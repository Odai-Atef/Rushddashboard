/**
 * useOrganizationInformation Hook
 *
 * Fetches and refetches the automated LLM extraction results for a single
 * organization. Used by the project-manager organization details review page.
 */

import { useCallback, useEffect, useState } from 'react';
import { userService, OrganizationInformation } from '@/api/services/user-service';
import { ApiError } from '@/api/types';

export interface UseOrganizationInformationReturn {
 data: OrganizationInformation | null;
 isLoading: boolean;
 isSyncing: boolean;
 error: string | null;
 refetch: () => Promise<void>;
 sync: () => Promise<void>;
}

const getErrorMessage = (error: unknown): string => {
 const apiError = error as ApiError;
 const status = apiError.statusCode;

 if (status) {
 switch (status) {
 case 401:
 return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
 case 403:
 return 'ليس لديك الصلاحية لعرض بيانات المنظمة.';
 case 404:
 return 'لم يتم العثور على المنظمة.';
 case 500:
 case 502:
 case 503:
 case 504:
 return 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
 default:
 return apiError.message || 'حدث خطأ غير متوقع.';
 }
 }

 return 'لا يمكن الاتصال بالخادم. يرجى التحقق من الاتصال والمحاولة مرة أخرى.';
};

export function useOrganizationInformation(
 organizationId: string | undefined
): UseOrganizationInformationReturn {
 const [data, setData] = useState<OrganizationInformation | null>(null);
 const [isLoading, setIsLoading] = useState(false);
 const [isSyncing, setIsSyncing] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const refetch = useCallback(async () => {
 if (!organizationId) {
 setData(null);
 setError(null);
 return;
 }

 setIsLoading(true);
 setError(null);

 try {
 const response = await userService.getOrganizationInformation(organizationId);
 setData(response.data.data ?? null);
 } catch (err) {
 setError(getErrorMessage(err));
 } finally {
 setIsLoading(false);
 }
 }, [organizationId]);

 const sync = useCallback(async () => {
 if (!organizationId) {
 setError('لا يوجد معرف جهة متاح لتشغيل المزامنة.');
 return;
 }

 setIsSyncing(true);
 setError(null);

 try {
 const response = await userService.triggerOrganizationInformationExtraction(organizationId);
 setData(response.data.data ?? null);
 } catch (err) {
 setError(getErrorMessage(err));
 } finally {
 setIsSyncing(false);
 }
 }, [organizationId]);

 useEffect(() => {
 refetch();
 }, [refetch]);

 return { data, isLoading, isSyncing, error, refetch, sync };
}
