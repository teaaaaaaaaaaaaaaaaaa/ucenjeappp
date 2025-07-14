import React from 'react';

interface PageSkeletonProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {title && (
        <h1 className="text-3xl font-bold mb-6 text-foreground">{title}</h1>
      )}
      {children}
    </div>
  );
};

export default PageSkeleton; 