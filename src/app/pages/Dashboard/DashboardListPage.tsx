import { DashboardList } from '../../components/dashboard/DashboardList';
import { DashboardProvider } from '../../hooks/useDashboardContext';

export function DashboardListPage() {
  return (
    <DashboardProvider>
      <DashboardList />
    </DashboardProvider>
  );
}
