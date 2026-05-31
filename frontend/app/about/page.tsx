import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Code2, Zap, Bot } from "lucide-react";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Hubble — an open source AI agent platform built by RAJ Tripathi. Purpose-built agents for real-world automation tasks.",
};

export default function AboutPage() {
  return (
    <div className="content-width py-12 md:py-16">
      <div className="max-w-2xl">
        <h1
          className="font-bold mb-4"
          style={{ fontSize: "32px", color: "var(--color-text-primary)" }}
        >
          About Hubble
        </h1>
        <p
          className="mb-8 leading-relaxed"
          style={{ fontSize: "18px", color: "var(--color-text-secondary)" }}
        >
          Hubble is an open source platform that hosts purpose-built AI agents. Each agent
          solves a specific real-world task — web scraping, code generation, document processing,
          and more — without requiring you to set up infrastructure.
        </p>

        <section className="mb-10">
          <h2
            className="font-semibold mb-4"
            style={{ fontSize: "24px", color: "var(--color-text-primary)" }}
          >
            Why Hubble?
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                icon: <Shield size={20} />,
                title: "Your data stays private",
                desc: "API keys and inputs are never stored. Everything is processed in-memory and discarded after your session.",
              },
              {
                icon: <Code2 size={20} />,
                title: "Fully open source",
                desc: "Every agent, every line of code, is on GitHub. Fork it, self-host it, or contribute new agents.",
              },
              {
                icon: <Zap size={20} />,
                title: "Built for real tasks",
                desc: "Every agent is purpose-built. Not a general-purpose chatbot — a focused tool that does one thing extremely well.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-4 rounded-lg"
                style={{ border: "1px solid var(--color-border-subtle)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "var(--color-primary-light, #e8f0fe)",
                    color: "var(--color-primary)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    className="font-semibold mb-1"
                    style={{ fontSize: "16px", color: "var(--color-text-primary)" }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-semibold mb-3" style={{ fontSize: "24px", color: "var(--color-text-primary)" }}>
            Built by
          </h2>
          <p style={{ fontSize: "16px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
            Hubble is built and maintained by{" "}
            <a
              href="https://github.com/RAJTripathi3030"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
              style={{ color: "var(--color-primary)" }}
            >
              RAJ Tripathi
            </a>
            . It&apos;s a personal open source project — contributions, feedback, and new agent
            ideas are welcome!
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-semibold mb-3" style={{ fontSize: "24px", color: "var(--color-text-primary)" }}>
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "LangGraph", "Groq", "Tavily"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: "var(--color-surface-alt)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/RAJTripathi3030/Custom-Agents"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all btn-scale"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            <GithubIcon size={16} />
            View on GitHub
          </a>
          <Link
            href="/agents"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all btn-scale"
            style={{
              border: "1px solid var(--color-border-subtle)",
              color: "var(--color-text-primary)",
              background: "var(--color-surface)",
            }}
          >
            <Bot size={16} />
            Browse Agents
          </Link>
        </div>
      </div>
    </div>
  );
}
