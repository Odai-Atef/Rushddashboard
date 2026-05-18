import { DashboardCard } from './DashboardCard';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { EmptyState } from '../analysis/EmptyState';
import { ErrorState } from '../analysis/ErrorState';
import { useDashboards } from '../../hooks/useDashboards';
import { LayoutDashboard, Plus } from 'lucide-react';

export function DashboardList() {
  const { dashboards, isLoading, error, fetchDashboards } = useDashboards();

  if (isLoading) {
    return <DashboardListSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="تعذر تحميل لوحات المعلومات"
          message={error}
          onRetry={fetchDashboards}
        />
      </div>
    );
  }

  if (dashboards.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={LayoutDashboard}
          title="لا توجد لوحات معلومات"
          description="لم يتم العثور على أي لوحات معلومات متاحة"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">لوحات المعلومات</h1>
          <p className="text-muted-foreground">اختر لوحة معلومات لعرض التحليلات والمؤشرات</p>
        </div>
        <Link to="/dashboard/new">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء لوحة
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dashboards.map((dashboard) => (
          <DashboardCard key={dashboard.id} dashboard={dashboard} />
        ))}
      </div>
    </div>
  );
}

function DashboardListSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
