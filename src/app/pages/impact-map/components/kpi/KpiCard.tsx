/**
 * KPI Card Component
 *
 * Premium executive KPI card using design system tokens.
 * Features: gradient background, hover lift, icon, trend badge, animated value.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { KpiIcon } from './KpiIcon';
import { KpiValue } from './KpiValue';
import { TrendBadge } from './TrendBadge';
import type { KpiCardProps } from '../../types/kpi';

export function KpiCard({ data, index = 0, className }: KpiCardProps) {
  const { title, value, formattedValue, description, icon, trendPercentage, trendDirection } = data;

  return (
    <motion.article
      className={cn(
        // Card base: 16px radius, 1px border, soft shadow, 24px padding
        'rounded-[16px] border p-6',
        // Background gradient: Light (#FFFFFF → #F8FAFC), Dark (#0F172A → #16253D)
        'bg-gradient-to-b from-white to-[#F8FAFC]',
        'dark:from-[#0F172A] dark:to-[#16253D]',
        // Border color
        'border-[var(--impact-border)]',
        // Shadow
        'shadow-[var(--impact-shadow-1)]',
        // Hover: translateY(-4px), shadow increase, 200ms transition
        'transition-all duration-200 ease-out',
        'hover:-translate-y-1 hover:shadow-[var(--impact-shadow-2)]',
        // Flex layout
        'flex flex-col',
        // Minimum touch target for interactive area
        'min-h-[160px]',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: 'easeOut',
      }}
      // Accessibility
      role="article"
      aria-label={`بطاقة KPI: ${title}`}
      tabIndex={0}
    >
      {/* Top row: Icon (left) + Trend badge (right) */}
      <div className="flex items-start justify-between mb-5">
        <KpiIcon iconName={icon} />
        <TrendBadge percentage={trendPercentage} direction={trendDirection} />
      </div>

      {/* KPI value */}
      <div className="mt-auto">
        <KpiValue value={value} formattedValue={formattedValue} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-[var(--impact-text-primary)] mt-2 leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-[var(--impact-text-muted)] mt-1 leading-relaxed">
        {description}
      </p>
    </motion.article>
  );
}
