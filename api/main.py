import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "WebScraper"))
from main import run_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScrapeRequest(BaseModel):
    tavily_api_key: str
    groq_api_key: str
    site_url: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/scrape")
def scrape(request: ScrapeRequest):
    result = run_agent(
        tavily_api_key = request.tavily_api_key,
        groq_api_key = request.groq_api_key,
        scrape_url = request.site_url,
    )
    return {"result": result}
