# Research: Session Username Sync

**Date**: 2026-06-08
**Branch**: `035-session-username-sync`

## Context

The feature requires replacing hardcoded user identity strings in the top bar and settings page with live session data. The existing codebase already has:

- `AuthService.getProfile()` returning `ApiResponse<UserProfile>`
- `RootLayout` providing `AuthContext` with `isAuthenticated`, `login`, `logout`
- Static values in `TopBar.tsx` ("أحمد محمد", "ahmed@rushd.ai", "أح")
- Static values in `SettingsPage.tsx` ("أحمد", "محمد", "ahmed@rushd.ai")

## Decisions

| Decision | Rationale |
|----------|-----------|
| Extend `AuthContext` with `user: UserProfile \| null` | Minimal, idiomatic React pattern; avoids prop drilling or new state library |
| Fetch profile on mount (if authenticated) and after login | Covers both page refresh and fresh login flows |
| Reuse existing `authService.getProfile()` | No new service or endpoint constant needed; respects API abstraction layer |
| Split `fullName` on whitespace for settings form | Matches existing two-field layout; zero backend changes |
| Generic fallbacks (`؟`, `المستخدم`) on missing/failed fetch | Preserves UI usability; aligns with resilience acceptance criteria |
| `getInitials` as pure utility | Reusable across `TopBar` and `SettingsPage`; testable and deterministic |

## Alternatives Considered

- **Global state library (Zustand / Redux)**: Rejected. The scope is a single read-only identity propagation; React Context is sufficient and keeps dependencies minimal.
- **Separate `UserContext`**: Rejected. Splitting auth state into two contexts adds complexity without benefit; the user is intrinsically part of the auth domain.
- **Polling / real-time sync**: Rejected. Out of scope per assumptions; data changes infrequently and a manual refresh (re-login) is acceptable.

## Risks

- **Profile fetch failure on mount**: Handled by `catch()` block that silently ignores errors; UI shows fallbacks.
- **User with no `fullName`**: Handled by `getInitials` returning `؟` and name defaulting to `المستخدم`.
- **Long names breaking layout**: Handled by existing CSS constraints (max-width containers, text truncation in dropdowns).
