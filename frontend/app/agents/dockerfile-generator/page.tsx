'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function DockerfileGeneratorPage() {
  const agent = agents.find((a) => a.id === 'dockerfile-generator')!;
  const [runtime, setRuntime] = useState('');
  const [description, setDescription] = useState('');
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

  const sharedInputStyle = {
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    background: 'var(--color-surface)',
    width: '100%',
  };

  return (
    <AgentPageLayout agent={agent}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Language / Runtime */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='runtime-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Language / Runtime
          </label>
          <input
            id='runtime-input'
            type='text'
            style={sharedInputStyle}
            placeholder='e.g. Node.js 20, Python 3.11, Go 1.22'
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            required
          />
        </div>

        {/* App description */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='description-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Describe your app
          </label>
          <textarea
            id='description-input'
            style={{ ...sharedInputStyle, minHeight: '120px', resize: 'vertical' }}
            placeholder='e.g. A Next.js app with Prisma and a PostgreSQL database. Needs multi-stage build.'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading || !runtime.trim() || !description.trim()}
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
          downloadFilename='Dockerfile'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
