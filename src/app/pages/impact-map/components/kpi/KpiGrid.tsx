/**
 * KPI Grid Component
 *
 * Responsive grid layout for KPI cards.
 * Desktop: 4 cards in single row
 * Laptop: 2×2 grid
 * Tablet: 2 columns
 * Mobile: Single column, full width
 */

import { cn } from '@/app/utils/cn';
import { KpiCard } from './KpiCard';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ErrorState } from '../ErrorState';
import type { KpiGridProps } from '../../types/kpi';

export function KpiGrid({
  kpis,
  isLoading,
  isError,
  onRetry,
  className,
}: KpiGridProps) {
  // Error state
  if (isError) {
    return (
      <div className={cn('min-h-[160px]', className)}>
        <ErrorState
          title="تعذر تحميل المؤشرات"
          message="حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى."
          onRetry={onRetry}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          // Desktop: 4 columns, Laptop: 2×2, Tablet: 2, Mobile: 1
          'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
          'gap-[var(--spacing-grid-gap)]',
          className
        )}
      >
        <LoadingSkeleton variant="stat" count={4} />
      </div>
    );
  }

  // Normal state
  return (
    <div
      className={cn(
        // Responsive grid:
        // Mobile: 1 column (default grid-cols-1)
        // Tablet (sm): 2 columns
        // Desktop (xl): 4 columns
        'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
        'gap-[var(--spacing-grid-gap)]',
        className
      )}
      role="region"
      aria-label="المؤشرات الرئيسية"
    >
      {kpis.map((kpi, index) => (
        <KpiCard key={kpi.id} data={kpi} index={index} />
      ))}
    </div>
  );
}
