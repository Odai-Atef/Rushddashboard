import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getCategories } from '../services/analysis';
import type { AnalysisCategory } from '../types/analysis';

export function useCategories() {
  const [categories, setCategories] = useState<AnalysisCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (hasFetched && categories.length > 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCategories();
      const sorted = [...(response.categories || [])].sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      setCategories(sorted);
      setHasFetched(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في تحميل التصنيفات';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [categories.length, hasFetched]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
  };
}
