# Multi-Agent Website — Master Instructions File

> This file is the single source of truth for building, designing, securing, and scaling this project. Follow every section precisely.

---

## 1. PROJECT OVERVIEW

A public-facing web platform that hosts multiple AI-powered agents. Each agent solves a specific real-world task. The platform must be clean, fast, trustworthy, and easy to extend with new agents.

**Current Agents:**
- Web Scraper Agent
- Linux ISO Downloader Agent
- GitHub Issues Triage Agent (in progress)

**Planned Agents (add these):**
- Resume/CV Analyzer & Rewriter Agent
- SQL Query Generator Agent (user describes data need → get SQL)
- Regex Builder Agent (describe pattern in plain English → get regex + explanation)
- JSON Formatter / Schema Validator Agent
- Cron Job Expression Builder Agent
- Dockerfile Generator Agent (describe app stack → get Dockerfile)
- API Mock Generator Agent (describe API → get OpenAPI spec + mock data)
- Markdown to HTML/PDF Converter Agent
- Color Palette Generator Agent (describe brand/mood → get palette + hex codes)
- Domain Name Idea Generator Agent
- Tech Stack Advisor Agent (describe project → get stack recommendation with reasoning)

---

## 2. TECH STACK DECISIONS

### Frontend
- **Framework:** React (with TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** Zustand (lightweight, no boilerplate)
- **Routing:** React Router v6
- **HTTP Client:** Axios with global interceptors
- **Form Handling:** React Hook Form + Zod validation
- **Notifications/Toasts:** Sonner or React Hot Toast
- **Icons:** Lucide React (consistent, minimal)

### Backend
- **Runtime:** Node.js with Express (or Fastify for performance)
- **Language:** TypeScript
- **Task Queue:** BullMQ with Redis (for long-running agent jobs)
- **Database:** PostgreSQL (primary) + Redis (cache + queue)
- **ORM:** Prisma
- **Auth:** JWT (short-lived access token + refresh token rotation)
- **File Handling:** Multer + cloud storage (S3-compatible)
- **Logging:** Winston + structured JSON logs
- **Rate Limiting:** express-rate-limit per IP + per user
- **Validation:** Zod on both frontend and backend (shared schemas)

### Infrastructure
- **Deployment:** Docker + Docker Compose for local; containerized on cloud
- **Reverse Proxy:** Nginx (handles SSL termination, gzip, static files)
- **CI/CD:** GitHub Actions
- **Environment Config:** dotenv with strict schema validation at startup (fail fast if env vars missing)
- **Monitoring:** Uptime monitoring + error tracking (Sentry)

---

## 3. ARCHITECTURE PATTERNS

### Agent Architecture Pattern
Every agent MUST follow this exact contract:

```
AgentInput → InputValidator → AgentRunner → OutputFormatter → AgentOutput
                 ↓                 ↓                ↓
           ValidationError    JobQueue         RateLimiter
                              (async)
```

- All agents are **async by design** — even fast ones go through the job queue
- Each agent is a self-contained module: `agents/{agent-name}/index.ts`
- Each agent module exports: `{ schema, runner, metadata }`
  - `schema`: Zod schema for input validation
  - `runner`: async function that does the work
  - `metadata`: name, description, icon, category, estimatedTime, tags

### Job Lifecycle
```
PENDING → PROCESSING → COMPLETED
                    ↘ FAILED → RETRIED (max 3) → DEAD
```

- Store job status in Redis with TTL of 24h
- Completed results stored in PostgreSQL for 7 days then purged
- User gets a `jobId` immediately on submit; polls `/api/jobs/{jobId}` for status

### API Design
- RESTful with consistent response envelope:
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "jobId": "...", "timestamp": "...", "version": "1.0" }
}
```
- All error responses use RFC 7807 Problem Details format
- API versioning: `/api/v1/` prefix from day one — never skip this
- Never expose internal error messages to the client; log them server-side

---

## 4. UI/UX — GOOGLE-PRINCIPLES DESIGN SYSTEM

Apply the following principles from Google's design philosophy across the entire website.

### 4.1 Core Principles
1. **Focus on the user** — every decision starts with "does this help the user achieve their goal faster?"
2. **Speed is a feature** — every interaction must feel instant; use optimistic UI, skeleton loaders, and lazy loading
3. **One primary action per screen** — never overwhelm with choices; progressive disclosure for advanced options
4. **Consistent and predictable** — same patterns everywhere; users should never be surprised
5. **Accessible by default** — WCAG 2.1 AA minimum; keyboard navigable; proper ARIA labels
6. **Mobile-first** — design for 375px width first, then scale up

### 4.2 Layout System
- **Max content width:** 1200px, centered, with 24px padding on mobile / 48px on desktop
- **Grid:** 12-column grid; agents use 4-col cards on desktop, 6-col on tablet, 12-col (full) on mobile
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96px — never use arbitrary values
- **Border radius:** 8px for cards, 4px for inputs, 24px for pills/badges
- **Elevation (shadows):** 3 levels only — none, subtle (card), raised (modal)

### 4.3 Typography
- **Font:** Inter (Google Fonts) — used by Google products for clean readability
- **Scale:**
  - Display: 48px / 700 weight
  - H1: 32px / 700
  - H2: 24px / 600
  - H3: 18px / 600
  - Body: 16px / 400
  - Small: 14px / 400
  - Caption: 12px / 400
- **Line height:** 1.5 for body, 1.2 for headings
- **Never use more than 2 font weights on one screen**

### 4.4 Color System
- **Primary:** Blue (#1a73e8) — Google's action blue; buttons, links, active states
- **Surface:** White (#ffffff) / Gray-50 (#f8f9fa) for page backgrounds
- **Border:** Gray-200 (#e8eaed)
- **Text Primary:** Gray-900 (#202124)
- **Text Secondary:** Gray-600 (#5f6368)
- **Success:** Green (#1e8e3e)
- **Warning:** Amber (#f29900)
- **Error:** Red (#d93025)
- **Dark mode:** Always support it from day one; use CSS variables for all colors

### 4.5 Component Patterns

**Search/Input Bar (Homepage)**
- Centered, large (56px height), with rounded corners (28px radius)
- Subtle box shadow that deepens on focus (Google Search style)
- Placeholder text is specific and helpful, not generic ("Paste a URL to scrape" not "Enter input")
- Never show a form label inside the input — use placeholder + floating label on focus

**Agent Cards**
- White card with 1px border, 8px radius, 16px padding
- Icon (32px) + Agent name (18px bold) + one-line description (14px muted)
- Subtle hover state: shadow lifts, border color shifts to primary blue
- "Try it →" CTA in the bottom right corner
- Show a badge if agent is "New" or "Popular" (top-right corner of card)
- Never show more than 2 lines of description — truncate with ellipsis

**Agent Input Form**
- Full-width inputs, 16px font, 48px height
- Real-time validation — show error inline below field immediately on blur, not on submit
- Primary submit button: full-width on mobile, fixed-width (200px) on desktop, right-aligned
- Button states: default → loading (spinner, text changes to "Running...") → disabled
- Never disable submit button unless form is actively invalid — don't block the user

**Results Panel**
- Slides in below the form on same page (no navigation)
- Header: "Results" + timestamp + copy-all button + download button (if applicable)
- Code output: syntax-highlighted code block with copy button top-right
- Prose output: clean typography, no raw JSON shown to user
- Error state: red-bordered card with friendly message + retry button

**Navigation Header**
- Sticky, height 64px, white background, 1px bottom border
- Left: Logo/wordmark
- Center (desktop only): nav links — Home, Agents, About
- Right: Theme toggle + GitHub link + Sign In (if auth exists)
- Mobile: hamburger → full-screen slide-out menu
- Never show more than 5 nav items — use a "More" dropdown if needed

**Loading States**
- Skeleton loaders for cards (not spinners) — match the exact shape of the content
- For agent jobs: progress bar + status text ("Scraping page...", "Parsing content...", "Formatting results...")
- Never use a blank screen — always show something

**Empty States**
- Centered illustration (simple SVG, not stock art) + heading + subtext + CTA
- Example: "No agents found. Try a different search." + "Browse all agents" button

**Toast Notifications**
- Top-right, max 3 at a time, auto-dismiss in 4 seconds
- Success (green), Error (red), Info (blue) — no warning toast, use inline instead
- Never show a toast for form validation errors — those go inline

### 4.6 Interaction Design
- **Hover states:** all interactive elements must have a visible hover state (cursor change + visual change)
- **Focus states:** 2px outline in primary blue, 2px offset — never remove focus outlines
- **Click feedback:** buttons scale down 2% on mousedown (transform: scale(0.98))
- **Page transitions:** fade-in (opacity 0→1, 150ms ease) for route changes — no slide animations
- **Scroll:** smooth scrolling site-wide; scroll-to-top button appears after 400px scroll
- **Animations:** max 200ms for micro-interactions, 300ms for panels, 0ms if user has prefers-reduced-motion

### 4.7 Homepage Layout
```
[HEADER — sticky]
[HERO — Agent platform name, one-line description, search bar]
[FEATURED AGENTS — 3 cards horizontal, "View all →" link]
[ALL AGENTS GRID — filterable by category, searchable]
[HOW IT WORKS — 3-step horizontal flow (icon + heading + text)]
[FOOTER — minimal: logo, links, theme toggle, copyright]
```

### 4.8 Agent Page Layout
```
[HEADER]
[BREADCRUMB — Home > Agents > Agent Name]
[AGENT HEADER — icon, name, description, category badge, estimated time badge]
[INPUT FORM — full-width, centered max 640px]
[RESULTS PANEL — appears after submission, below form]
[RELATED AGENTS — 3 cards, "You might also like"]
[FOOTER]
```

---

## 5. SECURITY

### 5.1 Input Security
- **All inputs are untrusted** — validate and sanitize on the server, always, regardless of frontend validation
- Zod schemas are the single source of truth; share between frontend and backend via a `/packages/shared` monorepo package
- Max input length enforced per agent (e.g., URL max 2048 chars, text input max 10,000 chars)
- Reject inputs with null bytes, control characters, or known injection patterns
- For the web scraper agent: whitelist allowed URL schemes (`https://` only); block `localhost`, `127.0.0.1`, `10.x.x.x`, `192.168.x.x`, `169.254.x.x`, `0.0.0.0`, and `file://` — this prevents SSRF attacks
- For the Linux ISO agent: only allow downloads from a hardcoded whitelist of official mirror domains — never accept user-supplied download URLs directly
- For the GitHub triage agent: use read-only GitHub tokens scoped to the minimum required permissions

