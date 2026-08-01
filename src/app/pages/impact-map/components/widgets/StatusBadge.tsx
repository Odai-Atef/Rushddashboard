/**
 * StatusBadge — Reusable Status Badge
 *
 * Reusable status badge for project execution states.
 * 9999px radius, small padding, theme-aware.
 */

import { cn } from '@/app/utils/cn';
import type { ProjectExecutionStatus } from '../../types/analytics';

export interface StatusBadgeProps {
  status: ProjectExecutionStatus;
  label?: string;
  className?: string;
  showDot?: boolean;
}

const STATUS_CONFIG: Record<ProjectExecutionStatus, { label: string; color: string; bg: string }> = {
  running: {
    label: 'قيد التنفيذ',
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.10)',
  },
  completed: {
    label: 'مكتمل',
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.10)',
  },
  delayed: {
    label: 'متأخر',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.10)',
  },
  planned: {
    label: 'مخطط',
    color: '#64748B',
    bg: 'rgba(100, 116, 139, 0.10)',
  },
  cancelled: {
    label: 'ملغى',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.10)',
  },
};

export function StatusBadge({
  status,
  label,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const displayLabel = label ?? config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2.5 py-1 rounded-[9999px]',
        'text-xs font-semibold leading-none',
        'min-h-[24px]',
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: config.color }}
          aria-hidden="true"
        />
      )}
      {displayLabel}
    </span>
  );
}
