/**
 * Onboarding layout.
 *
 * Wraps every onboarding route page with the shared provider and parses the
 * organizationId query parameter. Step guards are intentionally disabled so
 * users can freely navigate between onboarding pages.
 */

import { useSearchParams, Outlet } from 'react-router';
import { OnboardingProvider } from '@/app/context/OnboardingContext';

export function OnboardingLayout() {
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId') || null;

  return (
    <OnboardingProvider organizationId={organizationId}>
      <div className="min-h-full">
        <Outlet />
      </div>
    </OnboardingProvider>
  );
}
