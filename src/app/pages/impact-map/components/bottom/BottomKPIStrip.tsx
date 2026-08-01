/**
 * BottomKPIStrip — Bottom Analytics KPI Strip
 *
 * Responsive KPI strip: Average Project Cost, Average Beneficiaries,
 * Average Duration, Average SROI, Completion Rate.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  Calculator,
  Users,
  CalendarClock,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { WidgetCard } from '../widgets/WidgetCard';
import type { BottomKpiMetric } from '../../types/analytics';

export interface BottomKPIStripProps {
  metrics?: BottomKpiMetric[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_METRICS: BottomKpiMetric[] = [
  {
    id: 'bottom-avg-cost',
    label: 'Average Project Cost',
    labelAr: 'متوسط تكلفة المشروع',
    value: 6150000,
    formattedValue: '٦.١',
    unit: 'M SAR',
    unitAr: 'مليون ر.س.',
    trend: 'down',
    trendValue: 3.2,
    icon: 'Calculator',
  },
  {
    id: 'bottom-avg-beneficiaries',
    label: 'Average Beneficiaries',
    labelAr: 'متوسط المستفيدين',
    value: 340,
    formattedValue: '٣٤٠',
    unit: 'per project',
    unitAr: 'للمشروع',
    trend: 'up',
    trendValue: 7.8,
    icon: 'Users',
  },
  {
    id: 'bottom-avg-duration',
    label: 'Average Duration',
    labelAr: 'متوسط المدة',
    value: 18,
    formattedValue: '١٨',
    unit: 'months',
    unitAr: 'شهر',
    trend: 'down',
    trendValue: 5.1,
    icon: 'CalendarClock',
  },
  {
    id: 'bottom-avg-sroi',
    label: 'Average SROI',
    labelAr: 'متوسط العائد الاجتماعي',
    value: 3.8,
    formattedValue: '٣.٨x',
    trend: 'up',
    trendValue: 4.1,
    icon: 'TrendingUp',
  },
  {
    id: 'bottom-completion-rate',
    label: 'Completion Rate',
    labelAr: 'معدل الإنجاز',
    value: 78,
    formattedValue: '٧٨%',
    trend: 'up',
    trendValue: 6.5,
    icon: 'CheckCircle2',
  },
];

const ICON_MAP: Record<string, typeof Calculator> = {
  Calculator,
  Users,
  CalendarClock,
  TrendingUp,
  CheckCircle2,
};

function AnimatedKpiValue({
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

function KpiStripCard({
  metric,
  index,
}: {
  metric: BottomKpiMetric;
  index: number;
}) {
  const Icon = ICON_MAP[metric.icon] ?? Calculator;
  const isPositive = metric.trend === 'up';

  return (
    <motion.div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-[var(--card)] border border-[var(--border)]',
        'shadow-[var(--shadow-sm)]',
        'transition-all duration-150 ease-out',
        'hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)]',
        'flex-1 min-w-[180px]'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: 'easeOut',
      }}
      role="article"
      aria-label={`${metric.labelAr}: ${metric.formattedValue}`}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
          'bg-[var(--primary)]/10'
        )}
      >
        <Icon className="w-5 h-5 text-[var(--primary)]" />
      </div>

      {/* Value + Label */}
      <div className="min-w-0">
        <AnimatedKpiValue value={metric.value} formattedValue={metric.formattedValue} />
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs text-[var(--text-muted)]">{metric.labelAr}</span>
          {metric.trendValue && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isPositive
                  ? 'rgba(34, 197, 94, 0.10)'
                  : 'rgba(239, 68, 68, 0.10)',
                color: isPositive ? 'var(--impact-success)' : 'var(--impact-danger)',
              }}
            >
              {isPositive ? '+' : ''}{metric.trendValue}%
            </span>
          )}
        </div>
        {metric.unitAr && (
          <span className="text-[10px] text-[var(--text-muted)] opacity-70">
            {metric.unitAr}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function BottomKPIStrip({
  metrics = DEFAULT_METRICS,
  isLoading,
  isError,
  onRetry,
  className,
}: BottomKPIStripProps) {
  return (
    <WidgetCard
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد مؤشرات"
      className={className}
    >
      <div
        className={cn(
          'flex flex-wrap gap-3',
          'md:flex-nowrap md:overflow-x-auto md:pb-1 impact-scrollbar'
        )}
        role="region"
        aria-label="مؤشرات الأداء السفلية"
      >
        {metrics.map((metric, index) => (
          <KpiStripCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>
    </WidgetCard>
  );
}
