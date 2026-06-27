# Implementation Plan: Merge User and Organization Registration

**Branch**: `070-org-registration-merge` | **Date**: 2026-06-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/070-org-registration-merge/spec.md`

## Summary

Add a new combined registration page at `/auth/register/org` that merges the user-account fields from `/auth/register` with the organization fields from `/dashboard/onboarding/registration`, removes duplicate fields (email, phone, company/org name), and submits through a single atomic backend endpoint. The existing `/auth/register` and `/dashboard/onboarding/registration` pages remain untouched. After clarification, the page must redirect to `/auth/login` with a success message rather than auto-logging in.

**Current state**: The route `/auth/register/org` and a page component (`src/app/pages/auth/OrgRegistrationPage.tsx`) already exist. It currently auto-logs the user in and redirects to `/dashboard/onboarding/assessment`, lacks a `fullName` field, and omits several organization fields (`registrationDate`, `city`). This plan reconciles the implementation with the clarified specification.

## Technical Context

**Language/Version**: TypeScript 5.x (targeting ES2020+)
**Primary Dependencies**: React 18.3.1, react-router 7.13.0, Tailwind CSS 4.1.12, Vite 6.3.5, shadcn/ui primitives under `src/app/components/ui`, `lucide-react` icons, `sonner` toasts
**Storage**: N/A (frontend only; backend storage and API handled by separate backend service)
**Testing**: Manual browser verification via `npm run dev` and the existing Playwright/MCP setup; no unit-test framework is configured in this repo.
**Target Platform**: Modern browsers (Chrome, Firefox, Edge, Safari) with RTL Arabic UI
**Project Type**: Web application (single-page React app, Vite-based)
**Performance Goals**: Page interactive within 3s on a 4G connection; form submission feedback within 200ms of user action
**Constraints**: Keep existing `/auth/register` and `/dashboard/onboarding/registration` unchanged; reuse existing components/patterns only where it does not alter their behavior; no separate existence-check API calls from the frontend
**Scale/Scope**: Single new route and one API integration; expected low-to-moderate registration traffic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution file (`.specify/memory/constitution.md`) is still in placeholder/template form and does not define active gates. Therefore, no constitution violations are raised.

## Project Structure

### Documentation (this feature)

```text
specs/070-org-registration-merge/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts              # Base fetch client with auth interceptors
│   ├── services/
│   │   ├── auth-service.ts    # Already contains registerOrganization()
│   │   └── onboarding-service.ts  # getFundingAreas()
│   └── types.ts               # ApiResponse, ApiError shapes
├── app/
│   ├── pages/
│   │   └── auth/
│   │       └── OrgRegistrationPage.tsx   # Existing combined page to reconcile
│   ├── components/
│   │   ├── RegistrationPage.tsx            # Existing /auth/register page (do not modify)
│   │   └── ui/                             # shadcn/ui primitives
│   ├── pages/onboarding/
│   │   └── RegistrationPage.tsx            # Existing /dashboard/onboarding/registration page (do not modify)
│   ├── layouts/
│   │   ├── RootLayout.tsx       # Auth context provider
│   │   └── AuthLayout.tsx       # Auth route wrapper
│   └── routes.tsx               # Route definitions
├── lib/
│   └── env.ts                   # Environment variables
└── main.tsx                     # App entry
```

**Structure Decision**: Single Vite + React SPA under `src/`. The new page is already located at `src/app/pages/auth/OrgRegistrationPage.tsx` and registered in `src/app/routes.tsx` under `/auth/register/org`. No new directories are required.

## Complexity Tracking

No complexity violations to justify. The implementation stays within the single existing frontend project, reuses established API/service patterns, and does not introduce new dependencies.

## Phase 0: Research

### Resolved Unknowns

1. **Route/page existence**: The combined page is already implemented at `/auth/register/org` and is routed in `src/app/routes.tsx`.
2. **Atomic API endpoint**: `authService.registerOrganization()` already calls `POST /api/v1/auth/register-organization`.
3. **Shared field mapping**: The existing page sends `name`, `email`, and `phone` inside the organization payload but does not set a separate user `companyName`. The spec clarifies that the unified company/org name must map to both `user.companyName` and `organization.name`.
4. **Authentication after registration**: Existing implementation auto-logs in and redirects to `/dashboard/onboarding/assessment`. Clarified spec requires redirect to `/auth/login` with a success message and no auto-login.
5. **Password rules**: Existing `/auth/register` only checks presence and confirmation match. Clarified spec requires using the same rules as `/auth/register` (i.e., keep the existing lenient validation, do not add extra complexity).
6. **Duplicate-account detection**: Existing implementation relies on the API response error message. Clarified spec requires the same approach: backend detects duplicates and returns a field-level error; frontend surfaces it without extra calls.

### research.md

- **Decision**: Reconcile the existing `OrgRegistrationPage.tsx` with the clarified spec rather than creating a new page.
- **Rationale**: The page already exists, uses the correct route, calls the atomic endpoint, and follows the two-column layout. Only behavioral gaps remain (redirect/auth, field mapping, missing fields).
- **Alternatives considered**:
  - Refactor `/auth/register` and onboarding registration into shared form components → rejected because the spec requires existing pages remain unchanged and independent.
  - Create a brand-new page file → rejected because the current file already satisfies the route and most UI needs; duplication would increase maintenance.
  - Update the backend contract to auto-create the organization at login-time → rejected because the spec explicitly requires a single atomic API call from the frontend.

## Phase 1: Design & Contracts

### data-model.md

See generated `specs/070-org-registration-merge/data-model.md`.

### contracts/

See generated `specs/070-org-registration-merge/contracts/`.

### quickstart.md

See generated `specs/070-org-registration-merge/quickstart.md`.

### Agent context update

`AGENTS.md` already references `specs/070-org-registration-merge/plan.md` and remains current.

## Re-evaluated Constitution Check

No active constitution gates. Plan is approved to proceed to `/speckit.tasks`.

## Notes for Task Generation

The following concrete changes should be emitted as tasks:

1. Update `OrgRegistrationPage.tsx` success path: remove `login()` call and redirect to `/auth/login?registered=true` with a success toast.
2. Add `fullName` field to the combined form, validation, and payload.
3. Add `registrationDate` and `city` fields to the combined form, validation, and payload.
4. Map the unified company/org name to both user (`companyName`) and organization (`name`) fields; update `OrgRegistrationData`/`OrgRegistrationResponse` types and service call if needed.
5. Ensure password validation matches `/auth/register` (presence + confirm match only; no new complexity).
6. Ensure duplicate-account errors are surfaced from the atomic API response without extra existence-check calls.
7. Verify existing `/auth/register` and `/dashboard/onboarding/registration` pages are untouched.
8. Run build/lint and manual smoke test on `/auth/register/org`.
