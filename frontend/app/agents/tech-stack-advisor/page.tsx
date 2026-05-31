'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function TechStackAdvisorPage() {
  const agent = agents.find((a) => a.id === 'tech-stack-advisor')!;
  const [projectDescription, setProjectDescription] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [timeline, setTimeline] = useState('');
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
        {/* Project description */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='project-description-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Describe your project
          </label>
          <textarea
            id='project-description-input'
            style={{ ...sharedInputStyle, minHeight: '120px', resize: 'vertical' }}
            placeholder='e.g. A SaaS app with 10k users, real-time notifications, file uploads, and a mobile app'
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
          />
        </div>

        {/* Team size + Timeline side by side */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='team-size-input'
              className='text-sm font-medium'
              style={{ color: 'var(--color-text-primary)' }}
            >
              Team size
            </label>
            <input
              id='team-size-input'
              type='text'
              style={sharedInputStyle}
              placeholder='e.g. 2 engineers'
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='timeline-input'
              className='text-sm font-medium'
              style={{ color: 'var(--color-text-primary)' }}
            >
              Timeline
            </label>
            <input
              id='timeline-input'
              type='text'
              style={sharedInputStyle}
              placeholder='e.g. 3 months MVP'
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={loading || !projectDescription.trim()}
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
          downloadFilename='tech-stack.txt'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
