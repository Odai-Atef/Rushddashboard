/**
 * Onboarding layout.
 *
 * Wraps every onboarding route page with the shared provider, parses the
 * organizationId query parameter, hydrates state, and enforces step guards.
 */

import { useEffect, useMemo } from 'react';
import {
  Navigate,
  Outlet,
  useSearchParams,
  useLocation,
} from 'react-router';
import { Loader2 } from 'lucide-react';
import { OnboardingProvider, OnboardingStep } from '@/app/context/OnboardingContext';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import {
  evaluateStepGuard,
  getStepPath,
  isValidStep,
} from '@/app/utils/onboarding-guards';

function StepGuardOutlet() {
  console.log('[StepGuardOutlet] render');
  const {
    organization,
    isLoading,
    error,
    activeOrganizationId,
    assessmentStatus,
    assessmentResult,
  } = useOnboardingContext();
  const location = useLocation();
  const step = location.pathname.split('/').filter(Boolean).pop() ?? '';
  console.log('[StepGuardOutlet] step:', step, 'isLoading:', isLoading, 'error:', error, 'activeOrganizationId:', activeOrganizationId, 'orgCurrentStep:', organization?.currentStep);

  const isComingFromResults = new URLSearchParams(location.search).get('from') === 'results';

  const guardResult = useMemo(() => {
    // Allow the documents step when the user is coming from the charity-assessment
    // results page so they can upload missing required documents even if the
    // backend has not advanced currentStep beyond registration yet.
    if (
      step === 'documents' &&
      activeOrganizationId &&
      organization &&
      isComingFromResults
    ) {
      return { allowed: true };
    }

    if (!isValidStep(step ?? '')) {
      return {
        allowed: false,
        redirectTo: 'landing' as OnboardingStep,
        reason: 'الخطوة المطلوبة غير معروفة',
      };
    }

    if (!activeOrganizationId) {
      // No organization resolved; landing/registration are still allowed
      if (step === 'landing' || step === 'registration') {
        return { allowed: true };
      }
      return {
        allowed: false,
        redirectTo: 'landing' as OnboardingStep,
        reason: 'لم يتم تحديد الجمعية',
      };
    }

    const currentStep = (organization?.currentStep ?? 'landing').toLowerCase() as OnboardingStep;
    const assessmentCompleted =
      assessmentStatus?.status === 'COMPLETED' ||
      (!!assessmentResult && Object.keys(assessmentResult).length > 0);
    return evaluateStepGuard(step as OnboardingStep, {
      currentStep,
      assessmentCompleted,
      resultsCompleted: assessmentCompleted,
    });
  }, [step, organization?.currentStep, activeOrganizationId, assessmentStatus, assessmentResult, isComingFromResults, organization]);

  // When the organizationId comes from the URL query param, activeOrganizationId is
  // set immediately while organization is still being resolved. Show the loading state
  // until we have the organization record (or a resolved error) to avoid redirecting
  // to registration based on a missing currentStep.
  const isResolvingOrganization = activeOrganizationId && !organization && !error;
  if (isLoading || isResolvingOrganization) {
    console.log('[StepGuardOutlet] showing loading spinner');
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  console.log('[StepGuardOutlet] not loading, guardResult:', guardResult);

  // After hydration, if we still cannot resolve an organization id and we're not
  // on landing/registration, redirect to landing. The landing page can guide the user forward.
  if (!activeOrganizationId && step !== 'landing' && step !== 'registration') {
    console.log('[StepGuardOutlet] redirecting to landing because no activeOrganizationId');
    return (
      <Navigate
        to={`/dashboard/onboarding/landing${location.search}`}
        replace
      />
    );
  }

    if (!guardResult.allowed && guardResult.redirectTo) {
      console.log('[StepGuardOutlet] guard redirect to', guardResult.redirectTo);
      const targetPath =
        guardResult.redirectTo === 'registration'
          ? '/dashboard/charity-assessment'
          : getStepPath(guardResult.redirectTo);
      return (
        <Navigate
          to={`${targetPath}${location.search}`}
          replace
        />
      );
    }

    // Landing is the only onboarding entry point that auto-redirects when no progress exists.
    // Registration must remain directly accessible so users can always edit/fill it.
    if (
      step === 'landing' &&
      activeOrganizationId &&
      organization &&
      (!organization.currentStep || organization.currentStep.toLowerCase() === 'registration' || organization.currentStep.toLowerCase() === 'landing')
    ) {
      return <Navigate to={`/dashboard/charity-assessment${location.search}`} replace />;
    }

  // Surface hydration errors inside the existing onboarding layout instead of blocking
  if (error && !organization) {
    console.log('[StepGuardOutlet] showing error:', error);
    return (
      <div className="min-h-full flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  console.log('[StepGuardOutlet] rendering Outlet for step:', step);
  return <Outlet />;
}

export function OnboardingLayout() {
  console.log('[OnboardingLayout] render');
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId') || null;
  console.log('[OnboardingLayout] organizationId:', organizationId);

  return (
    <OnboardingProvider organizationId={organizationId}>
      <div className="min-h-full">
        <StepGuardOutlet />
      </div>
    </OnboardingProvider>
  );
}
