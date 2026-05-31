"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { agents } from "@/lib/agentRegistry";
import { Menu, X, Bot } from "lucide-react";

// Inline GitHub SVG — lucide-react v1 doesn't export Github
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "in-progress");

  return (
    <>
      <header
        className={`navbar-glass sticky top-0 z-50 w-full transition-shadow duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
        style={{ height: "64px" }}
      >
        <div className="content-width h-full flex items-center justify-between gap-4">

          {/* ── Brand (left) ── */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold shrink-0 transition-opacity hover:opacity-80"
            style={{ color: "var(--color-primary)" }}
          >
            <Bot size={24} />
            Hubble
          </Link>

          {/* ── Nav links (center — desktop only) ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Home
            </Link>
            <Link
              href="/agents"
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Agents
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted"
              style={{ color: "var(--color-text-secondary)" }}
            >
              About
            </Link>
          </nav>

          {/* ── Actions (right) ── */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-muted"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <GithubIcon size={16} />
              <span>GitHub</span>
            </a>
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen slide-out menu ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ top: "64px" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu panel */}
          <nav
            className="relative h-full w-full max-w-sm ml-auto flex flex-col p-6 gap-2 overflow-y-auto"
            style={{ background: "var(--color-surface)" }}
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-base font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Home
            </Link>
            <Link
              href="/agents"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-base font-medium rounded-lg hover:bg-muted transition-colors"
            >
              All Agents
            </Link>

            <div className="mt-2 mb-1 px-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}>
              Active Agents
            </div>
            {activeAgents.map((agent) => (
              <Link
                key={agent.id}
                href={agent.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-xl">{agent.icon}</span>
                <span className="text-sm font-medium">{agent.name}</span>
                {agent.status === "in-progress" && (
                  <span className="ml-auto text-[10px] badge-new">In Progress</span>
                )}
              </Link>
            ))}

            <div className="mt-auto pt-4 border-t flex flex-col gap-2" style={{ borderColor: "var(--color-border-subtle)" }}>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
              >
                About
              </Link>
              <a
                href="https://github.com/RAJTripathi3030/Custom-Agents"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
              >
                <GithubIcon size={16} />
                GitHub
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
