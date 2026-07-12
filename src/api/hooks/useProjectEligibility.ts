/**
 * useProjectEligibility Hook
 *
 * Fetches whether the current user is allowed to create a new project.
 * This is used by the project creation page to block the form and surface
 * a clear message before the user fills and submits it.
 */

import { useEffect, useRef, useState } from 'react';
import { projectService, ProjectEligibility } from '@/api/services/project-service';
import { ApiResponse } from '@/api/types';

export interface ProjectEligibilityState {
  data: ProjectEligibility | null;
  isLoading: boolean;
  error: string | null;
  reason: ProjectEligibility['reason'] | null;
}

const DEFAULT_INELIGIBLE_MESSAGE = 'لا يمكنك إنشاء مشروع حالياً.';

export function useProjectEligibility(organizationId: string | null | undefined): ProjectEligibilityState {
  const [state, setState] = useState<ProjectEligibilityState>({
    data: null,
    isLoading: true,
    error: null,
    reason: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!organizationId) {
      // Keep loading while waiting for organization to resolve.
      setState({
        data: null,
        isLoading: true,
        error: null,
        reason: null,
      });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const check = async () => {
      try {
        const res: ApiResponse<ProjectEligibility> = await projectService.checkProjectCreationEligibility(
          organizationId,
          { signal: controller.signal }
        );

        // Defensively unwrap the nested { success, data } envelope when present.
        const payload = (res.data as { data?: ProjectEligibility })?.data ?? res.data;
        const eligibility = payload ?? res.data;

        if (!cancelled) {
          const allowed = Boolean(eligibility?.canCreate ?? eligibility?.allowed);
          setState({
            data: eligibility,
            isLoading: false,
            error: allowed ? null : (eligibility?.message || DEFAULT_INELIGIBLE_MESSAGE),
            reason: eligibility?.reason || null,
          });
        }
      } catch (err: any) {
        if (cancelled) return;

        // Swallow deliberate cancellation.
        if ((err as Error)?.name === 'AbortError' && controller.signal.aborted) {
          return;
        }

        const message = err?.message || err?.data?.message || 'تعذر التحقق من إمكانية إنشاء المشروع. يرجى المحاولة مرة أخرى.';
        setState({
          data: null,
          isLoading: false,
          error: message,
          reason: err?.code || err?.data?.code || null,
        });
      }
    };

    check();

    return () => {
      cancelled = true;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      controller.abort();
    };
  }, [organizationId]);

  return state;
}

export default useProjectEligibility;
