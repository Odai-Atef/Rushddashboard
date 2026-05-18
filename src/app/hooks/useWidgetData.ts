import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getWidgetData } from '../services/dashboard';
import type { WidgetData } from '../types/dashboard';

export function useWidgetData(
  dashboardId?: string,
  widgetId?: string,
  filters?: Record<string, unknown>
) {
  const [data, setData] = useState<WidgetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWidgetData = useCallback(async () => {
    if (!dashboardId || !widgetId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getWidgetData(dashboardId, widgetId, filters);
      if (!abortController.signal.aborted) {
        setData(response);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : 'فشل في تحميل بيانات العنصر';
      if (!abortController.signal.aborted) {
        setError(message);
        toast.error(message);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [dashboardId, widgetId, filters]);

  useEffect(() => {
    fetchWidgetData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWidgetData]);

  return {
    data,
    isLoading,
    error,
    fetchWidgetData,
  };
}
