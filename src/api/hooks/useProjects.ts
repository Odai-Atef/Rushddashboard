/**
 * useProjects Hook
 *
 * Manages the project list state: server-side pagination, filtering, search,
 * and parallel enrichment of each project ID returned by the list endpoint.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { projectService, ProjectFilters, ProjectListResponse } from '@/api/services/project-service';
import { Project } from '@/app/pages/project-management/project-types';
import { ApiResponse, ApiError } from '@/api/types';

export interface ProjectsState {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: ProjectFilters;
  pendingFilters: ProjectFilters;
  isLoading: boolean;
  error: string | null;
}

export interface UseProjectsReturn extends ProjectsState {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: Partial<ProjectFilters>) => void;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  refetch: () => Promise<void>;
}

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const getArabicListErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'طلب غير صحيح. يرجى التحقق من معايير البحث والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لعرض المشاريع.';
      case 404:
        return 'لم يتم العثور على البيانات المطلوبة.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
      default:
        return apiError.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
  }

  if ((error as Error)?.name === 'AbortError' || apiError.code === 'TIMEOUT') {
    return 'انتهت مهلة الطلب. يرجى التحقق من الاتصال والمحاولة مرة أخرى.';
  }

  return 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
};

export function useProjects(): UseProjectsReturn {
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    pagination: {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    },
    filters: {},
    pendingFilters: {},
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
    async (filters: ProjectFilters, resetPage: boolean = false) => {
      cleanupRequest();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const requestFilters: ProjectFilters = {
        ...filters,
        page: resetPage ? DEFAULT_PAGE : filters.page ?? DEFAULT_PAGE,
        limit: filters.limit ?? DEFAULT_LIMIT,
      };

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        filters: requestFilters,
        pendingFilters: requestFilters,
      }));

      try {
        const listResponse: ApiResponse<ProjectListResponse> = await projectService.getProjects(
          requestFilters,
          { signal: controller.signal }
        );

        const { data: projects, total, page, limit, totalPages } = listResponse.data;

        if (!isMountedRef.current) return;

        setState((prev) => ({
          ...prev,
          projects,
          pagination: { page, limit, total, totalPages },
          isLoading: false,
        }));
      } catch (error) {
        if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
          return;
        }
        if (!isMountedRef.current) return;

        const message = getArabicListErrorMessage(error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [cleanupRequest]
  );

  const setPage = useCallback(
    (page: number) => {
      const newFilters = { ...state.filters, page };
      setState((prev) => ({ ...prev, filters: newFilters, pendingFilters: newFilters }));
      load(newFilters);
    },
    [state.filters, load]
  );

  const setLimit = useCallback(
    (limit: number) => {
      const newFilters = { ...state.filters, limit, page: DEFAULT_PAGE };
      setState((prev) => ({ ...prev, filters: newFilters, pendingFilters: newFilters }));
      load(newFilters);
    },
    [state.filters, load]
  );

  const setFilters = useCallback((filters: Partial<ProjectFilters>) => {
    setState((prev) => ({
      ...prev,
      pendingFilters: { ...prev.pendingFilters, ...filters },
    }));
  }, []);

  const applyFilters = useCallback(async () => {
    const newFilters = { ...state.pendingFilters, page: DEFAULT_PAGE };
    await load(newFilters, true);
  }, [state.pendingFilters, load]);

  const clearFilters = useCallback(async () => {
    const cleared: ProjectFilters = {
      page: DEFAULT_PAGE,
      limit: state.filters.limit ?? DEFAULT_LIMIT,
    };
    setState((prev) => ({
      ...prev,
      pendingFilters: cleared,
      filters: cleared,
    }));
    await load(cleared);
  }, [state.filters.limit, load]);

  const refetch = useCallback(async () => {
    await load(state.filters);
  }, [state.filters, load]);

  // Initial load.
  useEffect(() => {
    load({});
    return () => {
      isMountedRef.current = false;
      cleanupRequest();
    };
  }, [load, cleanupRequest]);

  return {
    ...state,
    setPage,
    setLimit,
    setFilters,
    applyFilters,
    clearFilters,
    refetch,
  };
}

export default useProjects;
