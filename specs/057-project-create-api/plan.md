# Implementation Plan: Project Create API Integration

**Branch**: `058-057-project-create` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/057-project-create-api/spec.md`

## Summary

Wire the existing `/dashboard/project-management/create` page to the `/api/v1/projects` backend endpoint. The page will collect the same fields it shows today, transform the user input into the API contract (`name`, `type`, `category`, `description`, `budget`, `currencyCode`, `startDate`, `endDate`, `beneficiaries`, `geographicScope`, `managerId`, `organizationId`), call the endpoint, and provide success/error feedback without redesigning the UI. On success, the user is navigated to the newly created project's details page; on missing `id` in the response, the user is navigated to the project list with a warning.

## Technical Context

**Language/Version**: TypeScript with React 18.3.1, Vite 6.3.5
**Primary Dependencies**: React Router 7.13.0, Tailwind CSS 4.1.12, Radix UI primitives, shadcn/ui components in `src/app/components/ui`, `lucide-react` for icons
**Storage**: Browser `localStorage` for JWT access token; backend persistence via `/api/v1/projects`
**Testing**: Existing project has no automated test harness configured; validation is manual via the UI
**Target Platform**: Web (desktop + responsive), single-page React application
**Project Type**: Web frontend application (Rushd platform)
**Performance Goals**: Create request completes and redirects within 3 seconds under normal network conditions
**Constraints**: Must reuse the existing `ApiClient` in `src/api/client.ts`, follow the existing service/hook registry pattern, and preserve Arabic UX copy already present on the create page
**Scale/Scope**: Single form submission, single user at a time; no batch or bulk creation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution template is currently empty (placeholder text only), so there are no active gates to evaluate beyond the default development workflow. No violations recorded.

## Project Structure

### Documentation (this feature)

```text
specs/057-project-create-api/
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
│   ├── client.ts                 # Existing fetch-based API client with auth/timeout/retry
│   ├── services/
│   │   ├── index.ts              # Service registry export
│   │   └── project-service.ts    # NEW: project-specific API service
│   └── hooks/
│       └── useProjectCreate.ts   # NEW: React hook managing create form submission state
├── app/
│   ├── pages/
│   │   └── project-management/
│   │       ├── ProjectCreatePage.tsx   # EXISTING: updated to use hook + service
│   │       ├── project-types.ts        # EXISTING: extend DTO/response types
│   │       └── project-data.ts         # EXISTING: extend mock data if still used
│   └── components/ui/            # Reusable UI primitives (button, input, select, sonner, etc.)
└── types/                      # Shared domain types
```

**Structure Decision**: The frontend is a single Vite React app. We extend the existing API service layer with a new `project-service.ts` and a custom hook `useProjectCreate.ts`, following the `useOnboardingRegistration.ts` pattern already in the codebase.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified.

## Phase 0: Research Findings

*Research is lightweight because the existing codebase already defines the API client, service registry, and hook patterns we will reuse.*

### Decision: Service + Custom Hook Pattern

- **Decision**: Use a dedicated `ProjectService` class plus a `useProjectCreate` hook.
- **Rationale**: Matches the existing `OnboardingService` + `useOnboardingRegistration` architecture, keeps API calls out of JSX, and centralizes loading/error state.
- **Alternatives considered**: Inline fetch in the page component (rejected — duplicates logic), React Query/TanStack Query (rejected — not already in the dependency tree, adds scope).

### Decision: Reuse Existing `ApiClient.post`

- **Decision**: Add `projectService.createProject(dto)` that delegates to `apiClient.post('/api/v1/projects', dto)`.
- **Rationale**: Auth headers, base URL, 401 redirect, timeout, retry, and error parsing are already handled by `apiClient`.
- **Alternatives considered**: Raw `fetch` (rejected — bypasses interceptors), Axios (rejected — not in dependencies).

### Decision: Minimal Form State Refactor

- **Decision**: Keep the page's local `useState` form state; add a submission handler, loading flag, and inline error display.
- **Rationale**: The spec explicitly says to maintain existing form behavior and layout. We only add persistence and feedback.
- **Alternatives considered**: `react-hook-form` refactor (rejected — out of scope, would change validation/UX timing).

### Decision: Arabic Error Messages

- **Decision**: Translate common API/network error messages to Arabic in the hook, matching `useOnboardingRegistration`.
- **Rationale**: The rest of the page is Arabic; users should receive feedback in the same language.
- **Alternatives considered**: Pass through backend messages (rejected — backend may return English or generic strings).

### Decision: Date Split from Existing `duration` Field

- **Decision**: The existing UI has a single "المدة الزمنية" text field, but the API contract requires `startDate` and `endDate` as strings. The form will split this into start/end date inputs (date pickers or text inputs in `YYYY-MM-DD` / localized format) to satisfy the API contract.
- **Rationale**: The backend contract is fixed. The UI must expose both dates.
- **Alternatives considered**: Parse the free-text duration string (rejected — ambiguous, fragile), keep only duration and omit start/end (rejected — violates API contract).

## Phase 1: Design & Contracts

### Data Model

See `data-model.md` for full entity definitions. Key additions to the existing `Project` model:

- `CreateProjectDto`: maps 1:1 to the `/api/v1/projects` request body.
- `CreatedProjectResponse`: extends the DTO with the server-generated `id` and timestamps.

### Contracts

See `contracts/project-create-api-contract.md` for the interface contract between the frontend page and the backend endpoint.

### Quick Start

See `quickstart.md` for the minimal developer workflow to run and test the create page against a real or mock backend.

### Agent Context Update

The `AGENTS.md` references for this feature will be updated after task generation to point to `plan.md`, `data-model.md`, and `quickstart.md`.