### 5.2 Rate Limiting (Per Endpoint)
- `/api/v1/agents/*/run` — 10 requests per minute per IP (unauthenticated), 30/min per user (authenticated)
- `/api/v1/auth/login` — 5 attempts per 15 minutes per IP; lock for 30 minutes after exceeded
- `/api/v1/jobs/*` — 60 requests per minute per IP (polling endpoint)
- Global fallback: 100 requests per minute per IP across all routes
- Return `429 Too Many Requests` with `Retry-After` header

### 5.3 Authentication & Authorization
- JWT access tokens: 15-minute expiry
- Refresh tokens: 7-day expiry, stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookie
- Never store tokens in localStorage
- Refresh token rotation: issue a new refresh token on every use; invalidate the old one
- On logout: server-side invalidate refresh token by storing a blacklist in Redis
- Agent results are keyed to `userId` + `jobId`; users cannot access other users' results

### 5.4 HTTP Security Headers (Nginx)
```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
```

### 5.5 CORS
- Allow only your own frontend domain — never `*` in production
- `Access-Control-Allow-Credentials: true` only on auth endpoints
- Reject preflight requests from unknown origins

### 5.6 File Download Security (ISO Agent)
- Never pipe user-controlled URLs directly to the client
- Validate Content-Type header of the remote response (must be `application/octet-stream` or `application/x-iso9660-image`)
- Stream downloads through the backend with a max file size cap
- Add `Content-Disposition: attachment` header to force download, never inline
- Generate a temporary signed download URL (15-minute TTL) rather than exposing permanent storage links

