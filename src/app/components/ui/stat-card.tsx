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
 * 
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Revenue"
 *   value="$245,000"
 *   change="+12.5%"
 *   isPositive={true}
 *   icon={TrendingUp}
 *   iconColor="text-chart-1"
 *   iconBgColor="bg-chart-1/10"
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
        'bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all',
        onClick && 'cursor-pointer hover:border-primary/50',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-lg', iconBgColor)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {change}
          </div>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground text-xs mb-2">{description}</p>
      )}
      <h3 className="text-muted-foreground text-sm mb-2">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}