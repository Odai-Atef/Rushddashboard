import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { OnboardingStep } from '../context/OnboardingContext';
import { useOnboardingContext } from './useOnboardingContext';

const INFO_STEP_PATH = '/dashboard/onboarding/info';

const STEP_TO_TAB: Record<'registration' | 'documents', string> = {
  registration: 'info',
  documents: 'documents',
};

export function useOnboardingNavigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawUrlOrganizationId = searchParams.get('organizationId');
  const { activeOrganizationId } = useOnboardingContext();
  const urlOrganizationId = rawUrlOrganizationId || null;
  const organizationId = urlOrganizationId ?? activeOrganizationId;

  const buildUrl = useCallback((step: OnboardingStep) => {
    if (step === 'registration' || step === 'documents') {
      const params = new URLSearchParams({ tab: STEP_TO_TAB[step] });
      if (organizationId) {
        params.set('organizationId', organizationId);
      }
      return `${INFO_STEP_PATH}?${params.toString()}`;
    }
    const path = `/dashboard/onboarding/${step}`;
    return organizationId ? `${path}?organizationId=${encodeURIComponent(organizationId)}` : path;
  }, [organizationId]);

  const goToStep = useCallback(
    (step: OnboardingStep, options?: { replace?: boolean }) => {
      const nextUrl = buildUrl(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(nextUrl, { replace: options?.replace });
    },
    [navigate, buildUrl]
  );

  return { goToStep, organizationId, buildUrl };
}