### 5.7 Dependency & Infrastructure Security
- `npm audit` runs in CI; builds fail on high/critical vulnerabilities
- Pin Docker image versions (`node:20.11-alpine`, not `node:latest`)
- No secrets in code, `.env` files committed, or Docker images — use environment injection
- PostgreSQL: never expose port publicly; backend connects via internal Docker network only
- Redis: password-protected, bind to localhost only
- Regular automated backups of PostgreSQL with encrypted snapshots

### 5.8 Edge Cases & Failure Modes to Handle
- Agent runner crashes mid-job → BullMQ handles retry; job moves to FAILED after 3 attempts; user sees friendly error
- Database connection drops → implement connection pooling with retry backoff; queue jobs continue to work
- ISO mirror is unreachable → retry with 3 alternate mirrors from the whitelist before failing
- Web scraper gets blocked (403/429 from target site) → return friendly error "This site blocked the scraper"
- GitHub rate limit hit → check `X-RateLimit-Remaining` header before each request; surface error to user with time until reset
- User submits job then closes browser → job still runs; user can retrieve result via jobId from history
- Duplicate job submission (same input, same user, within 60 seconds) → return existing jobId, do not create duplicate
- Malformed UTF-8 in scraped content → normalize to valid UTF-8 before storing or returning
- Very large job result (>10MB) → store in S3, return a signed download URL instead of inline JSON
- Memory leak in long-running agent → each agent runs in its own worker process via BullMQ workers with a memory limit; auto-restart if exceeded

