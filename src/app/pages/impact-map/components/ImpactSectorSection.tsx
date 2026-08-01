import { cn } from '@/app/utils/cn';
import { ImpactCard } from './ImpactCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import type { Sector } from '../types';

export interface ImpactSectorSectionProps {
  sectors: Sector[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactSectorSection({
  sectors,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactSectorSectionProps) {
  if (isError) {
    return (
      <ImpactCard title="المشاريع حسب القطاع" className={className}>
        <ErrorState
          title="تعذر تحميل بيانات القطاعات"
          message="حدث خطأ أثناء جلب بيانات القطاعات."
          onRetry={onRetry}
        />
      </ImpactCard>
    );
  }

  if (isLoading) {
    return (
      <ImpactCard title="المشاريع حسب القطاع" className={className}>
        <LoadingSkeleton variant="chart" />
      </ImpactCard>
    );
  }

  if (!sectors.length) {
    return (
      <ImpactCard title="المشاريع حسب القطاع" className={className}>
        <EmptyState
          title="لا توجد بيانات القطاعات"
          description="لم يتم العثور على بيانات القطاعات حالياً."
        />
      </ImpactCard>
    );
  }

  const totalProjects = sectors.reduce((sum, s) => sum + s.projectCount, 0);
  const totalFunding = sectors.reduce((sum, s) => sum + s.totalFunding, 0);

  return (
    <ImpactCard
      title="المشاريع حسب القطاع"
      description="توزيع المشاريع والتمويل عبر القطاعات المختلفة"
      className={cn('animate-fade-in', className)}
    >
      <div className="space-y-5">
        {/* Sector Bars */}
        <div className="space-y-3">
          {sectors.map((sector) => {
            const percentage = totalProjects > 0
              ? (sector.projectCount / totalProjects) * 100
              : 0;

            return (
              <div key={sector.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {sector.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm text-[var(--text-muted)]">
                      {sector.projectCount} مشروع
                    </span>
                    <span className="text-sm font-bold text-[var(--text-primary)] w-12 text-left">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-[var(--hover)] overflow-hidden">
                  <div
                    className="absolute top-0 right-0 h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: sector.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-[var(--hover)]/30 text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">إجمالي القطاعات</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {sectors.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--primary)]/[0.06] text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">إجمالي التمويل</div>
            <div className="text-lg font-bold text-[var(--primary)]">
              {(totalFunding / 1_000_000).toFixed(0)} مليون ر.س.
            </div>
          </div>
        </div>
      </div>
    </ImpactCard>
  );
}
