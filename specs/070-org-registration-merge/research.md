# Research: Merge User and Organization Registration

## Context

Feature `070-org-registration-merge` requires a new page at `/auth/register/org` that merges the fields of the existing `/auth/register` user-registration page and the `/dashboard/onboarding/registration` organization-registration page, removes duplicate fields, and submits through a single atomic backend call.

## Investigation Findings

### 1. Route and page already exist

- Route is already registered in `src/app/routes.tsx`:
  ```tsx
  {
    path: 'register/org',
    Component: OrgRegistrationPage,
  }
  ```
- Component lives at `src/app/pages/auth/OrgRegistrationPage.tsx`.
- It already renders a two-column layout matching `/auth/register` and calls `authService.registerOrganization()`.

### 2. Atomic API endpoint already exists

- `src/api/services/auth-service.ts` exposes:
  ```ts
  async registerOrganization(data: OrgRegistrationData): Promise<ApiResponse<OrgRegistrationResponse>>
  ```
  which performs `POST /api/v1/auth/register-organization`.
- The service unwraps nested backend envelopes and stores the returned access token on success.

### 3. Source page fields

| Field | `/auth/register` (`RegistrationPage.tsx`) | `/dashboard/onboarding/registration` (`OnboardingRegistrationPage.tsx`) | Action in combined page |
|-------|-------------------------------------------|------------------------------------------------------------------------|-------------------------|
| Full name | `fullName` | — | Keep |
| Email | `email` | `email` (from existing org record) | Merge into one field |
| Phone | `phone` | `mobile` (from existing org record) | Merge into one field |
| Password | `password`, `confirmPassword` | — | Keep |
| Company/Org name | `companyName` | `orgName` → `name` | Merge into one field |
| License number | — | `licenseNumber` | Keep |
| Registration date | — | `registrationDate` | Keep |
| Organization type | — | `orgType` | Keep |
| City | — | `city` | Keep |
| Activity / Overview | — | `activity` / `overview` | Keep |
| Funding areas | — | `fundingAreas` | Keep |
| Terms agreement | `agreeToTerms` | — | Keep |

### 4. Existing page gaps vs. clarified spec

- The existing `OrgRegistrationPage.tsx` does **not** collect `fullName`, `registrationDate`, or `city`.
- It auto-logs the user in (`login()`) and redirects to `/dashboard/onboarding/assessment`. The clarified spec says: redirect to `/auth/login` with a success message, do not log in.
- It does not explicitly map the unified org name to a user `companyName` field.

### 5. Password complexity

The existing `/auth/register` only validates that a password is present and that it matches the confirmation password. There is no minimum length or character-class check. The clarified spec instructs the combined page to use the same rules.

### 6. Duplicate-account detection

No frontend existence-check APIs are used anywhere in the codebase. Both `/auth/register` and the existing `OrgRegistrationPage.tsx` rely on the backend returning an error message, which is displayed as a single API error. This matches the clarified requirement.

## Decisions

| Decision | Rationale |
|----------|-------------|
| Reconcile the existing `OrgRegistrationPage.tsx` instead of creating a new page | Route, component, and API call already exist and match the spec direction. |
| Remove auto-login and redirect to `/auth/login?registered=true` | Directly implements the clarified acceptance criterion FR-006 / SC-005. |
| Add `fullName`, `registrationDate`, and `city` fields | Needed to truly merge both source pages per the feature request. |
| Map unified org name to both user `companyName` and organization `name` | Satisfies FR-002/FR-003 and avoids losing data needed by either entity. |
| Keep password validation identical to `/auth/register` | Satisfies FR-004A and avoids introducing inconsistent policy. |
| Continue relying on backend for duplicate detection | Satisfies FR-010 and avoids extra API calls. |
| Leave `/auth/register` and `/dashboard/onboarding/registration` untouched | Satisfies FR-007. |

## Open items deferred to tasks

- Exact visual styling/ordering of the added `fullName`, `registrationDate`, and `city` fields.
- Whether the backend endpoint needs the new fields in the payload or if the frontend types must change.
- Manual smoke-test steps and any Playwright/MCP verification if available.
