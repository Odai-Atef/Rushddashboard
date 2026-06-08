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
    urgent: 'border-r-4 border-red-500 bg-red-500/10',
    warning: 'border-r-4 border-yellow-500 bg-yellow-500/10',
    info: 'border-r-4 border-blue-500 bg-blue-500/10',
    success: 'border-r-4 border-green-500 bg-green-500/10',
  };

  const priorityLabels: Record<AlertPriority, string> = {
    critical: 'حرج',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
  };

  const priorityStyles: Record<AlertPriority, string> = {
    critical: 'bg-red-500/20 text-red-600',
    high: 'bg-orange-500/20 text-orange-600',
    medium: 'bg-yellow-500/20 text-yellow-600',
    low: 'bg-blue-500/20 text-blue-600',
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity',
        alertStyles[type],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium">{title}</h4>
        <span
          className={cn(
            'px-2 py-1 text-xs rounded-full flex-shrink-0',
            priorityStyles[priority]
          )}
        >
          {priorityLabels[priority]}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}