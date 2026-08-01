/**
 * ImpactLeftPanel — Analytics widgets displayed beside the map on desktop.
 *
 * Contains a compact set of widgets whose total height is intended to match
 * the map row height. Additional widgets are distributed into bottom rows.
 */

import { cn } from '@/app/utils/cn';
import { ImpactSummaryCard } from './panel/ImpactSummaryCard';
import { QuickStatistics } from './panel/QuickStatistics';
import type { SummaryMetric, QuickStatistic } from '../types/analytics';

export interface ImpactLeftPanelProps {
  summaryMetrics?: SummaryMetric[];
  quickStatistics?: QuickStatistic[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactLeftPanel({
  summaryMetrics,
  quickStatistics,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactLeftPanelProps) {
  return (
    <aside
      className={cn(
        'w-full flex flex-col gap-[var(--spacing-grid-gap)]',
        'animate-fade-in',
        className
      )}
      aria-label="لوحة التحليلات اليسرى"
    >
      <ImpactSummaryCard
        metrics={summaryMetrics}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        className="flex-1 min-h-0"
      />

      <QuickStatistics
        statistics={quickStatistics}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        className="flex-1 min-h-0"
      />
    </aside>
  );
}
