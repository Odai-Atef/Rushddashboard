/**
 * useProjectDiscussions Hook
 *
 * Fetches and manages paginated project discussions.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  collaborationService,
  Discussion,
  DiscussionFilters,
  PaginatedResponse,
} from '@/api/services/collaboration-service';
import { ApiResponse } from '@/api/types';
import { getCollaborationErrorMessage } from '@/app/lib/error-messages';

export interface DiscussionsState {
  discussions: Discussion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: DiscussionFilters;
  isLoading: boolean;
  error: string | null;
}

export interface UseProjectDiscussionsReturn extends DiscussionsState {
  setPage: (page: number) => void;
  setFilters: (filters: Partial<DiscussionFilters>) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

export function useProjectDiscussions(
  projectId: string | undefined
): UseProjectDiscussionsReturn {
  const [state, setState] = useState<DiscussionsState>({
    discussions: [],
    pagination: {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    },
    filters: {},
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const cleanupRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const load = useCallback(
    async (filters: DiscussionFilters, resetPage: boolean = false) => {
      if (!projectId) return;

      cleanupRequest();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const requestFilters: DiscussionFilters = {
        ...filters,
        page: resetPage ? DEFAULT_PAGE : filters.page ?? DEFAULT_PAGE,
        limit: filters.limit ?? DEFAULT_LIMIT,
      };

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        filters: requestFilters,
      }));

      try {
        const response: ApiResponse<PaginatedResponse<Discussion>> =
          await collaborationService.getProjectDiscussions(projectId, requestFilters, {
            signal: controller.signal,
          });

        if (!isMountedRef.current) return;

        const { data: discussions, total, page, limit, totalPages } = response.data;

        setState((prev) => ({
          ...prev,
          discussions,
          pagination: { page, limit, total, totalPages },
          isLoading: false,
        }));
      } catch (error) {
        if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
          return;
        }
        if (!isMountedRef.current) return;

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: getCollaborationErrorMessage(error),
        }));
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [projectId, cleanupRequest]
  );

  const setPage = useCallback(
    (page: number) => {
      const newFilters = { ...state.filters, page };
      setState((prev) => ({ ...prev, filters: newFilters }));
      load(newFilters);
    },
    [state.filters, load]
  );

  const setFilters = useCallback((filters: Partial<DiscussionFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters, page: DEFAULT_PAGE },
    }));
  }, []);

  const applyFilters = useCallback(async () => {
    await load({ ...state.filters, page: DEFAULT_PAGE }, true);
  }, [state.filters, load]);

  const clearFilters = useCallback(async () => {
    const cleared: DiscussionFilters = {
      page: DEFAULT_PAGE,
      limit: state.filters.limit ?? DEFAULT_LIMIT,
    };
    setState((prev) => ({ ...prev, filters: cleared }));
    await load(cleared, true);
  }, [state.filters.limit, load]);

  const refetch = useCallback(async () => {
    await load(state.filters);
  }, [state.filters, load]);

  useEffect(() => {
    load({}, true);
    return () => {
      isMountedRef.current = false;
      cleanupRequest();
    };
  }, [load, cleanupRequest]);

  return {
    ...state,
    setPage,
    setFilters,
    applyFilters,
    clearFilters,
    refetch,
  };
}

export default useProjectDiscussions;