---

## 6. PERFORMANCE

### Frontend
- Code-split per agent page — each agent's code loads only when the user visits that agent
- Lazy load images with `loading="lazy"` and proper `width`/`height` attributes
- Preconnect to Google Fonts: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Bundle size budget: initial JS < 150KB gzipped
- Use `react-query` (TanStack Query) for caching API responses client-side

### Backend
- Database connection pool: min 2, max 10 connections
- Cache agent metadata (list of agents, their schemas) in Redis with 1-hour TTL — it doesn't change often
- Compress all API responses with gzip
- Use `select` in Prisma queries — never fetch all columns when only 3 are needed
- Index database columns: `userId`, `jobId`, `status`, `createdAt` on the jobs table

### Agent Performance
- Each agent has a `timeout` defined in its metadata (e.g., 30s for scraper, 300s for ISO download)
- BullMQ job times out at `metadata.timeout + 10s` buffer
- Long-running agents stream status updates via Server-Sent Events (SSE) at `/api/v1/jobs/{jobId}/stream`

---

## 7. SCALABILITY PATTERNS

### Horizontal Scaling
- Stateless API servers — all state in PostgreSQL or Redis; any server can handle any request
- BullMQ workers run independently — scale worker instances without scaling API servers
- Each agent type has its own BullMQ queue — heavy agents (ISO downloader) don't block fast agents (regex builder)

### Adding a New Agent (Checklist)
Every new agent must follow this checklist exactly:

1. Create `agents/{agent-name}/index.ts` with `{ schema, runner, metadata }`
2. Add metadata to the agents registry (`agents/registry.ts`)
3. Add a BullMQ queue name in `config/queues.ts`
4. Create `routes/agents/{agent-name}.ts` with POST `/run` and GET `/result/:jobId`
5. Add frontend page at `pages/agents/{agent-name}.tsx`
6. Add agent card to the homepage grid (auto-populated from registry — no manual addition needed if registry is used)
7. Write input validation schema using Zod (shared package)
8. Add rate limit config for this agent in `config/rateLimits.ts`
9. Add security rules specific to this agent in `config/agentSecurity.ts`
10. Write integration test: valid input → job created → job completed → result returned
11. Add estimated time and description to `metadata` — these display in the UI

