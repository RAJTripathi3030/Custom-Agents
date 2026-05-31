"use client";

import { useState } from "react";
import { agents } from "@/lib/agentRegistry";
import { AgentPageLayout } from "@/components/AgentPageLayout";
import { ResultsPanel } from "@/components/ResultsPanel";
import { scrapeAgent } from "@/lib/api";
import { toast } from "sonner";

export default function WebScraperAgentPage() {
  const agent = agents.find((a) => a.id === "web-scraper")!;

  const [tavilyApiKey, setTavilyApiKey] = useState("");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [siteURL, setSiteURL] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [timestamp, setTimestamp] = useState<Date | undefined>();

  const inputStyle = {
    border: "1px solid var(--color-border-subtle)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "var(--color-text-primary)",
    background: "var(--color-surface)",
    width: "100%",
    height: "48px",
    outline: "none",
    transition: "box-shadow 150ms ease",
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--color-text-primary)",
    marginBottom: "6px",
    display: "block",
  } as React.CSSProperties;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate URL
    try {
      const parsed = new URL(siteURL);
      if (parsed.protocol !== "https:") {
        toast.error("Only HTTPS URLs are allowed.");
        return;
      }
    } catch {
      toast.error("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    setLoading(true);
    setResult(null);
    setIsError(false);

    try {
      const output = await scrapeAgent(tavilyApiKey, groqApiKey, siteURL);
      setResult(output);
      setTimestamp(new Date());
      setIsError(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setResult(msg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AgentPageLayout agent={agent}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* API Keys section */}
        <fieldset className="flex flex-col gap-4 p-4 rounded-lg" style={{ border: "1px solid var(--color-border-subtle)" }}>
          <legend className="px-1 text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            API Keys
          </legend>

          <div>
            <label htmlFor="input-tavily-api-key" style={labelStyle}>
              Tavily API Key
            </label>
            <input
              id="input-tavily-api-key"
              type="password"
              placeholder="tvly-..."
              value={tavilyApiKey}
              onChange={(e) => setTavilyApiKey(e.target.value)}
              style={inputStyle}
              required
              autoComplete="off"
            />
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Get your key at{" "}
              <a
                href="https://tavily.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                tavily.com
              </a>
            </p>
          </div>

          <div>
            <label htmlFor="input-groq-api-key" style={labelStyle}>
              Groq API Key
            </label>
            <input
              id="input-groq-api-key"
              type="password"
              placeholder="gsk_..."
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              style={inputStyle}
              required
              autoComplete="off"
            />
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Get your key at{" "}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                console.groq.com
              </a>
            </p>
          </div>
        </fieldset>

        {/* URL Input */}
        <div>
          <label htmlFor="input-site-url" style={labelStyle}>
            Webpage URL
          </label>
          <input
            id="input-site-url"
            type="url"
            placeholder="https://example.com/page-to-scrape"
            value={siteURL}
            onChange={(e) => setSiteURL(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {/* Query */}
        <div>
          <label htmlFor="input-query" style={labelStyle}>
            What do you want to extract?
          </label>
          <textarea
            id="input-query"
            placeholder={`e.g. "Extract all product names and prices" or "Get the main article text"`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              ...inputStyle,
              height: "100px",
              resize: "vertical",
            }}
          />
        </div>

        {/* Tips */}
        <div
          className="p-3 rounded-lg text-xs"
          style={{
            background: "var(--color-surface-alt)",
            color: "var(--color-text-secondary)",
            lineHeight: "1.6",
          }}
        >
          <strong>Tips:</strong> Be specific — &ldquo;Extract all product prices&rdquo; works better than &ldquo;get prices&rdquo;.
          Works best on article pages, docs, and e-commerce sites. Avoid login-protected or JS-heavy pages.
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            id="scrape-submit-btn"
            type="submit"
            disabled={loading || !tavilyApiKey.trim() || !groqApiKey.trim() || !siteURL.trim()}
            className="px-6 py-3 rounded-lg font-medium text-sm transition-all btn-scale disabled:opacity-50 w-full sm:w-auto"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              minWidth: "160px",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Running...
              </span>
            ) : (
              "Scrape Page →"
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {result !== null && (
        <ResultsPanel
          title="Scraped Results"
          content={result}
          isError={isError}
          timestamp={timestamp}
          downloadFilename="scraped-results.txt"
          onRetry={() => handleSubmit(new Event("submit") as unknown as React.FormEvent)}
        />
      )}
    </AgentPageLayout>
  );
}
