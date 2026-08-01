import type { MapRegion, MapMarker, MapLegendItem } from '../types/map';

/* ============================================================
 Impact Map — Mock Data
 ============================================================
 Simplified SVG paths for Saudi Arabia's 13 administrative regions.
 Coordinates are scaled to a 1000×1000 viewBox.
 ============================================================ */

export const mapRegions: MapRegion[] = [
  {
    id: 'riyadh',
    name: 'الرياض',
    nameAr: 'الرياض',
    path:
      'M420,380 L480,370 L540,390 L580,430 L590,490 L560,540 L500,560 L440,550 L400,510 L390,450 L400,400 Z',
    centerX: 490,
    centerY: 465,
    projects: 892,
    beneficiaries: 42150,
    funding: 985_000_000,
    impactScore: 94,
    sroi: 4.8,
    lastUpdated: '2026-07-28T14:30:00Z',
    impactLevel: 'very-high',
  },
  {
    id: 'makkah',
    name: 'مكة المكرمة',
    nameAr: 'مكة المكرمة',
    path:
      'M310,470 L360,450 L400,460 L420,510 L400,560 L360,590 L320,580 L290,540 L280,500 L300,480 Z',
    centerX: 350,
    centerY: 520,
    projects: 654,
    beneficiaries: 31200,
    funding: 720_000_000,
    impactScore: 88,
    sroi: 4.2,
    lastUpdated: '2026-07-27T09:15:00Z',
    impactLevel: 'very-high',
  },
  {
    id: 'madinah',
    name: 'المدينة المنورة',
    nameAr: 'المدينة المنورة',
    path:
      'M240,360 L290,340 L330,350 L350,390 L340,430 L300,450 L260,440 L230,410 L220,380 Z',
    centerX: 285,
    centerY: 395,
    projects: 198,
    beneficiaries: 8900,
    funding: 210_000_000,
    impactScore: 72,
    sroi: 3.7,
    lastUpdated: '2026-07-25T11:00:00Z',
    impactLevel: 'high',
  },
  {
    id: 'qassim',
    name: 'القصيم',
    nameAr: 'القصيم',
    path:
      'M340,280 L390,270 L430,290 L440,330 L420,360 L380,370 L340,360 L320,330 L320,300 Z',
    centerX: 380,
    centerY: 320,
    projects: 165,
    beneficiaries: 7200,
    funding: 175_000_000,
    impactScore: 65,
    sroi: 3.5,
    lastUpdated: '2026-07-26T08:45:00Z',
    impactLevel: 'medium',
  },
  {
    id: 'hail',
    name: 'حائل',
    nameAr: 'حائل',
    path:
      'M290,190 L340,180 L380,200 L400,240 L390,280 L350,300 L300,290 L270,260 L260,220 Z',
    centerX: 330,
    centerY: 240,
    projects: 87,
    beneficiaries: 3800,
    funding: 92_000_000,
    impactScore: 52,
    sroi: 3.1,
    lastUpdated: '2026-07-24T16:20:00Z',
    impactLevel: 'low',
  },
  {
    id: 'tabuk',
    name: 'تبوك',
    nameAr: 'تبوك',
    path:
      'M120,160 L180,140 L240,150 L280,180 L290,230 L270,270 L220,290 L160,280 L120,250 L100,200 Z',
    centerX: 195,
    centerY: 215,
    projects: 108,
    beneficiaries: 4800,
    funding: 95_000_000,
    impactScore: 58,
    sroi: 3.3,
    lastUpdated: '2026-07-26T13:10:00Z',
    impactLevel: 'medium',
  },
  {
    id: 'al-jawf',
    name: 'الجوف',
    nameAr: 'الجوف',
    path:
      'M390,120 L440,110 L480,130 L490,170 L470,200 L430,210 L390,200 L370,170 L370,140 Z',
    centerX: 430,
    centerY: 160,
    projects: 62,
    beneficiaries: 2800,
    funding: 58_000_000,
    impactScore: 45,
    sroi: 2.9,
    lastUpdated: '2026-07-23T10:30:00Z',
    impactLevel: 'low',
  },
  {
    id: 'asir',
    name: 'عسير',
    nameAr: 'عسير',
    path:
      'M360,620 L400,600 L440,610 L460,650 L450,690 L410,710 L370,700 L340,670 L340,640 Z',
    centerX: 400,
    centerY: 655,
    projects: 287,
    beneficiaries: 13400,
    funding: 320_000_000,
    impactScore: 78,
    sroi: 4.1,
    lastUpdated: '2026-07-28T07:55:00Z',
    impactLevel: 'high',
  },
  {
    id: 'jazan',
    name: 'جازان',
    nameAr: 'جازان',
    path:
      'M300,720 L340,700 L370,710 L380,750 L360,790 L320,800 L290,780 L280,750 Z',
    centerX: 330,
    centerY: 750,
    projects: 134,
    beneficiaries: 5900,
    funding: 145_000_000,
    impactScore: 61,
    sroi: 3.4,
    lastUpdated: '2026-07-27T15:40:00Z',
    impactLevel: 'medium',
  },
  {
    id: 'najran',
    name: 'نجران',
    nameAr: 'نجران',
    path:
      'M460,720 L500,700 L540,710 L560,750 L550,790 L510,810 L470,800 L450,770 L450,740 Z',
    centerX: 505,
    centerY: 755,
    projects: 76,
    beneficiaries: 3400,
    funding: 72_000_000,
    impactScore: 48,
    sroi: 2.8,
    lastUpdated: '2026-07-25T09:00:00Z',
    impactLevel: 'low',
  },
  {
    id: 'eastern',
    name: 'المنطقة الشرقية',
    nameAr: 'الشرقية',
    path:
      'M580,280 L660,260 L740,280 L790,340 L810,420 L800,500 L760,560 L690,590 L620,580 L580,540 L570,480 L580,420 L590,350 Z',
    centerX: 690,
    centerY: 425,
    projects: 543,
    beneficiaries: 25800,
    funding: 610_000_000,
    impactScore: 82,
    sroi: 3.9,
    lastUpdated: '2026-07-28T12:00:00Z',
    impactLevel: 'high',
  },
  {
    id: 'al-baha',
    name: 'الباحة',
    nameAr: 'الباحة',
    path:
      'M280,580 L320,570 L350,590 L360,630 L340,660 L300,670 L270,650 L260,620 L270,600 Z',
    centerX: 310,
    centerY: 620,
    projects: 55,
    beneficiaries: 2400,
    funding: 48_000_000,
    impactScore: 42,
    sroi: 2.7,
    lastUpdated: '2026-07-22T14:15:00Z',
    impactLevel: 'very-low',
  },
  {
    id: 'northern-borders',
    name: 'الحدود الشمالية',
    nameAr: 'الحدود الشمالية',
    path:
      'M480,60 L540,50 L600,70 L630,110 L620,150 L580,170 L520,160 L480,140 L470,100 Z',
    centerX: 550,
    centerY: 110,
    projects: 43,
    beneficiaries: 1900,
    funding: 38_000_000,
    impactScore: 38,
    sroi: 2.5,
    lastUpdated: '2026-07-21T11:30:00Z',
    impactLevel: 'very-low',
  },
];

