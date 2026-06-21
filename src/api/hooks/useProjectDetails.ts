/**
 * useProjectDetails Hook
 *
 * Fetches and manages the state for a single project details view.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { projectService } from '@/api/services/project-service';
import { ProjectDetails } from '@/app/pages/project-management/project-types';
import { ApiResponse, ApiError } from '@/api/types';

export interface ProjectDetailsState {
  project: ProjectDetails | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseProjectDetailsReturn extends ProjectDetailsState {
  refetch: () => Promise<void>;
}

const getArabicDetailsErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'طلب غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لعرض هذا المشروع.';
      case 404:
        return 'لم يتم العثور على المشروع المطلوب.';
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

export function useProjectDetails(projectId: string | undefined): UseProjectDetailsReturn {
  const [state, setState] = useState<ProjectDetailsState>({
    project: null,
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const load = useCallback(async () => {
    if (!projectId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ project: null, isLoading: true, error: null });

    try {
      const response: ApiResponse<ProjectDetails> = await projectService.getProjectById(projectId, {
        signal: controller.signal,
      });

      if (!isMountedRef.current) return;

      setState({ project: response.data, isLoading: false, error: null });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
        return;
      }
      if (!isMountedRef.current) return;

      const message = getArabicDetailsErrorMessage(error);
      setState({ project: null, isLoading: false, error: message });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [projectId]);

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

export default useProjectDetails;
