/**
 * ErrorChartState — Friendly error state for charts
 *
 * With retry button, theme-aware colors.
 */

import { cn } from '@/app/utils/cn';
import { AlertCircle, RotateCcw } from 'lucide-react';

export interface ErrorChartStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorChartState = ({
  title = 'تعذر تحميل البيانات',
  description = 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.',
  onRetry,
  className,
}: ErrorChartStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-10 px-6',
        className
      )}
      role="alert"
      aria-label="خطأ في تحميل البيانات"
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
          'bg-[var(--impact-danger)]/10'
        )}
      >
        <AlertCircle
          className="w-8 h-8 text-[var(--impact-danger)]"
          aria-hidden="true"
        />
      </div>
      <h4 className="text-base font-semibold text-[var(--impact-text-primary)] mb-1.5">
        {title}
      </h4>
      <p className="text-sm text-[var(--impact-text-muted)] max-w-xs leading-relaxed mb-5">
        {description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl',
            'text-sm font-semibold',
            'text-[var(--impact-primary)] bg-[var(--impact-primary)]/10',
            'hover:bg-[var(--impact-primary)]/15',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-[var(--impact-primary)]',
            'min-h-[44px]'
          )}
          aria-label="إعادة المحاولة"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};
