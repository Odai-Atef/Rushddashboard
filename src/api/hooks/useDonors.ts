/**
 * React Query Hook: useDonors
 *
 * Manages donor data fetching with caching, refetching, and loading states.
 * Uses React hooks + Context pattern (no external React Query library dependency).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { donorService } from '../services/donor-service';
import { PaginatedDonorList, Donor } from '../../types/donors';
import { ApiError } from '../types';

interface UseDonorsResult {
  data: Donor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useDonors(page: number = 1, limit: number = 10): UseDonorsResult {
  const [result, setResult] = useState<{
    data: Donor[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    data: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Track the latest request to handle race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDonors = useCallback(async () => {
    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await donorService.getDonors(page, limit);

      // Only update if this request wasn't aborted
      if (!controller.signal.aborted) {
        setResult({
          data: response.data.data,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const apiError = err as ApiError;
        setIsError(true);
        setError(apiError);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [page, limit]);

  useEffect(() => {
    fetchDonors();

    // Cleanup: abort any in-flight request on unmount or param change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDonors]);

  return {
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    isLoading,
    isError,
    error,
    refetch: fetchDonors,
  };
}
