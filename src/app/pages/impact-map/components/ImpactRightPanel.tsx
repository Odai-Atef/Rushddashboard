/**
 * ImpactRightPanel — Analytics widgets displayed beside the map on desktop.
 *
 * Contains a compact set of widgets whose total height is intended to match
 * the map row height. Additional widgets are distributed into bottom rows.
 */

import { cn } from '@/app/utils/cn';
import { BeneficiaryCategories } from './panel/BeneficiaryCategories';
import { RegionalSummary } from './panel/RegionalSummary';
import type { BeneficiaryCategory, RegionalSummaryRow } from '../types/analytics';

export interface ImpactRightPanelProps {
  beneficiaryCategories?: BeneficiaryCategory[];
  regionalSummary?: RegionalSummaryRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactRightPanel({
  beneficiaryCategories,
  regionalSummary,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactRightPanelProps) {
  return (
    <aside
      className={cn(
        'w-full flex flex-col gap-[var(--spacing-grid-gap)]',
        'animate-fade-in',
        className
      )}
      aria-label="لوحة التحليلات اليمنى"
    >
      <BeneficiaryCategories
        categories={beneficiaryCategories}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        className="flex-1 min-h-0"
      />

      <RegionalSummary
        regions={regionalSummary}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        className="flex-1 min-h-0"
      />
    </aside>
  );
}
