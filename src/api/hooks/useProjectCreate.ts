/**
 * useProjectCreate Hook
 *
 * Manages the project creation submission state, including loading indicators,
 * Arabic error mapping, and API field-level validation errors.
 */

import { useCallback, useRef, useState } from 'react';
import { projectService, CreateProjectDto, CreatedProjectResponse } from '@/api/services/project-service';
import { ApiResponse, ApiError } from '@/api/types';

export interface ProjectCreateState {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}

export interface UseProjectCreateReturn extends ProjectCreateState {
  create: (data: CreateProjectDto) => Promise<ApiResponse<CreatedProjectResponse>>;
  clearError: () => void;
  clearFieldError: (field: string) => void;
}

const parseFieldErrors = (data: ApiError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  if (Array.isArray(data.errors)) {
    const seen = new Set<string>();
    data.errors.forEach((err) => {
      const field = err.field || 'general';
      if (!seen.has(field)) {
        fieldErrors[field] = err.message || 'قيمة غير صحيحة';
        seen.add(field);
      }
    });
  } else if (data.errors && typeof data.errors === 'object') {
    Object.entries(data.errors).forEach(([key, value]) => {
      fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
    });
  }

  return fieldErrors;
};

const getArabicErrorMessage = (error: unknown): { message: string; fieldErrors: Record<string, string> } => {
  let message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';

  const apiError = error as ApiError;
  const status = apiError.statusCode;
  const data = apiError as ApiError;

  // Extract field-level errors regardless of HTTP status code so they can be
  // displayed next to each input even when the backend returns 403, 422, etc.
  const fieldErrors = parseFieldErrors(data);

  if (status) {
    switch (status) {
      case 400:
      case 403:
      case 422:
        message = Object.keys(fieldErrors).length > 0
          ? 'يرجى تصحيح الأخطاء التالية:'
          : data.message || 'البيانات المدخلة غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.';
        break;
      case 401:
        message = 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
        break;
      case 404:
        message = 'لم يتم العثور على البيانات المطلوبة.';
        break;
      case 409:
        message = data.message || 'يوجد مشروع بنفس البيانات. يرجى استخدام بيانات أخرى.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        message = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
        break;
      default:
        if (status >= 400 && status < 500) {
          message = data.message || 'طلب غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
        } else {
          message = data.message || 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
        }
    }
  } else if ((error as Error)?.name === 'AbortError' || apiError.code === 'TIMEOUT') {
    message = 'انتهت مهلة الطلب. يرجى التحقق من الاتصال والمحاولة مرة أخرى.';
  } else if ((error as Error)?.message?.includes('fetch') || (error as Error)?.message?.includes('network')) {
    message = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
  }

  return { message, fieldErrors };
};

export function useProjectCreate(): UseProjectCreateReturn {
  const [state, setState] = useState<ProjectCreateState>({
    isLoading: false,
    error: null,
    fieldErrors: {},
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setState((prev) => {
      const newFieldErrors = { ...prev.fieldErrors };
      delete newFieldErrors[field];
      return { ...prev, fieldErrors: newFieldErrors };
    });
  }, []);

  const create = useCallback(
    async (data: CreateProjectDto): Promise<ApiResponse<CreatedProjectResponse>> => {
      // Prevent duplicate submissions by ignoring clicks while a request is in flight.
      if (state.isLoading) {
        throw new Error('Request already in progress');
      }

      // Cancel any previous request before starting a new one.
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setState({ isLoading: true, error: null, fieldErrors: {} });

      try {
        const response = await projectService.createProject(data, { signal: controller.signal });
        setState((prev) => ({ ...prev, isLoading: false }));
        return response;
      } catch (error) {
        // Don't update state if the request was deliberately cancelled.
        if ((error as Error)?.name === 'AbortError' && controller.signal.aborted) {
          throw error;
        }

        const { message, fieldErrors } = getArabicErrorMessage(error);

        setState({ isLoading: false, error: message, fieldErrors });
        throw error;
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [state.isLoading]
  );

  return {
    ...state,
    create,
    clearError,
    clearFieldError,
  };
}

export default useProjectCreate;
