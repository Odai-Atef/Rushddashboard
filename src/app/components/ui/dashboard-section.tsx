import { cn } from '@/app/utils/cn';

export interface DashboardSectionProps {
 children: React.ReactNode;
 columns?: 1 | 2 | 3 | 4;
 gap?: 'sm' | 'md' | 'lg';
 className?: string;
 title?: string;
 description?: string;
}

/**
 * DashboardSection Component
 *
 * A reusable grid section layout with configurable columns and gap.
 * Ensures equal-height cards using items-stretch.
 *
 * @example
 * ```tsx
 * <DashboardSection columns={4} gap="md">
 * <StatCard ... />
 * <StatCard ... />
 * </DashboardSection>
 * ```
 */
export function DashboardSection({
 children,
 columns = 2,
 gap = 'md',
 className,
 title,
 description,
}: DashboardSectionProps) {
 const gridCols = {
 1: 'grid-cols-1',
 2: 'grid-cols-1 md:grid-cols-2',
 3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
 4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
 };

 const gapSizes = {
 sm: 'gap-[var(--spacing-small-gap)]',
 md: 'gap-[var(--spacing-grid-gap)]',
 lg: 'gap-[var(--spacing-grid-gap)]',
 };

 return (
 <div className={cn('space-y-[var(--spacing-section-gap)]', className)}>
 {(title || description) && (
 <div>
 {title && (
 <h3 className="text-xl font-semibold text-[var(--text-primary)]">
 {title}
 </h3>
 )}
 {description && (
 <p className="text-sm text-[var(--text-muted)]">
 {description}
 </p>
 )}
 </div>
 )}
 <div
 className={cn(
 'grid items-stretch',
 gridCols[columns],
 gapSizes[gap]
 )}
 >
 {children}
 </div>
 </div>
 );
}
