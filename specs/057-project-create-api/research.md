# Research: Project Create API Integration

**Date**: 2026-06-21
**Feature**: specs/057-project-create-api

## Decision: Service + Custom Hook Pattern

- **Decision**: Use a dedicated `ProjectService` class plus a `useProjectCreate` hook.
- **Rationale**: Matches the existing `OnboardingService` + `useOnboardingRegistration` architecture, keeps API calls out of JSX, and centralizes loading/error state.
- **Alternatives considered**: Inline fetch in the page component (rejected — duplicates logic), React Query/TanStack Query (rejected — not already in the dependency tree, adds scope).

## Decision: Reuse Existing `ApiClient.post`

- **Decision**: Add `projectService.createProject(dto)` that delegates to `apiClient.post('/api/v1/projects', dto)`.
- **Rationale**: Auth headers, base URL, 401 redirect, timeout, retry, and error parsing are already handled by `apiClient`.
- **Alternatives considered**: Raw `fetch` (rejected — bypasses interceptors), Axios (rejected — not in dependencies).

## Decision: Minimal Form State Refactor

- **Decision**: Keep the page's local `useState` form state; add a submission handler, loading flag, and inline error display.
- **Rationale**: The spec explicitly says to maintain existing form behavior and layout. We only add persistence and feedback.
- **Alternatives considered**: `react-hook-form` refactor (rejected — out of scope, would change validation/UX timing).

## Decision: Arabic Error Messages

- **Decision**: Translate common API/network error messages to Arabic in the hook, matching `useOnboardingRegistration`.
- **Rationale**: The rest of the page is Arabic; users should receive feedback in the same language.
- **Alternatives considered**: Pass through backend messages (rejected — backend may return English or generic strings).

## Decision: Date Split from Existing `duration` Field

- **Decision**: The existing UI has a single "المدة الزمنية" text field, but the API contract requires `startDate` and `endDate` as strings. The form will split this into start/end date inputs (date pickers or text inputs in `YYYY-MM-DD` / localized format) to satisfy the API contract.
- **Rationale**: The backend contract is fixed. The UI must expose both dates.
- **Alternatives considered**: Parse the free-text duration string (rejected — ambiguous, fragile), keep only duration and omit start/end (rejected — violates API contract).

## Decision: Post-Success Navigation

- **Decision**: On success with a returned project `id`, navigate to `/dashboard/project-management/details/:id`. If the response omits `id`, navigate to `/dashboard/project-management/list` and show a warning.
- **Rationale**: Clarified with the user during `/speckit.clarify`.
- **Alternatives considered**: Always navigate to list (rejected — user wants details-first flow when possible).

## Decision: Required Field Validation

- **Decision**: Do not hard-code required fields in the frontend. Send the form to the API and surface field-level errors returned by the backend. Optionally guard against empty `name` as a minimal client-side sanity check.
- **Rationale**: Clarified with the user during `/speckit.clarify`; validation rules should be driven by the API.
- **Alternatives considered**: Hard-code required fields locally (rejected — duplicates backend rules and risks drift).
