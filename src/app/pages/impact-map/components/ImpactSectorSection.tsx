/**
 * ImpactSectorSection — Projects by Sector
 *
 * Displays horizontal bar chart for sector distribution.
 */

import { useMemo } from 'react';
import { cn } from '@/app/utils/cn';
import { BarChartCard } from './charts/BarChartCard';
import type { Sector } from '../types';

export interface ImpactSectorSectionProps {
  sectors: Sector[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactSectorSection({
  sectors,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactSectorSectionProps) {
  const barData = useMemo(
    () =>
      sectors.map((s) => ({
        label: s.name,
        value: s.projectCount,
        category: s.id,
      })),
    [sectors]
  );

  const totalProjects = useMemo(
    () => sectors.reduce((sum, s) => sum + s.projectCount, 0),
    [sectors]
  );

  const totalFunding = useMemo(
    () => sectors.reduce((sum, s) => sum + s.totalFunding, 0),
    [sectors]
  );

  return (
    <div className={cn('space-y-4', className)}>
      <BarChartCard
        title="المشاريع حسب القطاع"
        description="توزيع المشاريع والتمويل عبر القطاعات المختلفة"
        data={barData}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        horizontal={true}
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryPill
          label="إجمالي القطاعات"
          value={sectors.length.toLocaleString('ar-SA')}
          variant="default"
        />
        <SummaryPill
          label="إجمالي التمويل"
          value={`${(totalFunding / 1_000_000).toFixed(0)} مليون ر.س.`}
          variant="primary"
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
