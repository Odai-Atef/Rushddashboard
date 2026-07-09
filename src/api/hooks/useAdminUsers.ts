/**
 * useAdminUsers Hook
 *
 * Manages the paginated list of active users with their organizations and
 * documents for the organization activation page.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  userService,
  AdminUser,
  AdminUserFilters,
  AdminUsersResponse,
} from '@/api/services/user-service';
import { ApiResponse, ApiError } from '@/api/types';

export interface AdminUsersState {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: AdminUserFilters;
  pendingSearch: string;
  isLoading: boolean;
  error: string | null;
}

export interface UseAdminUsersReturn extends AdminUsersState {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  applySearch: () => Promise<void>;
  clearSearch: () => Promise<void>;
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
        return 'ليس لديك الصلاحية لعرض المستخدمين.';
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

export function useAdminUsers(): UseAdminUsersReturn {
  const [state, setState] = useState<AdminUsersState>({
    users: [],
    pagination: {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    },
    filters: {},
    pendingSearch: '',
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
    async (filters: AdminUserFilters, resetPage: boolean = false) => {
      cleanupRequest();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const requestFilters: AdminUserFilters = {
        ...filters,
        page: resetPage ? DEFAULT_PAGE : filters.page ?? DEFAULT_PAGE,
        limit: filters.limit ?? DEFAULT_LIMIT,
      };

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        filters: requestFilters,
        pendingSearch: requestFilters.search ?? '',
      }));

      try {
        const response: ApiResponse<AdminUsersResponse> =
          await userService.getOrganizationsUsers(requestFilters, {
            signal: controller.signal,
          });

        const { data: users, total, page, limit, totalPages } = response.data;

        if (!isMountedRef.current) return;

        setState((prev) => ({
          ...prev,
          users,
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
      setState((prev) => ({ ...prev, filters: newFilters }));
      load(newFilters);
    },
    [state.filters, load]
  );

  const setLimit = useCallback(
    (limit: number) => {
      const newFilters = { ...state.filters, limit, page: DEFAULT_PAGE };
      setState((prev) => ({ ...prev, filters: newFilters }));
      load(newFilters);
    },
    [state.filters, load]
  );

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, pendingSearch: search }));
  }, []);

  const applySearch = useCallback(async () => {
    const newFilters = { ...state.filters, search: state.pendingSearch, page: DEFAULT_PAGE };
    await load(newFilters, true);
  }, [state.filters, state.pendingSearch, load]);

  const clearSearch = useCallback(async () => {
    const cleared: AdminUserFilters = {
      page: DEFAULT_PAGE,
      limit: state.filters.limit ?? DEFAULT_LIMIT,
    };
    setState((prev) => ({
      ...prev,
      filters: cleared,
      pendingSearch: '',
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
    setSearch,
    applySearch,
    clearSearch,
    refetch,
  };
}

export default useAdminUsers;
