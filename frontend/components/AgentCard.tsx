import Link from "next/link";
import type { Agent } from "@/lib/agentRegistry";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const isDisabled = agent.status === "coming-soon";

  const statusBadge =
    agent.status === "active" ? (
      <span className="badge-active">Active</span>
    ) : agent.status === "in-progress" ? (
      <span className="badge-new">In Progress</span>
    ) : (
      <span className="badge-coming-soon">Coming Soon</span>
    );

  const cornerBadge = agent.badge === "Popular" ? (
    <span className="badge-popular">{agent.badge}</span>
  ) : agent.badge === "New" ? (
    <span className="badge-new">{agent.badge}</span>
  ) : null;

  const card = (
    <article
      className={`agent-card flex flex-col h-full relative ${
        isDisabled ? "opacity-60 cursor-default" : ""
      }`}
      aria-label={`${agent.name} — ${agent.status}`}
    >
      {/* Corner badge */}
      {cornerBadge && (
        <div className="absolute top-4 right-4">{cornerBadge}</div>
      )}

      {/* Icon */}
      <div className="mb-5">
        <span
          className="text-3xl leading-none"
          role="img"
          aria-label={agent.name}
          style={{ display: "inline-block" }}
        >
          {agent.icon}
        </span>
      </div>

      {/* Name + status */}
      <div className="mb-3">
        <h3
          style={{
            fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
            fontSize: "18px",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "var(--color-ink)",
            marginBottom: "8px",
          }}
        >
          {agent.name}
        </h3>
        {statusBadge}
      </div>

      {/* Description */}
      <p
        className="flex-1 mb-6 overflow-hidden"
        style={{
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          lineHeight: "1.5",
        }}
      >
        {agent.description}
      </p>

      {/* Footer row */}
      <div
        className="flex items-center justify-between mt-auto pt-4"
        style={{ borderTop: "1px solid var(--color-card-border)" }}
      >
        {/* Estimated time — mono label style */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
          }}
        >
          {agent.estimatedTime}
        </span>

        {!isDisabled && (
          <span
            className="btn-pill-outline"
            style={{ fontSize: "12px", padding: "4px 12px" }}
          >
            Try it →
          </span>
        )}
      </div>
    </article>
  );

  if (isDisabled) return card;

  return (
    <Link
      href={agent.href}
      className="block h-full focus-visible:outline-none"
      style={{ borderRadius: "var(--radius-sm)" }}
    >
      {card}
    </Link>
  );
}

// Skeleton version matching exact card shape
export function AgentCardSkeleton() {
  return (
    <div className="agent-card flex flex-col h-full" aria-hidden="true">
      {/* Icon placeholder */}
      <div className="skeleton w-8 h-8 rounded mb-5" />
      {/* Name */}
      <div className="skeleton h-5 w-2/3 rounded mb-2" />
      {/* Badge */}
      <div className="skeleton h-4 w-16 rounded-full mb-3" />
      {/* Description lines */}
      <div className="flex-1 flex flex-col gap-2 mb-6">
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3.5 w-5/6 rounded" />
        <div className="skeleton h-3.5 w-4/6 rounded" />
      </div>
      {/* Footer */}
      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: "1px solid var(--color-card-border)" }}
      >
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
