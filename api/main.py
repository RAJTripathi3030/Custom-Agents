"""
Hubble AI Agent Platform — FastAPI Backend
==========================================

Architecture (per AGENT_WEBSITE_INSTRUCTIONS.md §3):
  AgentInput → InputValidator → AgentRunner → OutputFormatter → AgentOutput
                    ↓                ↓
              ValidationError   StreamingSSE

Run with:
  uvicorn api.main:app --reload --port 8000
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api.routers import web_scraper, iso, gita, health
from api.routers import resume_analyzer
from api.routers import sql_generator
from api.routers import regex_builder
from api.routers import json_formatter
from api.routers import cron_builder
from api.routers import dockerfile_generator
from api.routers import api_mock_generator
from api.routers import markdown_converter
from api.routers import color_palette
from api.routers import domain_generator
from api.routers import tech_stack_advisor

# Load .env from project root
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # Validate required env vars at startup — fail fast (§8)
    required = []  # Add required vars here when auth/DB is added
    missing = [v for v in required if not os.getenv(v)]
    if missing:
        raise RuntimeError(f"Missing required environment variables: {missing}")
    print("✓ Hubble API started")
    yield
    print("✓ Hubble API shut down")


app = FastAPI(
    title="Hubble AI Agent Platform",
    description="API for Hubble — a platform hosting multiple AI-powered agents.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS (§5.5) ───────────────────────────────────────────────────────────────
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# ── Routers (§3 API Design — /api/v1/ prefix from day one) ───────────────────
app.include_router(health.router)
app.include_router(web_scraper.router, prefix="/api/v1", tags=["Web Scraper"])
app.include_router(iso.router,         prefix="/api/v1", tags=["ISO Downloader"])
app.include_router(gita.router,        prefix="/api/v1", tags=["GitHub Triage"])
app.include_router(resume_analyzer.router, prefix='/api/v1', tags=['ResumeAnalyzer'])
app.include_router(sql_generator.router, prefix='/api/v1', tags=['SQLGenerator'])
app.include_router(regex_builder.router, prefix='/api/v1', tags=['RegexBuilder'])
app.include_router(json_formatter.router, prefix='/api/v1', tags=['JSONFormatter'])
app.include_router(cron_builder.router, prefix='/api/v1', tags=['CronBuilder'])
app.include_router(dockerfile_generator.router, prefix='/api/v1', tags=['DockerfileGenerator'])
app.include_router(api_mock_generator.router, prefix='/api/v1', tags=['ApiMockGenerator'])
app.include_router(markdown_converter.router, prefix='/api/v1', tags=['MarkdownConverter'])
app.include_router(color_palette.router, prefix='/api/v1', tags=['ColorPalette'])
app.include_router(domain_generator.router, prefix='/api/v1', tags=['DomainGenerator'])
app.include_router(tech_stack_advisor.router, prefix='/api/v1', tags=['TechStackAdvisor'])


@app.get("/")
async def root():
    return {
        "success": True,
        "data": {"name": "Hubble API", "version": "1.0.0"},
        "error": None,
        "meta": {"docs": "/docs"},
    }