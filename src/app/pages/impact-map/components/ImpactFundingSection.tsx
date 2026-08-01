/**
 * ImpactFundingSection — Funding Growth
 *
 * Displays area chart for monthly funding growth.
 */

import { AreaChartCard } from './charts/AreaChartCard';
import type { FundingMonth } from '../types/charts';

export interface ImpactFundingSectionProps {
  data?: FundingMonth[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactFundingSection({
  data = [],
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactFundingSectionProps) {
  return (
    <AreaChartCard
      title="نمو التمويل"
      description="تطور التمويل على مدار العام"
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      className={className}
    />
  );
}
