/**
 * Impact Map Dashboard — Type Definitions
 *
 * Core data models consumed by the UI. Replacing mock data with
 * API responses should require minimal changes.
 */

/* ──────────────────────────────────────────────────────────────── */
/*  KPI                                                             */
/* ──────────────────────────────────────────────────────────────── */

export interface KPI {
  id: string;
  label: string;
  value: number | string;
  change?: string;
  isPositive?: boolean;
  icon: string;
  description?: string;
}

/* Re-export new KPI types */
export type {
  KpiData,
  KpiCardProps,
  KpiIconProps,
  KpiValueProps,
  TrendBadgeProps,
  KpiGridProps,
} from './kpi';

/* ──────────────────────────────────────────────────────────────── */
/*  Region                                                          */
/* ──────────────────────────────────────────────────────────────── */

export interface Region {
  id: string;
  name: string;
  nameEn: string;
  projectsCount: number;
  beneficiariesCount: number;
  totalFunding: number;
  sroiValue: number;
  coordinates: [number, number];
  color: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Beneficiary                                                     */
/* ──────────────────────────────────────────────────────────────── */

export interface Beneficiary {
  id: string;
  name: string;
  type: 'individual' | 'family' | 'community' | 'organization';
  regionId: string;
  sectorId: string;
  count: number;
  projectId: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Sector                                                          */
/* ──────────────────────────────────────────────────────────────── */

export interface Sector {
  id: string;
  name: string;
  nameEn: string;
  projectCount: number;
  totalFunding: number;
  beneficiariesCount: number;
  color: string;
  icon?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Project                                                         */
/* ──────────────────────────────────────────────────────────────── */

export type ProjectStatus =
  | 'active'
  | 'completed'
  | 'pending'
  | 'suspended'
  | 'funded'
  | 'draft';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  regionId: string;
  sectorId: string;
  organizationId: string;
  organizationName: string;
  totalBudget: number;
  raisedAmount: number;
  beneficiariesCount: number;
  startDate: string;
  endDate: string;
  sroi: number;
  progress: number;
  tags: string[];
}

/* ──────────────────────────────────────────────────────────────── */
/*  SROI (Social Return on Investment)                              */
/* ──────────────────────────────────────────────────────────────── */

export interface SROI {
  id: string;
  projectId: string;
  projectName: string;
  investment: number;
  socialReturn: number;
  ratio: number;
  sectorId: string;
  regionId: string;
  year: number;
  beneficiariesImpacted: number;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Chart Series                                                    */
/* ──────────────────────────────────────────────────────────────── */

export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Legend                                                          */
/* ──────────────────────────────────────────────────────────────── */

export interface LegendItem {
  label: string;
  color: string;
  value?: number | string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Recent Activity                                                 */
/* ──────────────────────────────────────────────────────────────── */

export interface RecentActivity {
  id: string;
  type: 'project_created' | 'project_funded' | 'project_completed' | 'beneficiary_added' | 'funding_received' | 'milestone_reached';
  title: string;
  description: string;
  projectId?: string;
  projectName?: string;
  timestamp: string;
  userName?: string;
  userAvatar?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Filters                                                         */
/* ──────────────────────────────────────────────────────────────── */

export interface ImpactFilters {
  year: number | null;
  regionId: string | null;
  sectorId: string | null;
  fundingProgramId: string | null;
  organizationId: string | null;
  searchQuery: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  UI State                                                        */
/* ──────────────────────────────────────────────────────────────── */

export interface ImpactUIState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  selectedRegionId: string | null;
  filters: ImpactFilters;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}
