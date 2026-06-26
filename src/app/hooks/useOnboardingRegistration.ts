/**
 * useOnboardingRegistration Hook
 *
 * Manages organization registration and profile state with backend persistence.
 * Uses JWT-based /me endpoints — no client-side orgId storage.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { onboardingService } from '@/api/services';
import {
  Organization,
  OrganizationRegistration,
  OrganizationProfile,
  OrganizationProfileResponse,
  FundingArea,
} from '@/api/services/onboarding-service';

const AUTO_SAVE_DELAY = 30000; // 30 seconds

export interface OnboardingState {
  organization: Organization | null;
  profile: OrganizationProfileResponse | null;
  fundingAreas: FundingArea[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}

interface UseOnboardingRegistrationReturn {
  // State
  organization: Organization | null;
  profile: OrganizationProfileResponse | null;
  fundingAreas: FundingArea[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;

  // Expose setState for direct client-side validation updates
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;

  // Actions
  loadOrganization: () => Promise<void>;
  saveOrganization: (data: OrganizationRegistration) => Promise<Organization | null>;
  loadProfile: () => Promise<void>;
  createProfile: (data: OrganizationProfile) => Promise<void>;
  loadFundingAreas: () => Promise<void>;
  saveFundingAreas: (fundingAreaIds: string[], customAreas?: { name: string }[]) => Promise<void>;
  clearError: () => void;
  clearFieldError: (field: string) => void;
}

export function useOnboardingRegistration(): UseOnboardingRegistrationReturn {
  const [state, setState] = useState<OnboardingState>({
    organization: null,
    profile: null,
    fundingAreas: [],
    isLoading: false,
    isSaving: false,
    error: null,
    fieldErrors: {},
  });

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdateRef = useRef<Partial<OrganizationRegistration> | null>(null);

  // Set error with Arabic messages
  const setErrorWithArabic = useCallback((error: any) => {
    let message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    const fieldErrors: Record<string, string> = {};

    // Support both axios-style {response:{status,data}} and direct ApiError shape
    const status = error?.response?.status ?? error?.statusCode;
    const data = error?.response?.data ?? error;

    if (status) {
      switch (status) {
        case 401:
          window.location.href = '/auth/login';
          return;
        case 404:
          message = 'لم يتم العثور على البيانات المطلوبة.';
          break;
        case 409:
          message = data?.message || 'رقم الترخيص مستخدم مسبقاً. يرجى استخدام رقم آخر.';
          fieldErrors.licenseNumber = 'رقم الترخيص مستخدم مسبقاً';
          break;
        case 400:
          if (Array.isArray(data?.errors)) {
            const seen = new Set<string>();
            data.errors.forEach((err: { field?: string; message?: string }) => {
              const field = err.field || 'general';
              if (!seen.has(field)) {
                fieldErrors[field] = err.message || 'قيمة غير صحيحة';
                seen.add(field);
              }
            });
            message = 'يرجى تصحيح الأخطاء التالية:';
          } else if (data?.errors && typeof data.errors === 'object') {
            Object.entries(data.errors).forEach(([key, value]) => {
              fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
            });
            message = 'يرجى تصحيح الأخطاء التالية:';
          } else {
            message = data?.message || 'البيانات المدخلة غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.';
          }
          break;
        default:
          message = data?.message || 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
      }
    } else if (error?.request || error?.code === 'TIMEOUT') {
      message = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
    }

    setState((prev) => ({
      ...prev,
      error: message,
      fieldErrors: { ...prev.fieldErrors, ...fieldErrors },
      isLoading: false,
      isSaving: false,
    }));
  }, []);

  // Clear errors
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

  // Load my organization via JWT
  const loadOrganization = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await onboardingService.getMyOrganization();
      setState((prev) => ({
        ...prev,
        organization: response.data,
        isLoading: false,
      }));
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        // No organization yet — show empty form
        setState((prev) => ({ ...prev, isLoading: false }));
      } else {
        setErrorWithArabic(error);
      }
    }
  }, [setErrorWithArabic]);

  // Save (create or update) my organization via JWT
  const saveOrganization = useCallback(
    async (data: OrganizationRegistration): Promise<Organization | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null, fieldErrors: {} }));

      try {
        const response = await onboardingService.saveMyOrganization(data);
        const organization = response.data.org;

        setState((prev) => ({
          ...prev,
          organization,
          isLoading: false,
        }));

        return organization;
      } catch (error) {
        setErrorWithArabic(error);
        throw error;
      }
    },
    [setErrorWithArabic]
  );

  // Debounced auto-save (uses saveOrganization)
  const scheduleAutoSave = useCallback(
    (data: Partial<OrganizationRegistration>) => {
      pendingUpdateRef.current = data;

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        if (pendingUpdateRef.current) {
          // Cast to full DTO for auto-save (partial saves not supported by PUT /me)
          saveOrganization(pendingUpdateRef.current as OrganizationRegistration);
          pendingUpdateRef.current = null;
        }
      }, AUTO_SAVE_DELAY);
    },
    [saveOrganization]
  );

  // Load profile
  const loadProfile = useCallback(async () => {
    const orgId = state.organization?.id;
    if (!orgId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await onboardingService.getProfile(orgId);
      setState((prev) => ({
        ...prev,
        profile: response.data,
        isLoading: false,
      }));
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        setErrorWithArabic(error);
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  }, [state.organization?.id, setErrorWithArabic]);

  // Create profile
  const createProfile = useCallback(
    async (data: OrganizationProfile) => {
      const orgId = state.organization?.id;
      if (!orgId) {
        const message = 'لم يتم العثور على معرف الجهه. يرجى إكمال التسجيل أولاً.';
        setState((prev) => ({
          ...prev,
          error: message,
        }));
        throw new Error(message);
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null, fieldErrors: {} }));

      try {
        // eslint-disable-next-line no-console
        console.log('[createProfile] calling onboardingService.createProfile with orgId:', orgId, 'data:', data);
        const response = await onboardingService.createProfile(orgId, data);
        // eslint-disable-next-line no-console
        console.log('[createProfile] response:', response);
        setState((prev) => ({
          ...prev,
          profile: response.data,
          isLoading: false,
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[createProfile] error:', error);
        setErrorWithArabic(error);
        throw error;
      }
    },
    [state.organization?.id, setErrorWithArabic]
  );

  // Load available funding areas
  const loadFundingAreas = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await onboardingService.getFundingAreas();
      setState((prev) => ({
        ...prev,
        fundingAreas: response.data,
        isLoading: false,
      }));
    } catch (error) {
      setErrorWithArabic(error);
    }
  }, [setErrorWithArabic]);

  // Save funding areas
  const saveFundingAreas = useCallback(
    async (fundingAreaIds: string[], customAreas?: { name: string }[]) => {
      const orgId = state.organization?.id;
      if (!orgId) {
        const message = 'لم يتم العثور على معرف الجهه. يرجى إكمال التسجيل أولاُ.';
        setState((prev) => ({ ...prev, error: message }));
        throw new Error(message);
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await onboardingService.setFundingAreas(orgId, {
          fundingAreaIds,
          customAreas,
        });

        // Update profile with new funding areas
        if (state.profile) {
          setState((prev) => ({
            ...prev,
            profile: {
              ...prev.profile!,
              fundingAreas: response.data.map((fa) => ({
                id: fa.fundingAreaId,
                name: fa.fundingAreaName,
                description: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              })),
            },
            isLoading: false,
          }));
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setErrorWithArabic(error);
        throw error;
      }
    },
    [state.organization?.id, state.profile, setErrorWithArabic]
  );

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    organization: state.organization,
    profile: state.profile,
    fundingAreas: state.fundingAreas,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    fieldErrors: state.fieldErrors,

    // Expose setState for direct validation updates
    setState,

    // Actions
    loadOrganization,
    saveOrganization,
    loadProfile,
    createProfile,
    loadFundingAreas,
    saveFundingAreas,
    clearError,
    clearFieldError,
  };
}

export default useOnboardingRegistration;
