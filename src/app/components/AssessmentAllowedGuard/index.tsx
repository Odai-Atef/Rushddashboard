import { ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { onboardingService } from '@/api/services';
import { Loader2 } from 'lucide-react';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';

interface AssessmentAllowedGuardProps {
  children: ReactNode;
}

/**
 * Guard that asks the backend whether the current organization may start or
 * retake the assessment. If the backend denies access (cooldown, already
 * qualified, etc.) the provided message is shown instead of the wrapped page.
 *
 * This guard is intentionally separate from the role-based route guard so the
 * eligibility decision stays centralized in the backend.
 */
export function AssessmentAllowedGuard({ children }: AssessmentAllowedGuardProps) {
  const [searchParams] = useSearchParams();
  const urlOrganizationId = searchParams.get('organizationId');
  const { activeOrganizationId } = useOnboardingContext();
  const organizationId = urlOrganizationId ?? activeOrganizationId;

  const [state, setState] = useState<{
    loading: boolean;
    allowed: boolean;
    message: string | null;
    remainingSeconds: number | null;
  }>({
    loading: true,
    allowed: false,
    message: null,
    remainingSeconds: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!organizationId) {
      setState({
        loading: false,
        allowed: false,
        message: 'معرّف الجهة مطلوب لبدء التقييم.',
        remainingSeconds: null,
      });
      return;
    }

    const check = async () => {
      try {
        const res = await onboardingService.checkAssessmentAllowed(organizationId);
        // The apiClient may wrap the server's { success, data } envelope again,
        // so we unwrap one level when we detect the nested shape.
        const payload = (res.data as any)?.data ?? res.data;
        if (!cancelled) {
          setState({
            loading: false,
            allowed: payload?.allowed ?? false,
            message: payload?.message ?? 'تعذر التحقق من إمكانية بدء التقييم.',
            remainingSeconds: payload?.remainingCooldownSeconds ?? null,
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          const statusCode = err?.statusCode ?? err?.response?.status;
          // If the backend eligibility endpoint is not deployed yet (404), fall
          // back to allowing access so the existing assessment flow keeps working.
          if (statusCode === 404) {
            setState({
              loading: false,
              allowed: true,
              message: null,
              remainingSeconds: null,
            });
          } else {
            setState({
              loading: false,
              allowed: false,
              message: err?.message || 'تعذر الاتصال بالخادم للتحقق من إمكانية التقييم.',
              remainingSeconds: null,
            });
          }
        }
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  if (state.loading) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">جارٍ التحقق من إمكانية بدء التقييم...</p>
        </div>
      </div>
    );
  }

  if (!state.allowed) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
          <h2 className="text-xl font-bold mb-2">لا يمكن بدء التقييم الآن</h2>
          <div
            className="text-gray-600 mb-6"
            dangerouslySetInnerHTML={{ __html: state.message ?? '' }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
