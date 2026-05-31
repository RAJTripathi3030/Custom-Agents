'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function RegexBuilderPage() {
  const agent = agents.find((a) => a.id === 'regex-builder')!;
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
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
  };

  return (
    <AgentPageLayout agent={agent}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Pattern description */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='pattern-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Describe your pattern
          </label>
          <input
            id='pattern-input'
            type='text'
            style={inputStyle}
            placeholder='e.g. Match all email addresses that end in .com or .org'
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            required
          />
        </div>

        {/* Test string */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='test-string-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Test string{' '}
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
              (optional)
            </span>
          </label>
          <input
            id='test-string-input'
            type='text'
            style={inputStyle}
            placeholder='Enter a sample string to test the regex on (optional)'
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
          />
        </div>

        <button
          type='submit'
          disabled={loading || !pattern.trim()}
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
          downloadFilename='regex.txt'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
