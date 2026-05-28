import os
import json
import httpx
from pathlib import Path
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode
from pydantic import SecretStr

DB_PATH = Path(__file__).resolve().parent / "distro-db" / "db.json"

# Module-level checkpointer — persists conversation state across API requests
# so multi-turn chat works correctly within a server session.
_global_checkpointer = MemorySaver()


# ── TOOLS ────────────────────────────────────────────────────────────────────

def fetch_iso(distro_name: str) -> str:
    """
    Look up ISO download links for a Linux distribution from the local database.
    Use lowercase keys such as: ubuntu, fedora, debian, arch, linuxmint, manjaro,
    kali, popos, nixos, alpine, rocky, almalinux, opensuse-tumbleweed, endeavouros,
    tails, parrot, mxlinux, voidlinux, freebsd, proxmox, truenas, etc.
    For variants try: ubuntu-22, kali-live, debian-live, opensuse-leap, linuxmint-mate.
    """
    try:
        with open(DB_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return "Local ISO database not found. Please ensure distro-db/db.json exists."

    key = distro_name.strip().lower()
    entry = data.get(key)

    if not entry:
        # Fuzzy match: find keys containing the query string
        matches = [k for k in data.keys() if key in k or k.startswith(key)]
        if matches:
            entry = data[matches[0]]
            key = matches[0]
        else:
            available = ", ".join(list(data.keys())[:20])
            return (
                f"'{distro_name}' not found in local database. "
                f"Some available keys: {available}..."
            )

    urls: list[str] = entry.get("urls", [])
    name: str = entry.get("name", key)

    if not urls:
        return f"No download URLs found for '{name}'."

    lines = [f"Found {len(urls)} ISO link(s) for {name} (key: '{key}'):"]
    for i, url in enumerate(urls, 1):
        lines.append(f"{i}. {url}")
    return "\n".join(lines)


def validate_url(url: str) -> str:
    """
    Check whether an ISO download URL is reachable and alive.
    Use this on direct .iso or .img file URLs — not on HTML download pages,
    SourceForge /download redirectors, or torrent files.
    """
    try:
        r = httpx.head(
            url,
            follow_redirects=True,
            timeout=6,
            headers={"User-Agent": "Mozilla/5.0 (compatible; HubbleBot/1.0)"},
        )
        if r.status_code == 200:
            cl = r.headers.get("content-length", "")
            size_str = f" · {int(cl) // 1_048_576} MB" if cl.isdigit() else ""
            final_url = str(r.url)
            truncated = final_url if len(final_url) <= 80 else final_url[:77] + "..."
            return f"✓ alive{size_str} → {truncated}"
        elif r.status_code in (301, 302, 307, 308):
            loc = r.headers.get("location", "unknown")
            return f"↪ redirects → {loc[:80]}"
        else:
            return f"✗ HTTP {r.status_code}"
    except httpx.TimeoutException:
        return "✗ timed out (6 s) — server may be slow or link may be invalid"
    except Exception as e:
        return f"✗ {type(e).__name__}: {str(e)[:60]}"


def search_web_for_iso(distro_name: str) -> str:
    """
    Search online for a Linux distro's ISO download page when it is NOT in the
    local database. Checks DistroWatch and common official URL patterns.
    """
    results: list[str] = []
    slug = distro_name.strip().lower().replace(" ", "").replace("-", "")
    headers = {"User-Agent": "Mozilla/5.0 (compatible; HubbleBot/1.0)"}

    # 1. Try DistroWatch
    try:
        dw_url = f"https://distrowatch.com/table.php?distribution={slug}"
        r = httpx.get(dw_url, timeout=8, follow_redirects=True, headers=headers)
        if r.status_code == 200 and "error" not in r.text[:300].lower():
            results.append(f"DistroWatch page: {dw_url}")
    except Exception:
        pass

    # 2. Try common official URL patterns
    candidates = [
        f"https://{slug}linux.org/download",
        f"https://{slug}.org/download",
        f"https://get{slug}.com",
        f"https://{slug}.com/download",
        f"https://www.{slug}.org/download",
    ]
    for url in candidates:
        try:
            r = httpx.head(url, timeout=4, follow_redirects=True, headers=headers)
            if r.status_code in (200, 301, 302, 307):
                results.append(f"Official download page likely: {url}")
                break
        except Exception:
            continue

    if results:
        return (
            "Web search results:\n"
            + "\n".join(results)
            + "\n\nVisit these pages to find direct ISO links."
        )
    return (
        f"Could not automatically locate online sources for '{distro_name}'. "
        f"Try searching '{distro_name} linux iso download' in your browser."
    )


tools = [fetch_iso, validate_url, search_web_for_iso]

SYS_PROMPT = SystemMessage(
    content="""You are an expert Linux ISO assistant running inside the Hubble AI platform.
Your role is to help users find ISO download links for Linux distributions — quickly, accurately, and autonomously.

TOOLS:
- fetch_iso(distro_name): Local DB lookup. Fast. Try this first. Use lowercase keys.
- validate_url(url): HTTP HEAD check on a direct .iso/.img URL. Use ONLY on direct file URLs, NOT on HTML pages or SourceForge /download redirectors.
- search_web_for_iso(distro_name): Online fallback when the distro isn't in the local DB.

BEHAVIOR RULES:
1. When the user names a distro → call fetch_iso immediately. Do not ask for clarification.
2. After fetching links → validate_url on direct .iso/.img links only (skip HTML pages, torrent links, download manager URLs).
3. If fetch_iso returns "not found" → call search_web_for_iso.
4. If the user describes a use case (e.g. "lightweight", "gaming", "privacy-focused", "beginner-friendly") → reason and pick the 1-2 best matching distros, then fetch them.
5. Multi-distro comparisons → fetch both, summarize key differences briefly.
6. Follow-up questions (e.g. "give me the minimal version", "what about Fedora instead") → use context from previous messages.

OUTPUT FORMAT:
- Be concise. After tool calls, write a short, clean summary.
- Number the links clearly.
- Show validation status inline: ✓ alive / ✗ broken / ↪ redirect.
- If a link is broken, note it and suggest the fallback URL or official site.
- Do NOT lecture. Do NOT add disclaimers. Just give the user what they asked for."""
)


# ── GRAPH FACTORY ─────────────────────────────────────────────────────────────

def create_graph(groq_api_key: str):
    """
    Create and compile a LangGraph graph wired to the given Groq API key.
    Uses the module-level _global_checkpointer so thread state persists
    across multiple API calls with the same thread_id.
    """
    model = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=SecretStr(groq_api_key),
    )
    model_with_tools = model.bind_tools(tools)

    def assistant(state: MessagesState):
        response = model_with_tools.invoke([SYS_PROMPT] + state["messages"])
        return {"messages": [response]}

    def route_after_assistant(state: MessagesState):
        last = state["messages"][-1]
        if getattr(last, "tool_calls", []):
            return "tools"
        return "__end__"

    builder = StateGraph(MessagesState)
    builder.add_node("assistant", assistant)
    builder.add_node("tools", ToolNode(tools))
    builder.add_edge(START, "assistant")
    builder.add_conditional_edges("assistant", route_after_assistant)
    builder.add_edge("tools", "assistant")

    return builder.compile(checkpointer=_global_checkpointer)