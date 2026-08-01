/**
 * Impact Map Dashboard — Mock Chart Data
 *
 * All chart datasets for the executive dashboard.
 * Replace with API responses when backend is ready.
 */

import type {
  PieSlice,
  TrendPoint,
  BarItem,
  FundingMonth,
  RegionalData,
} from '../types/charts';

/* ──────────────────────────────────────────────────────────────── */
/*  Beneficiaries Distribution (Donut Chart)                          */
/* ──────────────────────────────────────────────────────────────── */

export const beneficiariesDistribution: PieSlice[] = [
  { name: 'أسر', value: 35, color: '#2563EB' },
  { name: 'شباب', value: 25, color: '#3B82F6' },
  { name: 'نساء', value: 20, color: '#0EA5E9' },
  { name: 'أطفال', value: 15, color: '#22C55E' },
  { name: 'كبار السن', value: 5, color: '#94A3B8' },
];

/* ──────────────────────────────────────────────────────────────── */
/*  SROI Trend (Line Chart)                                         */
/* ──────────────────────────────────────────────────────────────── */

export const sroiTrendData: TrendPoint[] = [
  { year: '2021', value: 2.8, target: 3.0 },
  { year: '2022', value: 3.4, target: 3.5 },
  { year: '2023', value: 3.9, target: 4.0 },
  { year: '2024', value: 4.3, target: 4.5 },
  { year: '2025', value: 4.8, target: 5.0 },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Projects by Sector (Horizontal Bar Chart)                         */
/* ──────────────────────────────────────────────────────────────── */

export const projectsBySector: BarItem[] = [
  { label: 'التعليم', value: 723, category: 'education' },
  { label: 'الصحة', value: 612, category: 'health' },
  { label: 'البيئة والاستدامة', value: 387, category: 'environment' },
  { label: 'الإسكان', value: 100, category: 'housing' },
  { label: 'التدريب والتوظيف', value: 312, category: 'economic' },
  { label: 'التنمية الاقتصادية', value: 215, category: 'culture' },
  { label: 'المجتمع والرياضة', value: 498, category: 'social' },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Funding Growth (Area Chart)                                     */
/* ──────────────────────────────────────────────────────────────── */

export const fundingGrowthData: FundingMonth[] = [
  { month: 'يناير', amount: 45.2, cumulative: 45.2 },
  { month: 'فبراير', amount: 52.8, cumulative: 98.0 },
  { month: 'مارس', amount: 48.5, cumulative: 146.5 },
  { month: 'أبريل', amount: 61.3, cumulative: 207.8 },
  { month: 'مايو', amount: 55.7, cumulative: 263.5 },
  { month: 'يونيو', amount: 72.4, cumulative: 335.9 },
  { month: 'يوليو', amount: 68.1, cumulative: 404.0 },
  { month: 'أغسطس', amount: 75.9, cumulative: 479.9 },
  { month: 'سبتمبر', amount: 63.2, cumulative: 543.1 },
  { month: 'أكتوبر', amount: 70.5, cumulative: 613.6 },
  { month: 'نوفمبر', amount: 82.1, cumulative: 695.7 },
  { month: 'ديسمبر', amount: 78.8, cumulative: 774.5 },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Regional Impact (Vertical Bar Chart)                              */
/* ──────────────────────────────────────────────────────────────── */

export const regionalImpactData: RegionalData[] = [
  { region: 'الرياض', projects: 892, beneficiaries: 42150, funding: 985.0 },
  { region: 'مكة المكرمة', projects: 654, beneficiaries: 31200, funding: 720.0 },
  { region: 'الشرقية', projects: 543, beneficiaries: 25800, funding: 610.0 },
  { region: 'عسير', projects: 287, beneficiaries: 13400, funding: 320.0 },
  { region: 'المدينة المنورة', projects: 198, beneficiaries: 8900, funding: 210.0 },
  { region: 'القصيم', projects: 165, beneficiaries: 7200, funding: 175.0 },
  { region: 'تبوك', projects: 108, beneficiaries: 4800, funding: 95.0 },
  { region: 'حائل', projects: 92, beneficiaries: 4100, funding: 78.0 },
  { region: 'جازان', projects: 85, beneficiaries: 3800, funding: 68.0 },
  { region: 'نجران', projects: 76, beneficiaries: 3200, funding: 62.0 },
  { region: 'الجوف', projects: 58, beneficiaries: 2400, funding: 48.0 },
  { region: 'الحدود الشمالية', projects: 45, beneficiaries: 1800, funding: 38.0 },
  { region: 'الباحة', projects: 38, beneficiaries: 1500, funding: 29.0 },
];
