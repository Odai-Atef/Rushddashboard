'use client';

import { cn } from '@/app/utils/cn';
import { Map } from 'lucide-react';

export interface MapEmptyStateProps {
  className?: string;
}

export function MapEmptyState({ className }: MapEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'w-full h-full min-h-[320px] p-8',
        className
      )}
      role="status"
      aria-label="لا توجد بيانات تأثير متاحة"
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-5',
          'bg-[var(--impact-surface-secondary)]',
          'border border-[var(--impact-border)]',
          'text-[var(--impact-text-muted)]'
        )}
      >
        <Map className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--impact-text-primary)' }}
      >
        لا توجد بيانات تأثير متاحة
      </h3>
      <p
        className="text-sm max-w-xs leading-relaxed"
        style={{ color: 'var(--impact-text-muted)' }}
      >
        لم يتم العثور على بيانات للمناطق المحددة. جرب تعديل الفلاتر أو التحقق لاحقاً.
      </p>
    </div>
  );
}
