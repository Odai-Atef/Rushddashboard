'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import saudiArabiaLow from '@amcharts/amcharts5-geodata/saudiArabiaLow';

// ─── Types ──────────────────────────────────────────────────────

export interface RegionMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  value: number; // 0-100 impact score
}

export interface AmChartsMapProps {
  onRegionClick?: (regionId: string, regionName: string) => void;
  selectedRegion?: string | null;
  impactData?: Record<string, number>; // regionId -> impact score (0-100)
  regionMarkers?: RegionMarker[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

// ─── amCharts region ID → normalized internal ID mapping ─────────
// amCharts uses ISO-like IDs (SA-01 … SA-14).  We normalise to the
// kebab-case IDs already used by the rest of the dashboard.
const AMCHARTS_TO_INTERNAL: Record<string, string> = {
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

const INTERNAL_TO_AMCHARTS: Record<string, string> = Object.fromEntries(
  Object.entries(AMCHARTS_TO_INTERNAL).map(([k, v]) => [v, k])
);

// ─── Color helpers (use CSS-var-friendly hex values) ───────────
function getImpactColor(value: number): am5.Color {
  if (value > 75) return am5.color(0x22c55e);   // High impact – green
  if (value > 50) return am5.color(0xeab308);   // Medium – yellow
  if (value > 25) return am5.color(0xf97316);   // Low-medium – orange
  return am5.color(0xef4444);                   // Low – red
}

function getMarkerSize(value: number): number {
  // Map 0-100 impact score to a visible radius range (8px-24px)
  return Math.max(8, Math.min(24, 8 + value / 6.25));
}

// ─── Component ──────────────────────────────────────────────────

export const AmChartsMap: React.FC<AmChartsMapProps> = ({
  onRegionClick,
  selectedRegion,
  impactData = {},
  regionMarkers = [],
  isLoading,
  isError,
  onRetry,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track previous selected region to avoid unnecessary updates
  const prevSelectedRef = useRef<string | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const chartRef = useRef<am5map.MapChart | null>(null);
  const polygonSeriesRef = useRef<am5map.MapPolygonSeries | null>(null);
  const pointSeriesRef = useRef<am5map.MapPointSeries | null>(null);

  /* ── Initialise amCharts (run once) ─────────────────────────── */
  useEffect(() => {
    if (!containerRef.current || isLoading || isError) return;

    const root = am5.Root.new(containerRef.current);
    rootRef.current = root;

    // Respect dark mode via CSS variable on the container
    const isDark =
      containerRef.current.closest('[data-theme="dark"]') !== null ||
      document.documentElement.classList.contains('dark');

    // Theme colours
    const fillColor = isDark ? am5.color(0x1e293b) : am5.color(0xe2e8f0);   // slate-800 / slate-200
    const strokeColor = isDark ? am5.color(0x334155) : am5.color(0xffffff);   // slate-700 / white
    const hoverColor = am5.color(0x3b82f6);                                      // blue-500
    const activeColor = am5.color(0x2563eb);                                     // blue-600
    const activeStroke = am5.color(0x1d4ed8);                                  // blue-700
    const bgColor = isDark ? am5.color(0x0f172a) : am5.color(0xffffff);        // slate-900 / white

    root.container.setAll({
      background: am5.Rectangle.new(root, {
        fill: bgColor,
      }),
    });

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        panY: 'translateY',
        projection: am5map.geoMercator(),
        homeZoomLevel: 1,
        homeGeoPoint: { latitude: 24.5, longitude: 45 },
        maxZoomLevel: 10,
        minZoomLevel: 1,
        wheelY: 'zoom',
      })
    );
    chartRef.current = chart;

    // Zoom control
    chart.set(
      'zoomControl',
      am5map.ZoomControl.new(root, {})
    );

    // Polygon series
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: saudiArabiaLow as unknown as any,
        valueField: 'value',
        calculateAggregates: true,
      })
    );
    polygonSeriesRef.current = polygonSeries;

