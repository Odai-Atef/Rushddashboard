import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getDashboard } from '../services/dashboard';
import { useDashboardContext } from './useDashboardContext';
import type { Dashboard, Widget } from '../types/dashboard';

export function useDashboard(dashboardId?: string) {
  const {
    selectedDashboard,
    setSelectedDashboard,
    widgets,
    setWidgets,
    isLoadingDashboard,
    setIsLoadingDashboard,
    dashboardError,
    setDashboardError,
  } = useDashboardContext();

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!dashboardId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoadingDashboard(true);
    setDashboardError(null);

    try {
      const response = await getDashboard(dashboardId);
      if (!abortController.signal.aborted) {
        setSelectedDashboard(response.dashboard);
        setWidgets(response.widgets);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : 'فشل في تحميل لوحة المعلومات';
      if (!abortController.signal.aborted) {
        setDashboardError(message);
        toast.error(message);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoadingDashboard(false);
      }
    }
  }, [dashboardId, setSelectedDashboard, setWidgets, setDashboardError, setIsLoadingDashboard]);

  useEffect(() => {
    fetchDashboard();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDashboard]);

  return {
    dashboard: selectedDashboard,
    widgets,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    fetchDashboard,
  };
}
