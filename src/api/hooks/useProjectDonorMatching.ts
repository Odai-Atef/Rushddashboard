/**
 * useProjectDonorMatching Hook
 *
 * Automatically executes AI donor matching for a given project ID on mount.
 */

import { useEffect, useRef, useState } from 'react';
import { projectService, MatchDonorsResponse } from '@/api/services/project-service';
import { ApiResponse, ApiError } from '@/api/types';
import { toast } from 'sonner';

export interface UseProjectDonorMatchingReturn {
  matchData: MatchDonorsResponse | null;
  isMatching: boolean;
  error: string | null;
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

export function useProjectDonorMatching(
  projectId: string | undefined
): UseProjectDonorMatchingReturn {
  const [matchData, setMatchData] = useState<MatchDonorsResponse | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetch = async () => {
      setIsMatching(true);
      setError(null);

      try {
        const res: ApiResponse<MatchDonorsResponse> = await projectService.matchDonors(
          projectId,
          undefined,
          { signal: controller.signal }
        );

        const payload = (res.data as { data?: MatchDonorsResponse })?.data ?? res.data;
        const data = payload ?? res.data;

        if (!cancelled) {
          if (data) {
            setMatchData(data);
            toast.success(`تم العثور على ${data.donors?.length ?? 0} جهات مانحة متطابقة.`);
          } else {
            setError('لم يتم العثور على نتائج.');
          }
        }
      } catch (err: any) {
        if ((err as Error)?.name === 'AbortError' && controller.signal.aborted) {
          return;
        }
        if (!cancelled) {
          const message = getArabicMatchError(err);
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setIsMatching(false);
        }
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    };

    fetch();

    return () => {
      cancelled = true;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      controller.abort();
    };
  }, [projectId]);

  return { matchData, isMatching, error };
}

export default useProjectDonorMatching;