    // Template defaults
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: '{name}',
      toggleKey: 'active',
      interactive: true,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 1,
      fillOpacity: 1,
    });

    // Hover state
    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: hoverColor,
      stroke: activeStroke,
      strokeWidth: 2,
    });

    // Active (selected) state
    polygonSeries.mapPolygons.template.states.create('active', {
      fill: activeColor,
      stroke: activeStroke,
      strokeWidth: 2,
    });

    // Click handler
    polygonSeries.mapPolygons.template.events.on('click', (ev) => {
      const dataItem = ev.target.dataItem;
      if (!dataItem || !onRegionClick) return;

      const amChartsId = dataItem.get('id') as string;
      const internalId = AMCHARTS_TO_INTERNAL[amChartsId] ?? amChartsId;
      const regionName = (dataItem.get('name') as string) ?? '';
      onRegionClick(internalId, regionName);
    });

    // ─── Point series for region capital markers ───────────────
    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: 'latitude',
        longitudeField: 'longitude',
        valueField: 'value',
      })
    );
    pointSeriesRef.current = pointSeries;

    pointSeries.bullets.push(() => {
      const circle = am5.Circle.new(root, {
        radius: 8,
        fill: am5.color(0x1fa97a),
        fillOpacity: 0.85,
        stroke: am5.color(0xffffff),
        strokeWidth: 2,
        tooltipText: '{name}\nالأثر: {value}',
        interactive: true,
        cursorOverStyle: 'pointer',
      });

      circle.adapters.add('radius', (_radius, target) => {
        const dataItem = target.dataItem;
        if (!dataItem) return 8;
        return getMarkerSize(Number(dataItem.get('value') ?? 0));
      });

      circle.adapters.add('fill', (_fill, target) => {
        const dataItem = target.dataItem;
        if (!dataItem) return am5.color(0x1fa97a);
        return getImpactColor(Number(dataItem.get('value') ?? 0));
      });

      circle.states.create('hover', {
        scale: 1.2,
        fillOpacity: 1,
      });

      circle.events.on('click', (ev) => {
        const dataItem = ev.target.dataItem;
        if (!dataItem || !onRegionClick) return;
        const id = dataItem.get('id') as string;
        const name = dataItem.get('name') as string;
        onRegionClick(id, name);
      });

      return am5.Bullet.new(root, { sprite: circle });
    });

    // Animation
    chart.appear(1000, 100);

    return () => {
      root.dispose();
      rootRef.current = null;
      chartRef.current = null;
      polygonSeriesRef.current = null;
      pointSeriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError]);

  /* ── Update impact-data colours (re-run when data changes) ── */
  useEffect(() => {
    if (!polygonSeriesRef.current) return;

    const series = polygonSeriesRef.current;

    series.mapPolygons.each((polygon) => {
      const dataItem = polygon.dataItem;
      if (!dataItem) return;

      const amChartsId = dataItem.get('id') as string;
      const internalId = AMCHARTS_TO_INTERNAL[amChartsId] ?? amChartsId;
      const score = impactData[internalId] ?? 0;

      // Base fill driven by impact score
      const baseFill = score > 0 ? getImpactColor(score) : am5.color(0xe2e8f0);
      polygon.set('fill', baseFill);

      // Keep stroke consistent (will be overridden by hover/active states)
      polygon.set('stroke', am5.color(0xffffff));
      polygon.set('strokeWidth', 1);
    });

    // Re-apply data so amCharts recalculates aggregates if needed
    const regionData = Object.entries(impactData).map(([internalId, value]) => ({
      id: INTERNAL_TO_AMCHARTS[internalId] ?? internalId,
      value,
    }));
    series.data.setAll(regionData);
  }, [impactData]);

  /* ── Update region markers (re-run when markers change) ───── */
  useEffect(() => {
    if (!pointSeriesRef.current) return;

    const series = pointSeriesRef.current;
    const data = regionMarkers.map((marker) => ({
      ...marker,
      radius: getMarkerSize(marker.value),
    }));

    series.data.setAll(data);

    // Apply per-marker radius & colour via adapter
    series.bullets.each((bullet) => {
      const sprite = bullet.get('sprite');
      if (sprite instanceof am5.Circle) {
        sprite.adapters.add('radius', (radius, target) => {
          const dataItem = target.dataItem;
          if (!dataItem) return radius;
          return getMarkerSize(Number(dataItem.get('value') ?? 0));
        });
        sprite.adapters.add('fill', (fill, target) => {
          const dataItem = target.dataItem;
          if (!dataItem) return fill;
          return getImpactColor(Number(dataItem.get('value') ?? 0));
        });
      }
    });
  }, [regionMarkers]);

  /* ── Update selected region highlight ─────────────────────── */
  useEffect(() => {
    if (!polygonSeriesRef.current) return;
    if (prevSelectedRef.current === selectedRegion) return;

    const series = polygonSeriesRef.current;

    // Reset all first
    series.mapPolygons.each((polygon) => {
      polygon.set('active', false);
    });

    prevSelectedRef.current = selectedRegion ?? null;

    if (!selectedRegion) return;

    const amChartsId = INTERNAL_TO_AMCHARTS[selectedRegion] ?? selectedRegion;
    const selectedPolygon = series.getPolygonById(amChartsId);
    if (selectedPolygon) {
      selectedPolygon.set('active', true);
      // Bring to front visually
      selectedPolygon.toFront();
    }
  }, [selectedRegion]);

  /* ── Loading / Error shells ───────────────────────────────── */
  if (isError) {
    return (
      <div
        className={`w-full h-full min-h-[420px] md:min-h-[550px] lg:min-h-[650px] rounded-[20px] border border-[var(--impact-border)] bg-gradient-to-b from-white to-[#F8FAFC] dark:from-[#0F172A] dark:to-[#16253D] flex items-center justify-center ${className || ''}`}
      >
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--impact-text-primary)] mb-2">
            تعذر تحميل الخارطة
          </h3>
          <p className="text-sm text-[var(--impact-text-secondary)] mb-4">
            حدث خطأ أثناء تحميل بيانات الخارطة. يرجى المحاولة مرة أخرى.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-[var(--impact-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`w-full h-full min-h-[420px] md:min-h-[550px] lg:min-h-[650px] rounded-[20px] border border-[var(--impact-border)] bg-gradient-to-b from-white to-[#F8FAFC] dark:from-[#0F172A] dark:to-[#16253D] animate-pulse ${className || ''}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[420px] md:min-h-[550px] lg:min-h-[650px] rounded-[20px] overflow-hidden border border-[var(--impact-border)] shadow-[var(--impact-shadow-2)] dark:shadow-[var(--impact-shadow-3)] ${className || ''}`}
      style={{ direction: 'ltr' }}
      role="img"
      aria-label="خارطة المملكة العربية السعودية التفاعلية"
    />
  );
};

export default AmChartsMap;
