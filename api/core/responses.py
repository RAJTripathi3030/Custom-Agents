"""
Standard API response envelope per §3:
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "timestamp": "...", "version": "1.0" }
}

Error responses use RFC 7807 Problem Details format.
Internal error messages are NEVER exposed to the client (§3).
"""
from datetime import datetime, timezone
from typing import Any

from fastapi import Request
from fastapi.responses import JSONResponse


API_VERSION = "1.0"


def success_response(data: Any, status_code: int = 200) -> dict:
    """Wrap a successful result in the standard envelope."""
    return {
        "success": True,
        "data": data,
        "error": None,
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": API_VERSION,
        },
    }


def error_response(
    title: str,
    detail: str,
    status: int = 400,
    instance: str | None = None,
) -> dict:
    """
    RFC 7807 Problem Details format.
    Never include internal stack traces — log those server-side only.
    """
    return {
        "success": False,
        "data": None,
        "error": {
            "type": f"https://hubble.ai/errors/{status}",
            "title": title,
            "status": status,
            "detail": detail,
            "instance": instance,
        },
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": API_VERSION,
        },
    }


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler — logs the real error server-side,
    returns a generic message to the client (§3).
    """
    import traceback
    print(f"[ERROR] Unhandled exception on {request.url}: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content=error_response(
            title="Internal Server Error",
            detail="Something went wrong. Please try again.",
            status=500,
            instance=str(request.url),
        ),
    )
