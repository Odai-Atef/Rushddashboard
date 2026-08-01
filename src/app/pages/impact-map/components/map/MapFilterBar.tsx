'use client';

import { cn } from '@/app/utils/cn';
import { Search, Calendar, MapPin, Tag, Building2, Users } from 'lucide-react';

export interface MapFilterBarProps {
  className?: string;
}

export function MapFilterBar({ className }: MapFilterBarProps) {
  return (
    <div
      className={cn(
        'impact-filter-bar',
        className
      )}
      role="region"
      aria-label="فلاتر الخارطة"
    >
      {/* Year filter placeholder */}
      <div className="flex items-center gap-2 min-w-[140px]">
        <Calendar className="w-4 h-4 text-[var(--impact-text-muted)]" aria-hidden="true" />
        <span className="text-sm text-[var(--impact-text-muted)]">السنة</span>
        <div className="w-20 h-8 rounded-lg bg-[var(--impact-surface-secondary)] border border-[var(--impact-border)]" />
      </div>

      {/* Region filter placeholder */}
      <div className="flex items-center gap-2 min-w-[140px]">
        <MapPin className="w-4 h-4 text-[var(--impact-text-muted)]" aria-hidden="true" />
        <span className="text-sm text-[var(--impact-text-muted)]">المنطقة</span>
        <div className="w-24 h-8 rounded-lg bg-[var(--impact-surface-secondary)] border border-[var(--impact-border)]" />
      </div>

      {/* Sector filter placeholder */}
      <div className="flex items-center gap-2 min-w-[140px]">
        <Tag className="w-4 h-4 text-[var(--impact-text-muted)]" aria-hidden="true" />
        <span className="text-sm text-[var(--impact-text-muted)]">القطاع</span>
        <div className="w-24 h-8 rounded-lg bg-[var(--impact-surface-secondary)] border border-[var(--impact-border)]" />
      </div>

      {/* Funding Program placeholder */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <Building2 className="w-4 h-4 text-[var(--impact-text-muted)]" aria-hidden="true" />
        <span className="text-sm text-[var(--impact-text-muted)]">البرنامج</span>
        <div className="w-28 h-8 rounded-lg bg-[var(--impact-surface-secondary)] border border-[var(--impact-border)]" />
      </div>

      {/* Organization placeholder */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <Users className="w-4 h-4 text-[var(--impact-text-muted)]" aria-hidden="true" />
        <span className="text-sm text-[var(--impact-text-muted)]">الجهة</span>
        <div className="w-28 h-8 rounded-lg bg-[var(--impact-surface-secondary)] border border-[var(--impact-border)]" />
      </div>

      {/* Search placeholder */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md ml-auto">
        <Search className="w-4 h-4 text-[var(--impact-text-muted)]" aria-hidden="true" />
        <div className="flex-1 h-9 rounded-lg bg-[var(--impact-surface-secondary)] border border-[var(--impact-border)]" />
      </div>
    </div>
  );
}
