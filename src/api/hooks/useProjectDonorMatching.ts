/**
 * useProjectDonorMatching Hook
 *
 * Loads existing donor matches + optionally runs AI donor matching.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { projectService, MatchDonorsResponse } from '@/api/services/project-service';
import { ApiResponse, ApiError } from '@/api/types';
import { toast } from 'sonner';

export interface UseProjectDonorMatchingReturn {
  matchData: MatchDonorsResponse | null;
  isMatching: boolean;
  error: string | null;
  refetch: () => void;
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
  const [trigger, setTrigger] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

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
        // Load existing matches first
        const existingRes = await projectService.getDonorMatches(projectId, undefined, {
          signal: controller.signal,
        });

        // Extract resultId from existing matches first
        const existingPayload = (existingRes.data as any)?.data ?? (existingRes.data as any)?.data?.data ?? (existingRes.data as any);
        const existingDonors = Array.isArray(existingPayload) ? existingPayload : (existingPayload?.donors ?? []);
        let resultId = existingDonors?.[0]?.matchingResultId || existingDonors?.[0]?.resultId || '';
        let donors: any[] = existingDonors;

        // Run AI matching to get fresh results + resultId
        const aiRes: ApiResponse<MatchDonorsResponse> = await projectService.matchDonors(
          projectId,
          undefined,
          { signal: controller.signal }
        );

        // Unwrap the response: apiClient returns { success, data }, and data is the raw API body
        // The raw API body is: { success: true, data: { id, projectId, cached, donors, ... } }
        const apiBody = aiRes.data as any;
        const raw = apiBody?.data ?? apiBody;
        const data: MatchDonorsResponse | null = raw ?? null;

        if (data) {
          // The resultId is in data.id (the matching result ID)
          const aiResultId = data.id || (data as any)?.id || '';
          if (aiResultId) {
            resultId = aiResultId;
          }

          // Merge: existing donors + AI donors, deduplicate by id
          const existingIds = new Set(existingDonors.map((d: any) => d.id));
          const newDonors = (data.donors || []).filter((d) => !existingIds.has(d.id));
          donors = [...existingDonors, ...newDonors];
        }

        if (!cancelled) {
          setMatchData({
            projectId: projectId,
            resultId,
            searchParameters: data?.searchParameters || { keywords: [], fundingAreas: [], locations: [], query: '' },
            donors,
          });
          if (data?.donors?.length) {
            toast.success(`تم العثور على ${data.donors.length} جهات مانحة متطابقة.`);
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
  }, [projectId, trigger]);

  return { matchData, isMatching, error, refetch };
}

export default useProjectDonorMatching;
