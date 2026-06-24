/**
 * Collaboration module error messages
 *
 * Maps common HTTP status codes and network errors to Arabic user-facing strings.
 */

import { ApiError } from '@/api/types';

export function getCollaborationErrorMessage(error: unknown): string {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'طلب غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لعرض بيانات التعاون لهذا المشروع.';
      case 404:
        return 'لم يتم العثور على المشروع أو البيانات المطلوبة.';
      case 408:
        return 'انتهت مهلة الطلب. يرجى التحقق من الاتصال والمحاولة مرة أخرى.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
      default:
        return apiError.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
  }

  if (
    (error as Error)?.name === 'AbortError' ||
    apiError.code === 'TIMEOUT'
  ) {
    return 'انتهت مهلة الطلب. يرجى التحقق من الاتصال والمحاولة مرة أخرى.';
  }

  return 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
}