### Database Schema (Core Tables)
```sql
-- users
id, email, password_hash, created_at, updated_at, is_active

-- refresh_tokens
id, user_id, token_hash, expires_at, revoked_at, created_at

-- jobs
id, user_id (nullable for anonymous), agent_id, status, input_hash,
input_payload (encrypted), result_payload, error_message,
created_at, started_at, completed_at, expires_at

-- agent_usage_stats
id, agent_id, date, total_runs, success_count, failure_count, avg_duration_ms
```

---

## 8. DEVELOPER EXPERIENCE

### Project Structure
```
/
├── packages/
│   └── shared/          # Zod schemas, TypeScript types, constants
├── frontend/
│   ├── src/
│   │   ├── pages/       # One file per route
│   │   ├── components/  # Reusable UI components
│   │   ├── agents/      # Agent-specific input forms and result renderers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── store/       # Zustand stores
│   │   └── lib/         # Axios instance, query client, utilities
├── backend/
│   ├── src/
│   │   ├── agents/      # Agent modules (schema + runner + metadata)
│   │   ├── routes/      # Express route handlers
│   │   ├── workers/     # BullMQ worker definitions
│   │   ├── middleware/  # Auth, rate limit, error handler
│   │   ├── lib/         # DB client, Redis client, logger
│   │   └── config/      # Env config, queue config, security config
└── docker-compose.yml
```

### Environment Variables (Required at startup — fail fast if missing)
```
# Backend
DATABASE_URL
REDIS_URL
JWT_SECRET              (min 64 chars, random)
JWT_REFRESH_SECRET      (min 64 chars, random, different from above)
ENCRYPTION_KEY          (32 bytes hex, for encrypting job payloads)
GITHUB_TOKEN            (for GitHub triage agent)
ALLOWED_ORIGINS         (comma-separated frontend URLs)
NODE_ENV

# Frontend
VITE_API_BASE_URL
```

### Coding Standards
- ESLint + Prettier enforced in CI — no exceptions
- TypeScript strict mode (`"strict": true`) — no `any` types
- Every function that can fail must either throw a typed error or return a `Result<T, E>` type
- All async functions must have error boundaries
- Commit format: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Branch protection: PRs require 1 review + CI passing to merge to main

---

## 9. SEO & DISCOVERABILITY

- Each agent page has a unique `<title>`, `<meta description>`, and Open Graph tags
- `/agents` page has a proper `<h1>` and descriptive paragraph for each agent category
- `robots.txt` allows all pages except `/api/`
- `sitemap.xml` auto-generated from agent registry on build
- Structured data (JSON-LD) on homepage: `WebSite` + `SearchAction` for site search
- Use semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>` — never div-soup

---

## 10. ANALYTICS & OBSERVABILITY

- Track: page views, agent runs (by agent), job success/failure rate, time-to-result
- Never track: input content, results content, or any PII without explicit consent
- Frontend errors reported to Sentry with source maps
- Backend structured logs include: `requestId`, `userId` (hashed), `agentId`, `duration`, `status`
- Health check endpoint: `GET /api/health` returns `{ status: "ok", db: "ok", redis: "ok", version: "..." }`
- Dashboard (internal): agent usage stats from `agent_usage_stats` table — build a simple `/admin` page protected by a separate admin JWT

---

## 11. LEGAL & COMPLIANCE

- Privacy Policy page: what data is collected, how it's used, how long it's kept
- Terms of Service page: acceptable use policy — explicitly prohibit using agents for scraping private data, circumventing security, or generating malicious content
- Cookie banner: only if using non-essential cookies — JWT in HttpOnly cookie is not a tracking cookie and does not require consent
- GDPR: provide a data deletion endpoint `DELETE /api/v1/account` that purges all user data and job history
- Rate limit abuse: log repeat offenders; implement IP-based ban list with manual review before permanent ban

---

## END OF INSTRUCTIONS FILE
