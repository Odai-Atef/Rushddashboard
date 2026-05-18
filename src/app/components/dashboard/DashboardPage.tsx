import { useParams } from 'react-router';
import { useDashboard } from '../../hooks/useDashboard';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { WidgetGrid } from './WidgetGrid';
import { DashboardFilters } from './DashboardFilters';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { ErrorState } from '../analysis/ErrorState';
import { EmptyState } from '../analysis/EmptyState';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { dashboard, widgets, isLoading, error, fetchDashboard } = useDashboard(id);
  const { activeFilters } = useDashboardContext();

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="تعذر تحميل لوحة المعلومات"
          message={error}
          onRetry={fetchDashboard}
        />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <EmptyState
          icon={LayoutDashboard}
          title="لوحة المعلومات غير موجودة"
          description="لم يتم العثور على لوحة المعلومات المطلوبة"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4 ml-1" />
              العودة للقائمة
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-2">{dashboard.nameAr || dashboard.name}</h1>
        {dashboard.description && (
          <p className="text-muted-foreground">{dashboard.description}</p>
        )}
      </div>

      {dashboard.filters && dashboard.filters.length > 0 && (
        <div className="mb-6">
          <DashboardFilters filters={dashboard.filters} />
        </div>
      )}

      <WidgetGrid
        widgets={widgets}
        dashboardId={dashboard.id}
        filters={activeFilters}
      />
    </div>
  );
}

function DashboardPageSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />

      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-span-12 md:col-span-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-4 w-48 mb-6" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
