"use client";

import { useState } from "react";
import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { agents, allCategories, type AgentCategory } from "@/lib/agentRegistry";
import { Search, ArrowRight, Shield, Zap, Code2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find your agent",
    description:
      "Browse the catalog or search for the task you want to automate. Each agent is purpose-built for a specific real-world job.",
  },
  {
    number: "02",
    title: "Provide your input",
    description:
      "Give the agent what it needs — a URL, a description, a document. The agent handles all the complexity.",
  },
  {
    number: "03",
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

const trustFeatures = [
  {
    icon: <Shield size={22} strokeWidth={1.5} />,
    title: "Your data stays private",
    body: "API keys are never stored. Inputs are processed and discarded.",
  },
  {
    icon: <Code2 size={22} strokeWidth={1.5} />,
    title: "Fully open source",
    body: "Every agent, every line of code is on GitHub. Self-host in minutes.",
  },
  {
    icon: <Zap size={22} strokeWidth={1.5} />,
    title: "State-of-the-art AI",
    body: "Built on LangGraph, Groq, and Tavily for speed and reliability.",
  },
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
      <section className="content-width pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">

        {/* Mono label pill */}
        <div
          className="text-mono-label mb-8"
          style={{
            color: "var(--color-coral)",
            fontSize: "11px",
            letterSpacing: "0.1em",
          }}
        >
          Open Source · AI Agent Platform
        </div>

        {/* Monumental headline */}
        <h1
          style={{
            fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.025em",
            color: "var(--color-ink)",
            maxWidth: "800px",
            marginBottom: "28px",
          }}
        >
          Automate real-world tasks with AI agents
        </h1>

        {/* Lead text */}
        <p
          style={{
            fontSize: "18px",
            color: "var(--color-text-secondary)",
            lineHeight: 1.5,
            maxWidth: "480px",
            marginBottom: "40px",
          }}
        >
          Purpose-built agents for web scraping, code generation, document
          processing, and more. No setup. No API limits. Fully open source.
        </p>

        {/* CTA group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <a href="#agents" className="btn-primary">
            Browse agents
          </a>
          <a
            href="https://github.com/RAJTripathi3030/Custom-Agents"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            View on GitHub <ArrowRight size={14} strokeWidth={1.5} />
          </a>
        </div>

        {/* Search */}
        <div className="w-full max-w-lg relative">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: "16px", color: "var(--color-text-muted)" }}
          />
          <input
            id="agent-search"
            type="search"
            className="search-input"
            style={{ paddingLeft: "44px", borderRadius: "var(--radius-xs)" }}
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
      </section>

      {/* ─── Stats Bar ─── */}
      <section style={{ borderTop: "1px solid var(--color-hairline)", borderBottom: "1px solid var(--color-hairline)" }}>
        <div className="content-width">
          <div
            className="grid grid-cols-4"
            style={{ borderColor: "var(--color-hairline)" }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center py-6 px-2"
                style={i > 0 ? { borderLeft: "1px solid var(--color-hairline)" } : {}}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
                    fontSize: "28px",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "var(--color-ink)",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Agents ─── */}
      {searchQuery === "" && selectedCategory === "All" && (
        <section id="featured" className="content-width py-20 md:py-24">
          <div className="flex items-end justify-between mb-10" style={{ borderBottom: "1px solid var(--color-hairline)", paddingBottom: "20px" }}>
            <div>
              <div
                className="text-mono-label mb-3"
                style={{ color: "var(--color-coral)", fontSize: "11px", letterSpacing: "0.1em" }}
              >
                Featured
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                }}
              >
                Ready to use right now
              </h2>
            </div>
            <Link
              href="/agents"
              className="hidden sm:flex items-center gap-1.5 btn-secondary"
              style={{ fontSize: "14px", whiteSpace: "nowrap" }}
            >
              View all <ArrowRight size={13} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: "var(--color-hairline)", border: "1px solid var(--color-hairline)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}
          >
            {featuredAgents.map((agent) => (
              <div key={agent.id} style={{ background: "var(--color-canvas)" }}>
                <AgentCard agent={agent} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── All Agents Grid ─── */}
      <section
        id="agents"
        style={{ background: "var(--color-soft-stone)" }}
      >
        <div className="content-width py-20 md:py-24">

          {/* Section header + category filters */}
          <div className="flex flex-col gap-6 mb-10">
            <div style={{ borderBottom: "1px solid var(--color-hairline)", paddingBottom: "20px" }}>
              <div
                className="text-mono-label mb-3"
                style={{ color: "var(--color-coral)", fontSize: "11px", letterSpacing: "0.1em" }}
              >
                Catalog
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                }}
              >
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedCategory === "All"
                  ? "All Agents"
                  : selectedCategory}
              </h2>
            </div>

            {/* Category filter chips */}
            <div className="flex flex-wrap gap-2">
              {(["All", ...allCategories] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as AgentCategory | "All")}
                  className={`chip-filter${selectedCategory === cat ? " active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredAgents.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid var(--color-hairline)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Search size={20} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "var(--color-ink)",
                  marginBottom: "8px",
                }}
              >
                No agents found
              </h3>
              <p
                style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "24px" }}
              >
                Try a different search or browse all agents.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="btn-primary"
                style={{ fontSize: "14px", padding: "10px 20px" }}
              >
                Browse all agents
              </button>
            </div>
          ) : (
            <div
              className="grid gap-px"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                background: "var(--color-hairline)",
                border: "1px solid var(--color-hairline)",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
              }}
            >
              {filteredAgents.map((agent) => (
                <div key={agent.id} style={{ background: "var(--color-canvas)" }}>
                  <AgentCard agent={agent} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── How It Works — Dark Feature Band ─── */}
      <section className="dark-feature-band">
        <div className="content-width py-20 md:py-24">
          <div className="text-center mb-16">
            <div
              className="text-mono-label mb-4"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em" }}
            >
              Process
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
                fontSize: "clamp(24px, 3vw, 40px)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.95)",
              }}
            >
              Three steps from idea to result
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col pt-10 pb-6"
                style={{
                  paddingRight: i < steps.length - 1 ? "40px" : 0,
                  paddingLeft: i > 0 ? "40px" : 0,
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.12)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: "var(--color-coral)",
                    marginBottom: "16px",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
                    fontSize: "20px",
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.95)",
                    marginBottom: "12px",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust / Features Strip ─── */}
      <section style={{ borderTop: "1px solid var(--color-hairline)", borderBottom: "1px solid var(--color-hairline)" }}>
        <div className="content-width py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {trustFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 py-6"
                style={{
                  paddingRight: i < trustFeatures.length - 1 ? "48px" : 0,
                  paddingLeft: i > 0 ? "48px" : 0,
                  borderLeft: i > 0 ? "1px solid var(--color-hairline)" : "none",
                }}
              >
                <div style={{ color: "var(--color-ink)", opacity: 0.6 }}>
                  {feature.icon}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
                    fontSize: "18px",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "var(--color-ink)",
                  }}
                >
                  {feature.title}
                </div>
                <div style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  {feature.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: "var(--color-primary)", color: "var(--color-on-dark)" }}>
        <div className="content-width py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">

            {/* Brand */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: "rgba(255,255,255,0.95)",
                  marginBottom: "8px",
                }}
              >
                Hubble
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, maxWidth: "220px" }}>
                Open-source AI agents for real-world automation.
              </p>
            </div>

            {/* Links */}
            <nav className="flex items-start gap-12" aria-label="Footer navigation">
              <div className="flex flex-col gap-3">
                <div
                  className="text-mono-label mb-1"
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "0.1em" }}
                >
                  Platform
                </div>
                {[
                  { href: "/agents", label: "Agents" },
                  { href: "/about", label: "About" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-opacity hover:opacity-60"
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="text-mono-label mb-1"
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "0.1em" }}
                >
                  Legal
                </div>
                {[
                  { href: "/privacy", label: "Privacy" },
                  { href: "/terms", label: "Terms" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-opacity hover:opacity-60"
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
              © {new Date().getFullYear()} Hubble · Built by RAJ Tripathi
            </p>
            <a
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-60"
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}
            >
              GitHub →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
