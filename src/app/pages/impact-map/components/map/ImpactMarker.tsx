'use client';

import { cn } from '@/app/utils/cn';
import type { MapMarker } from '../../types/map';

export interface ImpactMarkerProps {
  marker: MapMarker;
  size?: number;
  className?: string;
}

const levelSize = {
  'very-high': 12,
  high: 10,
  medium: 9,
  low: 8,
  'very-low': 7,
};

const levelColor = {
  'very-high': 'var(--impact-primary)',
  high: 'var(--impact-primary-hover)',
  medium: 'var(--impact-info)',
  low: 'var(--impact-info)',
  'very-low': 'var(--impact-border)',
};

export function ImpactMarker({ marker, size, className }: ImpactMarkerProps) {
  const baseSize = size ?? levelSize[marker.impactLevel] ?? 9;
  const color = levelColor[marker.impactLevel] ?? '#94A3B8';

  return (
    <g
      className={cn('cursor-pointer', className)}
      transform={`translate(${marker.x}, ${marker.y})`}
      aria-label={`${marker.projectCount} مشروع`}
    >
      {/* Outer pulse ring */}
      <circle
        r={baseSize * 2.2}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.25}
        className="marker-pulse"
      />
      {/* Middle glow */}
      <circle
        r={baseSize * 1.4}
        fill={color}
        opacity={0.18}
      />
      {/* Inner dot */}
      <circle
        r={baseSize * 0.65}
        fill={color}
        className="marker-dot"
      />
    </g>
  );
}
