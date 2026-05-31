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
        isDisabled ? "opacity-70 cursor-default" : ""
      }`}
      aria-label={`${agent.name} — ${agent.status}`}
    >
      {/* Corner badge */}
      {cornerBadge && (
        <div className="absolute top-3 right-3">{cornerBadge}</div>
      )}

      {/* Icon + Name row */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl leading-none" role="img" aria-label={agent.name}>
          {agent.icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold leading-tight mb-1 truncate"
            style={{ fontSize: "18px", color: "var(--color-text-primary)" }}
          >
            {agent.name}
          </h3>
          {statusBadge}
        </div>
      </div>

      {/* Description — max 2 lines */}
      <p
        className="flex-1 mb-4 overflow-hidden"
        style={{
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: "1.5",
        }}
      >
        {agent.description}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto pt-3"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            ⏱ {agent.estimatedTime}
          </span>
        </div>
        {!isDisabled && (
          <span
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            Try it →
          </span>
        )}
      </div>
    </article>
  );

  if (isDisabled) return card;

  return (
    <Link href={agent.href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
      {card}
    </Link>
  );
}

// Skeleton version matching exact card shape per §4.5
export function AgentCardSkeleton() {
  return (
    <div className="agent-card flex flex-col h-full" aria-hidden="true">
      <div className="flex items-start gap-3 mb-3">
        <div className="skeleton w-8 h-8 rounded-md shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="skeleton h-5 w-3/4 rounded" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1.5 mb-4">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
      </div>
      <div className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <div className="skeleton h-3 w-12 rounded" />
        <div className="skeleton h-4 w-14 rounded" />
      </div>
    </div>
  );
}
