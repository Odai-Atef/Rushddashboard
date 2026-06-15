# Research: Handle 401 Session Expired

**Date**: 2026-06-14  
**Feature**: Handle 401 Session Expired  
**Purpose**: Resolve technical unknowns and document decisions

---

## Research Topics

### 1. Where to intercept 401 responses in the custom ApiClient

**Decision**: Intercept 401 in `ApiClient.parseError()` and `ApiClient.requestWithRetry()` — specifically, treat 401 as a non-retryable client error (it already is non-retryable), but before throwing, trigger a global redirect handler.

**Rationale**: The `ApiClient` is a singleton and centralizes all HTTP calls. Every service (`authService`, etc.) goes through it. Adding the intercept here ensures 100% coverage without modifying individual service files.

**Alternatives considered**:
- Intercept in each service class individually — rejected because it's error-prone and duplicates logic across N services.
- Use a React hook (`useEffect` polling auth status) — rejected because it can't catch in-flight request failures in real time.

### 2. How to redirect without causing infinite loops or double redirects

**Decision**: Use a `isRedirecting` flag (module-level boolean in `api/client.ts`) that is checked before triggering any redirect. If already redirecting, silently swallow subsequent 401s.

**Rationale**: Prevents race conditions when multiple parallel API calls fail with 401. A module-level flag is the simplest state mechanism for a singleton client.

**Alternatives considered**:
- `sessionStorage` flag — rejected because module-level boolean is simpler and survives only for the page lifetime.
- Redux/Zustand store flag — rejected because the project uses React Context only; adding a store for one flag is overkill.

### 3. How to pass the session-expired message to the LoginPage

**Decision**: Use a query parameter `?expired=true` on the login URL. `LoginPage` reads this via `URLSearchParams` and displays the Arabic message.

**Rationale**: Query parameters are bookmarkable, survive page refreshes, and integrate cleanly with React Router's `useSearchParams`.

**Alternatives considered**:
- React Context state — rejected because after redirect, the component tree unmounts/remounts; context would be lost.
- localStorage flag — rejected because query param is simpler and visible in the URL for debugging.

### 4. How to preserve the intended destination (redirect back after login)

**Decision**: Append current path as `?redirect=/current-path` to `/auth/login`. The `LoginPage` reads this on successful login and navigates there instead of hardcoded `/dashboard`.

**Rationale**: Already clarified in spec (Q1). Aligns with common OAuth/post-login redirect patterns.

**Alternatives considered**:
- `sessionStorage` — rejected per Q1 clarification; query param is simpler.

### 5. Testing approach (NEEDS CLARIFICATION resolution)

**Decision**: Defer adding a new testing framework. Validate via manual integration testing in the browser and existing E2E flows. If a testing framework is introduced later (Vitest, Playwright), add unit tests for the 401 interceptor at that time.

**Rationale**: The project currently has zero test infrastructure. Adding Vitest + React Testing Library + jsdom is a significant scope expansion beyond the user's explicit request. The feature is small and integration-testable via browser DevTools (Network tab → block token → trigger API call).

**Alternatives considered**:
- Add Vitest + @testing-library/react now — rejected to keep scope minimal.
- Add no tests at all — accepted, with manual validation.

---

## Decisions Summary

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Intercept location | `ApiClient` singleton | Centralized, covers all API calls |
| Concurrent 401 handling | Module-level `isRedirecting` flag | Prevents race conditions |
| Message passing | Query param `?expired=true` | Survives redirect, simple |
| Destination preservation | Query param `?redirect=/path` | Standard pattern, clarified by user |
| Token clearing | `apiClient.clearAuthToken()` | Already exists; reuse it |
| Testing | Manual validation (deferred) | No existing test framework |

## References

- React Router v7 docs: `useNavigate`, `useSearchParams`
- Project `src/api/client.ts`: singleton `ApiClient` with `parseError()`, `requestWithRetry()`
- Project `src/app/routes.tsx`: `/auth/login` route at `path: 'login'` under `AuthLayout`
