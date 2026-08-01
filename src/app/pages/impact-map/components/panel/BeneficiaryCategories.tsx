/**
 * BeneficiaryCategories — Right Panel Section 2
 *
 * Small donut chart showing distribution with legend.
 * Categories: Families, Youth, Women, Children, Elderly, Disabled.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { WidgetCard } from '../widgets/WidgetCard';
import type { BeneficiaryCategory } from '../../types/analytics';

export interface BeneficiaryCategoriesProps {
  categories?: BeneficiaryCategory[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_CATEGORIES: BeneficiaryCategory[] = [
  { id: 'cat-families', label: 'Families', labelAr: 'أسر', count: 18500, percentage: 38.3, color: '#2563EB' },
  { id: 'cat-youth', label: 'Youth', labelAr: 'شباب', count: 12100, percentage: 25.1, color: '#22C55E' },
  { id: 'cat-women', label: 'Women', labelAr: 'نساء', count: 8700, percentage: 18.0, color: '#F59E0B' },
  { id: 'cat-children', label: 'Children', labelAr: 'أطفال', count: 6200, percentage: 12.8, color: '#8B5CF6' },
  { id: 'cat-elderly', label: 'Elderly', labelAr: 'مسنين', count: 1850, percentage: 3.8, color: '#EC4899' },
  { id: 'cat-disabled', label: 'Disabled', labelAr: 'ذوي إعاقة', count: 900, percentage: 1.9, color: '#06B6D4' },
];

function DonutChart({ categories }: { categories: BeneficiaryCategory[] }) {
  const total = categories.reduce((sum, c) => sum + c.percentage, 0);
  let currentOffset = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full -rotate-90"
        role="img"
        aria-label="توزيع الفئات المستفيدة"
      >
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--hover)"
          strokeWidth="12"
        />
        {/* Segments */}
        {categories.map((cat) => {
          const segmentLength = (cat.percentage / total) * circumference;
          const dashArray = `${segmentLength} ${circumference - segmentLength}`;
          const offset = -currentOffset;
          currentOffset += segmentLength;

          return (
            <motion.circle
              key={cat.id}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={cat.color}
              strokeWidth="12"
              strokeDasharray={dashArray}
              strokeDashoffset={offset}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: dashArray }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-[var(--text-primary)]">
          48K
        </span>
      </div>
    </div>
  );
}

export function BeneficiaryCategories({
  categories = DEFAULT_CATEGORIES,
  isLoading,
  isError,
  onRetry,
  className,
}: BeneficiaryCategoriesProps) {
  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <WidgetCard
      title="الفئات المستفيدة"
      description="توزيع المستفيدين حسب الفئة"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد بيانات"
      className={className}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Donut Chart */}
        <DonutChart categories={categories} />

        {/* Legend */}
        <div className="w-full space-y-2">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              className={cn(
                'flex items-center justify-between',
                'p-2 rounded-lg',
                'hover:bg-[var(--hover)]/30 transition-colors'
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                />
                <span className="text-sm text-[var(--text-primary)] truncate">
                  {cat.labelAr}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {cat.percentage}%
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {cat.count.toLocaleString('ar-SA')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="w-full pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">إجمالي المستفيدين</span>
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {totalCount.toLocaleString('ar-SA')}
            </span>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