/* ────────────────────────────────────────────────────────────────
 Markers — positioned roughly at region centers
 ──────────────────────────────────────────────────────────────── */
export const mapMarkers: MapMarker[] = mapRegions.map((r) => ({
  id: `marker-${r.id}`,
  regionId: r.id,
  x: r.centerX,
  y: r.centerY,
  projectCount: r.projects,
  impactLevel: r.impactLevel,
}));

export function getRecentProjectForRegion(_regionId: string): string {
  const projects = [
    'مبادرة التعليم الرقمي',
    'برنامج الصحة المجتمعية',
    'مشروع الغذاء المستدام',
    'مراكب التدريب المهني',
    'برنامج رعاية الأيتام',
    'مهرجان التراث الثقافي',
  ];
  const idx = Math.abs(_regionId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % projects.length;
  return projects[idx];
}

/* ────────────────────────────────────────────────────────────────
 Legend Items
 ──────────────────────────────────────────────────────────────── */
export const mapLegendItems: MapLegendItem[] = [
  {
    level: 'very-high',
    label: 'Very High',
    labelAr: 'مرتفع جداً',
    color: '#2563EB',
    projectCount: mapRegions.filter((r) => r.impactLevel === 'very-high').reduce((s, r) => s + r.projects, 0),
  },
  {
    level: 'high',
    label: 'High',
    labelAr: 'مرتفع',
    color: '#3B82F6',
    projectCount: mapRegions.filter((r) => r.impactLevel === 'high').reduce((s, r) => s + r.projects, 0),
  },
  {
    level: 'medium',
    label: 'Medium',
    labelAr: 'متوسط',
    color: '#38BDF8',
    projectCount: mapRegions.filter((r) => r.impactLevel === 'medium').reduce((s, r) => s + r.projects, 0),
  },
  {
    level: 'low',
    label: 'Low',
    labelAr: 'منخفض',
    color: '#93C5FD',
    projectCount: mapRegions.filter((r) => r.impactLevel === 'low').reduce((s, r) => s + r.projects, 0),
  },
  {
    level: 'very-low',
    label: 'Very Low',
    labelAr: 'منخفض جداً',
    color: '#DBEAFE',
    projectCount: mapRegions.filter((r) => r.impactLevel === 'very-low').reduce((s, r) => s + r.projects, 0),
  },
];

/* ────────────────────────────────────────────────────────────────
 Helpers
 ──────────────────────────────────────────────────────────────── */
export function getRegionById(id: string): MapRegion | undefined {
  return mapRegions.find((r) => r.id === id);
}

export function getMarkerByRegionId(regionId: string): MapMarker | undefined {
  return mapMarkers.find((m) => m.regionId === regionId);
}

/** Color by impact level */
export function getImpactLevelColor(level: string, dark = false): string {
  switch (level) {
    case 'very-high':
      return dark ? '#3B82F6' : '#2563EB';
    case 'high':
      return dark ? '#60A5FA' : '#3B82F6';
    case 'medium':
      return dark ? '#7DD3FC' : '#38BDF8';
    case 'low':
      return dark ? '#BFDBFE' : '#93C5FD';
    case 'very-low':
      return dark ? '#DBEAFE' : '#DBEAFE';
    default:
      return '#94A3B8';
  }
}
