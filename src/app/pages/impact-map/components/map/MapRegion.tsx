'use client';

import { cn } from '@/app/utils/cn';
import type { MapRegion as MapRegionType } from '../../types/map';
import type { MouseEvent, KeyboardEvent } from 'react';

export interface MapRegionProps {
  region: MapRegionType;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  defaultFill?: string;
  hoverFill?: string;
  selectedFill?: string;
}

export function MapRegion({
  region,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  defaultFill = '#E2E8F0',
  hoverFill = '#BFDBFE',
  selectedFill = '#2563EB',
}: MapRegionProps) {
  const handleClick = (e: MouseEvent<SVGPathElement>) => {
    e.stopPropagation();
    onSelect?.(region.id);
  };

  const handleKeyDown = (e: KeyboardEvent<SVGPathElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(region.id);
    }
  };

  const fillColor = isSelected
    ? selectedFill
    : isHovered
    ? hoverFill
    : defaultFill;

  const strokeColor = isSelected ? '#FFFFFF' : isHovered ? '#60A5FA' : '#CBD5E1';
  const strokeWidth = isSelected ? 2.5 : isHovered ? 1.5 : 1;

  return (
    <path
      d={region.path}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      className={cn(
        'cursor-pointer transition-all duration-200',
        'focus:outline-none'
      )}
      style={{
        filter: isSelected
          ? 'drop-shadow(0 4px 12px rgba(37,99,235,0.35))'
          : isHovered
          ? 'drop-shadow(0 2px 6px rgba(37,99,235,0.18))'
          : 'none',
        transitionProperty: 'fill, stroke, stroke-width, filter',
      }}
      onClick={handleClick}
      onMouseEnter={() => onHover?.(region.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(region.id)}
      onBlur={() => onHover?.(null)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`منطقة ${region.nameAr}، ${region.projects} مشروع`}
      data-region-id={region.id}
    />
  );
}
