/**
 * QuickStatistics — Right Panel Section 6
 *
 * Responsive 2×2 grid of statistic cards.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  FolderKanban,
  Building2,
  Banknote,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { WidgetCard } from '../widgets/WidgetCard';
import type { QuickStatistic } from '../../types/analytics';

export interface QuickStatisticsProps {
  statistics?: QuickStatistic[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_STATISTICS: QuickStatistic[] = [
  {
    id: 'quick-projects',
    label: 'Projects',
    labelAr: 'المشاريع',
    value: 142,
    formattedValue: '١٤٢',
    icon: 'FolderKanban',
    trend: 'up',
    trendValue: 12.5,
  },
  {
    id: 'quick-orgs',
    label: 'Organizations',
    labelAr: 'المنظمات',
    value: 48,
    formattedValue: '٤٨',
    icon: 'Building2',
    trend: 'up',
    trendValue: 6.7,
  },
  {
    id: 'quick-funding',
    label: 'Funding',
    labelAr: 'التمويل',
    value: 875000000,
    formattedValue: '٨٧٥M ر.س.',
    icon: 'Banknote',
    trend: 'up',
    trendValue: 8.3,
  },
  {
    id: 'quick-beneficiaries',
    label: 'Beneficiaries',
    labelAr: 'المستفيدين',
    value: 48250,
    formattedValue: '٤٨K',
    icon: 'Users',
    trend: 'up',
    trendValue: 15.2,
  },
];

const ICON_MAP: Record<string, typeof FolderKanban> = {
  FolderKanban,
  Building2,
  Banknote,
  Users,
};

function StatCard({ stat, index }: { stat: QuickStatistic; index: number }) {
  const Icon = ICON_MAP[stat.icon] ?? FolderKanban;
  const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = stat.trend === 'up' ? '#22C55E' : '#EF4444';

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl',
        'bg-[var(--card)] border border-[var(--border)]',
        'shadow-[var(--shadow-sm)]',
        'transition-all duration-150 ease-out',
        'hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)]',
        'min-h-[88px]'
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.06,
        ease: 'easeOut',
      }}
      role="article"
      aria-label={`${stat.labelAr}: ${stat.formattedValue}`}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0'
        )}
        style={{
          backgroundColor: 'var(--primary)',
          opacity: 0.1,
        }}
      >
        <Icon className="w-5 h-5 text-[var(--primary)]" />
      </div>

      {/* Value + Label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-[var(--text-primary)] tabular-nums leading-tight">
            {stat.formattedValue}
          </span>
          {stat.trendValue && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <TrendIcon className="w-3 h-3" style={{ color: trendColor }} />
              <span className="text-[10px] font-semibold" style={{ color: trendColor }}>
                {stat.trend === 'up' ? '+' : ''}{stat.trendValue}%
              </span>
            </div>
          )}
        </div>
        <span className="text-xs text-[var(--text-muted)]">{stat.labelAr}</span>
      </div>
    </motion.div>
  );
}

export function QuickStatistics({
  statistics = DEFAULT_STATISTICS,
  isLoading,
  isError,
  onRetry,
  className,
}: QuickStatisticsProps) {
  return (
    <WidgetCard
      title="إحصائيات سريعة"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد إحصائيات"
      className={className}
    >
      <div className="grid grid-cols-2 gap-3">
        {statistics.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>
    </WidgetCard>
  );
}
