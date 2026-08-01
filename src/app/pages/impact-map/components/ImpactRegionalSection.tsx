/**
 * ImpactRegionalSection — Regional Impact
 *
 * Displays vertical bar chart for regional project distribution.
 */

import { RegionalBarChartCard } from './charts/RegionalBarChartCard';
import type { RegionalData } from '../types/charts';

export interface ImpactRegionalSectionProps {
  data?: RegionalData[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactRegionalSection({
  data = [],
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactRegionalSectionProps) {
  return (
    <RegionalBarChartCard
      title="الأثر الإقليمي"
      description="توزيع المشاريع عبر مناطق المملكة"
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      className={className}
    />
  );
}
