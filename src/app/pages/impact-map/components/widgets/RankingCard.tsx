/**
 * RankingCard — Ranking Card Component
 *
 * Ranking card with rank number, region/entity name, metrics, trend indicator.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { RegionRanking } from '../../types/analytics';
import { ProgressBar } from './ProgressBar';

export interface RankingCardProps {
  ranking: RegionRanking;
  index?: number;
  maxFunding?: number;
  className?: string;
}

function formatFunding(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return amount.toLocaleString('ar-SA');
}

export function RankingCard({
  ranking,
  index = 0,
  maxFunding,
  className,
}: RankingCardProps) {
  const { rank, regionAr, projects, funding, impactScore, trend } = ranking;
  const isTopThree = rank <= 3;
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? '#22C55E' : '#EF4444';

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl',
        'border border-[var(--border)]',
        'bg-[var(--card)]',
        'transition-all duration-150 ease-out',
        'hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)]',
        className
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: 'easeOut',
      }}
      role="listitem"
      aria-label={`${regionAr}: المرتبة ${rank}`}
    >
      {/* Rank number */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          'text-sm font-bold flex-shrink-0'
        )}
        style={{
          backgroundColor: isTopThree ? 'var(--primary)' : 'var(--hover)',
          color: isTopThree ? 'var(--primary-foreground)' : 'var(--text-muted)',
        }}
      >
        {rank}
      </div>

      {/* Region info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {regionAr}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
            <span className="text-xs font-medium" style={{ color: trendColor }}>
              {impactScore}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span>{projects} مشروع</span>
          <span className="text-[var(--border)]">|,</span>
          <span>{formatFunding(funding)} ر.س.</span>
        </div>

        {/* Impact score bar */}
        <div className="mt-2">
          <ProgressBar
            progress={impactScore}
            height={3}
            color={
              impactScore >= 90
                ? '#22C55E'
                : impactScore >= 80
                  ? '#2563EB'
                  : '#F59E0B'
            }
          />
        </div>
      </div>
    </motion.div>
  );
}
