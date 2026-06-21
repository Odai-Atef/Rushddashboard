/**
 * useProjectDashboard Hook
 *
 * Fetches and manages the state for the project dashboard summary.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { projectService, ProjectDashboardData } from '@/api/services/project-service';
import { ApiResponse, ApiError } from '@/api/types';

export interface ProjectDashboardState {
  data: ProjectDashboardData | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseProjectDashboardReturn extends ProjectDashboardState {
  refetch: () => Promise<void>;
}

export function timeAgo(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }
    return formatDistanceToNow(date, { locale: ar, addSuffix: true });
  } catch {
    return timestamp;
  }
}

const getArabicDashboardErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'طلب غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لعرض لوحة المشاريع.';
      case 404:
        return 'لم يتم العثور على بيانات لوحة المشاريع.';
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

export function useProjectDashboard(): UseProjectDashboardReturn {
  const [state, setState] = useState<ProjectDashboardState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const load = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ data: null, isLoading: true, error: null });

    try {
      const response: ApiResponse<ProjectDashboardData> = await projectService.getProjectDashboardSummary({
        signal: controller.signal,
      });

      if (!isMountedRef.current) return;

      setState({ data: response.data, isLoading: false, error: null });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
        return;
      }
      if (!isMountedRef.current) return;

      const message = getArabicDashboardErrorMessage(error);
      setState({ data: null, isLoading: false, error: message });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [load]);

  return {
    ...state,
    refetch: load,
  };
}

export default useProjectDashboard;
