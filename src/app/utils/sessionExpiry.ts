export const LOGOUT_SIGNAL_KEY = 'rushd_logout_signal';
export const SESSION_POLL_INTERVAL_MS = 15_000;

export interface LogoutSignal {
  type: 'SESSION_EXPIRED';
  timestamp: number;
  tabId: string;
}

const CURRENT_TAB_ID = crypto.randomUUID
  ? crypto.randomUUID()
  : Math.random().toString(36).substring(2);

export function setLogoutSignal(): void {
  const signal: LogoutSignal = {
    type: 'SESSION_EXPIRED',
    timestamp: Date.now(),
    tabId: CURRENT_TAB_ID,
  };
  localStorage.setItem(LOGOUT_SIGNAL_KEY, JSON.stringify(signal));
}

export function getLogoutSignal(): LogoutSignal | null {
  const raw = localStorage.getItem(LOGOUT_SIGNAL_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LogoutSignal;
  } catch {
    return null;
  }
}

export function clearLogoutSignal(): void {
  localStorage.removeItem(LOGOUT_SIGNAL_KEY);
}

export function isRecentSignal(timestamp: number, windowMs: number = 3000): boolean {
  return Date.now() - timestamp < windowMs;
}

export function getCurrentTabId(): string {
  return CURRENT_TAB_ID;
}
