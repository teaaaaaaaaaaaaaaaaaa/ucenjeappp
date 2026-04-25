import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const subjectMeta: Record<string, { name: string; file: string }> = {
  NJT: { name: 'Napredne Java Tehnologije', file: '/guides/NJT_survival_guide.html' },
  OI2: { name: 'Operaciona Istraživanja 2', file: '/guides/OI2_survival_guide.html' },
  PJ: { name: 'Programski Jezici', file: '/guides/PJ_survival_guide.html' },
  NA: { name: 'Numerička Analiza', file: '/guides/NA_survival_guide.html' },
};

const SubjectGuidePage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = subject ? subjectMeta[subject.toUpperCase()] : undefined;

  useEffect(() => {
    if (!meta) {
      setError('Predmet nije pronađen.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(meta.file)
      .then((res) => {
        if (!res.ok) throw new Error('Nije moguće učitati vodič.');
        return res.text();
      })
      .then((text) => {
        setHtml(DOMPurify.sanitize(text, { FORCE_BODY: true, ADD_TAGS: ['style'] }));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [meta]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => navigate('/predmeti')}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Svi predmeti
      </button>

      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/3" />
          <div className="h-4 bg-secondary rounded w-full" />
          <div className="h-4 bg-secondary rounded w-5/6" />
          <div className="h-4 bg-secondary rounded w-4/6" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div
          className="guide-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
};

export default SubjectGuidePage;
