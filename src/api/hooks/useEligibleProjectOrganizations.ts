/**
 * useEligibleProjectOrganizations Hook
 *
 * Loads the list of organizations that have a valid subscription and remaining
 * project quota. This list is used by project-managers on the create project
 * page to pick which organization to create the project for.
 */

import { useEffect, useRef, useState } from 'react';
import {
  userService,
  EligibleOrganizationForProjectCreation,
} from '@/api/services/user-service';
import { ApiResponse } from '@/api/types';

export interface EligibleProjectOrganizationsState {
  organizations: EligibleOrganizationForProjectCreation[];
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_ERROR = 'تعذر تحميل الجهات المؤهلة لإنشاء مشروع.';

export function useEligibleProjectOrganizations(
  enabled: boolean
): EligibleProjectOrganizationsState {
  const [state, setState] = useState<EligibleProjectOrganizationsState>({
    organizations: [],
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setState({ organizations: [], isLoading: false, error: null });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const load = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const res: ApiResponse<{ data: EligibleOrganizationForProjectCreation[]; total: number }> =
          await userService.getEligibleOrganizationsForProjectCreation({
            signal: controller.signal,
          });

        const payload =
          (res.data as { data?: EligibleOrganizationForProjectCreation[] })?.data ??
          res.data ??
          [];

        if (!cancelled) {
          setState({
            organizations: Array.isArray(payload) ? payload : [],
            isLoading: false,
            error: null,
          });
        }
      } catch (err: any) {
        if (cancelled) return;

        if (err?.name === 'AbortError' && controller.signal.aborted) {
          return;
        }

        const message =
          err?.message || err?.data?.message || DEFAULT_ERROR;
        setState({ organizations: [], isLoading: false, error: message });
      }
    };

    load();

    return () => {
      cancelled = true;
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      controller.abort();
    };
  }, [enabled]);

  return state;
}

export default useEligibleProjectOrganizations;
