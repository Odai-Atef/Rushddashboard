/**
 * useEvaluationComments Hook
 *
 * Fetches and manages the evaluation comments map for the assessment page.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EvaluationCommentsMap,
  onboardingService,
} from '@/api/services/onboarding-service';
import { ApiError, ApiResponse } from '@/api/types';

export interface EvaluationCommentsState {
  data: EvaluationCommentsMap;
  isLoading: boolean;
  error: string | null;
}

export interface UseEvaluationCommentsReturn extends EvaluationCommentsState {
  refetch: () => Promise<void>;
}

const getArabicEvaluationCommentsErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'معرف المنظمة غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لعرض تعليقات هذا التقييم.';
      case 404:
        return 'لم يتم العثور على تعليقات التقييم لهذه المنظمة.';
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

export function useEvaluationComments(
  organizationId: string | undefined
): UseEvaluationCommentsReturn {
  const [state, setState] = useState<EvaluationCommentsState>({
    data: {},
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const load = useCallback(async () => {
    if (!organizationId) {
      setState({ data: {}, isLoading: false, error: null });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<{ success: boolean; data: EvaluationCommentsMap }> =
        await onboardingService.getEvaluationComments(organizationId);

      if (!isMountedRef.current) return;

      const commentsMap = response.data?.data ?? {};
      setState({ data: commentsMap, isLoading: false, error: null });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
        return;
      }
      if (!isMountedRef.current) return;

      const message = getArabicEvaluationCommentsErrorMessage(error);
      // Log the error but do not block the assessment UI.
      console.error('[useEvaluationComments] failed to load comments', error);
      setState({ data: {}, isLoading: false, error: message });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [organizationId]);

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

export default useEvaluationComments;
