/* ============================================================
 Impact Map — Map-Specific Type Definitions
 ============================================================ */

/** Impact intensity level for regions and markers */
export type ImpactLevel = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';

/** Map region with SVG path, stats, and metadata */
export interface MapRegion {
  id: string;
  name: string;
  nameAr: string;
  path: string;
  /** Approximate center of the region within the SVG viewBox (0-1000 scale) */
  centerX: number;
  centerY: number;
  projects: number;
  beneficiaries: number;
  funding: number;
  impactScore: number;
  sroi: number;
  lastUpdated: string;
  impactLevel: ImpactLevel;
}

/** Impact marker placed on a region */
export interface MapMarker {
  id: string;
  regionId: string;
  /** X position in SVG viewBox (0-1000) */
  x: number;
  /** Y position in SVG viewBox (0-1000) */
  y: number;
  projectCount: number;
  impactLevel: ImpactLevel;
}

/** Legend item for the impact intensity scale */
export interface MapLegendItem {
  level: ImpactLevel;
  label: string;
  labelAr: string;
  color: string;
  projectCount: number;
}

/** Selected region detail panel payload */
export interface SelectedRegion {
  region: MapRegion;
  recentProject: string;
}

/** Map view state (zoom + pan) */
export interface MapViewState {
  zoom: number;
  panX: number;
  panY: number;
}

/* ─── amCharts Region ID Mapping ─────────────────────────────── */

/** amCharts ISO region ID → internal region ID */
export const AMCHARTS_TO_INTERNAL: Record<string, string> = {
  'SA-01': 'riyadh',
  'SA-02': 'makkah',
  'SA-03': 'madinah',
  'SA-04': 'eastern',
  'SA-05': 'qassim',
  'SA-06': 'hail',
  'SA-07': 'tabuk',
  'SA-08': 'northern-borders',
  'SA-09': 'jazan',
  'SA-10': 'najran',
  'SA-11': 'al-baha',
  'SA-12': 'al-jawf',
  'SA-14': 'asir',
};

/** Internal region ID → amCharts ISO region ID */
export const INTERNAL_TO_AMCHARTS: Record<string, string> = Object.fromEntries(
  Object.entries(AMCHARTS_TO_INTERNAL).map(([k, v]) => [v, k])
);
