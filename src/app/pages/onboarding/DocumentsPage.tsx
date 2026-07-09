import { Navigate, useSearchParams } from 'react-router';

export function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  const from = searchParams.get('from');

  const params = new URLSearchParams({ tab: 'documents' });
  if (organizationId) {
    params.set('organizationId', organizationId);
  }
  if (from) {
    params.set('from', from);
  }

  return <Navigate to={`/dashboard/onboarding/info?${params.toString()}`} replace />;
}
