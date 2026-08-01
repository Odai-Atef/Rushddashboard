/**
 * BarChartCard — Projects by Sector (Horizontal Bar Chart)
 *
 * Horizontal bars with rounded ends, gradient fill,
 * animated width on render, and value labels.
 */

import { useMemo, useCallback, memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { cn } from '@/app/utils/cn';
import { ExecutiveChartCard } from './ExecutiveChartCard';
import { ChartSkeleton } from './ChartSkeleton';
import { EmptyChartState } from './EmptyChartState';
import { ErrorChartState } from './ErrorChartState';
import { ChartTooltip } from './ChartTooltip';
import type { BarItem } from '../../types/charts';

export interface BarChartCardProps {
  data: BarItem[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
  horizontal?: boolean;
}

const ANIMATION_DURATION = 500;
const GRID_COLOR_LIGHT = '#E5E7EB';
const AXIS_TEXT_LIGHT = '#64748B';

const MemoizedTooltip = memo(ChartTooltip);

export const BarChartCard = ({
  data,
  title = 'المشاريع حسب القطاع',
  description = 'توزيع المشاريع عبر القطاعات المختلفة',
  isLoading,
  isError,
  onRetry,
  className,
  horizontal = true,
}: BarChartCardProps) => {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.label,
        value: d.value,
        category: d.category,
      })),
    [data]
  );

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value)),
    [data]
  );

  const barColors = [
    '#2563EB',
    '#3B82F6',
    '#0EA5E9',
    '#22C55E',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
  ];

  const renderTooltip = useCallback(
    (props: {
      active?: boolean;
      payload?: Array<{
        name: string;
        value: number;
        color: string;
        dataKey?: string;
      }>;
      label?: string;
    }) => {
      if (!props.active || !props.payload?.length) return null;
      return (
        <MemoizedTooltip
          active={props.active}
          payload={props.payload}
          label={props.label}
          formatter={(value) => `${value.toLocaleString('ar-SA')} مشروع`}
        />
      );
    },
    []
  );

  if (isLoading) {
    return (
      <ExecutiveChartCard title={title} description={description} className={className}>
        <ChartSkeleton height="320px" bars={7} />
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
    <ExecutiveChartCard title={title} description={description} className={className}>
      <div className="w-full min-h-[320px]">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            layout={horizontal ? 'vertical' : 'horizontal'}
            margin={{ top: 10, right: 16, left: 16, bottom: 8 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={!horizontal}
              vertical={horizontal}
              stroke={GRID_COLOR_LIGHT}
              className="dark:[stroke:#334155]"
            />

            {horizontal ? (
              <>
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: AXIS_TEXT_LIGHT,
                    fontSize: 12,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  dx={4}
                  className="dark:[&_text]:fill-[#94A3B8]"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#475569',
                    fontSize: 13,
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 500,
                  }}
                  width={110}
                  className="dark:[&_text]:fill-[#CBD5E1]"
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: AXIS_TEXT_LIGHT,
                    fontSize: 12,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  dy={8}
                  className="dark:[&_text]:fill-[#94A3B8]"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: AXIS_TEXT_LIGHT,
                    fontSize: 12,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  dx={-4}
                  className="dark:[&_text]:fill-[#94A3B8]"
                />
              </>
            )}

            <Tooltip content={renderTooltip} />

            <Bar
              dataKey="value"
              name="المشاريع"
              radius={horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
              animationDuration={ANIMATION_DURATION}
              animationEasing="ease-out"
              maxBarSize={horizontal ? 28 : 40}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
              <LabelList
                dataKey="value"
                position={horizontal ? 'right' : 'top'}
                formatter={(value: number) => value.toLocaleString('ar-SA')}
                fill="#475569"
                className="dark:fill-[#CBD5E1]"
                style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ExecutiveChartCard>
  );
};
