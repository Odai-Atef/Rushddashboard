import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getCategories } from '../services/analysis';
import { useAnalysisContext } from './useAnalysisContext';
import type { AnalysisCategory } from '../types/analysis';

export function useCategories() {
  const {
    categories,
    setCategories,
    isLoadingCategories,
    setIsLoadingCategories,
    categoriesError,
    setCategoriesError,
  } = useAnalysisContext();

  const [hasFetched, setHasFetched] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (hasFetched && categories.length > 0) return;

    setIsLoadingCategories(true);
    setCategoriesError(null);

    try {
      const response = await getCategories();
      setCategories(response.categories);
      setHasFetched(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في تحميل التصنيفات';
      setCategoriesError(message);
      toast.error(message);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [categories.length, hasFetched, setCategories, setCategoriesError, setIsLoadingCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    fetchCategories,
  };
}
