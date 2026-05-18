import { WidgetRenderer } from './WidgetRenderer';
import type { Widget, FilterValue } from '../../types/dashboard';

interface WidgetGridProps {
  widgets: Widget[];
  dashboardId: string;
  filters?: FilterValue[];
}

export function WidgetGrid({ widgets, dashboardId, filters }: WidgetGridProps) {
  if (widgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        لا توجد عناصر في هذه اللوحة
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="col-span-12"
          style={{
            gridColumn: `span ${Math.min(widget.layout.width, 12)} / span ${Math.min(widget.layout.width, 12)}`,
          }}
        >
          <WidgetRenderer
            widget={widget}
            dashboardId={dashboardId}
            filters={filters}
          />
        </div>
      ))}
    </div>
  );
}
