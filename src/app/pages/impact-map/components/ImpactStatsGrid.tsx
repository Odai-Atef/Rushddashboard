/**
 * Impact Stats Grid
 *
 * Executive KPI section for the Impact Map Dashboard.
 * Displays 4 premium KPI cards with animations.
 *
 * Updated: Now uses new KpiGrid and KpiCard components.
 */

import { cn } from '@/app/utils/cn';
import { KpiGrid } from './kpi';
import type { KpiData } from '../types/kpi';

export interface ImpactStatsGridProps {
  kpis: KpiData[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactStatsGrid({
  kpis,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactStatsGridProps) {
  return (
    <KpiGrid
      kpis={kpis}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      className={cn('animate-fade-in', className)}
    />
  );
}
