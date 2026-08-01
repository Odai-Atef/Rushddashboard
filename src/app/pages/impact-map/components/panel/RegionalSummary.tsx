/**
 * RegionalSummary — Right Panel Section 3
 *
 * Top 5 regions list with projects count, impact score (mini progress bar), trend.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { WidgetCard } from '../widgets/WidgetCard';
import { ProgressBar } from '../widgets/ProgressBar';
import type { RegionalSummaryRow } from '../../types/analytics';

export interface RegionalSummaryProps {
  regions?: RegionalSummaryRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_REGIONS: RegionalSummaryRow[] = [
  { id: 'reg-riyadh', region: 'Riyadh', regionAr: 'الرياض', projectsCount: 42, impactScore: 94, trend: 'up' },
  { id: 'reg-makkah', region: 'Makkah', regionAr: 'مكة المكرمة', projectsCount: 28, impactScore: 89, trend: 'up' },
  { id: 'reg-eastern', region: 'Eastern Province', regionAr: 'المنطقة الشرقية', projectsCount: 24, impactScore: 86, trend: 'down' },
  { id: 'reg-asir', region: 'Asir', regionAr: 'عسير', projectsCount: 18, impactScore: 82, trend: 'up' },
  { id: 'reg-madinah', region: 'Madinah', regionAr: 'المدينة المنورة', projectsCount: 15, impactScore: 78, trend: 'up' },
];

export function RegionalSummary({
  regions = DEFAULT_REGIONS,
  isLoading,
  isError,
  onRetry,
  className,
}: RegionalSummaryProps) {
  return (
    <WidgetCard
      title="أفضل المناطق"
      description="أعلى ٥ مناطق من حيث الأثر"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد بيانات"
      className={className}
    >
      <div className="space-y-3">
        {regions.map((region, index) => {
          const TrendIcon = region.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor = region.trend === 'up' ? '#22C55E' : '#EF4444';
          const isTopThree = index < 3;

          return (
            <motion.div
              key={region.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl',
                'border border-[var(--border)]',
                'bg-[var(--card)]',
                'transition-all duration-150 ease-out',
                'hover:translate-y-[-2px] hover:shadow-[var(--shadow-sm)]'
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.06,
                ease: 'easeOut',
              }}
              role="listitem"
            >
              {/* Rank */}
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center',
                  'text-xs font-bold flex-shrink-0'
                )}
                style={{
                  backgroundColor: isTopThree ? 'var(--primary)' : 'var(--hover)',
                  color: isTopThree ? 'var(--primary-foreground)' : 'var(--text-muted)',
                }}
              >
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {region.regionAr}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <TrendIcon className="w-3 h-3" style={{ color: trendColor }} />
                    <span className="text-xs font-medium" style={{ color: trendColor }}>
                      {region.impactScore}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                    {region.projectsCount} مشروع
                  </span>
                  <div className="flex-1">
                    <ProgressBar
                      progress={region.impactScore}
                      height={3}
                      color={
                        region.impactScore >= 90
                          ? '#22C55E'
                          : region.impactScore >= 80
                            ? '#2563EB'
                            : '#F59E0B'
                      }
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
