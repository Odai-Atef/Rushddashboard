import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { OnboardingStep } from '../context/OnboardingContext';
import { getStepPath } from '../utils/onboarding-guards';
import { useOnboardingContext } from './useOnboardingContext';

export function useOnboardingNavigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawUrlOrganizationId = searchParams.get('organizationId');
  const { activeOrganizationId } = useOnboardingContext();
  const urlOrganizationId = rawUrlOrganizationId || null;
  const organizationId = urlOrganizationId ?? activeOrganizationId;

  const goToStep = useCallback(
    (step: OnboardingStep, options?: { replace?: boolean }) => {
      const path = getStepPath(step);
      const nextUrl = organizationId ? `${path}?organizationId=${encodeURIComponent(organizationId)}` : path;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(nextUrl, { replace: options?.replace });
    },
    [navigate, organizationId]
  );

  return { goToStep, organizationId };
}
