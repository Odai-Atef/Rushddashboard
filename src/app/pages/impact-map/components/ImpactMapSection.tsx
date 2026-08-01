import React from 'react';
import { cn } from '@/app/utils/cn';
import { ImpactCard } from './ImpactCard';
import { AmChartsMap, MapSkeleton, MapErrorState, MapEmptyState } from './map';
import type { Region } from '../types';
import type { RegionMarker } from './map/AmChartsMap';

export interface ImpactMapSectionProps {
  regions: Region[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  selectedRegionId?: string | null;
  onRegionSelect?: (regionId: string) => void;
  className?: string;
}

/** Build impact-data record from Region array for the amCharts map */
function buildImpactData(regions: Region[]): Record<string, number> {
  const data: Record<string, number> = {};
  for (const r of regions) {
    // Derive impact score from totalFunding relative to max
    data[r.id] = r.sroiValue ? Math.min(r.sroiValue * 20, 100) : 0;
  }
  return data;
}

/** Build map-point data for region capitals */
function buildRegionMarkers(regions: Region[], impactData: Record<string, number>): RegionMarker[] {
  return regions.map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.coordinates[0],
    longitude: r.coordinates[1],
    value: impactData[r.id] ?? 0,
  }));
}

export function ImpactMapSection({
  regions,
  isLoading,
  isError,
  onRetry,
  selectedRegionId,
  onRegionSelect,
  className,
}: ImpactMapSectionProps) {
  if (isError) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-[var(--impact-radius-map-panel)]',
            'bg-gradient-to-b from-white to-[#F8FAFC]',
            'dark:from-[#0F172A] dark:to-[#16253D]',
            'border border-[var(--impact-border)]',
            'shadow-[var(--impact-shadow-2)]',
            'dark:shadow-[var(--impact-shadow-3)]',
            'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]'
          )}
        >
          <MapErrorState onRetry={onRetry} />
        </div>
      </ImpactCard>
    );
  }

  if (isLoading) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-[var(--impact-radius-map-panel)]',
            'bg-gradient-to-b from-white to-[#F8FAFC]',
            'dark:from-[#0F172A] dark:to-[#16253D]',
            'border border-[var(--impact-border)]',
            'shadow-[var(--impact-shadow-2)]',
            'dark:shadow-[var(--impact-shadow-3)]',
            'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]'
          )}
        >
          <MapSkeleton />
        </div>
      </ImpactCard>
    );
  }

  if (!regions.length) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-[var(--impact-radius-map-panel)]',
            'bg-gradient-to-b from-white to-[#F8FAFC]',
            'dark:from-[#0F172A] dark:to-[#16253D]',
            'border border-[var(--impact-border)]',
            'shadow-[var(--impact-shadow-2)]',
            'dark:shadow-[var(--impact-shadow-3)]',
            'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]'
          )}
        >
          <MapEmptyState />
        </div>
      </ImpactCard>
    );
  }

  const handleRegionClick = React.useCallback(
    (_amChartsId: string, regionName: string) => {
      // Find region by Arabic name (amCharts supplies the geoJSON name)
      const region = regions.find(
        (r) => r.name === regionName || r.nameEn === regionName
      );
      if (region && onRegionSelect) {
        onRegionSelect(region.id);
      }
    },
    [regions, onRegionSelect]
  );

  const impactData = React.useMemo(
    () => buildImpactData(regions),
    [regions]
  );

  const regionMarkers = React.useMemo(
    () => buildRegionMarkers(regions, impactData),
    [regions, impactData]
  );

  return (
    <ImpactCard
      title="الخارطة التفاعلية"
      description="انقر على المنطقة أو النقطة لعرض التفاصيل"
      className={cn('animate-fade-in', className)}
    >
      <AmChartsMap
        onRegionClick={handleRegionClick}
        selectedRegion={selectedRegionId ?? null}
        impactData={impactData}
        regionMarkers={regionMarkers}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        className="rounded-[var(--impact-radius-map-panel)]"
      />
    </ImpactCard>
  );
}
