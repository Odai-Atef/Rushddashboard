import { cn } from '@/app/utils/cn';
import { ImpactCard } from './ImpactCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import type { SROI } from '../types';

export interface ImpactSROISectionProps {
  sroiData: SROI[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ImpactSROISection({
  sroiData,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactSROISectionProps) {
  if (isError) {
    return (
      <ImpactCard title="تحليل العائد الاجتماعي" className={className}>
        <ErrorState
          title="تعذر تحميل بيانات العائد الاجتماعي"
          message="حدث خطأ أثناء جلب بيانات العائد الاجتماعي."
          onRetry={onRetry}
        />
      </ImpactCard>
    );
  }

  if (isLoading) {
    return (
      <ImpactCard title="تحليل العائد الاجتماعي" className={className}>
        <LoadingSkeleton variant="chart" />
      </ImpactCard>
    );
  }

  if (!sroiData.length) {
    return (
      <ImpactCard title="تحليل العائد الاجتماعي" className={className}>
        <EmptyState
          title="لا توجد بيانات SROI"
          description="لم يتم العثور على بيانات العائد الاجتماعي حالياً."
        />
      </ImpactCard>
    );
  }

  const totalInvestment = sroiData.reduce((sum, s) => sum + s.investment, 0);
  const totalReturn = sroiData.reduce((sum, s) => sum + s.socialReturn, 0);
  const avgRatio = sroiData.length > 0
    ? sroiData.reduce((sum, s) => sum + s.ratio, 0) / sroiData.length
    : 0;

  return (
    <ImpactCard
      title="تحليل العائد الاجتماعي (SROI)"
      description="عائد الاستثمار الاجتماعي لكل ريال مستثمر"
      className={cn('animate-fade-in', className)}
    >
      <div className="space-y-6">
        {/* Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[var(--hover)]/30 text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">إجمالي الاستثمار</div>
            <div className="text-xl font-bold text-[var(--text-primary)]">
              {(totalInvestment / 1_000_000).toFixed(1)} مليون
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--primary)]/[0.06] text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">إجمالي العائد</div>
            <div className="text-xl font-bold text-[var(--primary)]">
              {(totalReturn / 1_000_000).toFixed(1)} مليون
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--secondary)]/[0.06] text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">متوسط العائد</div>
            <div className="text-xl font-bold text-[var(--secondary)]">
              {avgRatio.toFixed(1)}x
            </div>
          </div>
        </div>

        {/* SROI Bars */}
        <div className="space-y-4">
          {sroiData.map((sroi) => (
            <div key={sroi.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[60%]">
                  {sroi.projectName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--primary)]">
                    {sroi.ratio}x
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {sroi.beneficiariesImpacted.toLocaleString('ar-SA')} مستفيد
                  </span>
                </div>
              </div>
              <div className="relative h-2.5 rounded-full bg-[var(--hover)] overflow-hidden">
                <div
                  className="absolute top-0 right-0 h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min((sroi.ratio / 6) * 100, 100)}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ImpactCard>
  );
}
