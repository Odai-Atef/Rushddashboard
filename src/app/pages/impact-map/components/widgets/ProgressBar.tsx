/**
 * ProgressBar — Mini Progress Bar
 *
 * Thin bar with percentage fill. Primary blue fill, light gray track.
 * Small and compact for tables/lists.
 */

import { cn } from '@/app/utils/cn';

export interface ProgressBarProps {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
}

export function ProgressBar({
  progress,
  color = 'var(--primary)',
  trackColor = 'var(--hover)',
  height = 4,
  className,
  showLabel = false,
  labelClassName,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{
          height,
          backgroundColor: trackColor,
        }}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`نسبة التقدم ${clampedProgress}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            'text-xs font-medium text-[var(--text-muted)] flex-shrink-0 w-8 text-left',
            labelClassName
          )}
        >
          {clampedProgress}%
        </span>
      )}
    </div>
  );
}
