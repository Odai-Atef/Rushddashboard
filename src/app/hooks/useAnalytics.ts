import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getAnalyticsSummary } from '../services/analysis';
import { useAnalysisContext } from './useAnalysisContext';
import type { AnalyticsSummary } from '../types/analysis';

export function useAnalytics(categoryId?: string) {
  const {
    filters,
    isLoadingAnalytics,
    setIsLoadingAnalytics,
    analyticsError,
    setAnalyticsError,
  } = useAnalysisContext();

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!categoryId) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoadingAnalytics(true);
    setAnalyticsError(null);

    try {
      const response = await getAnalyticsSummary(categoryId, filters);
      if (!abortController.signal.aborted) {
        setSummary(response.summary);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : 'فشل في تحميل التحليلات';
      if (!abortController.signal.aborted) {
        setAnalyticsError(message);
        toast.error(message);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoadingAnalytics(false);
      }
    }
  }, [categoryId, filters, setAnalyticsError, setIsLoadingAnalytics]);

  useEffect(() => {
    fetchAnalytics();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnalytics]);

  return {
    summary,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
    fetchAnalytics,
  };
}
