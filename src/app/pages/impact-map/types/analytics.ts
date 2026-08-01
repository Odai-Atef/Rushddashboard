/**
 * Impact Map Dashboard — Analytics Data Types
 *
 * Type definitions for Right Analytics Panel and Bottom Analytics Section.
 */

/* ──────────────────────────────────────────────────────────────── */
/*  Latest Project                                                  */
/* ──────────────────────────────────────────────────────────────── */

export type ProjectExecutionStatus =
  | 'running'
  | 'completed'
  | 'delayed'
  | 'planned'
  | 'cancelled';

export interface LatestProject {
  id: string;
  name: string;
  nameAr: string;
  image?: string;
  region: string;
  regionAr: string;
  sector: string;
  sectorAr: string;
  status: ProjectExecutionStatus;
  funding: number;
  beneficiaries: number;
  progress: number;
  organization: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Timeline Activity                                               */
/* ──────────────────────────────────────────────────────────────── */

export type TimelineActivityType =
  | 'project_added'
  | 'funding_approved'
  | 'beneficiary_updated'
  | 'evaluation_completed'
  | 'organization_joined';

export type TimelineActivityStatus = 'completed' | 'pending' | 'failed';

export interface TimelineItem {
  id: string;
  type: TimelineActivityType;
  description: string;
  descriptionAr: string;
  timestamp: string;
  status: TimelineActivityStatus;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Quick Statistic                                                 */
/* ──────────────────────────────────────────────────────────────── */

export interface QuickStatistic {
  id: string;
  label: string;
  labelAr: string;
  value: number;
  formattedValue: string;
  icon: string;
  trend?: 'up' | 'down';
  trendValue?: number;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Region Ranking                                                  */
/* ──────────────────────────────────────────────────────────────── */

export interface RegionRanking {
  rank: number;
  region: string;
  regionAr: string;
  projects: number;
  funding: number;
  impactScore: number;
  trend: 'up' | 'down';
}

/* ──────────────────────────────────────────────────────────────── */
/*  Summary Metric                                                  */
/* ──────────────────────────────────────────────────────────────── */

export interface SummaryMetric {
  id: string;
  label: string;
  labelAr: string;
  value: number;
  formattedValue: string;
  icon: string;
  trend?: 'up' | 'down';
  trendValue?: number;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Beneficiary Category                                            */
/* ──────────────────────────────────────────────────────────────── */

export interface BeneficiaryCategory {
  id: string;
  label: string;
  labelAr: string;
  count: number;
  percentage: number;
  color: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Regional Summary Row                                            */
/* ──────────────────────────────────────────────────────────────── */

export interface RegionalSummaryRow {
  id: string;
  region: string;
  regionAr: string;
  projectsCount: number;
  impactScore: number;
  trend: 'up' | 'down';
}

/* ──────────────────────────────────────────────────────────────── */
/*  Bottom KPI Metric                                               */
/* ──────────────────────────────────────────────────────────────── */

export interface BottomKpiMetric {
  id: string;
  label: string;
  labelAr: string;
  value: number;
  formattedValue: string;
  unit?: string;
  unitAr?: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  icon: string;
}
