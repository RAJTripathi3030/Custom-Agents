"""
Health check endpoint per §10:
  GET /api/health → { status: "ok", version: "..." }
"""
from fastapi import APIRouter
from api.core.responses import success_response

router = APIRouter(tags=["Health"])


@router.get("/api/health")
async def health_check():
    return success_response({
        "status": "ok",
        "version": "1.0.0",
    })
