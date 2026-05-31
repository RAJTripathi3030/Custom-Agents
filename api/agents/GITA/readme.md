# GITA — GitHub Issue Triage Agent

An AI-powered GitHub Issue Triage Agent built with LangGraph and Groq.
Part of the [AgentHub](https://custom-agents-ecru.vercel.app) platform.

## What it does

Give GITA a GitHub repository and it will:

1. Fetch all open issues from the repository
2. Read and analyze each issue's content and comments
3. Categorize issues as `bug`, `feature`, or `question`
4. Detect potential duplicate issues across the repo
5. Identify issues suitable for newcomers (`good first issue`)
6. Pause and ask for your confirmation before marking duplicates
7. Return a structured triage report

## Tech Stack

- **LangGraph** — agent graph and human-in-the-loop interrupts
- **Groq** (llama-3.3-70b-versatile) — issue analysis and reasoning
- **GitHub REST API** — issue fetching and management
- **FastAPI** — backend API server
- **Next.js** — frontend UI

## Setup

### Prerequisites

- Python 3.11+
- Groq API key — [console.groq.com](https://console.groq.com)
- GitHub Personal Access Token — [github.com/settings/tokens](https://github.com/settings/tokens)
  - Required scopes: `repo` (for private repos) or `public_repo` (for public repos)

### Installation

```bash
git clone https://github.com/RAJTripathi3030/Custom-Agents
cd Custom-Agents
python -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the root:
