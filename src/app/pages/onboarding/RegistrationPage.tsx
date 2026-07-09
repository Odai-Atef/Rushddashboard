import { Navigate, useSearchParams } from 'react-router';

export function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');

  const target = organizationId
    ? `/dashboard/onboarding/info?tab=info&organizationId=${encodeURIComponent(organizationId)}`
    : '/dashboard/onboarding/info?tab=info';

  return <Navigate to={target} replace />;
}
