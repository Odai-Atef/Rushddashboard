/**
 * Impact Map Dashboard — Analytics Mock Data
 *
 * Mock data for Right Analytics Panel and Bottom Analytics Section.
 */

import type {
  LatestProject,
  TimelineItem,
  QuickStatistic,
  RegionRanking,
  SummaryMetric,
  BeneficiaryCategory,
  RegionalSummaryRow,
  BottomKpiMetric,
} from '../types/analytics';

/* ──────────────────────────────────────────────────────────────── */
/*  Impact Summary Metrics                                          */
/* ──────────────────────────────────────────────────────────────── */

export const mockImpactSummaryMetrics: SummaryMetric[] = [
  {
    id: 'summary-projects',
    label: 'Total Projects',
    labelAr: 'إجمالي المشاريع',
    value: 142,
    formattedValue: '١٤٢',
    icon: 'FolderKanban',
    trend: 'up',
    trendValue: 12.5,
  },
  {
    id: 'summary-funding',
    label: 'Total Funding',
    labelAr: 'إجمالي التمويل',
    value: 875000000,
    formattedValue: '٨٧٥ مليون ر.س.',
    icon: 'Banknote',
    trend: 'up',
    trendValue: 8.3,
  },
  {
    id: 'summary-beneficiaries',
    label: 'Beneficiaries',
    labelAr: 'المستفيدين',
    value: 48250,
    formattedValue: '٤٨٬٢٥٠',
    icon: 'Users',
    trend: 'up',
    trendValue: 15.2,
  },
  {
    id: 'summary-sroi',
    label: 'SROI',
    labelAr: 'العائد الاجتماعي',
    value: 3.8,
    formattedValue: '٣.٨x',
    icon: 'TrendingUp',
    trend: 'up',
    trendValue: 4.1,
  },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Beneficiary Categories                                          */
/* ──────────────────────────────────────────────────────────────── */

export const mockBeneficiaryCategories: BeneficiaryCategory[] = [
  { id: 'cat-families', label: 'Families', labelAr: 'أسر', count: 18500, percentage: 38.3, color: '#2563EB' },
  { id: 'cat-youth', label: 'Youth', labelAr: 'شباب', count: 12100, percentage: 25.1, color: '#22C55E' },
  { id: 'cat-women', label: 'Women', labelAr: 'نساء', count: 8700, percentage: 18.0, color: '#F59E0B' },
  { id: 'cat-children', label: 'Children', labelAr: 'أطفال', count: 6200, percentage: 12.8, color: '#8B5CF6' },
  { id: 'cat-elderly', label: 'Elderly', labelAr: 'مسنين', count: 1850, percentage: 3.8, color: '#EC4899' },
  { id: 'cat-disabled', label: 'Disabled', labelAr: 'ذوي إعاقة', count: 900, percentage: 1.9, color: '#06B6D4' },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Regional Summary (Top 5)                                        */
/* ──────────────────────────────────────────────────────────────── */

export const mockRegionalSummary: RegionalSummaryRow[] = [
  { id: 'reg-riyadh', region: 'Riyadh', regionAr: 'الرياض', projectsCount: 42, impactScore: 94, trend: 'up' },
  { id: 'reg-makkah', region: 'Makkah', regionAr: 'مكة المكرمة', projectsCount: 28, impactScore: 89, trend: 'up' },
  { id: 'reg-eastern', region: 'Eastern Province', regionAr: 'المنطقة الشرقية', projectsCount: 24, impactScore: 86, trend: 'down' },
  { id: 'reg-asir', region: 'Asir', regionAr: 'عسير', projectsCount: 18, impactScore: 82, trend: 'up' },
  { id: 'reg-madinah', region: 'Madinah', regionAr: 'المدينة المنورة', projectsCount: 15, impactScore: 78, trend: 'up' },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Latest Projects (Panel)                                         */
/* ──────────────────────────────────────────────────────────────── */

export const mockLatestProjects: LatestProject[] = [
  {
    id: 'proj-001',
    name: 'Digital Education Initiative',
    nameAr: 'مبادرة التعليم الرقمي',
    image: '/assets/projects/digital-edu.jpg',
    region: 'Riyadh',
    regionAr: 'الرياض',
    sector: 'Education',
    sectorAr: 'التعليم',
    status: 'running',
    funding: 45000000,
    beneficiaries: 8500,
    progress: 72,
    organization: 'Future Skills Foundation',
  },
  {
    id: 'proj-002',
    name: 'Community Health Program',
    nameAr: 'برنامج الصحة المجتمعية',
    image: '/assets/projects/health.jpg',
    region: 'Makkah',
    regionAr: 'مكة المكرمة',
    sector: 'Health',
    sectorAr: 'الصحة',
    status: 'completed',
    funding: 32000000,
    beneficiaries: 12000,
    progress: 100,
    organization: 'Al-Birr Medical Society',
  },
  {
    id: 'proj-003',
    name: 'Vocational Training Centers',
    nameAr: 'مراكز التدريب المهني',
    image: '/assets/projects/training.jpg',
    region: 'Eastern Province',
    regionAr: 'المنطقة الشرقية',
    sector: 'Employment',
    sectorAr: 'التوظيف',
    status: 'running',
    funding: 28000000,
    beneficiaries: 5600,
    progress: 58,
    organization: 'Tamkeen Development',
  },
  {
    id: 'proj-004',
    name: 'Orphan Care Program',
    nameAr: 'برنامج رعاية الأيتام',
    image: '/assets/projects/orphans.jpg',
    region: 'Asir',
    regionAr: 'عسير',
    sector: 'Social Care',
    sectorAr: 'الرعاية الاجتماعية',
    status: 'delayed',
    funding: 15000000,
    beneficiaries: 3200,
    progress: 35,
    organization: 'Atheer Charity',
  },
  {
    id: 'proj-005',
    name: 'Cultural Heritage Festival',
    nameAr: 'مهرجان التراث الثقافي',
    image: '/assets/projects/heritage.jpg',
    region: 'Madinah',
    regionAr: 'المدينة المنورة',
    sector: 'Culture',
    sectorAr: 'الثقافة',
    status: 'planned',
    funding: 8000000,
    beneficiaries: 15000,
    progress: 0,
    organization: 'Heritage Preservation Org',
  },
  {
    id: 'proj-006',
    name: 'Women Empowerment Hub',
    nameAr: 'مركز تمكين المرأة',
    image: '/assets/projects/women.jpg',
    region: 'Riyadh',
    regionAr: 'الرياض',
    sector: 'Empowerment',
    sectorAr: 'التمكين',
    status: 'running',
    funding: 22000000,
    beneficiaries: 4200,
    progress: 65,
    organization: 'Noura Initiative',
  },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Recent Activity Timeline                                        */
/* ──────────────────────────────────────────────────────────────── */

export const mockRecentActivity: TimelineItem[] = [
  {
    id: 'act-001',
    type: 'project_added',
    description: 'Project added: Digital Education Initiative',
    descriptionAr: 'تمت إضافة مشروع: مبادرة التعليم الرقمي',
    timestamp: '2026-07-31T14:30:00Z',
    status: 'completed',
  },
  {
    id: 'act-002',
    type: 'funding_approved',
    description: 'Funding approved: 45M SAR for Education sector',
    descriptionAr: 'تم اعتماد تمويل: ٤٥ مليون ر.س. لقطاع التعليم',
    timestamp: '2026-07-31T12:15:00Z',
    status: 'completed',
  },
  {
    id: 'act-003',
    type: 'beneficiary_updated',
    description: 'Beneficiaries updated: +1,200 for Vocational Training',
    descriptionAr: 'تم تحديث المستفيدين: +١٬٢٠٠ لبرنامج التدريب المهني',
    timestamp: '2026-07-30T16:45:00Z',
    status: 'completed',
  },
  {
    id: 'act-004',
    type: 'evaluation_completed',
    description: 'Evaluation completed: Community Health Program',
    descriptionAr: 'تم إنجاز التقييم: برنامج الصحة المجتمعية',
    timestamp: '2026-07-29T09:00:00Z',
    status: 'completed',
  },
  {
    id: 'act-005',
    type: 'organization_joined',
    description: 'New organization joined: Future Skills Foundation',
    descriptionAr: 'منظمة جديدة انضمت: مؤسسة مهارات المستقبل',
    timestamp: '2026-07-28T11:20:00Z',
    status: 'completed',
  },
  {
    id: 'act-006',
    type: 'project_added',
    description: 'Project added: Women Empowerment Hub',
    descriptionAr: 'تمت إضافة مشروع: مركز تمكين المرأة',
    timestamp: '2026-07-27T08:30:00Z',
    status: 'pending',
  },
  {
    id: 'act-007',
    type: 'funding_approved',
    description: 'Funding approved: 22M SAR for Empowerment sector',
    descriptionAr: 'تم اعتماد تمويل: ٢٢ مليون ر.س. لقطاع التمكين',
    timestamp: '2026-07-26T13:00:00Z',
    status: 'completed',
  },
  {
    id: 'act-008',
    type: 'beneficiary_updated',
    description: 'Beneficiaries updated: +3,500 new registrations',
    descriptionAr: 'تم تحديث المستفيدين: +٣٬٥٠٠ تسجيل جديد',
    timestamp: '2026-07-25T15:45:00Z',
    status: 'completed',
  },
  {
    id: 'act-009',
    type: 'evaluation_completed',
    description: 'Mid-term evaluation completed: Orphan Care Program',
    descriptionAr: 'تم إنجاز التقييم المتوسط: برنامج رعاية الأيتام',
    timestamp: '2026-07-24T10:00:00Z',
    status: 'completed',
  },
  {
    id: 'act-010',
    type: 'organization_joined',
    description: 'New organization joined: Heritage Preservation Org',
    descriptionAr: 'منظمة جديدة انضمت: منظمة الحفاظ على التراث',
    timestamp: '2026-07-23T09:15:00Z',
    status: 'completed',
  },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Quick Statistics                                                */
/* ──────────────────────────────────────────────────────────────── */

export const mockQuickStatistics: QuickStatistic[] = [
  {
    id: 'quick-projects',
    label: 'Projects',
    labelAr: 'المشاريع',
    value: 142,
    formattedValue: '١٤٢',
    icon: 'FolderKanban',
    trend: 'up',
    trendValue: 12.5,
  },
  {
    id: 'quick-orgs',
    label: 'Organizations',
    labelAr: 'المنظمات',
    value: 48,
    formattedValue: '٤٨',
    icon: 'Building2',
    trend: 'up',
    trendValue: 6.7,
  },
  {
    id: 'quick-funding',
    label: 'Funding',
    labelAr: 'التمويل',
    value: 875000000,
    formattedValue: '٨٧٥M ر.س.',
    icon: 'Banknote',
    trend: 'up',
    trendValue: 8.3,
  },
  {
    id: 'quick-beneficiaries',
    label: 'Beneficiaries',
    labelAr: 'المستفيدين',
    value: 48250,
    formattedValue: '٤٨K',
    icon: 'Users',
    trend: 'up',
    trendValue: 15.2,
  },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Latest Supported Projects (Table)                               */
/* ──────────────────────────────────────────────────────────────── */

export const mockLatestSupportedProjects: LatestProject[] = [
  ...mockLatestProjects,
  {
    id: 'proj-007',
    name: 'Agricultural Innovation Lab',
    nameAr: 'معمل الابتكار الزراعي',
    region: 'Qassim',
    regionAr: 'القصيم',
    sector: 'Agriculture',
    sectorAr: 'الزراعة',
    status: 'running',
    funding: 18500000,
    beneficiaries: 2800,
    progress: 48,
    organization: 'Green Fields Cooperative',
  },
  {
    id: 'proj-008',
    name: 'Youth Sports Complex',
    nameAr: 'مجمع الرياضات الشبابية',
    region: 'Jeddah',
    regionAr: 'جدة',
    sector: 'Sports',
    sectorAr: 'الرياضة',
    status: 'completed',
    funding: 35000000,
    beneficiaries: 9500,
    progress: 100,
    organization: 'Active Youth Foundation',
  },
  {
    id: 'proj-009',
    name: 'Sustainable Energy Pilot',
    nameAr: 'برنامج الطاقة المستدامة',
    region: 'Tabuk',
    regionAr: 'تبوك',
    sector: 'Environment',
    sectorAr: 'البيئة',
    status: 'running',
    funding: 42000000,
    beneficiaries: 1800,
    progress: 33,
    organization: 'Clean Energy Alliance',
  },
  {
    id: 'proj-010',
    name: 'Elderly Care Centers',
    nameAr: 'مراكز رعاية المسنين',
    region: 'Hail',
    regionAr: 'حائل',
    sector: 'Social Care',
    sectorAr: 'الرعاية الاجتماعية',
    status: 'planned',
    funding: 12000000,
    beneficiaries: 1200,
    progress: 0,
    organization: 'Silver Wings Association',
  },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Top Performing Regions                                          */
/* ──────────────────────────────────────────────────────────────── */

export const mockTopPerformingRegions: RegionRanking[] = [
  {
    rank: 1,
    region: 'Riyadh',
    regionAr: 'الرياض',
    projects: 42,
    funding: 285000000,
    impactScore: 94,
    trend: 'up',
  },
  {
    rank: 2,
    region: 'Makkah',
    regionAr: 'مكة المكرمة',
    projects: 28,
    funding: 198000000,
    impactScore: 89,
    trend: 'up',
  },
  {
    rank: 3,
    region: 'Eastern Province',
    regionAr: 'المنطقة الشرقية',
    projects: 24,
    funding: 175000000,
    impactScore: 86,
    trend: 'down',
  },
  {
    rank: 4,
    region: 'Asir',
    regionAr: 'عسير',
    projects: 18,
    funding: 98000000,
    impactScore: 82,
    trend: 'up',
  },
  {
    rank: 5,
    region: 'Madinah',
    regionAr: 'المدينة المنورة',
    projects: 15,
    funding: 72000000,
    impactScore: 78,
    trend: 'up',
  },
];

/* ──────────────────────────────────────────────────────────────── */
/*  Bottom KPI Strip Metrics                                        */
/* ──────────────────────────────────────────────────────────────── */

export const mockBottomKpiMetrics: BottomKpiMetric[] = [
  {
    id: 'bottom-avg-cost',
    label: 'Average Project Cost',
    labelAr: 'متوسط تكلفة المشروع',
    value: 6150000,
    formattedValue: '٦.١',
    unit: 'M SAR',
    unitAr: 'مليون ر.س.',
    trend: 'down',
    trendValue: 3.2,
    icon: 'Calculator',
  },
  {
    id: 'bottom-avg-beneficiaries',
    label: 'Average Beneficiaries',
    labelAr: 'متوسط المستفيدين',
    value: 340,
    formattedValue: '٣٤٠',
    unit: 'per project',
    unitAr: 'للمشروع',
    trend: 'up',
    trendValue: 7.8,
    icon: 'Users',
  },
  {
    id: 'bottom-avg-duration',
    label: 'Average Duration',
    labelAr: 'متوسط المدة',
    value: 18,
    formattedValue: '١٨',
    unit: 'months',
    unitAr: 'شهر',
    trend: 'down',
    trendValue: 5.1,
    icon: 'CalendarClock',
  },
  {
    id: 'bottom-avg-sroi',
    label: 'Average SROI',
    labelAr: 'متوسط العائد الاجتماعي',
    value: 3.8,
    formattedValue: '٣.٨x',
    trend: 'up',
    trendValue: 4.1,
    icon: 'TrendingUp',
  },
  {
    id: 'bottom-completion-rate',
    label: 'Completion Rate',
    labelAr: 'معدل الإنجاز',
    value: 78,
    formattedValue: '٧٨%',
    trend: 'up',
    trendValue: 6.5,
    icon: 'CheckCircle2',
  },
];
