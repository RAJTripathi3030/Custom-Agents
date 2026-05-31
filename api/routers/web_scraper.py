"""
Web Scraper Agent Router
Route: POST /api/v1/agents/web-scraper/run

Security (§5.1):
  - URL must be https:// only
  - Blocks localhost, private IPs (SSRF prevention)
  - API keys validated but never stored
  - Rate limit: 10 req/min unauthenticated (enforced via middleware in production)
"""
from fastapi import APIRouter
from pydantic import BaseModel

from api.core.security import validate_url, validate_api_key, validate_text
from api.core.responses import success_response, error_response
from api.agents.WebScraper.main import run_agent

router = APIRouter()


class WebScraperRequest(BaseModel):
    tavily_api_key: str
    groq_api_key: str
    url: str
    query: str = ""


@router.post("/agents/web-scraper/run")
async def run_web_scraper(body: WebScraperRequest):
    """
    Run the Web Scraper agent.
    Validates inputs, enforces SSRF protection, then runs LangGraph agent.
    """
    # Validate all inputs (§5.1)
    tavily_key = validate_api_key(body.tavily_api_key, "Tavily API key")
    groq_key   = validate_api_key(body.groq_api_key,   "Groq API key")
    url        = validate_url(body.url, "URL")
    query      = validate_text(body.query, "query", max_length=500) if body.query.strip() else ""

    try:
        result = run_agent(
            tavily_api_key=tavily_key,
            groq_api_key=groq_key,
            scrape_url=url,
        )
        return success_response({"result": result, "url": url})

    except Exception as e:
        # Log real error server-side, return generic message to client (§3)
        print(f"[WebScraper ERROR] {e}")
        
        # Surface known user-facing errors
        err_str = str(e).lower()
        if "403" in err_str or "blocked" in err_str or "forbidden" in err_str:
            detail = "This site blocked the scraper. Try a different URL."
        elif "429" in err_str:
            detail = "The target site is rate-limiting requests. Try again later."
        elif "timeout" in err_str:
            detail = "The request timed out. The site may be slow or unreachable."
        elif "tavily" in err_str or "api key" in err_str.lower():
            detail = "Invalid Tavily API key. Please check your key and try again."
        else:
            detail = "The scraper encountered an error. Please check the URL and try again."

        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=422,
            content=error_response(
                title="Scraper Error",
                detail=detail,
                status=422,
            ),
        )
