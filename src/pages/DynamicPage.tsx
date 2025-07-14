import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageSkeleton from '../components/shared/PageSkeleton';
import { Card } from '../components/ui/Card';
import { createSafeHtml } from '../lib/sanitizeHtml';

interface PageData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would fetch from an API using slug
        // For now, we'll simulate a page load with mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (slug === 'not-found') {
          throw new Error('Page not found');
        }
        
        const mockPage: PageData = {
          id: '123',
          title: `${slug?.charAt(0).toUpperCase()}${slug?.slice(1)} Page`,
          content: `
            <h2>Welcome to the ${slug} page</h2>
            <p>This is a dynamic page that would normally load content from a CMS or database.</p>
            <p>The slug for this page is: <strong>${slug}</strong></p>
          `,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setPage(mockPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <PageSkeleton>
        <div className="animate-pulse">
          <div className="h-8 bg-secondary w-1/4 mb-6 rounded"></div>
          <div className="h-4 bg-secondary w-full mb-3 rounded"></div>
          <div className="h-4 bg-secondary w-5/6 mb-3 rounded"></div>
          <div className="h-4 bg-secondary w-4/6 rounded"></div>
        </div>
      </PageSkeleton>
    );
  }

  if (error) {
    return (
      <PageSkeleton>
        <Card className="p-6 text-center bg-destructive/10 border-destructive/20">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </Card>
      </PageSkeleton>
    );
  }

  return (
    <PageSkeleton title={page?.title}>
      {page?.content && (
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={createSafeHtml(page.content)}
        />
      )}
    </PageSkeleton>
  );
};

export default DynamicPage;