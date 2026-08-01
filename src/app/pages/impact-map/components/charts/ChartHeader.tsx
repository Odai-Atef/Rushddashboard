/**
 * ChartHeader — Chart title and actions component
 *
 * Provides consistent header styling for all charts.
 */

import { cn } from '@/app/utils/cn';
import type { ReactNode } from 'react';

export interface ChartHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const ChartHeader = ({
  title,
  subtitle,
  actions,
  className,
}: ChartHeaderProps) => {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 mb-4',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h3
          className={cn(
            'text-lg font-semibold leading-snug',
            'text-[var(--impact-text-primary)]'
          )}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--impact-text-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex-shrink-0">{actions}</div>
      )}
    </div>
  );
};
