"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  "ubuntu",
  "Give me something privacy-focused",
  "I need a lightweight distro for old hardware",
  "fedora vs debian — which should I pick?",
  "arch",
  "kali linux",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ISOAgentPage() {
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
                  case "tool_call": {
                    return {
                      ...msg,
                      steps: [
                        ...msg.steps,
                        {
                          tool: event.tool!,
                          input: formatInput(event.input),
                          status: "running" as const,
                        },
                      ],
                    };
                  }

                  case "tool_result": {
                    const steps = [...msg.steps];
                    const idx = steps.findLastIndex(
                      (s) => s.tool === event.tool && s.status === "running"
                    );
                    if (idx >= 0) {
                      steps[idx] = {
                        ...steps[idx],
                        result: event.content,
                        status: "done",
                      };
                    }
                    // Collect links from tool results
                    const newLinks = extractUrls(event.content ?? "");
                    return {
                      ...msg,
                      steps,
                      links: [...new Set([...msg.links, ...newLinks])],
                    };
                  }

                  case "answer": {
                    return { ...msg, content: event.content ?? "" };
                  }

                  case "error": {
                    return {
                      ...msg,
                      content: event.content ?? "An unknown error occurred.",
                      isStreaming: false,
                      isError: true,
                    };
                  }

                  case "done": {
                    return { ...msg, isStreaming: false };
                  }

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
      const errMsg =
        e instanceof Error ? e.message : "Connection failed.";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: errMsg,
                isStreaming: false,
                isError: true,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col items-center px-4 md:px-6 py-12 md:py-20 gap-6 md:gap-8 max-w-3xl mx-auto w-full">

      {/* ─── Header ─── */}
      <div className="text-center w-full">
        <h1 className="text-2xl md:text-3xl">ISO Agent</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
          An autonomous agent that finds Linux ISO links, validates them live, and answers
          follow-up questions — powered by Groq + LangGraph.
        </p>
      </div>

      {/* ─── API Key Card ─── */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-amber-600">Groq API Key</CardTitle>
          <CardDescription>
            Required to power the LLM reasoning. Get yours at{" "}
            <a
              href="https://console.groq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground"
            >
              console.groq.com
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="groq-api-key-input"
            type="password"
            placeholder="gsk-..."
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* ─── Conversation Card ─── */}
      <Card className="w-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-amber-600">Conversation</CardTitle>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>
          {isEmpty && (
            <CardDescription>
              Ask anything — a distro name, a use case, or a comparison.
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4">

          {/* Empty state / suggestions */}
          {isEmpty && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Try asking
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={!groqApiKey.trim() || loading}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-sm border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex flex-col gap-5">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    /* ── User bubble ── */
                    <div className="flex justify-end">
                      <div className="max-w-[80%] px-3 py-2 rounded-lg bg-muted text-sm font-mono">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    /* ── Assistant bubble ── */
                    <div className="flex flex-col gap-2">

                      {/* Agent steps */}
                      {msg.steps.length > 0 && (
                        <div className="flex flex-col gap-1 border-l-2 border-amber-600/25 pl-3">
                          {msg.steps.map((step, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                {step.status === "running" ? (
                                  <span className="text-[10px] text-muted-foreground animate-pulse">
                                    ⟳
                                  </span>
                                ) : step.result?.startsWith("✗") ? (
                                  <span className="text-[10px] text-destructive">✗</span>
                                ) : (
                                  <span className="text-[10px] text-emerald-600">✓</span>
                                )}
                                <span className="text-[11px] font-mono text-amber-600">
                                  {TOOL_LABELS[step.tool] ?? step.tool}
                                </span>
                                <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[220px]">
                                  ({step.input})
                                </span>
                              </div>
                              {step.result && (
                                <p className="text-[10px] font-mono text-muted-foreground pl-4 leading-relaxed">
                                  {/* Show a short summary of the result */}
                                  {step.result.split("\n")[0]}
                                  {step.result.split("\n").length > 1 &&
                                    ` (+${step.result.split("\n").length - 1} more)`}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Streaming indicator */}
                      {msg.isStreaming && !msg.content && msg.steps.every(s => s.status !== "running") && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono pl-1">
                          <span className="animate-pulse">●</span>
                          <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                          <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                        </div>
                      )}

                      {/* Final answer */}
                      {msg.content && (
                        <div
                          className={`text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                            msg.isError ? "text-destructive" : "text-foreground"
                          }`}
                        >
                          {msg.content}
                          {msg.isStreaming && (
                            <span className="animate-pulse text-amber-600">▊</span>
                          )}
                        </div>
                      )}

                      {/* Error hint */}
                      {msg.isError && (
                        <p className="text-[10px] text-muted-foreground font-mono pl-1">
                          Make sure the backend is running:{" "}
                          <code className="bg-muted px-1 rounded">
                            uvicorn api.main:app --reload
                          </code>
                        </p>
                      )}

                      {/* Extracted links panel */}
                      {msg.links.length > 0 && !msg.isStreaming && (
                        <div className="mt-1 border rounded-sm overflow-hidden">
                          <div className="px-3 py-1.5 border-b bg-muted/40 flex items-center justify-between">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              Download Links
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {msg.links.length} found
                            </span>
                          </div>
                          <div className="divide-y">
                            {msg.links.map((link, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2"
                              >
                                <span className="text-[10px] text-muted-foreground font-mono w-4 shrink-0">
                                  {i + 1}.
                                </span>
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-mono text-foreground hover:text-amber-600 transition-colors flex-1 truncate"
                                  title={link}
                                >
                                  {link}
                                </a>
                                <button
                                  onClick={() => handleCopy(link)}
                                  className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                                >
                                  {copied === link ? "✓" : "Copy"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ─── Separator ─── */}
          {messages.length > 0 && <Separator />}

          {/* ─── Input row ─── */}
          <div className="flex gap-2">
            <Input
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
              className="flex-1 font-mono text-sm"
            />
            <Button
              id="iso-send-btn"
              onClick={() => sendMessage()}
              disabled={!groqApiKey.trim() || !input.trim() || loading}
              variant="outline"
            >
              {loading ? "Running..." : "Send →"}
            </Button>
          </div>

          {messages.length > 0 && (
            <p className="text-[10px] text-muted-foreground text-center">
              Multi-turn — follow up with &quot;give me the minimal version&quot; or &quot;compare with Fedora&quot;
            </p>
          )}
        </CardContent>
      </Card>

      {/* ─── Back link ─── */}
      <Link
        href="/"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to all agents
      </Link>
    </div>
  );
}
