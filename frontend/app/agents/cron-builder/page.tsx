'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function CronBuilderPage() {
  const agent = agents.find((a) => a.id === 'cron-builder')!;
  const [schedule, setSchedule] = useState('');
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
        {/* Schedule description */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='schedule-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Describe your schedule
          </label>
          <input
            id='schedule-input'
            type='text'
            className='w-full rounded-lg p-3 text-sm transition-shadow'
            style={{
              border: '1px solid var(--color-border-subtle)',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface)',
            }}
            placeholder='e.g. Every weekday at 9am, or on the 1st of every month at midnight'
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
          />
          <p className='text-xs mt-0.5' style={{ color: 'var(--color-text-secondary)' }}>
            Describe your schedule in plain English — the agent will generate the cron expression.
          </p>
        </div>

        <button
          type='submit'
          disabled={loading || !schedule.trim()}
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
          downloadFilename='cron.txt'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
