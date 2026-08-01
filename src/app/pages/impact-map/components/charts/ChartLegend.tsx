/**
 * ChartLegend — Interactive legend for charts
 *
 * Click to show/hide series, hover effects, RTL-friendly.
 */

import { cn } from '@/app/utils/cn';
import { useCallback } from 'react';
import type { LegendItem } from '../../types/charts';

export interface ChartLegendProps {
  items: LegendItem[];
  onToggle?: (index: number) => void;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const ChartLegend = ({
  items,
  onToggle,
  className,
  layout = 'horizontal',
}: ChartLegendProps) => {
  const handleToggle = useCallback(
    (index: number) => {
      onToggle?.(index);
    },
    [onToggle]
  );

  return (
    <div
      className={cn(
        'flex flex-wrap gap-3',
        layout === 'vertical' && 'flex-col gap-2',
        className
      )}
      role="group"
      aria-label="مفتاح الرسم البياني"
    >
      {items.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={() => handleToggle(index)}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
            'text-sm font-medium transition-all duration-150 ease-in-out',
            'hover:bg-[var(--impact-surface-secondary)]',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-[var(--impact-primary)]',
            'min-h-[36px]',
            !item.visible && 'opacity-40'
          )}
          aria-pressed={item.visible}
          aria-label={`${item.label} ${item.visible ? 'مرئي' : 'مخفي'}`}
        >
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              backgroundColor: item.visible ? item.color : 'var(--impact-text-muted)',
              opacity: item.visible ? 1 : 0.3,
            }}
          />
          <span
            className={cn(
              'text-[var(--impact-text-secondary)]',
              !item.visible && 'line-through'
            )}
          >
            {item.label}
          </span>
          {item.value !== undefined && (
            <span className="text-xs text-[var(--impact-text-muted)] font-semibold">
              {typeof item.value === 'number'
                ? item.value.toLocaleString('ar-SA')
                : item.value}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
