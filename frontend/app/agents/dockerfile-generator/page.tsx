'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function AgentPage() {
  const agent = agents.find((a) => a.id === 'dockerfile-generator')!;
  const [groqApiKey, setGroqApiKey] = useState('');
  const [stack, set_stack] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [timestamp, setTimestamp] = useState<Date | undefined>();

  const inputStyle = {
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    background: 'var(--color-surface)',
    width: '100%',
    outline: 'none',
    transition: 'box-shadow 150ms ease',
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    marginBottom: '6px',
    display: 'block',
  } as React.CSSProperties;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setIsError(false);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${BASE_URL}/api/v1/agents/dockerfile-generator/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groq_api_key: groqApiKey,
          input1: stack,
          input2: ''
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.detail || data.detail || 'Request failed');
      
      setResult(data.data.result);
      setIsError(false);
    } catch (error: unknown) {
      setResult(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setIsError(true);
    } finally {
      setTimestamp(new Date());
      setLoading(false);
    }
  }

  return (
    <AgentPageLayout agent={agent}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        
        <fieldset className="flex flex-col gap-4 p-4 rounded-lg" style={{ border: "1px solid var(--color-border-subtle)" }}>
          <legend className="px-1 text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>API Keys</legend>
          <div>
            <label htmlFor="input-groq-api-key" style={labelStyle}>Groq API Key</label>
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
              Get your key at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--color-primary)" }}>console.groq.com</a>
            </p>
          </div>
        </fieldset>

        <div>
          <label htmlFor="input1" style={labelStyle}>App Stack and Requirements</label>
          <textarea
            id="input1"
            placeholder="e.g. Next.js app with Node 18, needs sharp"
            value={stack}
            onChange={(e) => set_stack(e.target.value)}
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            required
          />
        </div>

        

        <button
          type='submit'
          disabled={loading || !groqApiKey.trim() || !stack.trim()}
          suppressHydrationWarning
          className='px-6 py-3 rounded-lg font-medium text-sm transition-all btn-scale self-end disabled:opacity-50 w-full sm:w-auto'
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            minWidth: '160px',
          }}
        >
          {loading ? 'Running...' : 'Run Agent →'}
        </button>
      </form>

      {result && (
        <ResultsPanel
          content={result}
          isError={isError}
          isCode={true}
          timestamp={timestamp}
          downloadFilename='result.md'
          onRetry={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
        />
      )}
    </AgentPageLayout>
  );
}
