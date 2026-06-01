"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { AgentCard } from "@/components/AgentCard";
import { agents, type Agent } from "@/lib/agentRegistry";
import { Clock } from "lucide-react";

interface AgentPageLayoutProps {
  agent: Agent;
  children: React.ReactNode;
}

export function AgentPageLayout({ agent, children }: AgentPageLayoutProps) {
  // Related agents: same category, excluding current, max 3
  const relatedAgents = agents
    .filter((a) => a.id !== agent.id && a.category === agent.category)
    .slice(0, 3);

  const statusBadge =
    agent.status === "active" ? (
      <span className="badge-active">Active</span>
    ) : agent.status === "in-progress" ? (
      <span className="badge-new">In Progress</span>
    ) : (
      <span className="badge-coming-soon">Coming Soon</span>
    );

  return (
    <div className="content-width py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Agents", href: "/agents" },
            { label: agent.name },
          ]}
        />
      </div>

      {/* Agent Header */}
      <header className="flex flex-col sm:flex-row sm:items-start gap-4 mb-10 pb-8"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl shrink-0"
          style={{ background: "var(--color-surface-alt)" }}
          role="img"
          aria-label={agent.name}
        >
          {agent.icon}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1
              className="font-bold"
              style={{ fontSize: "32px", color: "var(--color-text-primary)" }}
            >
              {agent.name}
            </h1>
            {statusBadge}
            {agent.badge && (
              agent.badge === "Popular"
                ? <span className="badge-popular">{agent.badge}</span>
                : <span className="badge-new">{agent.badge}</span>
            )}
          </div>
          <p
            className="mb-3"
            style={{ fontSize: "16px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}
          >
            {agent.longDescription}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="flex items-center gap-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Clock size={14} />
              {agent.estimatedTime}
            </span>
            <span
              className="text-sm px-2 py-0.5 rounded-full"
              style={{
                background: "var(--color-surface-alt)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border-subtle)",
                fontSize: "12px",
              }}
            >
              {agent.category}
            </span>
            {agent.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  background: "var(--color-primary-light, #1a2233)",
                  color: "var(--color-action-blue)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontSize: "10px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main content — Input Form + Results Panel */}
      <div className="mx-auto" style={{ maxWidth: "640px" }}>
        {children}
      </div>

      {/* Related Agents */}
      {relatedAgents.length > 0 && (
        <section className="mt-20 pt-10" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
          <h2
            className="font-semibold mb-6"
            style={{ fontSize: "18px", color: "var(--color-text-primary)" }}
          >
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedAgents.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
