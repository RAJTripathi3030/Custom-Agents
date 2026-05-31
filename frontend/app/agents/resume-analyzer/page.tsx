'use client';

import { useState } from 'react';
import { AgentPageLayout } from '@/components/AgentPageLayout';
import { ResultsPanel } from '@/components/ResultsPanel';
import { agents } from '@/lib/agentRegistry';

export default function ResumeAnalyzerPage() {
  const agent = agents.find((a) => a.id === 'resume-analyzer')!;
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
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
        {/* Resume field */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='resume-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Your Resume / CV
          </label>
          <textarea
            id='resume-input'
            style={{ ...inputStyle, minHeight: '160px' }}
            placeholder='Paste your resume text here...'
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            required
          />
        </div>

        {/* Job description field */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='job-description-input'
            className='text-sm font-medium'
            style={{ color: 'var(--color-text-primary)' }}
          >
            Job Description
          </label>
          <textarea
            id='job-description-input'
            style={{ ...inputStyle, minHeight: '120px' }}
            placeholder='Paste the job description you are targeting...'
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading || !resume.trim() || !jobDescription.trim()}
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
          downloadFilename='improved-resume.txt'
          onRetry={() => handleSubmit(new Event('submit') as any)}
        />
      )}
    </AgentPageLayout>
  );
}
