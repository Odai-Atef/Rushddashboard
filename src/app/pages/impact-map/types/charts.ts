/**
 * Impact Map Dashboard — Chart Type Definitions
 *
 * Reusable types for all chart components.
 */

/* ──────────────────────────────────────────────────────────────── */
/*  Chart Point & Series                                            */
/* ──────────────────────────────────────────────────────────────── */

export interface ChartPoint {
  label: string;
  value: number;
  extra?: Record<string, unknown>;
}

export interface ChartSeries {
  name: string;
  data: ChartPoint[];
  color?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Pie / Donut                                                     */
/* ──────────────────────────────────────────────────────────────── */

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Bar (horizontal or vertical)                                    */
/* ──────────────────────────────────────────────────────────────── */

export interface BarItem {
  label: string;
  value: number;
  category?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Trend (line / area)                                             */
/* ──────────────────────────────────────────────────────────────── */

export interface TrendPoint {
  year: string;
  value: number;
  target?: number;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Tooltip                                                         */
/* ──────────────────────────────────────────────────────────────── */

export interface TooltipData {
  title: string;
  value: string | number;
  percentage?: number;
  additional?: string;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Legend                                                          */
/* ──────────────────────────────────────────────────────────────── */

export interface LegendItem {
  label: string;
  color: string;
  value?: number | string;
  visible: boolean;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Funding Growth                                                  */
/* ──────────────────────────────────────────────────────────────── */

export interface FundingMonth {
  month: string;
  amount: number;
  cumulative?: number;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Regional Impact                                                 */
/* ──────────────────────────────────────────────────────────────── */

export interface RegionalData {
  region: string;
  projects: number;
  beneficiaries?: number;
  funding?: number;
}
