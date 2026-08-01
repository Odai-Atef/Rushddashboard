/**
 * Impact Map Dashboard — KPI Data Types
 *
 * Executive KPI card data model consumed by the UI.
 * Replacing mock data with API responses should require minimal changes.
 */

/* ──────────────────────────────────────────────────────────────── */
/*  KPI Data Interface                                            */
/* ──────────────────────────────────────────────────────────────── */

export interface KpiData {
  /** Unique identifier */
  id: string;
  /** KPI title in Arabic */
  title: string;
  /** Raw numeric value for animation */
  value: number;
  /** Pre-formatted display value (Arabic numerals) */
  formattedValue: string;
  /** Short description below the title */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** Trend percentage (e.g., 12.5 for +12.5%) */
  trendPercentage: number;
  /** Trend direction */
  trendDirection: 'up' | 'down';
  /** Optional color override token */
  color?: string;
  /** ISO timestamp of last update */
  lastUpdated?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  KPI Component Props                                           */
/* ──────────────────────────────────────────────────────────────── */

export interface KpiCardProps {
  data: KpiData;
  index?: number;
  className?: string;
}

export interface KpiIconProps {
  iconName: string;
  color?: string;
  className?: string;
}

export interface KpiValueProps {
  value: number;
  formattedValue: string;
  className?: string;
}

export interface TrendBadgeProps {
  percentage: number;
  direction: 'up' | 'down';
  className?: string;
}

export interface KpiGridProps {
  kpis: KpiData[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}
