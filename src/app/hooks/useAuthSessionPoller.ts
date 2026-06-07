import { useCallback, useRef } from 'react';
import { getAccessToken } from '../utils/auth';
import {
  SESSION_POLL_INTERVAL_MS,
  setLogoutSignal,
  getLogoutSignal,
  isRecentSignal,
} from '../utils/sessionExpiry';
import { getMe, AuthError } from '../services/auth';

export type SessionStatus = 'valid' | 'expired' | 'error';

export interface AuthSessionPollerOptions {
  onSessionExpired: () => void;
  isAuthenticated: boolean;
  pathname: string;
}

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export function useAuthSessionPoller({
  onSessionExpired,
  isAuthenticated,
  pathname,
}: AuthSessionPollerOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHandlingRef = useRef(false);

  const checkSession = useCallback(async () => {
    if (!isAuthenticated || isPublicRoute(pathname)) {
      return;
    }

    const token = getAccessToken();
    if (!token) {
      if (!isHandlingRef.current) {
        isHandlingRef.current = true;
        onSessionExpired();
      }
      return;
    }

    // Guard: check localStorage signal to avoid duplicate logout loops
    const signal = getLogoutSignal();
    if (signal && isRecentSignal(signal.timestamp)) {
      if (!isHandlingRef.current) {
        isHandlingRef.current = true;
        onSessionExpired();
      }
      return;
    }

    try {
      await getMe();
    } catch (error) {
      if (error instanceof AuthError && (error.statusCode === 401 || error.statusCode === 403)) {
        if (!isHandlingRef.current) {
          isHandlingRef.current = true;
          setLogoutSignal();
          onSessionExpired();
        }
      }
      // On network errors (timeouts, 5xx, DNS failure), silently skip this interval and retry on the next 15-second tick.
    }
  }, [isAuthenticated, pathname, onSessionExpired]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isAuthenticated || isPublicRoute(pathname)) {
      return;
    }
    isHandlingRef.current = false;
    intervalRef.current = setInterval(checkSession, SESSION_POLL_INTERVAL_MS);
  }, [isAuthenticated, pathname, checkSession]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isHandlingRef.current = false;
  }, []);

  return { startPolling, stopPolling };
}
