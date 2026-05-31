'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function GitHubTriagePage() {
  const agent = agents.find((a) => a.id === 'github-triage')!;
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
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
      'This agent is currently in development. The interface preview is shown above.'
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
      {/* In-development banner */}
      <div
        className='flex items-start gap-3 rounded-lg p-4 mb-5'
        style={{
          background: 'var(--color-primary-light, #e8f0fe)',
          border: '1px solid var(--color-primary)',
        }}
        role='status'
      >
        <span className='text-lg leading-none mt-0.5' aria-hidden='true'>
          🚧
        </span>
        <div>
          <p
            className='text-sm font-semibold'
            style={{ color: 'var(--color-primary)' }}
          >
            This agent is currently in development.
          </p>
          <p
            className='text-sm mt-0.5'
            style={{ color: 'var(--color-primary)' }}
          >
            The form below shows a preview of the interface. Full functionality
            coming soon!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Repo URL */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='repo-url-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            GitHub Repository URL
          </label>
          <input
            id='repo-url-input'
            type='url'
            style={sharedInputStyle}
            placeholder='https://github.com/owner/repo'
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
        </div>

        {/* GitHub Token */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='token-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            GitHub Token
          </label>
          <input
            id='token-input'
            type='password'
            style={sharedInputStyle}
            placeholder='ghp_... (read-only token)'
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete='off'
            required
          />
          <p className='text-xs mt-0.5' style={{ color: 'var(--color-text-secondary)' }}>
            A read-only personal access token is sufficient. Your token is never stored.
          </p>
        </div>

        <button
          type='submit'
          disabled={loading || !repoUrl.trim() || !token.trim()}
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
          downloadFilename='triage-report.txt'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
