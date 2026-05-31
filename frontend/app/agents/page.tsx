import type { Metadata } from "next";
import { agents, allCategories, getAgentsByCategory } from "@/lib/agentRegistry";
import { AgentCard } from "@/components/AgentCard";

export const metadata: Metadata = {
  title: "All AI Agents",
  description:
    "Browse all available AI agents on Hubble. Web scraping, SQL generation, regex building, Dockerfile generation, color palettes, and more.",
};

export default function AgentsPage() {
  return (
    <div className="content-width py-12 md:py-16">
      <header className="mb-12">
        <h1
          className="font-bold mb-3"
          style={{ fontSize: "32px", color: "var(--color-text-primary)" }}
        >
          All Agents
        </h1>
        <p
          className="max-w-2xl"
          style={{ fontSize: "16px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}
        >
          {agents.length} purpose-built AI agents for real-world automation tasks. Each agent is
          self-contained, open source, and free to self-host.
        </p>
      </header>

      {allCategories.map((category) => {
        const categoryAgents = getAgentsByCategory(category);
        if (categoryAgents.length === 0) return null;
        return (
          <section key={category} className="mb-14">
            <h2
              className="font-semibold mb-6 pb-3"
              style={{
                fontSize: "18px",
                color: "var(--color-text-primary)",
                borderBottom: "1px solid var(--color-border-subtle)",
              }}
            >
              {category}
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--color-text-secondary)" }}
              >
                ({categoryAgents.length})
              </span>
            </h2>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {categoryAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
