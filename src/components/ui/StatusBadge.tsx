interface StatusBadgeProps {
  label: string;
  className?: string;
}

export function StatusBadge({ label, className = '' }: StatusBadgeProps) {
  return (
    <div
      role="status"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--brand-subtle)] border border-[var(--brand-border)] text-xs font-medium text-[var(--brand-primary)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="w-2 h-2 rounded-full bg-[var(--brand-primary)]"
      />
      <span>{label}</span>
    </div>
  );
}
