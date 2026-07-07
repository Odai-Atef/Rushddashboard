/**
 * useProjectDocuments Hook
 *
 * Fetches and manages the state for a project's documents.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { projectService, ProjectDocument } from '@/api/services/project-service';
import { ApiResponse, ApiError } from '@/api/types';

export interface ProjectDocumentsState {
  documents: ProjectDocument[];
  isLoading: boolean;
  error: string | null;
}

export interface UseProjectDocumentsReturn extends ProjectDocumentsState {
  refetch: () => Promise<void>;
}

const getArabicDocumentsErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'طلب غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لعرض مستندات هذا المشروع.';
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

export function useProjectDocuments(projectId: string | undefined): UseProjectDocumentsReturn {
  const [state, setState] = useState<ProjectDocumentsState>({
    documents: [],
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

    setState({ documents: [], isLoading: true, error: null });

    try {
      const response: ApiResponse<ProjectDocument[]> = await projectService.getProjectDocuments(projectId, {
        signal: controller.signal,
      });

      if (!isMountedRef.current) return;

      const sorted = (response.data || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setState({ documents: sorted, isLoading: false, error: null });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
        return;
      }
      if (!isMountedRef.current) return;

      const message = getArabicDocumentsErrorMessage(error);
      setState({ documents: [], isLoading: false, error: message });
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

export default useProjectDocuments;
