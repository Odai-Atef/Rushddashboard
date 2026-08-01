import { cn } from '@/app/utils/cn';

export interface ImpactCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  isLoading?: boolean;
}

export function ImpactCard({
  children,
  className,
  title,
  description,
  headerAction,
  isLoading,
}: ImpactCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)]',
        'shadow-[var(--shadow-card)]',
        'transition-all duration-[var(--transition-duration)] ease-out',
        'hover:shadow-[var(--shadow-lg)] hover:translate-y-[-2px]',
        'flex flex-col',
        className
      )}
    >
      {(title || description || headerAction) && (
        <div className="px-[var(--spacing-card-padding)] pt-5 pb-4 flex items-start justify-between gap-[var(--spacing-small-gap)]">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">{headerAction}</div>
          )}
        </div>
      )}
      <div className={cn('flex-1', !title && !description && !headerAction && 'p-[var(--spacing-card-padding)]')}>
        {isLoading ? (
          <div className="animate-pulse space-y-3 p-[var(--spacing-card-padding)]">
            <div className="h-4 bg-[var(--hover)] rounded w-3/4" />
            <div className="h-4 bg-[var(--hover)] rounded w-1/2" />
            <div className="h-4 bg-[var(--hover)] rounded w-5/6" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
