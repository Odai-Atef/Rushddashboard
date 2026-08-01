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
 * title="Executive Dashboard"
 * description="Overview of platform performance"
 * >
 * <Button>Export Report</Button>
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
 <div className={cn('space-y-[var(--spacing-small-gap)]', className)}>
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-[var(--text-page-title)] mb-1">{title}</h2>
 {description && (
 <p className="text-muted-foreground">{description}</p>
 )}
 </div>
 {children && <div className="flex items-center gap-[var(--spacing-small-gap)]">{children}</div>}
 </div>
 </div>
 );
}
