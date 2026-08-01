/**
 * ImpactSROISection — SROI Analytics
 *
 * Displays SROI trend line chart alongside summary metrics.
 */

import { useMemo } from 'react';
import { cn } from '@/app/utils/cn';
import { LineChartCard } from './charts/LineChartCard';
import { ImpactCard } from './ImpactCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import type { SROI } from '../types';

export interface ImpactSROISectionProps {
  sroiData: SROI[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactSROISection({
  sroiData,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactSROISectionProps) {
  const totalInvestment = useMemo(
    () => sroiData.reduce((sum, s) => sum + s.investment, 0),
    [sroiData]
  );
  const totalReturn = useMemo(
    () => sroiData.reduce((sum, s) => sum + s.socialReturn, 0),
    [sroiData]
  );
  const avgRatio = useMemo(
    () =>
      sroiData.length > 0
        ? sroiData.reduce((sum, s) => sum + s.ratio, 0) / sroiData.length
        : 0,
    [sroiData]
  );

  if (isError) {
    return (
      <div className={className}>
        <LineChartCard
          title="اتجاه العائد الاجتماعي"
          description="تطور مؤشر العائد الاجتماعي على الاستثمار"
          data={[]}
          isError={true}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        <LineChartCard
          title="اتجاه العائد الاجتماعي"
          description="تطور مؤشر العائد الاجتماعي على الاستثمار"
          data={[]}
          isLoading={true}
        />
      </div>
    );
  }

  // Build trend data from SROI entries grouped by year
  const trendData = useMemo(() => {
    const byYear: Record<number, { investment: number; return: number; count: number }> = {};
    sroiData.forEach((s) => {
      if (!byYear[s.year]) byYear[s.year] = { investment: 0, return: 0, count: 0 };
      byYear[s.year].investment += s.investment;
      byYear[s.year].return += s.socialReturn;
      byYear[s.year].count += 1;
    });

    const years = Object.keys(byYear).sort();
    return years.map((year) => ({
      year,
      value: Number((byYear[Number(year)].return / byYear[Number(year)].investment).toFixed(1)),
      target: Number((byYear[Number(year)].return / byYear[Number(year)].investment * 1.1).toFixed(1)),
    }));
  }, [sroiData]);

  return (
    <div className={cn('space-y-4', className)}>
      <LineChartCard
        title="اتجاه العائد الاجتماعي"
        description="تطور مؤشر العائد الاجتماعي على الاستثمار"
        data={trendData}
        showTarget={true}
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryPill
          label="إجمالي الاستثمار"
          value={`${(totalInvestment / 1_000_000).toFixed(1)} مليون`}
          variant="default"
        />
        <SummaryPill
          label="إجمالي العائد"
          value={`${(totalReturn / 1_000_000).toFixed(1)} مليون`}
          variant="primary"
        />
        <SummaryPill
          label="متوسط العائد"
          value={`${avgRatio.toFixed(1)}x`}
          variant="accent"
        />
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: 'default' | 'primary' | 'accent';
}) {
  const variantClasses = {
    default: 'bg-[var(--impact-surface-secondary)] text-[var(--impact-text-primary)]',
    primary: 'bg-[var(--impact-primary)]/10 text-[var(--impact-primary)]',
    accent: 'bg-[var(--impact-success)]/10 text-[var(--impact-success)]',
  };

  return (
    <div className={cn('rounded-[var(--impact-radius-card)] p-4 text-center', variantClasses[variant])}>
      <div className="text-xs text-[var(--impact-text-muted)] mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
