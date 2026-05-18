import { DashboardPage } from '../../components/dashboard/DashboardPage';
import { DashboardProvider } from '../../hooks/useDashboardContext';

export function DashboardDetailPage() {
  return (
    <DashboardProvider>
      <DashboardPage />
    </DashboardProvider>
  );
}
