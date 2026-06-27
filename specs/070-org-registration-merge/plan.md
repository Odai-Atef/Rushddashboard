# Implementation Plan: Merge User and Organization Registration

**Branch**: `070-org-registration-merge` | **Date**: 2026-06-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/070-org-registration-merge/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Create a new combined registration page at `/auth/register/org` that merges the fields from the existing standalone user registration page (`/auth/register`) and the onboarding organization registration page (`/dashboard/onboarding/registration`). The new page will remove duplicate fields (e.g., email, phone, company/organization name) and submit all data through a single new backend API endpoint that creates both the user account and the organization atomically. The existing two registration pages remain untouched.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3.1, Vite 6.3.5  
**Primary Dependencies**: react-router 7.13.0, tailwindcss 4.1.12, shadcn/ui-style class utilities  
**Storage**: Browser state/cookies only (auth token); backend persists data.  
**Testing**: No automated test framework currently installed. Validation is manual via `npm run dev` / `npm run build`.  
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (single frontend SPA under `apps/frontend`)  
**Performance Goals**: Page loads without perceptible delay; form submission completes in under 3 seconds on normal networks; build succeeds with no TypeScript errors.  
**Constraints**: Must preserve Arabic/RTL UI text and existing layout patterns. Must not introduce new dependencies. Must not break existing `/auth/register` or `/dashboard/onboarding/registration` flows.  
**Scale/Scope**: Single-tenant frontend codebase (~200 TS/TSX files); change adds one new page, one new service method, and one new route.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution file is still a placeholder template, so no project-specific gates apply beyond the generic guidance. The plan respects the YAGNI principle: it adds only one new page and one new API contract, reuses existing components and patterns, and does not introduce new libraries.

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
│   ├── services/
│   │   ├── auth-service.ts           # Existing user auth service (UserProfile, RegisterData)
│   │   ├── onboarding-service.ts     # Existing organization service
│   │   └── index.ts                  # Service exports
│   └── types.ts                      # Shared API response types
├── app/
│   ├── components/
│   │   └── RegistrationPage.tsx      # Existing standalone user registration page
│   ├── pages/
│   │   └── onboarding/
│   │       └── RegistrationPage.tsx  # Existing onboarding organization registration page
│   ├── pages/
│   │   └── auth/
│   │       └── OrgRegistrationPage.tsx  # NEW combined page (suggested location)
│   └── routes.tsx                    # Add /auth/register/org route
├── lib/
│   └── env.ts                        # Environment config
└── main.tsx
```

**Structure Decision**: Single frontend SPA in `apps/frontend`. The new combined page can be placed in `src/app/pages/auth/OrgRegistrationPage.tsx` (matching the route `/auth/register/org`) or in `src/app/components/` if the project prefers keeping auth pages as components. The plan suggests `pages/auth/` for consistency with onboarding page organization.

## Complexity Tracking

No constitution violations requiring justification.

---

## Phase 0: Outline & Research

### Unknowns / Decisions

1. What is the exact URL path and component location for the new combined page?
2. What are the exact shared and unique fields between the two existing pages?
3. What is the name and shape of the new atomic backend API endpoint?
4. Should the new page reuse the existing `/auth/register` visual layout or the onboarding layout?

### Research Findings

**Decision 1**: New page path will be `/auth/register/org`, implemented as `src/app/pages/auth/OrgRegistrationPage.tsx`.

- **Rationale**: Matches the route naming requested by the user and groups the new page with the existing auth pages. Using `pages/auth/` keeps auth-specific pages together.
- **Alternatives considered**: Place in `src/app/components/` (rejected because onboarding pages already live in `pages/` and the route is a top-level page).

**Decision 2**: Merged field set (deduplicated):

| Field | Source | Used For |
|-------|--------|----------|
| `fullName` | User registration | User account |
| `email` | Both | User account + organization |
| `phone` | Both | User account + organization |
| `password` | User registration | User account |
| `confirmPassword` | User registration | User account |
| `companyName` / `orgName` | Both | Organization name (single field) |
| `licenseNumber` | Organization registration | Organization |
| `registrationDate` | Organization registration | Organization |
| `orgType` | Organization registration | Organization type (charity / private company) |
| `city` | Organization registration | Organization |
| `activity` / `overview` | Organization registration | Organization profile overview |
| `fundingAreas` | Organization registration | Organization funding areas |

- **Rationale**: Keeps all unique data from both pages while showing shared fields (email, phone, company/org name) only once.
- **Alternatives considered**: Keep separate email/phone fields for user and organization; rejected because it directly contradicts the request to remove duplicates.

**Decision 3**: The new frontend service method will call a backend endpoint named `POST /api/v1/auth/register/org` (or similar, to be confirmed with backend).

- **Rationale**: Atomic user + organization creation should live under the auth service namespace because the entry point is user registration.
- **Alternatives considered**: Call onboarding service endpoint; rejected because user creation is the primary entry point.

**Decision 4**: The visual layout will follow the existing `/auth/register` two-column design (form left, benefits right) but with a taller scrollable form area.

- **Rationale**: Consistency with the existing auth experience and better mobile handling via vertical scrolling.
- **Alternatives considered**: Use the onboarding stepper layout; rejected because the new route lives under `/auth/` and should feel like part of auth registration.

## Phase 1: Design & Contracts

### Data Model

See `data-model.md` for the merged `OrgRegistrationData` shape and mappings to `User` and `Organization`.

### Interface Contracts

See `contracts/org-registration-contract.md` for the new atomic API contract.

### Quickstart

See `quickstart.md` for verification steps after implementation.

### Agent Context Update

`AGENTS.md` will be updated to point to this plan.

## Phase 2: Task Generation

Run `/speckit.tasks` to generate the implementation tasks.
