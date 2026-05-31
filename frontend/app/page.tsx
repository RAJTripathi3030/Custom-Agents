"use client";

import { useState } from "react";
import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { agents, allCategories, type AgentCategory } from "@/lib/agentRegistry";
import { Search, ArrowRight, Bot, Zap, Shield, Code2 } from "lucide-react";

const steps = [
  {
    icon: <Search size={24} />,
    title: "Find your agent",
    description:
      "Browse the catalog or search for the task you want to automate. Each agent is purpose-built for a specific real-world job.",
  },
  {
    icon: <Zap size={24} />,
    title: "Provide your input",
    description:
      "Give the agent what it needs — a URL, a description, a document. The agent handles all the complexity.",
  },
  {
    icon: <ArrowRight size={24} />,
    title: "Get results instantly",
    description:
      "The agent processes your request and returns clean, structured output in seconds. Copy, download, or use via API.",
  },
];

const stats = [
  { value: "14", label: "AI Agents" },
  { value: "100%", label: "Open Source" },
  { value: "0", label: "Data Stored" },
  { value: "⚡", label: "Self-hosted" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | "All">("All");

  // Featured agents — active ones first
  const featuredAgents = agents.filter((a) => a.status === "active").slice(0, 3);

  // All agents filtered by search + category
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      searchQuery === "" ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="content-width pt-16 pb-12 md:pt-24 md:pb-20 flex flex-col items-center text-center">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1 mb-6 badge-new"
        >
          <Bot size={12} />
          Open Source AI Agent Platform
        </span>

        <h1
          className="font-bold mb-4 max-w-3xl"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: "1.2", color: "var(--color-text-primary)" }}
        >
          Automate real-world tasks<br className="hidden sm:block" />
          <span style={{ color: "var(--color-primary)" }}> with AI agents</span>
        </h1>

        <p
          className="mb-8 max-w-xl"
          style={{ fontSize: "18px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}
        >
          Purpose-built agents for web scraping, code generation, document processing, and more.
          No setup. No API limits. Fully open source.
        </p>

        {/* Google-style search bar */}
        <div className="w-full max-w-xl relative">
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: "20px", color: "var(--color-text-muted)" }}
          />
          <input
            id="agent-search"
            type="search"
            className="search-input"
            style={{ paddingLeft: "48px" }}
            placeholder="Search agents — try 'scrape', 'SQL', 'regex'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("agents")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label="Search agents"
            autoComplete="off"
          />
        </div>


        <div className="flex items-center gap-4 mt-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <a href="#featured" className="hover:underline" style={{ color: "var(--color-primary)" }}>
            Browse agents ↓
          </a>
          <span>·</span>
          <a
            href="https://github.com/RAJTripathi3030/Custom-Agents"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section style={{ borderTop: "1px solid var(--color-border-subtle)", borderBottom: "1px solid var(--color-border-subtle)" }}>
        <div className="content-width">
          <div className="grid grid-cols-4 divide-x" style={{ borderColor: "var(--color-border-subtle)" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center py-5 px-2">
                <div
                  className="font-bold mb-0.5"
                  style={{ fontSize: "24px", color: "var(--color-primary)" }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Agents ─── */}
      {searchQuery === "" && selectedCategory === "All" && (
        <section id="featured" className="content-width py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="font-bold mb-1"
                style={{ fontSize: "24px", color: "var(--color-text-primary)" }}
              >
                Featured Agents
              </h2>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
                Ready to use right now
              </p>
            </div>
            <Link
              href="/agents"
              className="flex items-center gap-1 text-sm font-medium hover:underline transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      )}

      {/* ─── All Agents Grid ─── */}
      <section
        id="agents"
        style={{ background: "var(--color-surface-alt)" }}
      >
        <div className="content-width py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2
              className="font-bold"
              style={{ fontSize: "24px", color: "var(--color-text-primary)" }}
            >
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory === "All"
                ? "All Agents"
                : selectedCategory}
            </h2>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2">
              {(["All", ...allCategories] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as AgentCategory | "All")}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 btn-scale"
                  style={{
                    background:
                      selectedCategory === cat
                        ? "var(--color-primary)"
                        : "var(--color-surface)",
                    color:
                      selectedCategory === cat
                        ? "#fff"
                        : "var(--color-text-secondary)",
                    border: `1px solid ${
                      selectedCategory === cat
                        ? "var(--color-primary)"
                        : "var(--color-border-subtle)"
                    }`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredAgents.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3
                className="font-semibold mb-2"
                style={{ fontSize: "18px", color: "var(--color-text-primary)" }}
              >
                No agents found
              </h3>
              <p
                className="mb-6"
                style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}
              >
                Try a different search or browse all agents.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="px-6 py-2 rounded-lg text-sm font-medium transition-all btn-scale"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                }}
              >
                Browse all agents
              </button>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="content-width py-16 md:py-20">
        <div className="text-center mb-12">
          <h2
            className="font-bold mb-3"
            style={{ fontSize: "24px", color: "var(--color-text-primary)" }}
          >
            How it works
          </h2>
          <p style={{ fontSize: "16px", color: "var(--color-text-secondary)" }}>
            Three steps from idea to result
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: "var(--color-primary-light, #e8f0fe)",
                  color: "var(--color-primary)",
                }}
              >
                {step.icon}
              </div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                Step {i + 1}
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ fontSize: "18px", color: "var(--color-text-primary)" }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Trust / Features Strip ─── */}
      <section
        style={{
          background: "var(--color-primary)",
          color: "#fff",
        }}
      >
        <div className="content-width py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <Shield size={28} className="shrink-0 opacity-90" />
              <div>
                <div className="font-semibold text-base mb-1">Your data stays private</div>
                <div className="text-sm opacity-80">API keys are never stored. Inputs are processed and discarded.</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <Code2 size={28} className="shrink-0 opacity-90" />
              <div>
                <div className="font-semibold text-base mb-1">Fully open source</div>
                <div className="text-sm opacity-80">Every agent, every line of code is on GitHub. Self-host in minutes.</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <Zap size={28} className="shrink-0 opacity-90" />
              <div>
                <div className="font-semibold text-base mb-1">Powered by state-of-the-art AI</div>
                <div className="text-sm opacity-80">Built on LangGraph, Groq, and Tavily for speed and reliability.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <div className="content-width py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2" style={{ color: "var(--color-primary)" }}>
            <Bot size={18} />
            <span className="font-bold text-base">Hubble</span>
          </div>

          <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <Link href="/agents" className="hover:underline transition-colors">Agents</Link>
            <Link href="/about" className="hover:underline transition-colors">About</Link>
            <Link href="/privacy" className="hover:underline transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:underline transition-colors">Terms</Link>
            <a
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors"
            >
              GitHub
            </a>
          </nav>

          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} Hubble · Built by RAJ Tripathi
          </p>
        </div>
      </footer>
    </div>
  );
}
