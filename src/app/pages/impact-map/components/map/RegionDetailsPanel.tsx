'use client';

import { cn } from '@/app/utils/cn';
import type { MapRegion } from '../../types/map';
import { X, Users, Briefcase, Banknote, TrendingUp, Activity, ArrowLeft } from 'lucide-react';

export interface RegionDetailsPanelProps {
  region: MapRegion;
  recentProject: string;
  onClose: () => void;
  onViewDetails?: (regionId: string) => void;
  className?: string;
}

export function RegionDetailsPanel({
  region,
  recentProject,
  onClose,
  onViewDetails,
  className,
}: RegionDetailsPanelProps) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      className={cn(
        'absolute top-4 bottom-4 z-40',
        'w-[280px] md:w-[300px]',
        'rounded-xl border shadow-xl',
        'bg-[var(--impact-surface)]',
        'border-[var(--impact-border)]',
        'dark:bg-[var(--impact-main-surface)]',
        'flex flex-col',
        'animate-slide-in-right',
        className
      )}

      role="dialog"
      aria-label={`تفاصيل منطقة ${region.nameAr}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--impact-divider)]">
      <h3
        className={cn(
          'text-base font-bold',
          'text-[var(--impact-text-primary)]'
        )}
      >
        {region.nameAr}
      </h3>
        <button
          onClick={onClose}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'text-[var(--impact-text-muted)]',
            'hover:bg-[var(--impact-surface-secondary)]',
            'hover:text-[var(--impact-text-primary)]',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--impact-primary)]/30'
          )}
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        <StatRow
          icon={<Briefcase className="w-4 h-4 text-[var(--impact-primary)]" />}
          label="المشاريع"
          value={region.projects.toLocaleString('ar-SA')}
        />
        <StatRow
          icon={<Users className="w-4 h-4 text-[var(--impact-info)]" />}
          label="المستفيدون"
          value={region.beneficiaries.toLocaleString('ar-SA')}
        />
        <StatRow
          icon={<Banknote className="w-4 h-4 text-[var(--impact-success)]" />}
          label="التمويل"
          value={formatCurrency(region.funding)}
        />
        <StatRow
          icon={<TrendingUp className="w-4 h-4 text-[var(--impact-warning)]" />}
          label="التأثير"
          value={`${region.impactScore}%`}
        />
        <StatRow
          icon={<Activity className="w-4 h-4 text-[var(--impact-danger)]" />}
          label="SROI"
          value={`${region.sroi}x`}
        />

        <div className="h-px bg-[var(--impact-divider)] my-2" />

        {/* Recent project */}
        <div className="space-y-1">
        <span
          className={cn(
            'text-xs font-medium',
            'text-[var(--impact-text-muted)]'
          )}
        >
          أحدث مشروع
        </span>
        <p
          className={cn(
            'text-sm font-semibold leading-relaxed',
            'text-[var(--impact-text-primary)]'
          )}
        >
          {recentProject}
        </p>
        </div>
      </div>

      {/* Footer action */}
      <div className="p-4 border-t border-[var(--impact-divider)]">
        <button
          onClick={() => onViewDetails?.(region.id)}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'px-4 py-2.5 rounded-xl text-sm font-medium',
            'bg-[var(--impact-primary)] text-[var(--impact-surface)]',
            'hover:bg-[var(--impact-primary-hover)]',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--impact-primary)]/40'
          )}
        >
          <span>عرض التفاصيل</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--impact-surface-secondary)]">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-[var(--impact-text-muted)]">
          {label}
        </div>
        <div className="text-sm font-bold tabular-nums text-[var(--impact-text-primary)]">
          {value}
        </div>
      </div>
    </div>
  );
}
