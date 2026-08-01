'use client';

import { cn } from '@/app/utils/cn';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Maximize2, Eye } from 'lucide-react';

export interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onToggleLegend?: () => void;
  onFullscreen?: () => void;
  onToggleLayers?: () => void;
  className?: string;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleLegend,
  onFullscreen,
  onToggleLayers,
  className,
}: MapControlsProps) {
  const btnBase = cn(
    'flex items-center justify-center',
    'w-9 h-9 rounded-lg',
    'bg-[var(--impact-surface)]/90 backdrop-blur-sm',
    'border border-[var(--impact-border)]',
    'text-[var(--impact-text-secondary)]',
    'hover:bg-[var(--impact-surface-secondary)]',
    'hover:text-[var(--impact-text-primary)]',
    'hover:border-[var(--impact-primary)]/30',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[var(--impact-primary)]/30'
  );

  return (
    <div
      className={cn('absolute z-30 flex flex-col gap-1.5', className)}
      role="toolbar"
      aria-label="أدوات الخارطة"
    >
      {/* Top-right group: zoom + reset */}
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onZoomIn}
          className={btnBase}
          aria-label="تكبير"
          title="تكبير"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className={btnBase}
          aria-label="تصغير"
          title="تصغير"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onReset}
          className={btnBase}
          aria-label="إعادة التعيين"
          title="إعادة التعيين"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--impact-border)] my-0.5" />

      {/* Bottom-right group: legend toggle, fullscreen, layers */}
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onToggleLegend}
          className={btnBase}
          aria-label="تبديل المفتاح"
          title="تبديل المفتاح"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          className={btnBase}
          aria-label="ملء الشاشة"
          title="ملء الشاشة"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleLayers}
          className={btnBase}
          aria-label="الطبقات"
          title="الطبقات"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
