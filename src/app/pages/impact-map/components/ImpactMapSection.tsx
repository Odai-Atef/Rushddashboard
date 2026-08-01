import { cn } from '@/app/utils/cn';
import { ImpactCard } from './ImpactCard';
import { ImpactMap, MapSkeleton, MapErrorState, MapEmptyState } from './map';
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
  className,
}: ImpactMapSectionProps) {
  if (isError) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-[20px]',
            'bg-gradient-to-b from-white to-[#F8FAFC]',
            'dark:from-[#0F172A] dark:to-[#16253D]',
            'border border-[var(--impact-border)]',
            'shadow-[0_10px_30px_rgba(15,23,42,0.08)]',
            'dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]',
            'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]'
          )}
        >
          <MapErrorState onRetry={onRetry} />
        </div>
      </ImpactCard>
    );
  }

  if (isLoading) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-[20px]',
            'bg-gradient-to-b from-white to-[#F8FAFC]',
            'dark:from-[#0F172A] dark:to-[#16253D]',
            'border border-[var(--impact-border)]',
            'shadow-[0_10px_30px_rgba(15,23,42,0.08)]',
            'dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]',
            'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]'
          )}
        >
          <MapSkeleton />
        </div>
      </ImpactCard>
    );
  }

  if (!regions.length) {
    return (
      <ImpactCard title="الخارطة التفاعلية" className={className}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-[20px]',
            'bg-gradient-to-b from-white to-[#F8FAFC]',
            'dark:from-[#0F172A] dark:to-[#16253D]',
            'border border-[var(--impact-border)]',
            'shadow-[0_10px_30px_rgba(15,23,42,0.08)]',
            'dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]',
            'min-h-[420px] md:min-h-[550px] lg:min-h-[650px]'
          )}
        >
          <MapEmptyState />
        </div>
      </ImpactCard>
    );
  }

  return (
    <ImpactCard
      title="الخارطة التفاعلية"
      description="انقر على المنطقة لعرض التفاصيل"
      className={cn('animate-fade-in', className)}
    >
      <ImpactMap isLoading={isLoading} isError={isError} onRetry={onRetry} />
    </ImpactCard>
  );
}
