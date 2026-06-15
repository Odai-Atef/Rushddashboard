# Research: Onboarding JWT Organization APIs

**Date**: 2026-06-15
**Feature**: specs/030-onboarding-jwt-org-apis

## Research Topics

### Topic 1 — Confirm no hidden orgId storage

**Task**: Full-text search across `src/` for `orgId`, `sessionStorage`, `localStorage` combinations.

**Finding**: No `orgId` read/write from `sessionStorage` or `localStorage` exists in the current codebase. The only `orgId` references are:
- Derived from React state (`state.organization?.id`) inside `useOnboardingRegistration.ts`.
- Passed as parameters to legacy profile/funding-areas endpoints (`getProfile`, `createProfile`, `setFundingAreas`) which are **out of scope** for this feature.

This satisfies **FR-001** of the spec.

### Topic 2 — Validate existing hook behavior against spec edge cases

**Task**: Review `useOnboardingRegistration.ts` for 401 redirect, 404 handling, retry, network-error preservation.

**Findings**:

| Scenario | Hook Behavior | Spec Requirement | Match |
|----------|---------------|------------------|-------|
| 401 Unauthorized | `setErrorWithArabic` triggers `window.location.href = '/auth/login'` | Redirect to login | ✅ |
| 404 on `loadOrganization` | Catches and sets `isLoading: false` without setting `error` | Show empty form | ✅ |
| Network / Timeout | Caught and surfaced with Arabic message; form state is external React state so survives | Preserve form, show retry | ✅ |
| 400 Validation | Parses `data.errors` array or object and merges into `fieldErrors` | Field-level errors | ✅ |
| 500 Server Error | Falls through to generic connection error message | Show error toast, keep form | ✅ |

### Topic 3 — UI Toast / Error Display Pattern

**Task**: Determine how the app displays user-facing error toasts.

**Finding**: `sonner` 2.0.3 is installed in `package.json`. The hook already returns `error` and `fieldErrors` strings in Arabic. The component can display `error` via `toast.error()` from `sonner`, or inline. No additional toast infrastructure needed.

## Decisions

| Decision | Rationale |
|----------|-----------|
| Re-use existing `useOnboardingRegistration` hook | Already implements `loadOrganization` and `saveOrganization` exactly as spec'd |
| No new dependencies | React state + existing service layer is sufficient; avoids React Query / Zustand bloat |
| Disable auto-save for registration step | Spec says save on Next/Save only; 30s debounce in hook risks incomplete PUTs |
| Keep legacy profile/funding-areas endpoints untouched | Out of scope; only `GET`/`PUT /organizations/me` are in scope |

## Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Introduce React Query / TanStack Query | Overkill for two endpoints; adds dependency and caching complexity not needed |
| Add Zustand or Redux for onboarding state | React local state + existing hook already covers load/save/cache; global store unnecessary |
| Create a new dedicated hook for `/me` endpoints | Duplicates logic already present in `useOnboardingRegistration`; violates DRY |
