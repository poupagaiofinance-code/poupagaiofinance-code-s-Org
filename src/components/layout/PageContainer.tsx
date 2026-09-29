import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <div className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col ${className}`}>
        {children}
      </div>
    </div>
  );
}
