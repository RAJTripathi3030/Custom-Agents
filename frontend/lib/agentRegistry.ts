// Agent Registry — single source of truth for all agents
// Drives: homepage grid, nav dropdown, sitemap, breadcrumbs

export type AgentStatus = "active" | "in-progress" | "coming-soon";
export type AgentBadge = "New" | "Popular" | null;
export type AgentCategory =
  | "Data & Web"
  | "Code & DevOps"
  | "Content & Documents"
  | "Design & Creativity"
  | "Developer Tools";

export interface Agent {
  id: string;
  name: string;
  description: string;         // max 2 lines — shown on card
  longDescription: string;     // shown on agent page header
  icon: string;                // emoji icon (32px display)
  category: AgentCategory;
  estimatedTime: string;       // e.g. "~5s", "~30s"
  tags: string[];
  status: AgentStatus;
  href: string;
  badge: AgentBadge;
}

export const agents: Agent[] = [
  // ─── Active Agents ───────────────────────────────────────────────────────────
  {
    id: "web-scraper",
    name: "Web Scraper Agent",
    description: "Extract structured data from any webpage using natural language queries.",
    longDescription:
      "Paste a URL and describe what you want to extract. The agent scrapes the page content and uses an LLM to return exactly the information you need — products, prices, links, text, or anything else.",
    icon: "🕷️",
    category: "Data & Web",
    estimatedTime: "~10s",
    tags: ["Tavily", "Groq", "LangGraph", "Web"],
    status: "active",
    href: "/web-scraper-agent",
    badge: "Popular",
  },
  {
    id: "iso-downloader",
    name: "Linux ISO Agent",
    description: "Find and validate Linux distro ISO download links automatically.",
    longDescription:
      "Describe the distro you want — by name, use case, or constraints. The agent finds the official ISO link, validates it live, and provides a direct download URL.",
    icon: "💿",
    category: "Data & Web",
    estimatedTime: "~15s",
    tags: ["LangGraph", "Groq", "FastAPI"],
    status: "active",
    href: "/iso-agent",
    badge: null,
  },
  {
    id: "github-triage",
    name: "GitHub Issues Triage Agent",
    description: "Automatically label, prioritize, and summarize GitHub issues using AI.",
    longDescription:
      "Connect your GitHub repository and let the agent read open issues, classify them by type and severity, suggest labels, and produce a prioritized action list.",
    icon: "🐙",
    category: "Developer Tools",
    estimatedTime: "~20s",
    tags: ["GitHub API", "Groq", "LangGraph"],
    status: "in-progress",
    href: "/agents/github-triage",
    badge: "New",
  },

  // ─── Planned Agents ───────────────────────────────────────────────────────────
  {
    id: "resume-analyzer",
    name: "Resume / CV Analyzer",
    description: "Analyze your resume and get AI-powered rewrite suggestions for any role.",
    longDescription:
      "Paste your resume and a job description. The agent identifies gaps, rewrites weak bullet points, and returns an improved version tailored to the role.",
    icon: "📄",
    category: "Content & Documents",
    estimatedTime: "~15s",
    tags: ["Groq", "Document AI"],
    status: "coming-soon",
    href: "/agents/resume-analyzer",
    badge: null,
  },
  {
    id: "sql-generator",
    name: "SQL Query Generator",
    description: "Describe your data need in plain English and get production-ready SQL.",
    longDescription:
      "Paste your database schema and describe what you want in plain English. The agent generates correct, optimized SQL with an explanation of each clause.",
    icon: "🗄️",
    category: "Developer Tools",
    estimatedTime: "~5s",
    tags: ["Groq", "SQL", "PostgreSQL"],
    status: "coming-soon",
    href: "/agents/sql-generator",
    badge: null,
  },
  {
    id: "regex-builder",
    name: "Regex Builder Agent",
    description: "Describe a text pattern in English and get a regex with full explanation.",
    longDescription:
      "Tell the agent what pattern you need to match or extract. It generates a regex, explains every part, and shows live test examples.",
    icon: "🔍",
    category: "Developer Tools",
    estimatedTime: "~3s",
    tags: ["Groq", "Regex", "Text Processing"],
    status: "coming-soon",
    href: "/agents/regex-builder",
    badge: null,
  },
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Format, validate, and generate JSON schemas from raw or messy JSON.",
    longDescription:
      "Paste messy JSON, and the agent formats it, validates the structure, infers a JSON schema, and highlights any issues.",
    icon: "📋",
    category: "Developer Tools",
    estimatedTime: "~3s",
    tags: ["JSON Schema", "Validation"],
    status: "coming-soon",
    href: "/agents/json-formatter",
    badge: null,
  },
  {
    id: "cron-builder",
    name: "Cron Expression Builder",
    description: "Describe a schedule in plain English and get the correct cron expression.",
    longDescription:
      "Type things like 'every weekday at 9am' or 'on the 1st of each month at midnight'. The agent generates the cron expression, explains it, and shows the next 5 run times.",
    icon: "⏰",
    category: "Developer Tools",
    estimatedTime: "~2s",
    tags: ["Cron", "Scheduling"],
    status: "coming-soon",
    href: "/agents/cron-builder",
    badge: null,
  },
  {
    id: "dockerfile-generator",
    name: "Dockerfile Generator",
    description: "Describe your app stack and get a production-ready Dockerfile instantly.",
    longDescription:
      "Tell the agent your language, framework, dependencies, and any special requirements. It generates an optimized multi-stage Dockerfile with best practices.",
    icon: "🐳",
    category: "Code & DevOps",
    estimatedTime: "~8s",
    tags: ["Docker", "DevOps", "Groq"],
    status: "coming-soon",
    href: "/agents/dockerfile-generator",
    badge: null,
  },
  {
    id: "api-mock-generator",
    name: "API Mock Generator",
    description: "Describe an API and get an OpenAPI spec plus realistic mock data.",
    longDescription:
      "Describe your API's purpose and endpoints. The agent generates a complete OpenAPI 3.0 spec and realistic mock response data for every endpoint.",
    icon: "🔌",
    category: "Code & DevOps",
    estimatedTime: "~10s",
    tags: ["OpenAPI", "REST", "Groq"],
    status: "coming-soon",
    href: "/agents/api-mock-generator",
    badge: null,
  },
  {
    id: "markdown-converter",
    name: "Markdown Converter",
    description: "Convert Markdown documents to clean HTML or formatted PDF instantly.",
    longDescription:
      "Paste or upload a Markdown document. The agent converts it to clean, styled HTML or generates a PDF with proper typography and formatting.",
    icon: "📝",
    category: "Content & Documents",
    estimatedTime: "~5s",
    tags: ["Markdown", "HTML", "PDF"],
    status: "coming-soon",
    href: "/agents/markdown-converter",
    badge: null,
  },
  {
    id: "color-palette",
    name: "Color Palette Generator",
    description: "Describe your brand or mood and get a curated color palette with hex codes.",
    longDescription:
      "Describe your brand personality, mood, or industry. The agent generates a harmonious color palette with primary, secondary, accent, and neutral colors plus usage guidelines.",
    icon: "🎨",
    category: "Design & Creativity",
    estimatedTime: "~5s",
    tags: ["Design", "Colors", "Branding"],
    status: "coming-soon",
    href: "/agents/color-palette",
    badge: "New",
  },
  {
    id: "domain-generator",
    name: "Domain Name Generator",
    description: "Describe your project and get creative, available-style domain name ideas.",
    longDescription:
      "Describe what your product or service does. The agent brainstorms domain names across multiple TLDs, rates each one, and explains its appeal.",
    icon: "🌐",
    category: "Design & Creativity",
    estimatedTime: "~5s",
    tags: ["Domains", "Branding", "Naming"],
    status: "coming-soon",
    href: "/agents/domain-generator",
    badge: null,
  },
  {
    id: "tech-stack-advisor",
    name: "Tech Stack Advisor",
    description: "Describe your project requirements and get a full stack recommendation.",
    longDescription:
      "Tell the agent your project type, team size, scalability needs, and budget constraints. It recommends a complete tech stack with reasoning for every choice.",
    icon: "⚡",
    category: "Developer Tools",
    estimatedTime: "~8s",
    tags: ["Architecture", "Tech Stack", "Groq"],
    status: "coming-soon",
    href: "/agents/tech-stack-advisor",
    badge: null,
  },
];

// Helper: get agents by category
export function getAgentsByCategory(category: AgentCategory): Agent[] {
  return agents.filter((a) => a.category === category);
}

// Helper: get active agents only
export function getActiveAgents(): Agent[] {
  return agents.filter((a) => a.status === "active");
}

// Helper: get featured agents (active + popular)
export function getFeaturedAgents(): Agent[] {
  return agents.filter((a) => a.status === "active" || a.badge === "Popular").slice(0, 3);
}

// Helper: get all unique categories
export const allCategories: AgentCategory[] = [
  "Data & Web",
  "Developer Tools",
  "Code & DevOps",
  "Content & Documents",
  "Design & Creativity",
];
