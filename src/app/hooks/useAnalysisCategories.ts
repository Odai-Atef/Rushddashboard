import { useState, useEffect, useCallback } from 'react';
import { analysisService, Category } from '@/api/services/analysis-service';

export interface UseAnalysisCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Custom hook to fetch and manage AI analysis categories from the backend.
 *
 * - Loads categories on mount via `analysisService.getCategories()`.
 * - Returns loading and error states for graceful UI handling.
 * - Categories are sorted by `sortOrder` ascending.
 * - Provides a `retry()` function to refetch after failures.
 *
 * @example
 * const { categories, isLoading, error, retry } = useAnalysisCategories();
 */
export function useAnalysisCategories(): UseAnalysisCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await analysisService.getCategories();
      if (response.success && Array.isArray(response.data)) {
        const sorted = [...response.data].sort(
          (a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
        );
        setCategories(sorted);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load categories'));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, retry };
}
