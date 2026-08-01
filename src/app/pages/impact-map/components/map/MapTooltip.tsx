'use client';

import { cn } from '@/app/utils/cn';
import type { MapRegion } from '../../types/map';

export interface MapTooltipProps {
  region: MapRegion;
  x: number;
  y: number;
  visible: boolean;
}

export function MapTooltip({ region, x, y, visible }: MapTooltipProps) {
  if (!visible) return null;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(n);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div
      className={cn(
        'absolute z-50 pointer-events-none',
        'px-4 py-3 rounded-xl min-w-[220px]',
        'border shadow-lg',
        'bg-[var(--impact-surface)] border-[var(--impact-border)]',
        'dark:bg-[var(--impact-main-surface)] dark:border-[var(--impact-border)]',
        'transition-opacity duration-150',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      style={{ left: x, top: y, boxShadow: 'var(--impact-shadow-2)' }}
      role="tooltip"
      aria-label={`تفاصيل منطقة ${region.nameAr}`}
    >
      <h4
        className={cn(
          'text-sm font-bold mb-2.5',
          'text-[var(--impact-text-primary)]'
        )}
      >
        {region.nameAr}
      </h4>

      <div className="space-y-1.5 text-xs leading-relaxed">
        <div className="flex justify-between gap-4">
          <span style={{ color: 'var(--impact-text-muted)' }}>المشاريع</span>
          <span className="font-semibold" style={{ color: 'var(--impact-text-primary)' }}>
            {region.projects.toLocaleString('ar-SA')}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: 'var(--impact-text-muted)' }}>المستفيدون</span>
          <span className="font-semibold" style={{ color: 'var(--impact-text-primary)' }}>
            {region.beneficiaries.toLocaleString('ar-SA')}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: 'var(--impact-text-muted)' }}>التمويل</span>
          <span className="font-semibold" style={{ color: 'var(--impact-primary)' }}>
            {formatCurrency(region.funding)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: 'var(--impact-text-muted)' }}>التأثير</span>
          <span className="font-semibold" style={{ color: 'var(--impact-text-primary)' }}>
            {region.impactScore}%
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: 'var(--impact-text-muted)' }}>SROI</span>
          <span className="font-semibold" style={{ color: 'var(--impact-success)' }}>
            {region.sroi}x
          </span>
        </div>
        <div className="flex justify-between gap-4 pt-1 border-t border-[var(--impact-divider)]">
          <span style={{ color: 'var(--impact-text-muted)' }}>آخر تحديث</span>
          <span className="font-medium" style={{ color: 'var(--impact-text-secondary)' }}>
            {formatDate(region.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}
