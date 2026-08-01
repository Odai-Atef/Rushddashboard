'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { cn } from '@/app/utils/cn';
import type { MapRegion as MapRegionType } from '../../types/map';
import { MapRegion } from './MapRegion';
import { ImpactMarker } from './ImpactMarker';
import { MapTooltip } from './MapTooltip';
import { MapLegend } from './MapLegend';
import { MapControls } from './MapControls';
import { MapFilterBar } from './MapFilterBar';
import { RegionDetailsPanel } from './RegionDetailsPanel';
import { MapEmptyState } from './MapEmptyState';
import { MapSkeleton } from './MapSkeleton';
import { MapErrorState } from './MapErrorState';
import {
  mapRegions,
  mapMarkers,
  mapLegendItems,
  getRegionById,
  getRecentProjectForRegion,
} from '../../mock/mapData';

export interface ImpactMapProps {
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactMap({
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showLegend, setShowLegend] = useState(true);
  const [view, setView] = useState({ zoom: 1, panX: 0, panY: 0 });

  const selectedRegion = useMemo(() => {
    if (!selectedRegionId) return null;
    const r = getRegionById(selectedRegionId);
    return r ? { region: r, recentProject: getRecentProjectForRegion(r.id) } : null;
  }, [selectedRegionId]);

  const hoveredRegion = useMemo(() => {
    if (!hoveredRegionId) return null;
    return getRegionById(hoveredRegionId) ?? null;
  }, [hoveredRegionId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedRegionId((prev) => (prev === id ? null : id));
  }, []);

  const handleHover = useCallback(
    (id: string | null) => {
      setHoveredRegionId(id);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !hoveredRegionId) return;
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left + 16,
        y: e.clientY - rect.top + 16,
      });
    },
    [hoveredRegionId]
  );

  const handleZoomIn = useCallback(() => {
    setView((v) => ({ ...v, zoom: Math.min(v.zoom + 0.15, 2.5) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setView((v) => ({ ...v, zoom: Math.max(v.zoom - 0.15, 0.6) }));
  }, []);

  const handleReset = useCallback(() => {
    setView({ zoom: 1, panX: 0, panY: 0 });
    setSelectedRegionId(null);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedRegionId(null);
  }, []);

  /* ── States ─────────────────────────────────────────────── */

  if (isError) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[20px]',
          'bg-gradient-to-b from-white to-[#F8FAFC]',
          'dark:from-[#0F172A] dark:to-[#16253D]',
          'border border-[var(--impact-border)]',
          'shadow-[var(--impact-shadow-2)]',
          'dark:shadow-[var(--impact-shadow-3)]',
          'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]',
          className
        )}
      >
        <MapErrorState onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[20px]',
          'bg-gradient-to-b from-white to-[#F8FAFC]',
          'dark:from-[#0F172A] dark:to-[#16253D]',
          'border border-[var(--impact-border)]',
          'shadow-[var(--impact-shadow-2)]',
          'dark:shadow-[var(--impact-shadow-3)]',
          'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]',
          className
        )}
      >
        <MapSkeleton />
      </div>
    );
  }

  if (!mapRegions.length) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[20px]',
          'bg-gradient-to-b from-white to-[#F8FAFC]',
          'dark:from-[#0F172A] dark:to-[#16253D]',
          'border border-[var(--impact-border)]',
          'shadow-[var(--impact-shadow-2)]',
          'dark:shadow-[var(--impact-shadow-3)]',
          'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]',
          className
        )}
      >
        <MapEmptyState />
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} role="region" aria-label="خارطة الأثر التفاعلية">
      {/* Filter bar */}
      <MapFilterBar />

      {/* Map container */}
      <div
        ref={containerRef}
        className={cn(
          'relative w-full overflow-hidden rounded-[20px]',
          'bg-gradient-to-b from-white to-[#F8FAFC]',
          'dark:from-[#0F172A] dark:to-[#16253D]',
          'border border-[var(--impact-border)]',
          'shadow-[var(--impact-shadow-2)]',
          'dark:shadow-[var(--impact-shadow-3)]',
          'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]',
          'animate-fade-in'
        )}
        onMouseMove={handleMouseMove}
        onClick={() => setSelectedRegionId(null)}
      >
        {/* Controls — top right */}
        <MapControls
          className="top-3 right-3"
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onToggleLegend={() => setShowLegend((s) => !s)}
        />

        {/* Legend — bottom left */}
        {showLegend && (
          <MapLegend
            items={mapLegendItems}
            className="bottom-3 left-3"
          />
        )}

        {/* SVG Map */}
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{
            minHeight: 'inherit',
            transition: 'transform 200ms ease-out',
            transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Background sea / void */}
          <rect
            x="0" y="0" width="1000" height="1000"
            fill="transparent"
            className="pointer-events-none"
          />

          {/* Regions */}
          <g className="map-regions">
            {mapRegions.map((region) => (
              <MapRegion
                key={region.id}
                region={region}
                isSelected={selectedRegionId === region.id}
                isHovered={hoveredRegionId === region.id}
                onSelect={handleSelect}
                onHover={handleHover}
              />
            ))}
          </g>

          {/* Markers */}
          <g className="map-markers">
            {mapMarkers.map((marker) => (
              <ImpactMarker key={marker.id} marker={marker} />
            ))}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredRegion && (
          <MapTooltip
            region={hoveredRegion}
            x={tooltipPos.x}
            y={tooltipPos.y}
            visible={!!hoveredRegion}
          />
        )}

        {/* Region details panel */}
        {selectedRegion && (
          <RegionDetailsPanel
            region={selectedRegion.region}
            recentProject={selectedRegion.recentProject}
            onClose={handleClosePanel}
            className="right-3 top-3 bottom-auto max-h-[calc(100%-24px)]"
          />
        )}
      </div>
    </div>
  );
}
