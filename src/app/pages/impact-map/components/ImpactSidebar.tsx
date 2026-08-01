import { cn } from '@/app/utils/cn';
import { ImpactCard } from './ImpactCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import type { Region } from '../types';

export interface ImpactSidebarProps {
  regions: Region[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  selectedRegionId?: string | null;
  className?: string;
}

export function ImpactSidebar({
  regions,
  isLoading,
  isError,
  onRetry,
  selectedRegionId,
  className,
}: ImpactSidebarProps) {
  const selectedRegion = selectedRegionId
    ? regions.find((r) => r.id === selectedRegionId)
    : null;

  const totalProjects = regions.reduce((sum, r) => sum + r.projectsCount, 0);
  const totalBeneficiaries = regions.reduce(
    (sum, r) => sum + r.beneficiariesCount,
    0
  );
  const totalFunding = regions.reduce((sum, r) => sum + r.totalFunding, 0);
  const avgSROI =
    regions.length > 0
      ? regions.reduce((sum, r) => sum + r.sroiValue, 0) / regions.length
      : 0;

  if (isError) {
    return (
      <ImpactCard title="لوحة التحليلات" className={className}>
        <ErrorState
          title="تعذر تحميل التحليلات"
          message="حدث خطأ أثناء جلب بيانات التحليلات."
          onRetry={onRetry}
        />
      </ImpactCard>
    );
  }

  if (isLoading) {
    return (
      <ImpactCard title="لوحة التحليلات" className={className}>
        <LoadingSkeleton variant="list" />
      </ImpactCard>
    );
  }

  if (!regions.length) {
    return (
      <ImpactCard title="لوحة التحليلات" className={className}>
        <EmptyState
          title="لا توجد بيانات"
          description="لم يتم العثور على بيانات التحليلات حالياً."
        />
      </ImpactCard>
    );
  }

  return (
    <div className={cn('space-y-[var(--spacing-grid-gap)] animate-fade-in', className)}>
      {/* Summary Stats */}
      <ImpactCard title="ملخص الأثر">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--hover)]/30">
            <span className="text-sm text-[var(--text-muted)]">إجمالي المشاريع</span>
            <span className="text-lg font-bold text-[var(--text-primary)]">
              {totalProjects.toLocaleString('ar-SA')}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--hover)]/30">
            <span className="text-sm text-[var(--text-muted)]">إجمالي المستفيدين</span>
            <span className="text-lg font-bold text-[var(--text-primary)]">
              {totalBeneficiaries.toLocaleString('ar-SA')}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--hover)]/30">
            <span className="text-sm text-[var(--text-muted)]">إجمالي التمويل</span>
            <span className="text-lg font-bold text-[var(--primary)]">
              {(totalFunding / 1_000_000).toFixed(1)} مليون ر.س.
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--hover)]/30">
            <span className="text-sm text-[var(--text-muted)]">متوسط العائد</span>
            <span className="text-lg font-bold text-[var(--secondary)]">
              {avgSROI.toFixed(1)}x
            </span>
          </div>
        </div>
      </ImpactCard>

      {/* Selected Region Detail */}
      {selectedRegion && (
        <ImpactCard
          title={selectedRegion.name}
          description="تفاصيل المنطقة المختارة"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedRegion.color }}
              />
              <span className="text-sm font-medium text-[var(--text-muted)]">
                {selectedRegion.nameEn}
              </span>
            </div>
            <StatRow label="المشاريع" value={selectedRegion.projectsCount.toLocaleString('ar-SA')} />
            <StatRow label="المستفيدين" value={selectedRegion.beneficiariesCount.toLocaleString('ar-SA')} />
            <StatRow
              label="التمويل"
              value={`${(selectedRegion.totalFunding / 1_000_000).toFixed(1)} مليون ر.س.`}
              highlight
            />
            <StatRow
              label="العائد الاجتماعي"
              value={`${selectedRegion.sroiValue}x`}
              highlight
            />
          </div>
        </ImpactCard>
      )}

      {/* Regions Ranked by Projects */}
      <ImpactCard
        title="المناطق حسب المشاريع"
        description="أعلى المناطق من حيث عدد المشاريع"
      >
        <div className="space-y-2">
          {[...regions]
            .sort((a, b) => b.projectsCount - a.projectsCount)
            .slice(0, 5)
            .map((region, index) => (
              <div
                key={region.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--hover)]/50 transition-colors"
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                    index < 3
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--hover)] text-[var(--text-muted)]'
                  )}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {region.name}
                    </span>
                    <span className="text-sm text-[var(--text-muted)] flex-shrink-0">
                      {region.projectsCount}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-[var(--hover)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(region.projectsCount / totalProjects) * 100}%`,
                        backgroundColor: region.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ImpactCard>
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
      <span
        className={cn(
          'text-sm font-semibold',
          highlight ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'
        )}
      >
        {value}
      </span>
    </div>
  );
}
