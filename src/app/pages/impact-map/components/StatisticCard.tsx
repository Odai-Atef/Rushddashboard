import { cn } from '@/app/utils/cn';

export interface StatisticCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatisticCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
  className,
}: StatisticCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)]',
        'shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)]',
        'transition-all duration-[var(--transition-duration)] ease-out',
        'hover:shadow-[var(--shadow-lg)] hover:translate-y-[-2px]',
        'flex flex-col justify-between h-full',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'p-[var(--spacing-small-gap)] rounded-[var(--radius-card)]',
            'bg-[var(--primary)]/[0.08]'
          )}
        >
          <div className="w-6 h-6 text-[var(--primary)]">{icon}</div>
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-[var(--radius-badge)]',
              isPositive
                ? 'text-[var(--primary)] bg-[var(--primary)]/[0.12]'
                : 'text-[var(--destructive)] bg-[var(--destructive)]/[0.12]'
            )}
          >
            {isPositive ? '+' : ''}{change}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-[var(--text-muted)] mb-2">{description}</p>
      )}

      <h3 className="text-sm font-medium text-[var(--text-muted)] mb-1.5">
        {title}
      </h3>
      <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
        {value}
      </p>
    </div>
  );
}
