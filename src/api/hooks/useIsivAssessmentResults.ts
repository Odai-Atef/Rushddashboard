/**
 * useIsivAssessmentResults Hook
 *
 * Fetches and manages the state for ISIV charity assessment results.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { onboardingService, IsivAssessmentResult } from '@/api/services/onboarding-service';
import { ApiResponse, ApiError } from '@/api/types';

export type { IsivAssessmentResult };

export interface IsivAssessmentResultsState {
  data: IsivAssessmentResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseIsivAssessmentResultsReturn extends IsivAssessmentResultsState {
  refetch: () => Promise<void>;
}

const getArabicIsivErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'معرف المنظمة غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لعرض نتائج هذا التقييم.';
      case 404:
        return 'لم يتم العثور على نتائج التقييم لهذه المنظمة.';
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

export function useIsivAssessmentResults(
  organizationId: string | undefined
): UseIsivAssessmentResultsReturn {
  const [state, setState] = useState<IsivAssessmentResultsState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const load = useCallback(async () => {
    if (!organizationId) {
      setState({ data: null, isLoading: false, error: 'معرف المنظمة مطلوب' });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ data: null, isLoading: true, error: null });

    try {
      const response: ApiResponse<IsivAssessmentResult> = await onboardingService.getIsivAssessmentResults(
        organizationId,
        { signal: controller.signal }
      );

      if (!isMountedRef.current) return;

      if (response.data) {
        setState({ data: response.data, isLoading: false, error: null });
      } else {
        setState({ data: null, isLoading: false, error: 'لا توجد نتائج' });
      }
    } catch (error) {
      if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
        return;
      }
      if (!isMountedRef.current) return;

      const message = getArabicIsivErrorMessage(error);
      setState({ data: null, isLoading: false, error: message });
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

export default useIsivAssessmentResults;
