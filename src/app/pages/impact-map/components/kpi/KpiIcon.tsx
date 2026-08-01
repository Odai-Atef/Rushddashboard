/**
 * KPI Icon Component
 *
 * Circular icon container with gradient background.
 * 60px circle with 28px Lucide icon.
 */

import {
  Briefcase,
  HandCoins,
  Users,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/app/utils/cn';
import type { KpiIconProps } from '../../types/kpi';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  HandCoins,
  Users,
  TrendingUp,
};

export function KpiIcon({ iconName, color, className }: KpiIconProps) {
  const IconComp = iconMap[iconName] ?? Briefcase;

  return (
    <div
      className={cn(
        // Container: 60px circle
        'w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0',
        // Light gradient: #DBEAFE → #BFDBFE
        'bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE]',
        // Dark mode gradient
        'dark:from-[rgba(37,99,235,0.25)] dark:to-[rgba(59,130,246,0.15)]',
        // Icon scale animation
        'animate-kpi-icon-scale',
        className
      )}
      style={color ? { background: color } : undefined}
      aria-hidden="true"
    >
      <IconComp
        className={cn(
          // Icon size: 28px
          'w-7 h-7',
          // Icon color: Primary Blue
          'text-[var(--impact-primary)]',
          className
        )}
      />
    </div>
  );
}
