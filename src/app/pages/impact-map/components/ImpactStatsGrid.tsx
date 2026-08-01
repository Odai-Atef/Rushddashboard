import {
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { StatisticCard } from './StatisticCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import type { KPI } from '../types';
import { cn } from '@/app/utils/cn';

export interface ImpactStatsGridProps {
  kpis: KPI[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
};

export function ImpactStatsGrid({
  kpis,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactStatsGridProps) {
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

  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-grid-gap)]',
          className
        )}
      >
        <LoadingSkeleton variant="stat" count={4} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-grid-gap)]',
        'animate-fade-in',
        className
      )}
    >
      {kpis.map((kpi) => {
        const IconComp = iconMap[kpi.icon] ?? Briefcase;
        return (
          <StatisticCard
            key={kpi.id}
            title={kpi.label}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            icon={<IconComp className="w-6 h-6 text-[var(--primary)]" />}
            description={kpi.description}
          />
        );
      })}
    </div>
  );
}
