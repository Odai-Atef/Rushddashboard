/**
 * EmptyChartState — "No data available" for charts
 *
 * Centered, theme-aware empty state with illustration.
 */

import { cn } from '@/app/utils/cn';
import { BarChart3 } from 'lucide-react';

export interface EmptyChartStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export const EmptyChartState = ({
  title = 'لا توجد بيانات',
  description = 'لم يتم العثور على بيانات لعرضها في هذا الرسم البياني.',
  className,
}: EmptyChartStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-10 px-6',
        className
      )}
      role="status"
      aria-label="لا توجد بيانات"
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
          'bg-[var(--impact-surface-secondary)]',
          'dark:bg-[var(--impact-surface-secondary)]'
        )}
      >
        <BarChart3
          className="w-8 h-8 text-[var(--impact-text-muted)]"
          aria-hidden="true"
        />
      </div>
      <h4 className="text-base font-semibold text-[var(--impact-text-primary)] mb-1.5">
        {title}
      </h4>
      <p className="text-sm text-[var(--impact-text-muted)] max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
};
