import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getInsights } from '../services/analysis';
import { useAnalysisContext } from './useAnalysisContext';
import type { AnalysisOutput } from '../types/analysis';

export function useInsights(categoryId?: string) {
  const {
    filters,
    isLoadingInsights,
    setIsLoadingInsights,
    insightsError,
    setInsightsError,
  } = useAnalysisContext();

  const [insights, setInsights] = useState<AnalysisOutput[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!categoryId) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoadingInsights(true);
    setInsightsError(null);

    try {
      const response = await getInsights(categoryId, filters);
      if (!abortController.signal.aborted) {
        setInsights(response.insights);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : 'فشل في تحميل التوصيات';
      if (!abortController.signal.aborted) {
        setInsightsError(message);
        toast.error(message);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoadingInsights(false);
      }
    }
  }, [categoryId, filters, setInsightsError, setIsLoadingInsights]);

  useEffect(() => {
    fetchInsights();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchInsights]);

  return {
    insights,
    isLoading: isLoadingInsights,
    error: insightsError,
    fetchInsights,
  };
}
