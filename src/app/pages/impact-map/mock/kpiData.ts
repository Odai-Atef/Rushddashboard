/**
 * Impact Map Dashboard — Executive KPI Mock Data
 *
 * 4 premium executive KPIs for the "خارطة الأثر" dashboard.
 * All values use Arabic numerals and RTL-friendly formatting.
 */

import type { KpiData } from '../types/kpi';

export const mockKPIs: KpiData[] = [
  {
    id: 'total-projects',
    title: 'إجمالي المشاريع',
    value: 248,
    formattedValue: '٢٤٨',
    description: 'مقارنة بالفترة السابقة',
    icon: 'Briefcase',
    trendPercentage: 12.5,
    trendDirection: 'up',
    lastUpdated: '2026-08-01T00:00:00Z',
  },
  {
    id: 'total-funding',
    title: 'إجمالي الدعم',
    value: 18.2,
    formattedValue: '١٨٫٢ مليون ريال',
    description: 'أحدث تحديث',
    icon: 'HandCoins',
    trendPercentage: 15.2,
    trendDirection: 'up',
    lastUpdated: '2026-08-01T00:00:00Z',
  },
  {
    id: 'total-beneficiaries',
    title: 'إجمالي المستفيدين',
    value: 61420,
    formattedValue: '٦١,٤٢٠',
    description: 'إجمالي منذ بداية البرنامج',
    icon: 'Users',
    trendPercentage: 8.3,
    trendDirection: 'up',
    lastUpdated: '2026-08-01T00:00:00Z',
  },
  {
    id: 'sroi-ratio',
    title: 'العائد الاجتماعي على الاستثمار',
    value: 3.4,
    formattedValue: '٣٫٤×',
    description: 'مقارنة بالفترة السابقة',
    icon: 'TrendingUp',
    trendPercentage: -2.1,
    trendDirection: 'down',
    lastUpdated: '2026-08-01T00:00:00Z',
  },
];
