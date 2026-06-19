interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-black/5" aria-label={`진행률 ${value}%`}>
      <div
        className="h-full rounded-full bg-[var(--app-accent)] transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
