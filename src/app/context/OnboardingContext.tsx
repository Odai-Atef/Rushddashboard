/**
 * Onboarding context provider.
 *
 * Holds shared onboarding state and hydrates it on mount / when the active
 * organization identifier changes. All onboarding route pages consume this
 * context so they can render independently on direct access.
 */

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AssessmentStatus,
  IsivAssessmentResult,
  Organization,
  OrganizationDocument,
  OrganizationProfileResponse,
  FundingArea,
} from '@/api/services/onboarding-service';
import { onboardingService } from '@/api/services';

export type OnboardingStep =
  | 'landing'
  | 'registration'
  | 'profile'
  | 'assessment'
  | 'documents'
  | 'preloader'
  | 'processing'
  | 'results'
  | 'analysis'
  | 'roadmap'
  | 'decision';

export interface OnboardingContextValue {
  organization: Organization | null;
  profile: OrganizationProfileResponse | null;
  fundingAreas: FundingArea[];
  assessmentStatus: AssessmentStatus | null;
  assessmentResult: IsivAssessmentResult | null;
  documents: OrganizationDocument[];
  isLoading: boolean;
  error: string | null;
  activeOrganizationId: string | null;
  refreshOrganization: () => Promise<void>;
  loadProfile: () => Promise<void>;
  loadFundingAreas: () => Promise<void>;
  loadAssessmentStatus: () => Promise<void>;
  loadAssessmentResult: () => Promise<void>;
  loadDocuments: () => Promise<void>;
  setAssessmentResult: (result: IsivAssessmentResult | null) => void;
  setAssessmentStatus: (status: AssessmentStatus | null) => void;
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(
  null
);

export interface OnboardingProviderProps {
  children: ReactNode;
  organizationId?: string | null;
}

export function OnboardingProvider({
  children,
  organizationId: externalOrganizationId,
}: OnboardingProviderProps) {
  console.log('[OnboardingProvider] init externalOrganizationId:', externalOrganizationId);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<OrganizationProfileResponse | null>(null);
  const [fundingAreas, setFundingAreas] = useState<FundingArea[]>([]);
  const [assessmentStatus, setAssessmentStatusState] = useState<AssessmentStatus | null>(null);
  const [assessmentResult, setAssessmentResultState] = useState<IsivAssessmentResult | null>(null);
  const [documents, setDocuments] = useState<OrganizationDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeOrganizationId = useMemo(() => {
    return externalOrganizationId ?? organization?.id ?? null;
  }, [externalOrganizationId, organization?.id]);

  const resolveOrganization = useCallback(async () => {
    setError(null);

    if (externalOrganizationId) {
      try {
        const res = await onboardingService.getOrganization(externalOrganizationId);
        setOrganization(res.data);
        return res.data;
      } catch (err: any) {
        const message =
          err?.message ||
          `تعذر تحميل المؤسسة المحددة (${externalOrganizationId})`;
        setError(message);
      }
    }

    try {
      const res = await onboardingService.getMyOrganization();
      setOrganization(res.data);
      return res.data;
    } catch (err: any) {
      if (err?.statusCode === 404 || err?.response?.status === 404) {
        // No organization yet - that is fine for registration/landing
        setOrganization(null);
        return null;
      } else {
        const message =
          err?.message || 'تعذر تحميل معلومات المؤسسة. يرجى المحاولة مرة أخرى.';
        setError(message);
      }
    }
    return null;
  }, [externalOrganizationId]);

  const loadProfile = useCallback(async () => {
    const orgId = activeOrganizationId;
    if (!orgId) return;
    try {
      const res = await onboardingService.getProfile(orgId);
      setProfile(res.data);
    } catch (err: any) {
      if (err?.response?.status !== 404 && err?.statusCode !== 404) {
        setError(err?.message || 'تعذر تحميل الملف التعريفي');
      }
    }
  }, [activeOrganizationId]);

  const loadFundingAreas = useCallback(async () => {
    try {
      const res = await onboardingService.getFundingAreas();
      setFundingAreas(res.data || []);
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل مجالات العمل');
    }
  }, []);

  const loadAssessmentStatus = useCallback(async () => {
    const orgId = activeOrganizationId;
    if (!orgId) return null;
    try {
      const res = await onboardingService.getAssessmentStatus(orgId);
      const statusData = (res.data as any)?.data ?? res.data;
      setAssessmentStatusState(statusData);
      return statusData;
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل حالة التقييم');
      throw err;
    }
  }, [activeOrganizationId]);

  const loadAssessmentResult = useCallback(async () => {
    const orgId = activeOrganizationId;
    if (!orgId) return null;
    try {
      const res = await onboardingService.getIsivAssessmentResults(orgId);
      const resultData = (res.data as any)?.data ?? res.data;
      setAssessmentResultState(resultData);
      return resultData;
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل نتائج التقييم');
      throw err;
    }
  }, [activeOrganizationId]);

  const loadDocuments = useCallback(async () => {
    const orgId = activeOrganizationId;
    if (!orgId) return;
    try {
      const res = await onboardingService.getOrganizationDocuments(orgId);
      setDocuments(res.data || []);
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل المستندات');
    }
  }, [activeOrganizationId]);

  const refreshOrganization = useCallback(async () => {
    setIsLoading(true);
    await resolveOrganization();
    setIsLoading(false);
  }, [resolveOrganization]);

  const setAssessmentResult = useCallback((result: IsivAssessmentResult | null) => {
    setAssessmentResultState(result);
  }, []);

  const setAssessmentStatus = useCallback((status: AssessmentStatus | null) => {
    setAssessmentStatusState(status);
  }, []);

  // Initial hydration when the provider mounts or the external id changes
  useEffect(() => {
    let cancelled = false;
    console.log('[OnboardingProvider] hydrate effect triggered');

    const hydrate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[OnboardingProvider] calling resolveOrganization');
        const org = await resolveOrganization();
        console.log('[OnboardingProvider] resolveOrganization done, organization:', org);
        await loadFundingAreas();
        console.log('[OnboardingProvider] loadFundingAreas done');

        // Hydrate assessment status/result so route guards can make accurate decisions
        // without requiring each page to load this independently on refresh.
        if (org?.id) {
          try {
            const status = await loadAssessmentStatus();
            if (status?.status === 'COMPLETED') {
              await loadAssessmentResult();
            }
          } catch (e) {
            // Assessment data may not exist yet; don't block the whole flow.
            console.log('[OnboardingProvider] optional assessment hydration failed', e);
          }
        }
      } catch (e) {
        console.error('[OnboardingProvider] hydrate error', e);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          console.log('[OnboardingProvider] hydration complete, isLoading false');
        }
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [resolveOrganization, loadFundingAreas, loadAssessmentStatus, loadAssessmentResult]);

  const value: OnboardingContextValue = {
    organization,
    profile,
    fundingAreas,
    assessmentStatus,
    assessmentResult,
    documents,
    isLoading,
    error,
    activeOrganizationId,
    refreshOrganization,
    loadProfile,
    loadFundingAreas,
    loadAssessmentStatus,
    loadAssessmentResult,
    loadDocuments,
    setAssessmentResult,
    setAssessmentStatus,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
