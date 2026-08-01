/**
 * ImpactSummaryCard — Right Panel Section 1
 *
 * Large metrics display: Total Projects, Total Funding, Beneficiaries, SROI.
 * Animated counters on first render.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  FolderKanban,
  Banknote,
  Users,
  TrendingUp,
} from 'lucide-react';
import { WidgetCard } from '../widgets/WidgetCard';
import type { SummaryMetric } from '../../types/analytics';

export interface ImpactSummaryCardProps {
  metrics?: SummaryMetric[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_METRICS: SummaryMetric[] = [
  {
    id: 'summary-projects',
    label: 'Total Projects',
    labelAr: 'إجمالي المشاريع',
    value: 142,
    formattedValue: '١٤٢',
    icon: 'FolderKanban',
    trend: 'up',
    trendValue: 12.5,
  },
  {
    id: 'summary-funding',
    label: 'Total Funding',
    labelAr: 'إجمالي التمويل',
    value: 875,
    formattedValue: '٨٧٥ مليون ر.س.',
    icon: 'Banknote',
    trend: 'up',
    trendValue: 8.3,
  },
  {
    id: 'summary-beneficiaries',
    label: 'Beneficiaries',
    labelAr: 'المستفيدين',
    value: 48250,
    formattedValue: '٤٨٬٢٥٠',
    icon: 'Users',
    trend: 'up',
    trendValue: 15.2,
  },
  {
    id: 'summary-sroi',
    label: 'SROI',
    labelAr: 'العائد الاجتماعي',
    value: 3.8,
    formattedValue: '٣.٨x',
    icon: 'TrendingUp',
    trend: 'up',
    trendValue: 4.1,
  },
];

const ICON_MAP: Record<string, typeof FolderKanban> = {
  FolderKanban,
  Banknote,
  Users,
  TrendingUp,
};

function AnimatedMetricValue({
  value,
  formattedValue,
}: {
  value: number;
  formattedValue: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 600;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      className="text-2xl font-bold text-[var(--text-primary)] tabular-nums leading-tight"
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      role="text"
      aria-label={`القيمة: ${formattedValue}`}
    >
      {formattedValue}
    </motion.span>
  );
}

function MetricRow({ metric, index }: { metric: SummaryMetric; index: number }) {
  const Icon = ICON_MAP[metric.icon] ?? FolderKanban;
  const isPositive = metric.trend === 'up';

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl',
        'bg-[var(--hover)]/30',
        'transition-colors duration-150',
        'hover:bg-[var(--hover)]/50'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: 'easeOut',
      }}
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
        <AnimatedMetricValue
          value={metric.value}
          formattedValue={metric.formattedValue}
        />
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--text-muted)]">{metric.labelAr}</span>
          {metric.trendValue && (
            <span
              className={cn(
                'text-[10px] font-semibold px-1.5 py-0.5 rounded-full'
              )}
              style={{
                backgroundColor: isPositive
                  ? 'rgba(34, 197, 94, 0.10)'
                  : 'rgba(239, 68, 68, 0.10)',
                color: isPositive ? '#22C55E' : '#EF4444',
              }}
            >
              {isPositive ? '+' : ''}{metric.trendValue}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ImpactSummaryCard({
  metrics = DEFAULT_METRICS,
  isLoading,
  isError,
  onRetry,
  className,
}: ImpactSummaryCardProps) {
  return (
    <WidgetCard
      title="ملخص الأثر"
      description="مؤشرات الأداء الرئيسية"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد مؤشرات"
      className={className}
    >
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <MetricRow key={metric.id} metric={metric} index={index} />
        ))}
      </div>
    </WidgetCard>
  );
}
