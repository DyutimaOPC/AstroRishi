import { isPlaceholder } from '@/lib/config/site';

/** Renders a real value plainly, and an unfilled one visibly marked. */
export function Ph({ value, className = '' }: { value: string; className?: string }) {
  if (!isPlaceholder(value)) return <span className={className}>{value}</span>;
  return (
    <span className={`ph ${className}`} title="Waiting on a real value before launch">
      {value}
    </span>
  );
}
