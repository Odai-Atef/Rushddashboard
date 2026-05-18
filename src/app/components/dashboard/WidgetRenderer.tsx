import { KPICard } from '../analysis/KPICard';
import { ChartWidget as AnalysisChartWidget } from '../analysis/ChartWidget';
import { TableWidget } from './widgets/TableWidget';
import { UnknownWidget } from './widgets/UnknownWidget';
import { useWidgetData } from '../../hooks/useWidgetData';
import { Skeleton } from '../ui/skeleton';
import { ErrorState } from '../analysis/ErrorState';
import type { Widget, FilterValue } from '../../types/dashboard';

interface WidgetRendererProps {
  widget: Widget;
  dashboardId: string;
  filters?: FilterValue[];
}

export function WidgetRenderer({ widget, dashboardId, filters }: WidgetRendererProps) {
  const { data, isLoading, error, fetchWidgetData } = useWidgetData(
    dashboardId,
    widget.id,
    filters ? Object.fromEntries(filters.map((f) => [f.filterId, f.value])) : undefined
  );

  if (isLoading) {
    return <WidgetSkeleton widget={widget} />;
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 h-full">
        <ErrorState
          title={`خطأ في تحميل ${widget.titleAr}`}
          message={error}
          onRetry={fetchWidgetData}
        />
      </div>
    );
  }

  switch (widget.type) {
    case 'stat': {
      if (!data?.data?.[0]) return null;
      const statData = data.data[0];
      const metric = {
        id: widget.id,
        label: widget.title,
        labelAr: widget.titleAr,
        value: statData.value || 0,
        unit: widget.config?.suffix || '',
        change: statData.change,
        changeType: statData.changeType,
      };
      return <KPICard metric={metric} />;
    }

    case 'line':
    case 'bar':
    case 'pie':
    case 'area': {
      if (!data?.data) return null;
      const chartConfig = {
        id: widget.id,
        type: widget.type,
        title: widget.title,
        titleAr: widget.titleAr,
        subtitle: widget.subtitle,
        data: data.data,
        xAxisKey: widget.config?.xAxisKey || 'x',
        yAxisKeys: widget.config?.yAxisKeys || ['y'],
        colors: widget.config?.colors,
        formatters: widget.config?.formatters,
      };
      return <AnalysisChartWidget config={chartConfig} />;
    }

    case 'table': {
      if (!data?.data) return null;
      return (
        <TableWidget
          data={data.data}
          config={widget.config}
          title={widget.titleAr || widget.title}
          subtitle={widget.subtitle}
        />
      );
    }

    default:
      return <UnknownWidget type={widget.type} title={widget.titleAr || widget.title} />;
  }
}

function WidgetSkeleton({ widget }: { widget: Widget }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full">
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
