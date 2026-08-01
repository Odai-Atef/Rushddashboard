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
 * title="Total Revenue"
 * value="$245,000"
 * change="+12.5%"
 * isPositive={true}
 * icon={TrendingUp}
 * iconColor="text-[var(--primary)]"
 * iconBgColor="bg-[var(--primary)]/10"
 * />
 * ```
 */
export function StatCard({
 title,
 value,
 change,
 isPositive = true,
 icon: Icon,
 iconColor = 'text-[var(--primary)]',
 iconBgColor = 'bg-[var(--primary)]/10',
 className,
 onClick,
 description,
}: StatCardProps) {
 return (
 <div
 className={cn(
 // Light mode — exact card color #FFFFFF
 'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-card)]',
 // Dark mode — exact card color #102942 with glass effect
 '',
 'p-[var(--spacing-card-padding)]',
 // Hover lift + glow in dark mode
 'hover:shadow-[var(--shadow-[var(--shadow-lg)])] hover:translate-y-[-2px]',
 'dark:hover:shadow-[var(--shadow-card)] dark:hover:shadow-[var(--shadow-glow)]',
 'transition-all duration-[var(--transition-duration)] ease-out',
 onClick && 'cursor-pointer hover:border-[var(--primary)]/30 dark:hover:border-[var(--primary)]/30',
 className
 )}
 onClick={onClick}
 >
 <div className="flex items-start justify-between mb-5">
 <div
 className={cn(
 'p-[var(--spacing-card-padding)] rounded-[var(--radius-card)]',
 'bg-[var(--hover)]',
 iconBgColor
 )}
 >
 <Icon
 className={cn(
 'w-6 h-6',
 'text-[var(--text-secondary)]',
 iconColor
 )}
 />
 </div>
 {change && (
 <div
 className={cn(
 'flex items-center gap-[var(--spacing-small-gap)] text-sm font-medium px-2 py-1 rounded-[var(--radius-badge)]',
 isPositive
 ? 'text-[var(--primary)] bg-[var(--primary)]/[0.12]/[0.2]'
 : 'text-[var(--destructive)] bg-[var(--destructive)]/[0.12]/[0.2]'
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
 <p className="text-xs text-[var(--text-muted)] mb-2">
 {description}
 </p>
 )}

 <h3 className="text-sm font-medium text-[var(--text-muted)] mb-1.5">
 {title}
 </h3>
 <p className="text-[var(--text-card-number)] font-bold text-[var(--text-primary)] tracking-tight">
 {value}
 </p>
 </div>
 );
}
