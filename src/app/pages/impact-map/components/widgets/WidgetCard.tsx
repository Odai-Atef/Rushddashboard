/**
 * WidgetCard — Base Widget Wrapper
 *
 * Base card wrapper for all analytics widgets.
 * 16px radius, 24px padding, theme-aware border and shadow.
 */

import { cn } from '@/app/utils/cn';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';

export interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorMessage?: string;
}

export function WidgetCard({
  children,
  className,
  title,
  description,
  headerAction,
  footer,
  isLoading,
  isError,
  isEmpty,
  onRetry,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorMessage,
}: WidgetCardProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'bg-[var(--card)] rounded-[16px] border border-[var(--border)]',
          'shadow-[var(--shadow-card)] overflow-hidden',
          'flex flex-col',
          className
        )}
      >
        {(title || headerAction) && (
          <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-3">
            <div className="h-5 bg-[var(--hover)] rounded w-1/3 animate-pulse" />
            <div className="h-8 bg-[var(--hover)] rounded w-20 animate-pulse" />
          </div>
        )}
        <div className="flex-1 px-6 pb-6">
          <LoadingSkeleton variant="list" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div
        className={cn(
          'bg-[var(--card)] rounded-[16px] border border-[var(--border)]',
          'shadow-[var(--shadow-card)] overflow-hidden',
          'flex flex-col min-h-[200px]',
          className
        )}
      >
        {(title || headerAction) && (
          <div className="px-6 pt-5 pb-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
                {title}
              </h3>
              {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
            </div>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center px-6 pb-6">
          <ErrorState
            title={errorTitle || 'تعذر تحميل البيانات'}
            message={errorMessage || 'حدث خطأ أثناء جلب البيانات.'}
            onRetry={onRetry}
            className="min-h-[160px]"
          />
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div
        className={cn(
          'bg-[var(--card)] rounded-[16px] border border-[var(--border)]',
          'shadow-[var(--shadow-card)] overflow-hidden',
          'flex flex-col min-h-[200px]',
          className
        )}
      >
        {(title || headerAction) && (
          <div className="px-6 pt-5 pb-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
                {title}
              </h3>
              {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
            </div>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center px-6 pb-6">
          <EmptyState
            title={emptyTitle || 'لا توجد بيانات'}
            description={emptyDescription || 'لم يتم العثور على أي بيانات حالياً.'}
            className="min-h-[160px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-[var(--card)] rounded-[16px] border border-[var(--border)]',
        'shadow-[var(--shadow-card)] overflow-hidden',
        'transition-all duration-150 ease-out',
        'hover:shadow-[var(--shadow-lg)] hover:translate-y-[-2px]',
        'flex flex-col',
        className
      )}
      role="region"
      aria-label={title}
    >
      {/* Header */}
      {(title || description || headerAction) && (
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-3">
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
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 px-6 pb-5">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-6 pb-5 pt-0 border-t border-[var(--border)]">
          {footer}
        </div>
      )}
    </div>
  );
}
