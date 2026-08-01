import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/app/utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  onClick?: () => void;
  description?: string;
}

/**
 * StatCard Component
 *
 * A reusable KPI/statistic card for dashboards.
 * Displays a value with an optional change indicator and icon.
 * Supports light/dark themes with glassmorphism effects.
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Revenue"
 *   value="$245,000"
 *   change="+12.5%"
 *   isPositive={true}
 *   icon={TrendingUp}
 *   iconColor="text-emerald-600"
 *   iconBgColor="bg-emerald-500/10"
 * />
 * ```
 */
export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  className,
  onClick,
  description,
}: StatCardProps) {
  return (
    <div
      className={cn(
        // Light mode
        'bg-white rounded-2xl border border-gray-200/80 shadow-sm',
        // Dark mode - glass effect
        'dark:bg-gray-900/60 dark:border-gray-700/50 dark:backdrop-blur-md',
        'p-6 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-emerald-500/10',
        'transition-all duration-200 ease-out',
        onClick && 'cursor-pointer hover:border-gray-300 dark:hover:border-emerald-500/30',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className={cn(
            'p-3 rounded-xl',
            'bg-gray-100 dark:bg-gray-800/80',
            iconBgColor
          )}
        >
          <Icon
            className={cn(
              'w-6 h-6',
              'text-gray-700 dark:text-gray-200',
              iconColor
            )}
          />
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
              isPositive
                ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-500/20'
                : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-500/20'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {change}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        {value}
      </p>
    </div>
  );
}
