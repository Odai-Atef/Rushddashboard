# Phase 0 Research: Global Session Expiry Check and Auto Logout

## Research Date
Friday, May 22, 2026

---

## Decision 1: Periodic Token Check Architecture

**Decision**: Use a centralized `useAuthSessionPoller` custom hook, placed at the application root (App shell or auth provider), rather than per-page checks.

**Rationale**:
- Prevents duplicate `setInterval` instances across page navigation or component re-mounts.
- Use `useRef` for the interval ID so cleanup works reliably across re-renders.
- Only start the interval when `isAuthenticated` is true and the current route is protected; pause when the user navigates to a public page, logs out, or the tab is backgrounded.

**Alternatives considered**:
- Route-level loader checks: Rejected because they only run on navigation, not continuously.
- `jwt-decode` client-side `exp` scheduling: Rejected because the app uses HttpOnly cookies (per previous specs), so token content is not readable client-side.
- TanStack Query `refetchInterval`: Rejected to avoid coupling auth polling to data-fetching hooks and minimize boilerplate.

---

## Decision 2: Background Tab / Visibility Handling

**Decision**: Integrate the `document.visibilitychange` API to pause/resume the interval timer.

**Rationale**:
- Avoids unnecessary background polling and battery drain.
- When `document.hidden === true`, pause the interval; resume on visibility return.
- This aligns with React app best practices and does not require third-party libraries.

**Alternatives considered**:
- Idle detection via mouse/keyboard events: Rejected as overkill for this feature.

---

## Decision 3: Cross-Tab Logout Coordination

**Decision**: Use `localStorage` + `storage` event for cross-tab coordination, with a timestamped `logout:inProgress` flag.

**Rationale**:
- Maximum browser compatibility (works back to 2015).
- On expiry detection, write a timestamped flag to `localStorage`.
- All tabs listen for the `storage` event; the active (`document.visibilityState === 'visible'`) tab shows the toast.
- Prevents duplicate logout loops because tabs check the flag timestamp before acting.
- On successful login, clear the flag.

**Alternatives considered**:
- `BroadcastChannel`: Rejected due to Safari support gaps in older versions (though improving).
- `SharedWorker`: Rejected as overkill.

---

## Decision 4: Toast Localization & Single Notification

**Decision**: Auth provider emits a typed "SESSION_EXPIRED" event (via a subscriber/callback pattern) instead of calling a toast library directly.

**Rationale**:
- Keeps auth logic decoupled from UI concerns.
- A dedicated notification listener reads the event and the current locale, then triggers the toast with the correct localized message.
- Ensures only one toast per event via a deduplication token (`hasNotifiedSessionExpired` ref reset on login).

**Alternatives considered**:
- Direct `toastService` injection into auth hook: Rejected as it creates a dependency on UI library internals.

---

## Decision 5: Network Error Handling During Checks

**Decision**: On HTTP 401 / explicit invalid/expired responses → logout. On network errors (timeouts, 5xx, DNS failure) → silently skip this interval and retry on the next 15-second tick.

**Rationale**:
- Prevents false logouts when the user has intermittent connectivity.
- Aligns with spec edge cases (network error ≠ token expired).
- Keeps logic simple and testable.

**Alternatives considered**:
- Retrying immediately inside the timer: Rejected to avoid burst requests.
- Logging a generic warning toast on network errors: Rejected to avoid unnecessary user interruption.

---

## Decision 6: Integration Points

**Decision**: Integrate expiry polling inside the existing authentication provider / context, gated by `isAuthenticated` and route protection status.

**Rationale**:
- The project already uses React Context + hooks for state management (constitution).
- The auth provider owns both the session state and the timer lifecycle.
- Public pages are determined by a whitelist or route guard logic already in place.

