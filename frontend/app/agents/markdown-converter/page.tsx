'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function MarkdownConverterPage() {
  const agent = agents.find((a) => a.id === 'markdown-converter')!;
  const [markdownInput, setMarkdownInput] = useState('');
  const [outputFormat, setOutputFormat] = useState<'html' | 'pdf'>('html');
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

  const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: 'var(--color-text-primary)',
  };

  return (
    <AgentPageLayout agent={agent}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Markdown input */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='markdown-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Markdown Input
          </label>
          <textarea
            id='markdown-input'
            className='w-full rounded-lg p-3 text-sm font-mono transition-shadow'
            style={{
              border: '1px solid var(--color-border-subtle)',
              minHeight: '160px',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface)',
              resize: 'vertical',
            }}
            placeholder={'# My Document\n\nPaste your Markdown here...'}
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            required
            spellCheck={false}
          />
        </div>

        {/* Output format toggle */}
        <div className='flex flex-col gap-1.5'>
          <span
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Output format
          </span>
          <div
            className='flex gap-4 p-3 rounded-lg'
            style={{
              border: '1px solid var(--color-border-subtle)',
              background: 'var(--color-surface)',
            }}
            role='radiogroup'
            aria-label='Output format'
          >
            <label style={radioLabelStyle}>
              <input
                type='radio'
                name='output-format'
                value='html'
                checked={outputFormat === 'html'}
                onChange={() => setOutputFormat('html')}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>HTML</span>
              <span
                className='text-xs'
                style={{ color: 'var(--color-text-secondary)' }}
              >
                — clean, styled markup
              </span>
            </label>
            <label style={radioLabelStyle}>
              <input
                type='radio'
                name='output-format'
                value='pdf'
                checked={outputFormat === 'pdf'}
                onChange={() => setOutputFormat('pdf')}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>PDF</span>
              <span
                className='text-xs'
                style={{ color: 'var(--color-text-secondary)' }}
              >
                — formatted document
              </span>
            </label>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading || !markdownInput.trim()}
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
          downloadFilename='output.html'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
