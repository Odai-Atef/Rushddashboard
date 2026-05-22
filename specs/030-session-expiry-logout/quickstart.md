# Quick Start Guide

## Feature Context
- **Spec**: `specs/030-session-expiry-logout/spec.md`
- **Plan**: `specs/030-session-expiry-logout/plan.md`
- **Data Model**: `specs/030-session-expiry-logout/data-model.md`

## Running the Application

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```

2. Log in to the application and navigate to any protected page.

3. Open the browser's DevTools → Network tab.

4. Simulate session expiry by either:
   - Deleting the session cookie/token from storage, or
   - Stubbing the auth-check endpoint to return HTTP 401.

5. Observe that:
   - Within 15 seconds, you are logged out and redirected to the login page.
   - A toast appears with the message "Session expired, please login again" (or Arabic if locale is `ar`).

## Testing Cross-Tab Behavior

1. Log in across two browser tabs on the same origin.
2. Trigger expiry in one tab.
3. Verify that only the active/focused tab shows the toast, and both tabs redirect to login.

## Architecture Overview

- **Centralized polling**: `useAuthSessionPoller` custom hook inside the auth provider.
- **Timer lifecycle**: `isAuthenticated && isProtectedRoute` guards `setInterval`.
- **Visibility pause**: `document.visibilitychange` pauses/resumes the interval.
- **Cross-tab sync**: `localStorage` timestamped `logoutSignal` with `storage` event listener.
- **Toast dispatch**: Auth provider emits `SESSION_EXPIRED`; a notification listener renders the localized toast.

