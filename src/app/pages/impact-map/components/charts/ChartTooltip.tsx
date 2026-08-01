/**
 * ChartTooltip — Custom tooltip for Recharts
 *
 * Modern tooltip with soft shadow, rounded corners, and RTL support.
 */

import { cn } from '@/app/utils/cn';

export interface ChartTooltipPayload {
  name: string;
  value: number;
  color: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
  title?: string;
  formatter?: (value: number, name: string) => string;
  className?: string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  title,
  formatter,
  className,
}: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const formatValue = (value: number, name: string): string => {
    if (formatter) return formatter(value, name);
    return value.toLocaleString('ar-SA');
  };

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 shadow-lg',
        'bg-[var(--impact-surface)] border-[var(--impact-border)]',
        'dark:bg-[var(--impact-main-surface)] dark:border-[var(--impact-border)]',
        'min-w-[180px]',
        className
      )}
      role="tooltip"
    >
      {label && (
        <div className="text-sm font-semibold text-[var(--impact-text-primary)] mb-2 pb-2 border-b border-[var(--impact-divider)]">
          {title || label}
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-[var(--impact-text-secondary)]">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-[var(--impact-text-primary)] tabular-nums">
              {formatValue(entry.value, entry.name)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
