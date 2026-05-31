"""
ISO Downloader Agent Router — Streaming SSE (§4.6 Agent Streaming Contract)
Route: POST /api/v1/agents/iso/chat

Streaming event format (SSE):
  data: {"type": "tool_call",   "tool": "fetch_iso",  "input": "ubuntu"}
  data: {"type": "tool_result", "tool": "fetch_iso",  "content": "Found 3 ISO links..."}
  data: {"type": "answer",                             "content": "Here are your links..."}
  data: {"type": "done"}
  data: {"type": "error",                              "content": "...user-facing message"}
"""
import json
import asyncio
from typing import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

from api.core.security import validate_text, validate_api_key
from api.agents.ISOAgent.main import create_graph

router = APIRouter()


class IsoChatRequest(BaseModel):
    message: str
    groq_api_key: str
    thread_id: str = "default"


def _sse(event: dict) -> str:
    """Format a dict as a Server-Sent Event line."""
    return f"data: {json.dumps(event)}\n\n"


def _safe_input(input_val) -> str:
    """Convert LangChain tool input to a display-safe string."""
    if isinstance(input_val, str):
        return input_val
    if isinstance(input_val, dict):
        return ", ".join(str(v) for v in input_val.values())
    return str(input_val)


async def _stream_iso_response(
    message: str,
    groq_api_key: str,
    thread_id: str,
) -> AsyncGenerator[str, None]:
    """
    Run the LangGraph ISO agent and stream events as SSE.
    Streams each tool call, tool result, and final answer as separate events.
    """
    try:
        graph = create_graph(groq_api_key)
        config = {"configurable": {"thread_id": thread_id}}
        inputs = {"messages": [HumanMessage(content=message)]}

        # LangGraph stream mode "messages" gives us incremental token chunks
        # stream mode "updates" gives us per-node state deltas
        # We use "values" for full state after each step
        async for event in graph.astream(inputs, config=config, stream_mode="updates"):
            for node_name, node_output in event.items():
                messages = node_output.get("messages", [])

                for msg in messages:
                    # ── Tool calls from the assistant ───────────────────────
                    if isinstance(msg, AIMessage) and getattr(msg, "tool_calls", []):
                        for tc in msg.tool_calls:
                            yield _sse({
                                "type": "tool_call",
                                "tool": tc["name"],
                                "input": _safe_input(tc.get("args", {})),
                            })
                            await asyncio.sleep(0)  # Yield control to event loop

                    # ── Tool results ─────────────────────────────────────────
                    elif isinstance(msg, ToolMessage):
                        yield _sse({
                            "type": "tool_result",
                            "tool": msg.name,
                            "content": str(msg.content)[:2000],  # Safety truncation
                        })
                        await asyncio.sleep(0)

                    # ── Final AI answer (no tool calls = done reasoning) ─────
                    elif isinstance(msg, AIMessage) and not getattr(msg, "tool_calls", []):
                        yield _sse({
                            "type": "answer",
                            "content": str(msg.content),
                        })
                        await asyncio.sleep(0)

        yield _sse({"type": "done"})

    except Exception as e:
        print(f"[ISO ERROR] {e}")
        err_str = str(e).lower()

        if "api key" in err_str or "invalid key" in err_str or "401" in err_str:
            detail = "Invalid Groq API key. Please check your key."
        elif "429" in err_str or "rate limit" in err_str:
            detail = "Rate limit reached on your Groq API key. Please wait and try again."
        elif "timeout" in err_str:
            detail = "The request timed out. Please try again."
        else:
            detail = "Something went wrong. Please try again."

        yield _sse({"type": "error", "content": detail})


@router.post("/agents/iso/chat")
async def iso_chat(body: IsoChatRequest):
    """
    Multi-turn streaming chat with the ISO Downloader agent.
    Returns Server-Sent Events (SSE) stream.
    """
    # Validate inputs (§5.1)
    groq_key = validate_api_key(body.groq_api_key, "Groq API key")
    message  = validate_text(body.message, "message", max_length=500)
    thread_id = validate_text(body.thread_id, "thread_id", max_length=128)

    return StreamingResponse(
        _stream_iso_response(message, groq_key, thread_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Disable nginx buffering for SSE
        },
    )
