import { cn } from '@/app/utils/cn';
import { ImpactCard } from './ImpactCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyProjectsState } from './EmptyState';
import type { Project } from '../types';

export interface ImpactProjectsSectionProps {
  projects: Project[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onViewAll?: () => void;
  className?: string;
}

const statusConfig: Record<Project['status'], { label: string; color: string }> = {
  active: { label: 'نشط', color: '#10B981' },
  completed: { label: 'مكتمل', color: '#3B82F6' },
  pending: { label: 'معلق', color: '#F59E0B' },
  suspended: { label: 'موقوف', color: '#EF4444' },
  funded: { label: 'ممول', color: '#1FA97A' },
  draft: { label: 'مسودة', color: '#6B7280' },
};

export function ImpactProjectsSection({
  projects,
  isLoading,
  isError,
  onRetry,
  onViewAll,
  className,
}: ImpactProjectsSectionProps) {
  if (isError) {
    return (
      <ImpactCard title="أحدث المشاريع" className={className}>
        <ErrorState
          title="تعذر تحميل المشاريع"
          message="حدث خطأ أثناء جلب بيانات المشاريع."
          onRetry={onRetry}
        />
      </ImpactCard>
    );
  }

  if (isLoading) {
    return (
      <ImpactCard title="أحدث المشاريع" className={className}>
        <LoadingSkeleton variant="list" />
      </ImpactCard>
    );
  }

  if (!projects.length) {
    return (
      <ImpactCard title="أحدث المشاريع" className={className}>
        <EmptyProjectsState onAction={onViewAll} />
      </ImpactCard>
    );
  }

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 5);

  return (
    <ImpactCard
      title="أحدث المشاريع"
      description="آخر المشاريع المضافة أو المحدثة"
      headerAction={
        onViewAll && (
          <button
            onClick={onViewAll}
            className={cn(
              'text-sm font-medium text-[var(--primary)]',
              'hover:text-[var(--primary)]/80 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40',
              'rounded px-2 py-1'
            )}
          >
            عرض الكل
          </button>
        )
      }
      className={cn('animate-fade-in', className)}
    >
      <div className="space-y-3">
        {recentProjects.map((project) => {
          const status = statusConfig[project.status];
          const progress = Math.min(
            Math.max(project.progress, 0),
            100
          );

          return (
            <div
              key={project.id}
              className={cn(
                'p-4 rounded-xl border border-[var(--border)]',
                'bg-[var(--card)] hover:bg-[var(--hover)]/50',
                'transition-colors duration-200',
                'flex flex-col sm:flex-row sm:items-center gap-3'
              )}
            >
              {/* Status Indicator */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                  title={status.label}
                />
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${status.color}15`,
                    color: status.color,
                  }}
                >
                  {status.label}
                </span>
              </div>

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {project.name}
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1 mb-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                  <span>{project.organizationName}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    {(project.totalBudget / 1_000_000).toFixed(1)} مليون ر.س.
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    {project.beneficiariesCount.toLocaleString('ar-SA')} مستفيد
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 flex-shrink-0 sm:w-32">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--hover)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: status.color,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--text-muted)] w-8 text-left">
                  {progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ImpactCard>
  );
}
