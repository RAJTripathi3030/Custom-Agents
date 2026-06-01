# Hubble — AI Agent Platform

Hubble is an open-source platform hosting a suite of purpose-built, self-contained AI agents designed to automate real-world tasks. From scraping web content to generating SQL queries and Dockerfiles, Hubble provides a beautiful, unified interface powered by a fast, robust LangGraph & FastAPI backend.

## ✨ Features
- **14 Purpose-Built Agents:** Includes tools for Code & DevOps, Data & Web, Design & Creativity, and more.
- **Privacy First:** No data is stored. API keys are strictly passed via frontend state and discarded after the request.
- **Self-Hosted:** Fully open-source and easy to deploy on your own infrastructure.
- **State-of-the-art Stack:** 
  - **Frontend:** Next.js 15, Tailwind CSS, TypeScript
  - **Backend:** FastAPI, Python, LangChain, LangGraph
  - **LLM Engine:** Groq (Llama 3.1 8b) for blazing-fast inference

## 🤖 Included Agents
- **Web Scraper Agent:** Extract text content from any website.
- **Linux ISO Downloader:** Find and validate official ISO download links for any Linux distro.
- **Resume Analyzer:** Compare a resume against a job description.
- **SQL Generator:** Convert plain text requirements into valid SQL schemas and queries.
- **Regex Builder:** Generate robust regular expressions from natural language.
- **JSON Formatter:** Clean up and structure messy JSON payloads.
- **Cron Builder:** Translate English schedule descriptions into cron syntax.
- **Dockerfile Generator:** Scaffold a Dockerfile based on your tech stack requirements.
- **API Mock Generator:** Create mock JSON responses from API descriptions.
- **Markdown Converter:** Convert text or instructions into styled markdown.
- **Color Palette:** Generate cohesive hex color codes based on brand personality.
- **Domain Generator:** Brainstorm creative, available-sounding domain names.
- **Tech Stack Advisor:** Recommend an optimal architecture for your app requirements.
- **GitHub Triage Agent:** (In Progress) Analyze and classify GitHub issues.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.10+)
- A [Groq API Key](https://console.groq.com/) for LLM inference

### 1. Start the Backend

1. Navigate to the project root and create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install the backend dependencies:
   ```bash
   pip install -r api/requirements.txt
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Add any global keys (if applicable) to .env, though the frontend accepts Groq API keys directly.
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend will be available at `http://localhost:8000`.

### 2. Start the Frontend

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:3000`.

## 🛠 Architecture
- The frontend submits REST/SSE requests to the FastAPI backend (`/api/v1/agents/.../run`).
- The backend parses the input and runs the corresponding LangGraph agent.
- Agents use Groq's high-speed Llama models for execution and tool calling.
- Results are piped back to the Next.js UI where they are formatted with syntax highlighting and copy/download controls.

## 📄 License
This project is open-source. Feel free to use, modify, and distribute it!
