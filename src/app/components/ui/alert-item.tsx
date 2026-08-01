import { cn } from '@/app/utils/cn';

export type AlertType = 'urgent' | 'warning' | 'info' | 'success';
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';

export interface AlertItemProps {
 id?: string | number;
 type: AlertType;
 title: string;
 description: string;
 priority?: AlertPriority;
 timestamp?: string;
 onClick?: () => void;
 className?: string;
}

/**
 * AlertItem Component
 *
 * A reusable alert/notification card with color-coded severity levels.
 *
 * @example
 * ```tsx
 * <AlertItem
 * type="urgent"
 * title="Conversion Rate Drop"
 * description="Decreased from 34.5% to 28.2%"
 * priority="high"
 * onClick={() => navigate('/alerts/123')}
 * />
 * ```
 */
export function AlertItem({
 type,
 title,
 description,
 priority = 'medium',
 onClick,
 className,
}: AlertItemProps) {
 const alertStyles: Record<AlertType, string> = {
 urgent: 'border-l-4 border-l-[var(--danger)] bg-[var(--danger)]/[0.06] hover:bg-[var(--danger)]/[0.1]',
 warning: 'border-l-4 border-l-[var(--warning)] bg-[var(--warning)]/[0.06]/[0.12] hover:bg-[var(--warning)]/[0.1]',
 info: 'border-l-4 border-l-[var(--secondary)] bg-[var(--secondary)]/[0.06]/[0.12] hover:bg-[var(--secondary)]/[0.1]',
 success: 'border-l-4 border-l-[var(--primary)] bg-[var(--primary)]/[0.06]/[0.12] hover:bg-[var(--primary)]/[0.1] dark:hover:bg-[var(--primary)]/[0.18]',
 };

 const priorityLabels: Record<AlertPriority, string> = {
 critical: 'حرج',
 high: 'عالية',
 medium: 'متوسطة',
 low: 'منخفضة',
 };

 const priorityStyles: Record<AlertPriority, string> = {
 critical: 'bg-[var(--danger)]/10 text-[var(--danger)]',
 high: 'bg-[var(--warning)]/[0.1] text-[var(--warning)]',
 medium: 'bg-[var(--warning)]/10 text-[var(--warning)]',
 low: 'bg-[var(--secondary)]/10 text-[var(--secondary)]',
 };

 return (
 <div
 className={cn(
 'p-[var(--spacing-card-padding)] rounded-[var(--radius-card)] cursor-pointer transition-all duration-[var(--transition-duration)] hover:translate-y-[-1px] hover:shadow-[var(--shadow-sm)]',
 alertStyles[type],
 className
 )}
 onClick={onClick}
 role="button"
 tabIndex={0}
 onKeyDown={(e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 onClick?.();
 }
 }}
 >
 <div className="flex items-start justify-between gap-2 mb-2">
 <h4 className="font-bold text-[var(--text-primary)] text-base">{title}</h4>
 <span
 className={cn(
 'px-2 py-0.5 text-xs font-medium rounded-[var(--radius-badge)] flex-shrink-0',
 priorityStyles[priority]
 )}
 >
 {priorityLabels[priority]}
 </span>
 </div>
 <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
 </div>
 );
}
