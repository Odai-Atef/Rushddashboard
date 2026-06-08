import { CheckCircle } from 'lucide-react';
import { cn } from '@/app/utils/cn';

export type RecommendationPriority = 'urgent' | 'high' | 'medium' | 'low';
export type RecommendationRisk = 'low' | 'medium' | 'high';

export interface RecommendationItemProps {
  id?: string | number;
  index?: number;
  title: string;
  impact: string;
  description?: string;
  priority?: RecommendationPriority;
  risk?: RecommendationRisk;
  onDismiss?: () => void;
  onApply?: () => void;
  className?: string;
}

/**
 * RecommendationItem Component
 *
 * A reusable card for displaying AI recommendations or action items.
 * 
 * @example
 * ```tsx
 * <RecommendationItem
 *   index={1}
 *   title="Expand B2B Sales Channel"
 *   impact="+32% Revenue"
 *   priority="urgent"
 *   risk="low"
 *   onApply={() => implementRecommendation(id)}
 * />
 * ```
 */
export function RecommendationItem({
  index,
  title,
  impact,
  description,
  priority = 'high',
  onDismiss,
  onApply,
  className,
}: RecommendationItemProps) {
  const priorityLabels: Record<RecommendationPriority, string> = {
    urgent: 'عاجل',
    high: 'أولوية عالية',
    medium: 'أولوية متوسطة',
    low: 'أولوية منخفضة',
  };

  const priorityStyles: Record<RecommendationPriority, string> = {
    urgent: 'bg-red-500/20 text-red-600',
    high: 'bg-orange-500/20 text-orange-600',
    medium: 'bg-yellow-500/20 text-yellow-600',
    low: 'bg-blue-500/20 text-blue-600',
  };

  return (
    <div
      className={cn(
        'p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors',
        (onApply || onDismiss) && 'cursor-pointer',
        className
      )}
      onClick={onApply}
    >
      <div className="flex items-start gap-3">
        {index !== undefined && (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
            {index}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium mb-1">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-green-600 font-medium text-sm">{impact}</span>
            <span className="text-muted-foreground">•</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                priorityStyles[priority]
              )}
            >
              {priorityLabels[priority]}
            </span>
          </div>
        </div>
        {onDismiss && (
          <CheckCircle
            className="w-5 h-5 text-muted-foreground hover:text-green-600 transition-colors flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
          />
        )}
      </div>
    </div>
  );
}