/**
 * DonutChartCard — Beneficiaries Distribution
 *
 * Donut/pie chart with center percentage, smooth hover,
 * rounded arcs, side legend, and Arabic labels.
 */

import { useMemo, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/app/utils/cn';
import { ExecutiveChartCard } from './ExecutiveChartCard';
import { ChartLegend } from './ChartLegend';
import { ChartSkeleton } from './ChartSkeleton';
import { EmptyChartState } from './EmptyChartState';
import { ErrorChartState } from './ErrorChartState';
import type { PieSlice } from '../../types/charts';

export interface DonutChartCardProps {
  data: PieSlice[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
  centerLabel?: string;
}

const ANIMATION_DURATION = 600;
const INNER_RADIUS = 65;
const OUTER_RADIUS = 95;
const PAD_ANGLE = 2;

export const DonutChartCard = ({
  data,
  title = 'توزيع المستفيدين',
  description = 'تصنيف المستفيدين حسب الفئات',
  isLoading,
  isError,
  onRetry,
  className,
  centerLabel = 'المستفيدون',
}: DonutChartCardProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndices, setActiveIndices] = useState<Set<number>>(
    new Set(data.map((_, i) => i))
  );

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const legendItems = useMemo(
    () =>
      data.map((slice, index) => ({
        label: slice.name,
        color: slice.color,
        value: slice.value,
        visible: activeIndices.has(index),
      })),
    [data, activeIndices]
  );

  const handleToggle = useCallback((index: number) => {
    setActiveIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const filteredData = useMemo(
    () =>
      data.map((d, i) => ({
        ...d,
        opacity: activeIndices.has(i) ? 1 : 0.15,
        scale: hoveredIndex === i ? 1.05 : 1,
      })),
    [data, activeIndices, hoveredIndex]
  );

  if (isLoading) {
    return (
      <ExecutiveChartCard title={title} description={description} className={className}>
        <ChartSkeleton height="320px" />
      </ExecutiveChartCard>
    );
  }

  if (isError) {
    return (
      <ExecutiveChartCard title={title} description={description} className={className}>
        <ErrorChartState onRetry={onRetry} />
      </ExecutiveChartCard>
    );
  }

  if (!data.length) {
    return (
      <ExecutiveChartCard title={title} description={description} className={className}>
        <EmptyChartState />
      </ExecutiveChartCard>
    );
  }

  return (
    <ExecutiveChartCard
      title={title}
      description={description}
      className={className}
    >
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Chart */}
        <div className="relative w-full lg:w-1/2 min-h-[260px]">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={INNER_RADIUS}
                outerRadius={OUTER_RADIUS}
                paddingAngle={PAD_ANGLE}
                cornerRadius={6}
                stroke="none"
                animationBegin={0}
                animationDuration={ANIMATION_DURATION}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={entry.opacity}
                    style={{
                      transform: `scale(${entry.scale})`,
                      transformOrigin: 'center',
                      transition: 'all 150ms ease-in-out',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-[var(--impact-text-primary)] tabular-nums">
              {total.toLocaleString('ar-SA')}%
            </span>
            <span className="text-xs text-[var(--impact-text-muted)] mt-0.5">
              {centerLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2">
          <ChartLegend
            items={legendItems}
            onToggle={handleToggle}
            layout="vertical"
          />
        </div>
      </div>
    </ExecutiveChartCard>
  );
};
