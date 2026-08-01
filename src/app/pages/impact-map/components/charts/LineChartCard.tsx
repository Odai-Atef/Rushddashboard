/**
 * LineChartCard — SROI Trend
 *
 * Line chart with gradient area fill, smooth curves,
 * animated points, and interactive tooltip.
 */

import { useMemo, useCallback, memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/app/utils/cn';
import { ExecutiveChartCard } from './ExecutiveChartCard';
import { ChartSkeleton } from './ChartSkeleton';
import { EmptyChartState } from './EmptyChartState';
import { ErrorChartState } from './ErrorChartState';
import { ChartTooltip } from './ChartTooltip';
import type { TrendPoint } from '../../types/charts';

export interface LineChartCardProps {
  data: TrendPoint[];
  title?: string;
  description?: string;
  showTarget?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const ANIMATION_DURATION = 700;
const GRID_COLOR_LIGHT = '#E5E7EB';
const GRID_COLOR_DARK = '#334155';
const AXIS_TEXT_LIGHT = '#64748B';
const AXIS_TEXT_DARK = '#94A3B8';

const MemoizedTooltip = memo(ChartTooltip);

export const LineChartCard = ({
  data,
  title = 'اتجاه العائد الاجتماعي',
  description = 'تطور مؤشر العائد الاجتماعي على الاستثمار',
  showTarget = true,
  isLoading,
  isError,
  onRetry,
  className,
}: LineChartCardProps) => {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.year,
        value: d.value,
        target: d.target,
      })),
    [data]
  );

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => Math.max(d.value, d.target || 0))),
    [data]
  );

  const yDomain = useMemo(() => [0, Math.ceil(maxValue * 1.2)], [maxValue]);

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
          formatter={(value) => `${value.toFixed(1)}x`}
        />
      );
    },
    []
  );

  if (isLoading) {
    return (
      <ExecutiveChartCard title={title} description={description} className={className}>
        <ChartSkeleton height="300px" />
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
      <div className="w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="sroiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--impact-primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--impact-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={GRID_COLOR_LIGHT}
              className="dark:[stroke:#334155]"
            />

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
              domain={yDomain}
              dx={-4}
              tickFormatter={(v: number) => `${v}x`}
              className="dark:[&_text]:fill-[#94A3B8]"
            />

            <Tooltip content={renderTooltip} />

            <Area
              type="monotone"
              dataKey="value"
              name="العائد الفعلي"
              stroke="var(--impact-primary)"
              strokeWidth={2.5}
              fill="url(#sroiGradient)"
              animationDuration={ANIMATION_DURATION}
              animationEasing="ease-out"
              dot={{
                r: 4,
                fill: '#2563EB',
                strokeWidth: 2,
                stroke: '#FFFFFF',
              }}
              activeDot={{
                r: 6,
                fill: '#2563EB',
                strokeWidth: 3,
                stroke: '#FFFFFF',
              }}
            />

            {showTarget && (
              <Area
                type="monotone"
                dataKey="target"
                name="الهدف"
                stroke="var(--impact-text-muted)"
                strokeWidth={2}
                strokeDasharray="6 4"
                fill="none"
                animationDuration={ANIMATION_DURATION}
                animationEasing="ease-out"
                dot={false}
                activeDot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ExecutiveChartCard>
  );
};
