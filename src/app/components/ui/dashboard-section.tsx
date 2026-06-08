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
 * 
 * @example
 * ```tsx
 * <DashboardSection columns={4} gap="md">
 *   <StatCard ... />
 *   <StatCard ... />
 *   <StatCard ... />
 *   <StatCard ... />
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
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className={cn('grid', gridCols[columns], gapSizes[gap])}>
        {children}
      </div>
    </div>
  );
}