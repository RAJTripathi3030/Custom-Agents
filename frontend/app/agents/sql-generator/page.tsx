'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function SqlGeneratorPage() {
  const agent = agents.find((a) => a.id === 'sql-generator')!;
  const [schema, setSchema] = useState('');
  const [query, setQuery] = useState('');
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

  const inputStyle = {
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    background: 'var(--color-surface)',
    width: '100%',
    resize: 'vertical' as const,
  };

  return (
    <AgentPageLayout agent={agent}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Schema field */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='schema-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Database Schema
          </label>
          <textarea
            id='schema-input'
            style={{ ...inputStyle, minHeight: '140px' }}
            placeholder='Paste your CREATE TABLE statements...'
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            required
          />
        </div>

        {/* Query description field */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='query-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            What do you need?
          </label>
          <textarea
            id='query-input'
            style={{ ...inputStyle, minHeight: '100px' }}
            placeholder='e.g. Find all users who signed up last month and made at least 2 purchases'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading || !schema.trim() || !query.trim()}
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
          downloadFilename='query.sql'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
