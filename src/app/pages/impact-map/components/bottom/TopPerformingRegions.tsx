/**
 * TopPerformingRegions — Bottom Analytics Right Column
 *
 * Ranking cards with rank number, region name, projects count, funding,
 * impact score, mini sparkline (placeholder), trend arrow.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { WidgetCard } from '../widgets/WidgetCard';
import { RankingCard } from '../widgets/RankingCard';
import type { RegionRanking } from '../../types/analytics';

export interface TopPerformingRegionsProps {
  regions?: RegionRanking[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_REGIONS: RegionRanking[] = [
  {
    rank: 1,
    region: 'Riyadh',
    regionAr: 'الرياض',
    projects: 42,
    funding: 285000000,
    impactScore: 94,
    trend: 'up',
  },
  {
    rank: 2,
    region: 'Makkah',
    regionAr: 'مكة المكرمة',
    projects: 28,
    funding: 198000000,
    impactScore: 89,
    trend: 'up',
  },
  {
    rank: 3,
    region: 'Eastern Province',
    regionAr: 'المنطقة الشرقية',
    projects: 24,
    funding: 175000000,
    impactScore: 86,
    trend: 'down',
  },
  {
    rank: 4,
    region: 'Asir',
    regionAr: 'عسير',
    projects: 18,
    funding: 98000000,
    impactScore: 82,
    trend: 'up',
  },
  {
    rank: 5,
    region: 'Madinah',
    regionAr: 'المدينة المنورة',
    projects: 15,
    funding: 72000000,
    impactScore: 78,
    trend: 'up',
  },
];

function MiniSparkline({ trend }: { trend: 'up' | 'down' }) {
  // Simple SVG sparkline placeholder
  const points = trend === 'up' 
    ? '2,18 8,14 14,10 20,6 26,4 32,2' 
    : '2,2 8,6 14,8 20,12 26,16 32,18';
  const color = trend === 'up' ? '#22C55E' : '#EF4444';

  return (
    <svg viewBox="0 0 34 20" className="w-12 h-6" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy={trend === 'up' ? 2 : 18} r="2.5" fill={color} />
    </svg>
  );
}

function EnhancedRankingRow({
  region,
  index,
  maxFunding,
}: {
  region: RegionRanking;
  index: number;
  maxFunding: number;
}) {
  const { rank, regionAr, projects, funding, impactScore, trend } = region;
  const isTopThree = rank <= 3;
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? '#22C55E' : '#EF4444';

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl',
        'border border-[var(--border)]',
        'bg-[var(--card)]',
        'transition-all duration-150 ease-out',
        'hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)]'
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: 'easeOut',
      }}
      role="listitem"
      aria-label={`${regionAr}: المرتبة ${rank}`}
    >
      {/* Rank */}
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center',
          'text-sm font-bold flex-shrink-0'
        )}
        style={{
          backgroundColor: isTopThree ? 'var(--primary)' : 'var(--hover)',
          color: isTopThree ? 'var(--primary-foreground)' : 'var(--text-muted)',
        }}
      >
        {rank}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {regionAr}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <MiniSparkline trend={trend} />
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${trendColor}10`,
              }}
            >
              <TrendIcon className="w-3 h-3" style={{ color: trendColor }} />
              <span className="text-xs font-semibold" style={{ color: trendColor }}>
                {impactScore}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-[var(--text-muted)]">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] opacity-70">
              مشاريع
            </span>
            <span className="font-medium text-[var(--text-primary)]">{projects}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] opacity-70">
              تمويل
            </span>
            <span className="font-medium text-[var(--text-primary)]">
              {(funding / 1_000_000).toFixed(0)}M
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)] opacity-70">
              الأثر
            </span>
            <span className="font-medium text-[var(--text-primary)]">{impactScore}%</span>
          </div>
        </div>

        {/* Funding bar */}
        <div className="mt-2">
          <div
            className="h-1.5 rounded-full overflow-hidden bg-[var(--hover)]"
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor:
                  impactScore >= 90
                    ? '#22C55E'
                    : impactScore >= 80
                      ? '#2563EB'
                      : '#F59E0B',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(funding / maxFunding) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.08 + 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TopPerformingRegions({
  regions = DEFAULT_REGIONS,
  isLoading,
  isError,
  onRetry,
  className,
}: TopPerformingRegionsProps) {
  const maxFunding = Math.max(...regions.map((r) => r.funding));

  return (
    <WidgetCard
      title="أفضل المناطق أداءً"
      description="المناطق حسب التمويل والأثر"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد بيانات"
      className={className}
    >
      <div className="space-y-3" role="list" aria-label="ترتيب المناطق">
        {regions.map((region, index) => (
          <EnhancedRankingRow
            key={region.id ?? region.rank}
            region={region}
            index={index}
            maxFunding={maxFunding}
          />
        ))}
      </div>
    </WidgetCard>
  );
}
