/**
 * ExecutiveChartCard — Wrapper for all charts
 *
 * Provides consistent card styling, header, and layout
 * for every chart in the impact dashboard.
 */

import { cn } from '@/app/utils/cn';
import type { ReactNode } from 'react';

export interface ExecutiveChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  isLoading?: boolean;
}

export const ExecutiveChartCard = ({
  title,
  description,
  children,
  footer,
  actions,
  className,
  bodyClassName,
  isLoading,
}: ExecutiveChartCardProps) => {
  return (
    <div
      className={cn(
        'rounded-[16px] border p-5 md:p-6',
        'bg-[var(--impact-surface)] border-[var(--impact-border)]',
        'shadow-[var(--impact-shadow-1)]',
        'transition-all duration-200 ease-in-out',
        'hover:shadow-[var(--impact-shadow-2)]',
        'dark:bg-[var(--impact-main-surface)]',
        'flex flex-col',
        className
      )}
      role="region"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              'text-lg font-semibold leading-snug',
              'text-[var(--impact-text-primary)]'
            )}
          >
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-[var(--impact-text-muted)]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0">{actions}</div>
        )}
      </div>

      {/* Body */}
      <div
        className={cn(
          'flex-1 min-h-0 mt-4',
          isLoading && 'opacity-50',
          bodyClassName
        )}
      >
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-[var(--impact-divider)]">
          {footer}
        </div>
      )}
    </div>
  );
};
