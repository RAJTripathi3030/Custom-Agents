"""
GitHub Issue Triage Agent Router (In Progress)
Route: POST /api/v1/agents/github-triage/run

Status: IN_PROGRESS — agent logic under development.
The router is wired but returns a 503 with a clear message
so the frontend can display the correct "coming soon" state.
"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from api.core.responses import error_response

router = APIRouter()


class GITARequest(BaseModel):
    github_token: str
    repo_url: str
    groq_api_key: str


@router.post("/agents/github-triage/run")
async def run_github_triage(body: GITARequest):
    """
    GitHub Issue Triage Agent — currently in development.
    Returns 503 so the frontend shows the correct in-progress state.
    """
    return JSONResponse(
        status_code=503,
        content=error_response(
            title="Agent In Development",
            detail=(
                "The GitHub Triage agent is currently being developed. "
                "Star the repo on GitHub to get notified when it launches."
            ),
            status=503,
        ),
    )
