'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function JsonFormatterPage() {
  const agent = agents.find((a) => a.id === 'json-formatter')!;
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [timestamp, setTimestamp] = useState<Date | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setIsError(false);
    await new Promise((r) => setTimeout(r, 800));
    setResult(
      'This agent is coming soon! Check back soon or ⭐ star the GitHub repo to get notified when it launches.'
    );
    setTimestamp(new Date());
    setLoading(false);
  }

  return (
    <AgentPageLayout agent={agent}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* JSON input */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='json-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            JSON Input
          </label>
          <textarea
            id='json-input'
            className='w-full rounded-lg p-3 text-sm font-mono transition-shadow'
            style={{
              border: '1px solid var(--color-border-subtle)',
              minHeight: '200px',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface)',
              resize: 'vertical',
            }}
            placeholder='Paste raw or messy JSON here...'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            required
            spellCheck={false}
          />
        </div>

        <button
          type='submit'
          disabled={loading || !jsonInput.trim()}
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
          downloadFilename='formatted.json'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
