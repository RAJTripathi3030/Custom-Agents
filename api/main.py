import sys
import os
import json
import importlib.util
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

# ── Import WebScraper agent ───────────────────────────────────────────────────
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "WebScraper"))
from main import run_agent  # noqa: E402

# ── Import ISOAgent via importlib to avoid module-name clash with WebScraper/main.py
_iso_spec = importlib.util.spec_from_file_location(
    "iso_agent",
    os.path.join(os.path.dirname(__file__), "..", "ISOAgent", "main.py"),
)
_iso_module = importlib.util.module_from_spec(_iso_spec)   # type: ignore[arg-type]
_iso_spec.loader.exec_module(_iso_module)                  # type: ignore[union-attr]
_create_iso_graph = _iso_module.create_graph

# Graph cache: one compiled graph per Groq API key so the MemorySaver
# (and therefore multi-turn thread state) is shared across requests.
_iso_graph_cache: dict[str, object] = {}


def _get_iso_graph(groq_api_key: str):
    if groq_api_key not in _iso_graph_cache:
        _iso_graph_cache[groq_api_key] = _create_iso_graph(groq_api_key)
    return _iso_graph_cache[groq_api_key]


# ── App setup ─────────────────────────────────────────────────────────────────

app = FastAPI(title="Hubble AI Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request models ────────────────────────────────────────────────────────────

class ScrapeRequest(BaseModel):
    tavily_api_key: str
    groq_api_key: str
    site_url: str


class ISOChatRequest(BaseModel):
    message: str
    groq_api_key: str
    thread_id: str = "default"


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


# ── Web Scraper ───────────────────────────────────────────────────────────────

@app.post("/scrape")
def scrape(request: ScrapeRequest):
    result = run_agent(
        tavily_api_key=request.tavily_api_key,
        groq_api_key=request.groq_api_key,
        scrape_url=request.site_url,
    )
    return {"result": result}


# ── ISO Agent (agentic, streaming) ────────────────────────────────────────────

@app.post("/iso/chat")
def iso_chat(request: ISOChatRequest):
    """
    Streaming SSE endpoint for the agentic ISO finder.
    Routes through the full LangGraph graph (LLM reasoning + tool calls).
    Emits typed Server-Sent Events for each step so the frontend can
    show live tool-call progress before the final answer appears.

    Event types:
      {"type": "tool_call",   "tool": "fetch_iso",    "input": {...}}
      {"type": "tool_result", "tool": "fetch_iso",    "content": "..."}
      {"type": "answer",      "content": "..."}
      {"type": "error",       "content": "..."}
      {"type": "done"}
    """

    def generate():
        try:
            graph = _get_iso_graph(request.groq_api_key)
            config = {"configurable": {"thread_id": request.thread_id}}

            for event in graph.stream(
                {"messages": [HumanMessage(content=request.message)]},
                config=config,
                stream_mode="updates",
            ):
                for _node_name, update in event.items():
                    for msg in update.get("messages", []):

                        if isinstance(msg, AIMessage):
                            # Tool-call intention from the LLM
                            for tc in getattr(msg, "tool_calls", []):
                                yield _sse(
                                    {
                                        "type": "tool_call",
                                        "tool": tc["name"],
                                        "input": tc.get("args", {}),
                                    }
                                )
                            # Final text answer (no tool calls)
                            if msg.content and not getattr(msg, "tool_calls", []):
                                yield _sse({"type": "answer", "content": msg.content})

                        elif isinstance(msg, ToolMessage):
                            yield _sse(
                                {
                                    "type": "tool_result",
                                    "tool": msg.name,
                                    "content": msg.content,
                                }
                            )

        except Exception as exc:
            yield _sse({"type": "error", "content": str(exc)})

        finally:
            yield _sse({"type": "done"})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


def _sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"
