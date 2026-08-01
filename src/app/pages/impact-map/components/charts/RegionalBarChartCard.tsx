/**
 * RegionalBarChartCard — Regional Impact (Vertical Bar Chart)
 *
 * Vertical bar chart for all 13 Saudi regions with
 * project counts, rounded bar tops, and interactive tooltip.
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
} from 'recharts';
import { cn } from '@/app/utils/cn';
import { ExecutiveChartCard } from './ExecutiveChartCard';
import { ChartSkeleton } from './ChartSkeleton';
import { EmptyChartState } from './EmptyChartState';
import { ErrorChartState } from './ErrorChartState';
import { ChartTooltip } from './ChartTooltip';
import type { RegionalData } from '../../types/charts';

export interface RegionalBarChartCardProps {
  data: RegionalData[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

const ANIMATION_DURATION = 500;
const GRID_COLOR_LIGHT = '#E5E7EB';
const AXIS_TEXT_LIGHT = '#64748B';

const MemoizedTooltip = memo(ChartTooltip);

export const RegionalBarChartCard = ({
  data,
  title = 'الأثر الإقليمي',
  description = 'توزيع المشاريع عبر مناطق المملكة',
  isLoading,
  isError,
  onRetry,
  className,
}: RegionalBarChartCardProps) => {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.region,
        value: d.projects,
        beneficiaries: d.beneficiaries,
        funding: d.funding,
      })),
    [data]
  );

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.projects)),
    [data]
  );

  const yDomain = useMemo(() => [0, Math.ceil(maxValue * 1.15)], [maxValue]);

  const barColors = [
    '#2563EB', '#3B82F6', '#0EA5E9', '#22C55E',
    '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6',
    '#EC4899', '#6366F1', '#F97316', '#84CC16', '#06B6D4',
  ];

  const renderTooltip = useCallback(
    (props: {
      active?: boolean;
      payload?: Array<{
        name: string;
        value: number;
        payload?: Record<string, unknown>;
        color: string;
      }>;
      label?: string;
    }) => {
      if (!props.active || !props.payload?.length) return null;
      const entry = props.payload[0];
      const payload = entry.payload as {
        value: number;
        beneficiaries?: number;
        funding?: number;
      };

      return (
        <MemoizedTooltip
          active={props.active}
          payload={[
            { ...entry, name: 'المشاريع' },
            ...(payload.beneficiaries
              ? [{
                  name: 'المستفيدين',
                  value: payload.beneficiaries,
                  color: '#22C55E',
                  dataKey: 'beneficiaries',
                }]
              : []),
            ...(payload.funding
              ? [{
                  name: 'التمويل (مليون ر.س.)',
                  value: payload.funding,
                  color: '#F59E0B',
                  dataKey: 'funding',
                }]
              : []),
          ]}
          label={props.label}
          formatter={(value, name) => {
            if (name === 'التمويل (مليون ر.س.)') return `${value} مليون ر.س.`;
            if (name === 'المستفيدين') return value.toLocaleString('ar-SA');
            return `${value.toLocaleString('ar-SA')} مشروع`;
          }}
        />
      );
    },
    []
  );

  if (isLoading) {
    return (
      <ExecutiveChartCard title={title} description={description} className={className}>
        <ChartSkeleton height="340px" bars={13} />
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
      <div className="w-full min-h-[340px]">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 8, bottom: 8 }}
            barCategoryGap="20%"
          >
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
                fontSize: 11,
                fontFamily: 'Cairo, sans-serif',
              }}
              dy={8}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={70}
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
              className="dark:[&_text]:fill-[#94A3B8]"
            />

            <Tooltip content={renderTooltip} />

            <Bar
              dataKey="value"
              name="المشاريع"
              radius={[8, 8, 0, 0]}
              animationDuration={ANIMATION_DURATION}
              animationEasing="ease-out"
              maxBarSize={36}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                  style={{
                    transition: 'opacity 150ms ease-in-out',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ExecutiveChartCard>
  );
};
