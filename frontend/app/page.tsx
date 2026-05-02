import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const agents = [
  {
    name: "Web Scraper Agent",
    tagline: "Extract structured data from any webpage using natural language.",
    tools: ["Tavily", "Groq", "LangGraph"],
    status: "active" as const,
    href: "/web-scraper-agent",
  },
  {
    name: "ISO Agent",
    tagline: "Find and validate Linux distro ISO download links automatically.",
    tools: ["LangGraph", "FastAPI"],
    status: "coming-soon" as const,
    href: "/iso-agent",
  },
];

const steps = [
  {
    number: "1",
    title: "Enter your API keys",
    description: "Provide your Tavily and Groq API keys. They're sent directly to the backend and never stored.",
  },
  {
    number: "2",
    title: "Give the agent a task",
    description: "Enter a URL or query. The agent figures out what to scrape and how to structure it.",
  },
  {
    number: "3",
    title: "Get results instantly",
    description: "The agent processes your request and returns clean, structured output in seconds.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="flex flex-col items-center justify-center px-4 md:px-6 pt-20 pb-12 md:pt-40 md:pb-28">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 border border-amber-600/30 rounded-full px-3 py-1 mb-6">
          ✦ Open Source AI Agents
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl text-center">Hubble</h1>

        <p className="text-center max-w-xl mt-3 md:mt-4 text-muted-foreground text-base md:text-xl px-2">
          AI Agents are a really cool and modern way of automating stuff. You
          really gotta try them out!
        </p>

        <a
          href="#agents"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors"
        >
          Explore agents
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y">
        <div className="max-w-3xl mx-auto flex items-center justify-center divide-x px-2">
          <div className="flex-1 text-center py-5 px-4">
            <div className="text-xl md:text-2xl font-bold">2</div>
            <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Agents</div>
          </div>
          <div className="flex-1 text-center py-5 px-4">
            <div className="text-xl md:text-2xl font-bold">✓</div>
            <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Open Source</div>
          </div>
          <div className="flex-1 text-center py-5 px-4">
            <div className="text-xl md:text-2xl font-bold">⚡</div>
            <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Self-hosted</div>
          </div>
        </div>
      </section>

      {/* ─── Agent Cards ─── */}
      <section id="agents" className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20 lg:py-28">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8 text-center">
          Available Agents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <Card key={agent.name} size="lg" className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      agent.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {agent.status === "active" ? "Active" : "Coming Soon"}
                  </span>
                </div>
                <CardDescription>{agent.tagline}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-sm border text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="link"
                  size="lg"
                  className="w-full"
                  asChild
                  disabled={agent.status !== "active"}
                >
                  <Link href={agent.href}>
                    {agent.status === "active" ? "Open Agent →" : "Coming Soon"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto mx-4 md:mx-auto" />

      {/* ─── How It Works ─── */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20 lg:py-28">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-10 text-center">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border text-sm font-bold mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* ─── Tech Stack ─── */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16 lg:py-20">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8 text-center">
          Built with
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm text-muted-foreground">
          {["LangGraph", "Tavily", "Groq", "FastAPI", "Next.js"].map((tech) => (
            <span key={tech} className="border rounded-sm px-3 py-1.5 text-xs font-medium">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-xs text-muted-foreground">
          <span>Built by RAJ Tripathi</span>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <span>Next.js + LangGraph</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
