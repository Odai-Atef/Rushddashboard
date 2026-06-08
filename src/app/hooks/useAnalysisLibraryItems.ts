import { useState, useEffect, useCallback, useRef } from 'react';
import { analysisService, AnalysisLibraryItem } from '@/api/services/analysis-service';

export interface UseAnalysisLibraryItemsResult {
  items: AnalysisLibraryItem[];
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Custom hook to fetch analysis library items for a given category (or all categories).
 *
 * - When `categoryId` is `'all'`, attempts `getAllLibraryItems()` first.
 *   If that returns 404, falls back to fetching categories and parallel
 *   per-category calls, then merging results.
 * - Filters out inactive items (`isActive === false`).
 * - Sorts results by `sortOrder` ascending.
 * - Cancels stale in-flight requests when `categoryId` changes.
 * - Returns loading/error states for graceful UI handling.
 *
 * @param categoryId - The backend category UUID, or `'all'`.
 *
 * @example
 * const { items, isLoading, error, retry } = useAnalysisLibraryItems(categoryId);
 */
export function useAnalysisLibraryItems(categoryId: string): UseAnalysisLibraryItemsResult {
  const [items, setItems] = useState<AnalysisLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Ref to track the latest AbortController so we can abort stale requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchItems = useCallback(async () => {
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      let data: AnalysisLibraryItem[] = [];

      if (categoryId === 'all') {
        data = await fetchAllItems(abortController.signal);
      } else {
        const response = await analysisService.getLibraryItems(categoryId);
        const payload = response.data;
        const list = Array.isArray(payload)
          ? payload
          : (payload as { data?: AnalysisLibraryItem[] } | undefined)?.data;
        if (response.success && Array.isArray(list)) {
          data = list;
        }
      }

      // Filter active-only and sort ascending by sortOrder
      const processed = data
        .filter((item) => item.isActive)
        .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER));

      if (!abortController.signal.aborted) {
        setItems(processed);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Silently ignore abort errors
        return;
      }
      if (!abortController.signal.aborted) {
        setError(err instanceof Error ? err : new Error('Failed to load analysis items'));
        setItems([]);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [categoryId]);

  const retry = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchItems]);

  return { items, isLoading, error, retry };
}

/**
 * Helper to fetch all items across categories.
 *
 * Tries the aggregated endpoint first. On 404, falls back to
 fetching categories then parallel per-category requests.
 */
async function fetchAllItems(signal: AbortSignal): Promise<AnalysisLibraryItem[]> {
  try {
    const response = await analysisService.getAllLibraryItems();
    const payload = response.data;
    const list = Array.isArray(payload)
      ? payload
      : (payload as { data?: AnalysisLibraryItem[] } | undefined)?.data;
    if (response.success && Array.isArray(list)) {
      return list;
    }
  } catch (err: any) {
    // If the endpoint returns 404 (not-found), fall back to parallel fetching
    if (err?.statusCode === 404 || err?.code === 'NOT_FOUND' || err?.message?.includes('404')) {
      // Continue to fallback below
    } else {
      throw err;
    }
  }

  // Fallback: fetch categories, then parallel per-category calls
  const categoriesResponse = await analysisService.getCategories();
  const categoriesPayload = categoriesResponse.data;
  const categories = Array.isArray(categoriesPayload)
    ? categoriesPayload
    : (categoriesPayload as { data?: { id: string }[] } | undefined)?.data;

  if (!categoriesResponse.success || !Array.isArray(categories) || categories.length === 0) {
    return [];
  }

  const results = await Promise.all(
    categories.map(async (cat) => {
      try {
        const res = await analysisService.getLibraryItems(cat.id);
        const payload = res.data;
        const list = Array.isArray(payload)
          ? payload
          : (payload as { data?: AnalysisLibraryItem[] } | undefined)?.data;
        if (res.success && Array.isArray(list)) {
          return list;
        }
        return [] as AnalysisLibraryItem[];
      } catch {
        return [] as AnalysisLibraryItem[];
      }
    })
  );

  const merged = results.flat();

  // Deduplicate by id just in case
  const seen = new Set<string>();
  const deduped: AnalysisLibraryItem[] = [];
  for (const item of merged) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      deduped.push(item);
    }
  }

  return deduped;
}
