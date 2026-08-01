import { cn } from '@/app/utils/cn';

export interface LoadingSkeletonProps {
  variant?: 'card' | 'stat' | 'list' | 'map' | 'chart';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'stat':
        return (
          <div
            className={cn(
              'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)]',
              'shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)]',
              'animate-pulse flex flex-col gap-3'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[var(--hover)]" />
              <div className="w-14 h-6 rounded-md bg-[var(--hover)]" />
            </div>
            <div className="space-y-2 mt-2">
              <div className="h-4 bg-[var(--hover)] rounded w-2/3" />
              <div className="h-8 bg-[var(--hover)] rounded w-1/2" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-[var(--spacing-small-gap)] p-3 rounded-lg bg-[var(--hover)]/50"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--hover)] flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--hover)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--hover)] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'map':
        return (
          <div
            className={cn(
              'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)]',
              'shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)]',
              'animate-pulse flex items-center justify-center',
              'min-h-[400px] md:min-h-[500px]'
            )}
          >
            <div className="text-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-[var(--hover)] mx-auto" />
              <div className="h-4 bg-[var(--hover)] rounded w-48 mx-auto" />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div
            className={cn(
              'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)]',
              'shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)]',
              'animate-pulse space-y-4'
            )}
          >
            <div className="h-6 bg-[var(--hover)] rounded w-1/3" />
            <div className="flex items-end gap-2 h-[250px] pt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[var(--hover)] rounded-t-md"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div
            className={cn(
              'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)]',
              'shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)]',
              'animate-pulse space-y-3'
            )}
          >
            <div className="h-5 bg-[var(--hover)] rounded w-3/4" />
            <div className="h-4 bg-[var(--hover)] rounded w-1/2" />
            <div className="h-4 bg-[var(--hover)] rounded w-5/6" />
            <div className="h-24 bg-[var(--hover)] rounded w-full mt-2" />
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={className}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
