interface BrandProps {
  className?: string;
  tagline?: string;
}

export function Brand({ className = '' }: BrandProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div 
        aria-hidden="true" 
        className="w-3 h-3 rounded-xs bg-[var(--brand-primary)]" 
      />
      <span className="text-sm font-semibold tracking-wider uppercase text-[var(--text-primary)]">
        Poupagaio Finance
      </span>
    </div>
  );
}
