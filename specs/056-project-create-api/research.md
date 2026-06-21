# Research: Project Create API Integration

**Feature**: Project Create API Integration  
**Date**: 2026-06-21  
**Input**: Implementation plan technical context and feature spec

## 1. API Client Pattern

**Decision**: Use the existing `apiClient` singleton in `src/api/client.ts` for the `POST /api/v1/projects` request.

**Rationale**:
- `apiClient` is already used across the codebase (`auth-service.ts`, `onboarding-service.ts`, `dashboard-service.ts`, etc.).
- It provides built-in bearer-token authentication, timeout handling, exponential retry for transient errors, typed `ApiResponse<T>`, and 401 redirect handling.
- Reusing it keeps the feature consistent with existing service modules and avoids introducing a second HTTP pattern.

**Alternatives considered**:
- Raw `fetch` directly inside `ProjectCreatePage.tsx` — rejected because it duplicates auth, timeout, retry, and error parsing logic already present in `apiClient`.
- Third-party HTTP library (axios) — rejected because the project already has a custom client and adding a dependency is unnecessary.

## 2. Project Service Module Pattern

**Decision**: Create `src/api/services/project-service.ts` as a small service class with static DTO/response types, following the pattern in `auth-service.ts` and `dashboard-service.ts`.

**Rationale**:
- Co-locates the endpoint path, request shape, response shape, and calling logic in one file.
- Makes the contract easy to test and update when the backend changes.
- Keeps the React page component focused on UI state rather than API plumbing.

**Alternatives considered**:
- Inline the API call inside the page component — rejected because it mixes concerns and makes the contract harder to maintain.

## 3. Form State Management

**Decision**: Keep the existing local React state in `ProjectCreatePage.tsx` and add `isSubmitting`/`error` state. No form library is introduced for this integration.

**Rationale**:
- The current page already uses controlled components with `useState`.
- Adding a form library (e.g., `react-hook-form`, which is already in dependencies) is possible but not required to satisfy the feature. Keeping the change minimal reduces regression risk.
- Client-side validation can be implemented with simple guard checks before calling the API.

**Alternatives considered**:
- Refactor to `react-hook-form` with zod validation — deferred because the spec requires minimal intrusion and preserving existing behavior; can be revisited in a future refactor.

## 4. Date Format

**Decision**: Use ISO 8601 date strings (`YYYY-MM-DD`) for `startDate` and `endDate`, matching the contract `"string"` type and the existing mock data format (`2026-01-15`).

**Rationale**:
- The provided API contract lists `startDate` and `endDate` as strings.
- Existing project mock data in `project-data.ts` uses `YYYY-MM-DD`.
- HTML date inputs naturally produce `YYYY-MM-DD`, so no conversion is needed.

**Alternatives considered**:
- Full ISO timestamp (`2026-01-15T00:00:00Z`) — rejected because the contract does not specify timestamp semantics and the existing UI uses plain dates.

## 5. Success/Error Feedback Pattern

**Decision**: Use an inline success banner and inline error message near the submit action. Toast notifications via `sonner` are available in dependencies but not globally wired; avoid introducing a new global pattern without explicit UI guidance.

**Rationale**:
- The existing page has no toast infrastructure, and adding one would expand scope.
- Inline messages are sufficient for form submission feedback and match the existing form-centric layout.
- On success, navigate to `/dashboard/project-management/list` (consistent with current cancel/back navigation) and show a brief success state before navigation if desired.

**Alternatives considered**:
- Global toast via `sonner` — deferred to avoid scope creep and global UI changes.
- Redirect to the new project details page — rejected because the API contract does not confirm an `id` is returned, and the project list is a safe, existing target.

## 6. Required Fields

**Decision**: Treat all fields in the API contract as required for submission: `name`, `type`, `category`, `description`, `budget`, `currencyCode`, `startDate`, `endDate`, `beneficiaries`, `geographicScope`, `managerId`, `organizationId`.

**Rationale**:
- The contract does not mark any field optional.
- The existing form already marks several fields with `*`.
- Missing values should be blocked client-side before the API call to avoid a round trip.

**Alternatives considered**:
- Let the API validate all required fields — rejected because the spec explicitly calls for client-side required validation (FR-004).

## 7. Field Mapping

**Decision**: Add two new fields to the create page UI (`startDate` and `endDate`) because they exist in the API contract but are not currently present in the form.

**Rationale**:
- The existing `ProjectCreatePage.tsx` collects `name`, `type`, `organization`, `category`, `description`, `beneficiaries`, `geographicScope`, `budget`, and `duration`.
- The API contract requires `startDate` and `endDate` instead of a single `duration` string.
- `managerId` and `organizationId` map from the existing manager and organization selections; the UI labels can remain the same while the values sent to the API are identifiers.

**Alternatives considered**:
- Keep `duration` and derive start/end dates — rejected because it introduces guesswork and contradicts the explicit contract fields.

## 8. Currency Code

**Decision**: Default `currencyCode` to `"SAR"` and keep it as a hidden/read-only field unless the UI later adds currency selection.

**Rationale**:
- The spec (FR-003) requires `currencyCode` to default to `"SAR"`.
- The existing budget label says "(ر.س)".
- A hidden default avoids adding new UI while remaining easy to expose later.

## 9. Loading and Duplicate Submission

**Decision**: Disable the submit button and show a loading indicator while the API request is in flight. This satisfies FR-008 without adding complex request deduplication.

**Rationale**:
- Disabling the primary action is the standard pattern for preventing double submits in a single-page form.
- `apiClient` does not currently expose request-level cancellation to the caller; disabling the button is sufficient for this scope.

## 10. Error Shape

**Decision**: Surface `ApiError.errors` (field-level array or record) and `ApiError.message` (general message) from `src/api/types.ts`.

**Rationale**:
- The existing client already normalizes errors into `ApiError` with optional `errors` and `details`.
- Field-level errors can be mapped to form fields; a general message covers server/network failures.

## 11. Environment and Base URL

**Decision**: Use `ENV.API_BASE_URL` via `apiClient` defaults; no hard-coded base URL in the service module.

**Rationale**:
- `apiClient` already reads the base URL from environment configuration.
- The endpoint path `/api/v1/projects` is appended to the configured base URL, consistent with other services.

## Open Unknowns Resolved

- **HTTP client**: Use existing `apiClient`.
- **Service structure**: Add `src/api/services/project-service.ts`.
- **Date format**: `YYYY-MM-DD` strings.
- **Feedback mechanism**: Inline messages + navigation to project list.
- **Required fields**: All contract fields.
- **New UI fields**: Add `startDate` and `endDate`; map manager/organization to IDs.
