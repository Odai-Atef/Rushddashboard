/**
 * Trend Badge Component
 *
 * Trend indicator badge with arrow icon.
 * Success: green backgrounds, Danger: red backgrounds.
 * Fade animation on render with slight delay.
 */

import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import type { TrendBadgeProps } from '../../types/kpi';

export function TrendBadge({
  percentage,
  direction,
  className,
}: TrendBadgeProps) {
  const isPositive = direction === 'up';
  const absPercentage = Math.abs(percentage);

  return (
    <motion.div
      className={cn(
        // Base styles: small badge, pill shape, padding
        'inline-flex items-center gap-1',
        'px-2 py-1.5 rounded-full',
        'text-xs font-semibold leading-none',
        // Minimum touch target
        'min-h-[28px]',
        // Color variants using semantic tokens
        isPositive
          ? 'bg-[var(--impact-success)]/10 text-[var(--impact-success)] dark:bg-[var(--impact-success)]/20 dark:text-[var(--impact-success)]'
          : 'bg-[var(--impact-danger)]/10 text-[var(--impact-danger)] dark:bg-[var(--impact-danger)]/20 dark:text-[var(--impact-danger)]',
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
      aria-label={
        isPositive
          ? `زيادة بنسبة ${absPercentage}%`
          : `انخفاض بنسبة ${absPercentage}%`
      }
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3" aria-hidden="true" />
      ) : (
        <TrendingDown className="w-3 h-3" aria-hidden="true" />
      )}
      <span>{isPositive ? '+' : ''}{absPercentage}%</span>
    </motion.div>
  );
}
