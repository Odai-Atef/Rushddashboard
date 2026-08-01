'use client';

import { cn } from '@/app/utils/cn';
import type { MapLegendItem } from '../../types/map';
import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

export interface MapLegendProps {
  items: MapLegendItem[];
  className?: string;
}

export function MapLegend({ items, className }: MapLegendProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => setCollapsed((p) => !p), []);

  return (
    <div
      className={cn(
        'absolute bottom-4 left-4 z-30',
        'rounded-xl border shadow-md',
        'bg-[var(--impact-surface)]/95 backdrop-blur-sm',
        'border-[var(--impact-border)]',
        'dark:bg-[var(--impact-main-surface)]/95',
        'transition-all duration-200',
        className
      )}

      role="region"
      aria-label="مفتاح الخارطة"
    >
      {/* Header */}
      <button
        onClick={toggle}
        className={cn(
          'flex items-center gap-2 w-full px-3 py-2',
          'text-sm font-semibold',
          'text-[var(--impact-text-primary)]',
          'hover:bg-[var(--impact-surface-secondary)]/50',
          'rounded-t-xl transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-[var(--impact-primary)]/30'
        )}
        aria-expanded={!collapsed}
        aria-controls="legend-content"
      >
        <Layers className="w-4 h-4 text-[var(--impact-primary)]" aria-hidden="true" />
        <span className="flex-1 text-right">مستوى التأثير</span>
        {collapsed ? (
          <ChevronDown className="w-4 h-4 text-[var(--impact-text-muted)]" />
        ) : (
          <ChevronUp className="w-4 h-4 text-[var(--impact-text-muted)]" />
        )}
      </button>

      {/* Content */}
      {!collapsed && (
        <div
          id="legend-content"
          className="px-3 pb-3 space-y-1.5 min-w-[180px]"
        >
          {items.map((item) => (
            <div
              key={item.level}
              className="flex items-center gap-2.5 text-xs"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-white/20"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span
                className="flex-1 text-right"
                style={{ color: 'var(--impact-text-secondary)' }}
              >
                {item.labelAr}
              </span>
              <span
                className="font-semibold tabular-nums"
                style={{ color: 'var(--impact-text-primary)' }}
              >
                {item.projectCount.toLocaleString('ar-SA')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
