import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatValue, getTrendColor } from '../../utils/analysis';
import type { MetricItem } from '../../types/analysis';

interface KPICardProps {
  metric: MetricItem;
}

export function KPICard({ metric }: KPICardProps) {
  const trendColor = getTrendColor(undefined, metric.changeType);
  const isPositive = metric.changeType === 'positive';
  const isNegative = metric.changeType === 'negative';

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-muted-foreground text-sm">{metric.labelAr || metric.label}</div>
        {metric.change !== undefined && (
          <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
            {isPositive && <ArrowUpRight className="w-4 h-4" />}
            {isNegative && <ArrowDownRight className="w-4 h-4" />}
            {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
            {metric.change > 0 ? '+' : ''}
            {metric.change}
            {metric.unit === '%' ? '%' : ''}
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold">
        {formatValue(metric.value, undefined, metric.unit)}
        {metric.unit && metric.unit !== '%' && (
          <span className="text-sm text-muted-foreground mr-1">{metric.unit}</span>
        )}
      </div>
    </div>
  );
}
