/**
 * Impact Map Dashboard — Component Exports
 */

export { ImpactCard } from './ImpactCard';
export { SectionHeader } from './SectionHeader';
export { StatisticCard } from './StatisticCard';
export { LoadingSkeleton } from './LoadingSkeleton';
export { EmptyState, EmptyProjectsState } from './EmptyState';
export { ErrorState } from './ErrorState';
export { ImpactHeader } from './ImpactHeader';
export { ImpactStatsGrid } from './ImpactStatsGrid';
export { ImpactMapSection } from './ImpactMapSection';
export { ImpactSidebar } from './ImpactSidebar';
export { ImpactLeftPanel } from './ImpactLeftPanel';
export { ImpactRightPanel } from './ImpactRightPanel';
export { ImpactSROISection } from './ImpactSROISection';
export { ImpactSectorSection } from './ImpactSectorSection';
export { ImpactProjectsSection } from './ImpactProjectsSection';

/* ──────────────────────────────────────────────────────────────── */
/*  Existing sections (kept for backward compatibility)             */
/* ──────────────────────────────────────────────────────────────── */

export { ImpactBeneficiariesSection } from './ImpactBeneficiariesSection';
export { ImpactFundingSection } from './ImpactFundingSection';
export { ImpactRegionalSection } from './ImpactRegionalSection';

/* ──────────────────────────────────────────────────────────────── */
/*  KPI Components                                                  */
/* ──────────────────────────────────────────────────────────────── */

export { KpiCard, KpiIcon, KpiValue, TrendBadge, KpiGrid } from './kpi';

/* ──────────────────────────────────────────────────────────────── */
/*  Right Panel Components                                          */
/* ──────────────────────────────────────────────────────────────── */

export {
  ImpactSummaryCard,
  BeneficiaryCategories,
  RegionalSummary,
  LatestProjects,
  RecentActivity,
  QuickStatistics,
} from './panel';

/* ──────────────────────────────────────────────────────────────── */
/*  Bottom Section Components                                       */
/* ──────────────────────────────────────────────────────────────── */

export {
  LatestProjectsTable,
  TopPerformingRegions,
  BottomKPIStrip,
} from './bottom';

/* ──────────────────────────────────────────────────────────────── */
/*  Shared Widgets                                                  */
/* ──────────────────────────────────────────────────────────────── */

export {
  WidgetCard,
  StatusBadge,
  ProgressBar,
  TimelineItem,
  RankingCard,
} from './widgets';
