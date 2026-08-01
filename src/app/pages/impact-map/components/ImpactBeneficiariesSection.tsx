/**
 * ImpactBeneficiariesSection — Beneficiaries Distribution
 *
 * Displays donut chart for beneficiary categories.
 */

import { DonutChartCard } from './charts/DonutChartCard';
import type { PieSlice } from '../types/charts';

export interface ImpactBeneficiariesSectionProps {
  data?: PieSlice[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactBeneficiariesSection({
  data = [],
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactBeneficiariesSectionProps) {
  return (
    <DonutChartCard
      title="توزيع المستفيدين"
      description="تصنيف المستفيدين حسب الفئات"
      data={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      className={className}
      centerLabel="إجمالي المستفيدين"
    />
  );
}
