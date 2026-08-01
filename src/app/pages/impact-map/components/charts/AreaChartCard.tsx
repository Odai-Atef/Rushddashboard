/**
 * AreaChartCard — Funding Growth
 *
 * Area chart with gradient fill, smooth curve,
 * monthly data, and animated appearance.
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
} from 'recharts';
import { cn } from '@/app/utils/cn';
import { ExecutiveChartCard } from './ExecutiveChartCard';
import { ChartSkeleton } from './ChartSkeleton';
import { EmptyChartState } from './EmptyChartState';
import { ErrorChartState } from './ErrorChartState';
import { ChartTooltip } from './ChartTooltip';
import type { FundingMonth } from '../../types/charts';

export interface AreaChartCardProps {
  data: FundingMonth[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const ANIMATION_DURATION = 700;
const GRID_COLOR_LIGHT = '#E5E7EB';
const AXIS_TEXT_LIGHT = '#64748B';

const MemoizedTooltip = memo(ChartTooltip);

export const AreaChartCard = ({
  data,
  title = 'نمو التمويل',
  description = 'تطور التمويل على مدار العام',
  isLoading,
  isError,
  onRetry,
  className,
}: AreaChartCardProps) => {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.month,
        value: d.amount,
        cumulative: d.cumulative,
      })),
    [data]
  );

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.amount)),
    [data]
  );

  const yDomain = useMemo(() => [0, Math.ceil(maxValue * 1.15)], [maxValue]);

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
          formatter={(value) => `${value.toFixed(1)} مليون ر.س.`}
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
              <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="60%" stopColor="#2563EB" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
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
              tickFormatter={(v: number) => `${v}`}
              className="dark:[&_text]:fill-[#94A3B8]"
            />

            <Tooltip content={renderTooltip} />

            <Area
              type="monotone"
              dataKey="value"
              name="التمويل الشهري"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#fundingGradient)"
              animationDuration={ANIMATION_DURATION}
              animationEasing="ease-out"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#2563EB',
                strokeWidth: 2,
                stroke: '#FFFFFF',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ExecutiveChartCard>
  );
};
