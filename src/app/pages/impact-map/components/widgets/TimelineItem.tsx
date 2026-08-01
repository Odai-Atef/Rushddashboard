/**
 * TimelineItem — Timeline Item Component
 *
 * Icon + content + time with vertical line connector.
 * Supports sequential animation.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  FolderPlus,
  Banknote,
  Users,
  ClipboardCheck,
  Building2,
} from 'lucide-react';
import type { TimelineItem as TimelineItemType } from '../../types/analytics';

export interface TimelineItemProps {
  item: TimelineItemType;
  index?: number;
  isLast?: boolean;
  className?: string;
}

const ACTIVITY_CONFIG: Record<
  TimelineItemType['type'],
  { icon: typeof FolderPlus; color: string; bg: string; label: string }
> = {
  project_added: {
    icon: FolderPlus,
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.10)',
    label: 'مشروع جديد',
  },
  funding_approved: {
    icon: Banknote,
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.10)',
    label: 'تمويل معتمد',
  },
  beneficiary_updated: {
    icon: Users,
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.10)',
    label: 'تحديث مستفيدين',
  },
  evaluation_completed: {
    icon: ClipboardCheck,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.10)',
    label: 'تقييم مكتمل',
  },
  organization_joined: {
    icon: Building2,
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.10)',
    label: 'منظمة جديدة',
  },
};

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `منذ ${diffMinutes} دقيقة`;
  }
  if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  }
  if (diffDays < 30) {
    return `منذ ${diffDays} يوم`;
  }
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function TimelineItem({
  item,
  index = 0,
  isLast = false,
  className,
}: TimelineItemProps) {
  const config = ACTIVITY_CONFIG[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn('relative flex gap-3', className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: 'easeOut',
      }}
    >
      {/* Icon + Connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            'border-2'
          )}
          style={{
            backgroundColor: config.bg,
            borderColor: config.color,
          }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: config.color }}
            aria-hidden="true"
          />
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 min-h-[20px]"
            style={{ backgroundColor: 'var(--border)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
              {item.descriptionAr}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {config.label}
            </p>
          </div>
          <span className="text-xs text-[var(--text-muted)] flex-shrink-0 whitespace-nowrap">
            {formatRelativeTime(item.timestamp)}
          </span>
        </div>

        {/* Status indicator */}
        {item.status === 'pending' && (
          <span
            className={cn(
              'inline-flex items-center gap-1',
              'mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium'
            )}
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.10)',
              color: '#F59E0B',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            قيد المراجعة
          </span>
        )}
        {item.status === 'failed' && (
          <span
            className={cn(
              'inline-flex items-center gap-1',
              'mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium'
            )}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.10)',
              color: '#EF4444',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            فشل
          </span>
        )}
      </div>
    </motion.div>
  );
}
