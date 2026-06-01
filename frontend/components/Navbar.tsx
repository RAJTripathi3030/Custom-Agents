"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { agents } from "@/lib/agentRegistry";
import { Menu, X } from "lucide-react";

// Inline GitHub SVG — lucide-react v1 doesn't export Github
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// Hubble wordmark — clean geometric
function HubbleLogo() {
  return (
    <span
      style={{
        fontFamily: "var(--font-display, 'Space Grotesk'), 'Inter', ui-sans-serif",
        fontWeight: 500,
        fontSize: "20px",
        letterSpacing: "-0.02em",
        color: "var(--color-ink)",
      }}
    >
      Hubble
    </span>
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
        className={`navbar-glass sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
        style={{ height: "60px" }}
      >
        <div className="content-width h-full flex items-center justify-between gap-4">

          {/* ── Brand (left) ── */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-70"
            aria-label="Hubble home"
          >
            {/* Simple geometric dot mark */}
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-ink)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <HubbleLogo />
          </Link>

          {/* ── Nav links (center — desktop only) ── */}
          <nav className="hidden md:flex items-center gap-0" aria-label="Primary navigation">
            {[
              { href: "/", label: "Home" },
              { href: "/agents", label: "Agents" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm transition-opacity hover:opacity-50"
                style={{
                  color: "var(--color-ink)",
                  fontFamily: "'Inter', ui-sans-serif",
                  fontWeight: 400,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Actions (right) ── */}
          <div className="flex items-center gap-3">
            {/* GitHub — pill outline button */}
            <a
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="hidden md:inline-flex btn-pill-outline items-center gap-1.5"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded transition-opacity hover:opacity-60"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{ color: "var(--color-ink)" }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen slide-out menu ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ top: "60px" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(23,23,28,0.15)" }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu panel */}
          <nav
            className="relative h-full w-full max-w-xs ml-auto flex flex-col p-6 gap-1 overflow-y-auto"
            style={{
              background: "var(--color-canvas)",
              borderLeft: "1px solid var(--color-hairline)",
            }}
            aria-label="Mobile navigation"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/agents", label: "All Agents" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-base transition-opacity hover:opacity-50"
                style={{ color: "var(--color-ink)", fontWeight: 400 }}
              >
                {link.label}
              </Link>
            ))}

            <div
              className="mt-4 mb-2 px-3 text-mono-label"
              style={{ color: "var(--color-text-secondary)", fontSize: "11px" }}
            >
              Active Agents
            </div>
            {activeAgents.map((agent) => (
              <Link
                key={agent.id}
                href={agent.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded transition-opacity hover:opacity-60"
                style={{ color: "var(--color-ink)" }}
              >
                <span className="text-lg">{agent.icon}</span>
                <span className="text-sm" style={{ fontWeight: 400 }}>{agent.name}</span>
                {agent.status === "in-progress" && (
                  <span className="ml-auto badge-new">In Progress</span>
                )}
              </Link>
            ))}

            <div
              className="mt-auto pt-4 flex flex-col gap-1"
              style={{ borderTop: "1px solid var(--color-hairline)" }}
            >
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm transition-opacity hover:opacity-50"
                style={{ color: "var(--color-ink)" }}
              >
                About
              </Link>
              <a
                href="https://github.com/RAJTripathi3030/Custom-Agents"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-3 text-sm transition-opacity hover:opacity-50"
                style={{ color: "var(--color-ink)" }}
              >
                <GithubIcon size={14} />
                GitHub
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
