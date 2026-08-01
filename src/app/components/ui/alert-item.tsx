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
 *   type="urgent"
 *   title="Conversion Rate Drop"
 *   description="Decreased from 34.5% to 28.2%"
 *   priority="high"
 *   onClick={() => navigate('/alerts/123')}
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
    urgent: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30',
    warning: 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30',
    info: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    success: 'border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
  };

  const priorityLabels: Record<AlertPriority, string> = {
    critical: 'حرج',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
  };

  const priorityStyles: Record<AlertPriority, string> = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  };

  return (
    <div
      className={cn(
        'p-4 rounded-xl cursor-pointer transition-all duration-200',
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
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0',
            priorityStyles[priority]
          )}
        >
          {priorityLabels[priority]}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
