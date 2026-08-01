/**
 * ImpactProjectsSection — Bottom Analytics Section
 *
 * Desktop: Two columns (left: table, right: ranking)
 * Tablet: Stacked
 * Mobile: Stacked, full width
 */

import { cn } from '@/app/utils/cn';
import { LatestProjectsTable } from './bottom/LatestProjectsTable';
import { TopPerformingRegions } from './bottom/TopPerformingRegions';
import { BottomKPIStrip } from './bottom/BottomKPIStrip';
import type { LatestProject, RegionRanking, BottomKpiMetric } from '../types/analytics';

export interface ImpactProjectsSectionProps {
  latestSupportedProjects?: LatestProject[];
  topPerformingRegions?: RegionRanking[];
  bottomKpiMetrics?: BottomKpiMetric[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onViewProject?: (project: LatestProject) => void;
  className?: string;
}

export function ImpactProjectsSection({
  latestSupportedProjects,
  topPerformingRegions,
  bottomKpiMetrics,
  isLoading,
  isError,
  onRetry,
  onViewProject,
  className,
}: ImpactProjectsSectionProps) {
  return (
    <section
      className={cn(
        'space-y-[var(--spacing-grid-gap)]',
        'animate-fade-in',
        className
      )}
      aria-label="قسم التحليلات السفلية"
    >
      {/* Bottom KPI Strip */}
      <BottomKPIStrip
        metrics={bottomKpiMetrics}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />

      {/* Two-column layout: Table + Ranking */}
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2',
          'gap-[var(--spacing-grid-gap)]'
        )}
      >
        {/* Left: Latest Supported Projects Table */}
        <LatestProjectsTable
          projects={latestSupportedProjects}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
          onViewProject={onViewProject}
        />

        {/* Right: Top Performing Regions */}
        <TopPerformingRegions
          regions={topPerformingRegions}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
        />
      </div>
    </section>
  );
}
