"use client";

import { useState } from "react";
import { Copy, Download, Check, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ResultsPanelProps {
  title?: string;
  content: string;
  isError?: boolean;
  isCode?: boolean;
  timestamp?: Date;
  downloadFilename?: string;
  onRetry?: () => void;
}

export function ResultsPanel({
  title = "Results",
  content,
  isError = false,
  isCode = false,
  timestamp,
  downloadFilename,
  onRetry,
}: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename ?? "result.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  if (isError) {
    return (
      <div
        className="results-panel mt-6 rounded-lg p-4 flex flex-col gap-3"
        style={{
          border: "1px solid var(--color-error)",
          background: "var(--color-error-bg)",
        }}
        role="alert"
      >
        <div className="flex items-center gap-2" style={{ color: "var(--color-error)" }}>
          <AlertCircle size={18} />
          <span className="font-semibold text-sm">Something went wrong</span>
        </div>
        <p className="text-sm" style={{ color: "var(--color-error)" }}>
          {content}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all btn-scale"
            style={{ background: "var(--color-error)", color: "#fff" }}
          >
            <RotateCcw size={14} />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="results-panel mt-6 rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--color-border-subtle)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "var(--color-surface-alt)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <div>
          <span className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
            {title}
          </span>
          {timestamp && (
            <span className="ml-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
              {timestamp.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            aria-label="Copy all"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all btn-scale hover:bg-muted"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy all"}
          </button>
          {downloadFilename && (
            <button
              onClick={handleDownload}
              aria-label="Download"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all btn-scale hover:bg-muted"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Download size={13} />
              Download
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isCode ? (
        <div className="relative">
          <button
            onClick={handleCopy}
            aria-label="Copy code"
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all z-10"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          <pre
            className="overflow-auto p-4 font-mono text-sm leading-relaxed"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              maxHeight: "480px",
              fontSize: "13px",
            }}
          >
            <code>{content}</code>
          </pre>
        </div>
      ) : (
        <div
          className="p-4 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            color: "var(--color-text-primary)",
            background: "var(--color-surface)",
            maxHeight: "480px",
            overflow: "auto",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
