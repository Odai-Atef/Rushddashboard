/**
 * ChartSkeleton — Loading state for charts
 *
 * Animated shimmer placeholder — no spinner.
 */

import { cn } from '@/app/utils/cn';

export interface ChartSkeletonProps {
  className?: string;
  height?: string;
  showHeader?: boolean;
  showLegend?: boolean;
  bars?: number;
}

export const ChartSkeleton = ({
  className,
  height = '280px',
  showHeader = true,
  showLegend = true,
  bars = 5,
}: ChartSkeletonProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 animate-pulse',
        className
      )}
      aria-busy="true"
      aria-label="جاري تحميل الرسم البياني..."
    >
      {/* Header Skeleton */}
      {showHeader && (
        <div className="space-y-2">
          <div className="h-5 w-1/3 rounded-md bg-[var(--impact-surface-secondary)] dark:bg-[var(--impact-surface-secondary)]" />
          <div className="h-3.5 w-1/2 rounded-md bg-[var(--impact-surface-secondary)] dark:bg-[var(--impact-surface-secondary)]" />
        </div>
      )}

      {/* Chart Body Skeleton */}
      <div
        className="relative rounded-[16px] bg-[var(--impact-surface-secondary)] dark:bg-[var(--impact-surface-secondary)] overflow-hidden"
        style={{ height }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

        {/* Fake bars / line */}
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
          {Array.from({ length: bars }).map((_, i) => (
            <div
              key={i}
              className="w-full mx-1 rounded-t-md bg-[var(--impact-border)] dark:bg-[var(--impact-border)] opacity-40"
              style={{
                height: `${20 + ((i * 17) % 60)}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Legend Skeleton */}
      {showLegend && (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--impact-surface-secondary)] dark:bg-[var(--impact-surface-secondary)]"
            >
              <div className="w-3 h-3 rounded-full bg-[var(--impact-border)]" />
              <div className="h-3.5 w-16 rounded-md bg-[var(--impact-border)]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
