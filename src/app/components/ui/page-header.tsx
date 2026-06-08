import { cn } from '@/app/utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // Extra content like buttons
  className?: string;
}

/**
 * PageHeader Component
 *
 * A reusable, consistent page header for all dashboard pages.
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="Executive Dashboard"
 *   description="Overview of platform performance"
 * >
 *   <Button>Export Report</Button>
 * </PageHeader>
 * ```
 */
export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-1">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
