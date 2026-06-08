import { cn } from '@/app/utils/cn';

export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

/**
 * ChartCard Component
 *
 * A reusable container for charts with a title and description header.
 * 
 * @example
 * ```tsx
 * <ChartCard title="Revenue Trend" description="Monthly revenue over time">
 *   <LineChart data={data}>{...}</LineChart>
 * </ChartCard>
 * ```
 */
export function ChartCard({
  title,
  description,
  children,
  className,
  headerClassName,
  bodyClassName,
}: ChartCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl overflow-hidden', className)}>
      <div className={cn('p-6 border-b border-border', headerClassName)}>
        <h3 className="text-lg mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className={cn('p-6', bodyClassName)}>{children}</div>
    </div>
  );
}