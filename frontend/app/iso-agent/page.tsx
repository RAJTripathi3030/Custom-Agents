"use client";

import { useState, useRef, useEffect } from "react";
import { agents } from "@/lib/agentRegistry";
import { AgentPageLayout } from "@/components/AgentPageLayout";
import { Send, X } from "lucide-react";

interface AgentStep {
  tool: string;
  input: string;
  result?: string;
  status: "running" | "done" | "error";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  steps: AgentStep[];
  links: string[];
  isStreaming: boolean;
  isError: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  fetch_iso: "Searching local database",
  validate_url: "Validating URL",
  search_web_for_iso: "Searching online",
};

function extractUrls(text: string): string[] {
  const re = /https?:\/\/[^\s\n"')]+/g;
  return [...new Set(text.match(re) ?? [])];
}

function formatInput(input: unknown): string {
  if (typeof input === "string") return input;
  if (typeof input === "object" && input !== null) {
    const vals = Object.values(input as Record<string, unknown>);
    return vals.map(String).join(", ");
  }
  return String(input);
}

const SUGGESTIONS = [
  "ubuntu 24.04",
  "Give me something privacy-focused",
  "lightweight distro for old hardware",
  "fedora vs debian — which should I pick?",
  "arch linux",
  "kali linux",
];

export default function ISOAgentPage() {
  const agent = agents.find((a) => a.id === "iso-downloader")!;

  const [groqApiKey, setGroqApiKey] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [threadId] = useState(
    () => `iso-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || !groqApiKey.trim() || loading) return;

    setInput("");
    setLoading(true);

    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: userId,
        role: "user",
        content: userText,
        steps: [],
        links: [],
        isStreaming: false,
        isError: false,
      },
      {
        id: assistantId,
        role: "assistant",
        content: "",
        steps: [],
        links: [],
        isStreaming: true,
        isError: false,
      },
    ]);

    try {
      const res = await fetch("http://localhost:8000/iso/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          groq_api_key: groqApiKey,
          thread_id: threadId,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server error (${res.status}). Is the backend running?`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          const line = chunk.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;

          try {
            const event = JSON.parse(line.slice(6)) as {
              type: string;
              tool?: string;
              input?: unknown;
              content?: string;
            };

            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantId) return msg;
                switch (event.type) {
                  case "tool_call":
                    return {
                      ...msg,
                      steps: [
                        ...msg.steps,
                        { tool: event.tool!, input: formatInput(event.input), status: "running" as const },
                      ],
                    };
                  case "tool_result": {
                    const steps = [...msg.steps];
                    const idx = steps.findLastIndex(
                      (s) => s.tool === event.tool && s.status === "running"
                    );
                    if (idx >= 0) {
                      steps[idx] = { ...steps[idx], result: event.content, status: "done" };
                    }
                    const newLinks = extractUrls(event.content ?? "");
                    return { ...msg, steps, links: [...new Set([...msg.links, ...newLinks])] };
                  }
                  case "answer":
                    return { ...msg, content: event.content ?? "" };
                  case "error":
                    return { ...msg, content: event.content ?? "An unknown error occurred.", isStreaming: false, isError: true };
                  case "done":
                    return { ...msg, isStreaming: false };
                  default:
                    return msg;
                }
              })
            );
          } catch {
            // Malformed JSON chunk — skip
          }
        }
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Connection failed.";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: errMsg, isStreaming: false, isError: true }
            : msg
        )
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

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
  } as React.CSSProperties;

  return (
    <AgentPageLayout agent={agent}>
      <div className="flex flex-col gap-5">

        {/* API Key */}
        <div>
          <label htmlFor="groq-api-key-input"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--color-text-primary)" }}>
            Groq API Key
          </label>
          <input
            id="groq-api-key-input"
            type="password"
            placeholder="gsk_..."
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
            style={inputStyle}
            autoComplete="off"
          />
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Required to power the LLM reasoning. Get yours at{" "}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: "var(--color-primary)" }}>
              console.groq.com
            </a>
          </p>
        </div>

        {/* Conversation area */}
        <div
          className="rounded-lg overflow-hidden flex flex-col"
          style={{ border: "1px solid var(--color-border-subtle)", minHeight: "320px" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border-subtle)" }}
          >
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Conversation
            </span>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
            {/* Empty state with suggestions */}
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--color-text-muted)" }}>
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      disabled={!groqApiKey.trim() || loading}
                      className="text-xs px-3 py-1.5 rounded-full transition-all btn-scale disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        border: "1px solid var(--color-border-subtle)",
                        color: "var(--color-text-secondary)",
                        background: "var(--color-surface)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] px-3 py-2 rounded-lg text-sm"
                      style={{
                        background: "var(--color-primary)",
                        color: "#fff",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Steps */}
                    {msg.steps.length > 0 && (
                      <div
                        className="flex flex-col gap-1 pl-3"
                        style={{ borderLeft: "2px solid var(--color-primary-light, #1a73e820)" }}
                      >
                        {msg.steps.map((step, i) => (
                          <div key={i} className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              {step.status === "running" ? (
                                <span className="text-xs animate-pulse" style={{ color: "var(--color-text-muted)" }}>⟳</span>
                              ) : step.result?.startsWith("✗") ? (
                                <span className="text-xs" style={{ color: "var(--color-error)" }}>✗</span>
                              ) : (
                                <span className="text-xs" style={{ color: "var(--color-success)" }}>✓</span>
                              )}
                              <span className="text-xs font-mono" style={{ color: "var(--color-primary)" }}>
                                {TOOL_LABELS[step.tool] ?? step.tool}
                              </span>
                              <span className="text-xs font-mono truncate max-w-[200px]" style={{ color: "var(--color-text-muted)" }}>
                                ({step.input})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Streaming indicator */}
                    {msg.isStreaming && !msg.content && (
                      <div className="flex items-center gap-1 text-xs pl-1" style={{ color: "var(--color-text-muted)" }}>
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                        <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                      </div>
                    )}

                    {/* Answer */}
                    {msg.content && (
                      <div
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ color: msg.isError ? "var(--color-error)" : "var(--color-text-primary)" }}
                      >
                        {msg.content}
                        {msg.isStreaming && <span className="animate-pulse" style={{ color: "var(--color-primary)" }}>▊</span>}
                      </div>
                    )}

                    {/* Download links */}
                    {msg.links.length > 0 && !msg.isStreaming && (
                      <div
                        className="mt-1 rounded-lg overflow-hidden"
                        style={{ border: "1px solid var(--color-border-subtle)" }}
                      >
                        <div
                          className="px-3 py-2 flex items-center justify-between"
                          style={{ background: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border-subtle)" }}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                            Download Links
                          </span>
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            {msg.links.length} found
                          </span>
                        </div>
                        {msg.links.map((link, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: i < msg.links.length - 1 ? "1px solid var(--color-border-subtle)" : "none" }}>
                            <span className="text-xs w-4 shrink-0" style={{ color: "var(--color-text-muted)" }}>{i + 1}.</span>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono flex-1 truncate transition-colors hover:underline"
                              style={{ color: "var(--color-primary)" }}
                              title={link}
                            >
                              {link}
                            </a>
                            <button
                              onClick={() => handleCopy(link)}
                              className="shrink-0 text-xs px-2 py-0.5 rounded transition-all btn-scale"
                              style={{
                                border: "1px solid var(--color-border-subtle)",
                                color: "var(--color-text-secondary)",
                                background: "var(--color-surface)",
                              }}
                            >
                              {copied === link ? "✓" : "Copy"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div
            className="p-3 flex gap-2"
            style={{ borderTop: "1px solid var(--color-border-subtle)", background: "var(--color-surface-alt)" }}
          >
            <input
              ref={inputRef}
              id="iso-chat-input"
              type="text"
              placeholder={
                groqApiKey.trim()
                  ? "Ask about any Linux distro..."
                  : "Enter your Groq API key above first"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={!groqApiKey.trim() || loading}
              className="flex-1"
              style={{
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "14px",
                color: "var(--color-text-primary)",
                background: "var(--color-surface)",
                outline: "none",
              }}
            />
            <button
              id="iso-send-btn"
              onClick={() => sendMessage()}
              disabled={!groqApiKey.trim() || !input.trim() || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all btn-scale disabled:opacity-50"
              style={{ background: "var(--color-primary)", color: "#fff" }}
            >
              <Send size={14} />
              {loading ? "Running..." : "Send"}
            </button>
          </div>
        </div>

        {messages.length > 0 && (
          <p className="text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
            Multi-turn — follow up with &ldquo;give me the minimal version&rdquo; or &ldquo;compare with Fedora&rdquo;
          </p>
        )}
      </div>
    </AgentPageLayout>
  );
}
