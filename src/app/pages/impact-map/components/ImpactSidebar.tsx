/**
 * ImpactSidebar — Right Analytics Panel
 *
 * Desktop: Width 360-420px, vertical stack of widgets
 * Tablet/Mobile: Full width, widgets stack vertically
 */

import { cn } from '@/app/utils/cn';
import { ImpactSummaryCard } from './panel/ImpactSummaryCard';
import { BeneficiaryCategories } from './panel/BeneficiaryCategories';
import { RegionalSummary } from './panel/RegionalSummary';
import { LatestProjects } from './panel/LatestProjects';
import { RecentActivity } from './panel/RecentActivity';
import { QuickStatistics } from './panel/QuickStatistics';
import type { SummaryMetric, BeneficiaryCategory, RegionalSummaryRow, LatestProject, TimelineItem, QuickStatistic } from '../types/analytics';

export interface ImpactSidebarProps {
  summaryMetrics?: SummaryMetric[];
  beneficiaryCategories?: BeneficiaryCategory[];
  regionalSummary?: RegionalSummaryRow[];
  latestProjects?: LatestProject[];
  recentActivity?: TimelineItem[];
  quickStatistics?: QuickStatistic[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onViewProject?: (project: LatestProject) => void;
  className?: string;
}

export function ImpactSidebar({
  summaryMetrics,
  beneficiaryCategories,
  regionalSummary,
  latestProjects,
  recentActivity,
  quickStatistics,
  isLoading,
  isError,
  onRetry,
  onViewProject,
  className,
}: ImpactSidebarProps) {
  return (
    <aside
      className={cn(
        'w-full',
        'flex-shrink-0',
        'space-y-6',
        'animate-fade-in',
        className
      )}
      aria-label="لوحة التحليلات اليمنى"
    >
      {/* Section 1: Impact Summary Card */}
      <ImpactSummaryCard
        metrics={summaryMetrics}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />

      {/* Section 2: Quick Statistics */}
      <QuickStatistics
        statistics={quickStatistics}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />

      {/* Section 3: Beneficiary Categories */}
      <BeneficiaryCategories
        categories={beneficiaryCategories}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />

      {/* Section 4: Regional Summary */}
      <RegionalSummary
        regions={regionalSummary}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />

      {/* Section 5: Latest Projects */}
      <LatestProjects
        projects={latestProjects}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        onViewProject={onViewProject}
      />

      {/* Section 6: Recent Activity */}
      <RecentActivity
        activities={recentActivity}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />
    </aside>
  );
}
