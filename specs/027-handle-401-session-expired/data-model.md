# Data Model: Handle 401 Session Expired

**Date**: 2026-06-14
**Feature**: Handle 401 Session Expired

## Entities

### UserSession

Represents the authenticated state of a user in the frontend application.

| Attribute | Type | Description |
|-----------|------|-------------|
| token | string | Authentication token stored in `localStorage` under `AUTH_CONFIG.TOKEN_KEY` |
| refreshToken | string | Refresh token stored in `localStorage` under `AUTH_CONFIG.REFRESH_TOKEN_KEY` |
| isAuthenticated | boolean | Derived state from `AuthContext`; true when token exists |

**State Transitions**:

```
[Authenticated] --401 detected--> [Token cleared] --redirect to /auth/login--> [Unauthenticated]
[Unauthenticated] --successful login--> [Authenticated]
```

### LoginRedirectState

Represents the state passed to the login page during a 401 redirect.

| Attribute | Type | Description |
|-----------|------|-------------|
| expired | boolean | Whether the redirect was caused by session expiry (`?expired=true`) |
| redirect | string | The original page URL to return to after re-login (`?redirect=/path`) |

## Validation Rules

- `expired` must be a boolean string (`"true"` or `"false"`); default to `false`.
- `redirect` must be a relative path within the application; external URLs should be rejected to prevent open redirect vulnerabilities.
- If `redirect` is not provided, default destination after login is `/dashboard`.

## Relationships

- `UserSession` is managed by `AuthContext` (React Context in `RootLayout.tsx`).
- `LoginRedirectState` is derived from URL query parameters when `LoginPage` mounts.
- `ApiClient` reads/writes `UserSession.token` via `localStorage` and notifies no one directly; the redirect is handled imperatively via `window.location.href` or React Router's `navigate`.
