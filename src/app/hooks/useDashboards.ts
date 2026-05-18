import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getDashboards } from '../services/dashboard';
import { useDashboardContext } from './useDashboardContext';
import type { Dashboard } from '../types/dashboard';

export function useDashboards() {
  const {
    dashboards,
    setDashboards,
    isLoadingDashboards,
    setIsLoadingDashboards,
    dashboardsError,
    setDashboardsError,
  } = useDashboardContext();

  const [hasFetched, setHasFetched] = useState(false);

  const fetchDashboards = useCallback(async () => {
    if (hasFetched && dashboards.length > 0) return;

    setIsLoadingDashboards(true);
    setDashboardsError(null);

    try {
      const response = await getDashboards();
      setDashboards(response.dashboards);
      setHasFetched(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في تحميل لوحات المعلومات';
      setDashboardsError(message);
      toast.error(message);
    } finally {
      setIsLoadingDashboards(false);
    }
  }, [dashboards.length, hasFetched, setDashboards, setDashboardsError, setIsLoadingDashboards]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  return {
    dashboards,
    isLoading: isLoadingDashboards,
    error: dashboardsError,
    fetchDashboards,
  };
}
