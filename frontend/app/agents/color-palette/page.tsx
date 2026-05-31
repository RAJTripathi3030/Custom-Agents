'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function ColorPalettePage() {
  const agent = agents.find((a) => a.id === 'color-palette')!;
  const [brandDescription, setBrandDescription] = useState('');
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
        {/* Brand / mood description */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='brand-description-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Describe your brand or mood
          </label>
          <textarea
            id='brand-description-input'
            className='w-full rounded-lg p-3 text-sm transition-shadow'
            style={{
              border: '1px solid var(--color-border-subtle)',
              minHeight: '120px',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface)',
              resize: 'vertical',
            }}
            placeholder='e.g. A modern fintech startup — trustworthy, clean, professional, with a hint of energy'
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            required
          />
          <p className='text-xs mt-0.5' style={{ color: 'var(--color-text-secondary)' }}>
            Describe your brand personality, industry, or the mood you want to convey.
          </p>
        </div>

        <button
          type='submit'
          disabled={loading || !brandDescription.trim()}
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
          timestamp={timestamp}
          downloadFilename='palette.txt'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
