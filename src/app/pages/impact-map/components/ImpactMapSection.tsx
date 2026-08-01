import { cn } from '@/app/utils/cn';
import { ImpactCard } from './ImpactCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import type { Region } from '../types';

export interface ImpactMapSectionProps {
  regions: Region[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  selectedRegionId?: string | null;
  onRegionSelect?: (regionId: string) => void;
  className?: string;
}

export function ImpactMapSection({
  regions,
  isLoading,
  isError,
  onRetry,
  selectedRegionId,
  onRegionSelect,
  className,
}: ImpactMapSectionProps) {
  if (isError) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <ErrorState
          title="تعذر تحميل الخارطة"
          message="حدث خطأ أثناء جلب بيانات الخارطة. يرجى المحاولة مرة أخرى."
          onRetry={onRetry}
        />
      </ImpactCard>
    );
  }

  if (isLoading) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <LoadingSkeleton variant="map" />
      </ImpactCard>
    );
  }

  if (!regions.length) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <EmptyState
          title="لا توجد بيانات جغرافية"
          description="لم يتم العثور على بيانات المناطق حالياً."
        />
      </ImpactCard>
    );
  }

  return (
    <ImpactCard
      title="الخارطة التفاعلية"
      description="انقر على المنطقة لعرض التفاصيل"
      className={cn('animate-fade-in', className)}
    >
      <div
        className={cn(
          'relative min-h-[400px] md:min-h-[500px] rounded-lg',
          'bg-[var(--background)] border border-[var(--border)]',
          'flex items-center justify-center'
        )}
      >
        {/* Placeholder for interactive map — will be replaced with actual map component */}
        <div className="text-center space-y-6 p-8 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => onRegionSelect?.(region.id)}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200 text-right',
                  'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40',
                  'min-h-[80px] flex flex-col justify-between',
                  selectedRegionId === region.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/[0.06] shadow-sm'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30'
                )}
                aria-label={`منطقة ${region.name}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {region.name}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-[var(--text-muted)]">
                  <div>{region.projectsCount.toLocaleString('ar-SA')} مشروع</div>
                  <div>{region.beneficiariesCount.toLocaleString('ar-SA')} مستفيد</div>
                </div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[var(--text-muted)] pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
              <span>منطقة نشطة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]" />
              <span>منطقة عادية</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]" />
              <span>منطقة مختارة</span>
            </div>
          </div>
        </div>
      </div>
    </ImpactCard>
  );
}
