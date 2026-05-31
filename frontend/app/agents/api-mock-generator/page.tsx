'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function ApiMockGeneratorPage() {
  const agent = agents.find((a) => a.id === 'api-mock-generator')!;
  const [apiDescription, setApiDescription] = useState('');
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
        {/* API description */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='api-description-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Describe your API
          </label>
          <textarea
            id='api-description-input'
            className='w-full rounded-lg p-3 text-sm transition-shadow'
            style={{
              border: '1px solid var(--color-border-subtle)',
              minHeight: '140px',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface)',
              resize: 'vertical',
            }}
            placeholder='e.g. A REST API for a task management app with users, tasks, and comments.'
            value={apiDescription}
            onChange={(e) => setApiDescription(e.target.value)}
            required
          />
          <p className='text-xs mt-0.5' style={{ color: 'var(--color-text-secondary)' }}>
            The agent will generate a complete OpenAPI 3.0 spec with mock response data.
          </p>
        </div>

        <button
          type='submit'
          disabled={loading || !apiDescription.trim()}
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
          downloadFilename='openapi.yaml'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
