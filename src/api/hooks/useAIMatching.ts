/**
 * useAIMatching Hook
 *
 * Loads the user's projects list and executes AI donor matching
 * for a selected project on demand.
 */

import { useCallback, useRef, useState } from 'react';
import { projectService, MatchDonorsResponse } from '@/api/services/project-service';
import { useProjects } from '@/api/hooks/useProjects';
import { ApiResponse, ApiError } from '@/api/types';
import { toast } from 'sonner';

export interface AIMatchingState {
  selectedProjectId: string | null;
  matchData: MatchDonorsResponse | null;
  isMatching: boolean;
  error: string | null;
}

export interface UseAIMatchingReturn extends AIMatchingState {
  projects: ReturnType<typeof useProjects>['projects'];
  isLoadingProjects: boolean;
  projectError: string | null;
  selectProject: (id: string | null) => void;
  executeMatch: (options?: { searchDepth?: 'basic' | 'advanced'; maxResults?: number }) => Promise<void>;
  clearMatch: () => void;
}

const getArabicMatchError = (error: unknown): string => {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'طلب غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك صلاحية الوصول لهذا المشروع.';
      case 404:
        return 'المشروع غير موجود أو لم يتم العثور عليه.';
      case 422:
        return apiError.message || 'قالب التحليل غير متوفر حالياً.';
      case 500:
      case 502:
      case 503:
      case 504:
        return apiError.message || 'فشل البحث عن الجهات المانحة. يرجى المحاولة لاحقاً.';
      default:
        return apiError.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
  }

  if ((error as Error)?.name === 'AbortError') {
    return 'تم إلغاء الطلب.';
  }

  return 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
};

export function useAIMatching(): UseAIMatchingReturn {
  const { projects, isLoading: isLoadingProjects, error: projectError } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<MatchDonorsResponse | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const selectProject = useCallback((id: string | null) => {
    setSelectedProjectId(id);
    setMatchData(null);
    setError(null);
  }, []);

  const executeMatch = useCallback(
    async (options?: { searchDepth?: 'basic' | 'advanced'; maxResults?: number }) => {
      if (!selectedProjectId) {
        toast.warning('يرجى اختيار مشروع أولاً.');
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsMatching(true);
      setError(null);

      try {
        const res: ApiResponse<MatchDonorsResponse> = await projectService.matchDonors(
          selectedProjectId,
          options,
          { signal: controller.signal }
        );

        // Defensively unwrap nested envelope if present
        const payload = (res.data as { data?: MatchDonorsResponse })?.data ?? res.data;
        const data = payload ?? res.data;

        if (data) {
          setMatchData(data);
          toast.success(`تم العثور على ${data.donors?.length ?? 0} جهات مانحة متطابقة.`);
        } else {
          setError('لم يتم العثور على نتائج.');
        }
      } catch (err: any) {
        if ((err as Error)?.name === 'AbortError' && controller.signal.aborted) {
          return;
        }
        const message = getArabicMatchError(err);
        setError(message);
        toast.error(message);
      } finally {
        setIsMatching(false);
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [selectedProjectId]
  );

  const clearMatch = useCallback(() => {
    setMatchData(null);
    setError(null);
  }, []);

  return {
    projects,
    isLoadingProjects,
    projectError,
    selectedProjectId,
    matchData,
    isMatching,
    error,
    selectProject,
    executeMatch,
    clearMatch,
  };
}

export default useAIMatching;
