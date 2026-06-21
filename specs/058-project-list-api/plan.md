# Implementation Plan: Project List API Integration

**Branch**: `059-058-project-list` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/058-project-list-api/spec.md`

## Summary

Wire the existing `/dashboard/project-management/list` page to the `/api/v1/projects` backend endpoint with server-side pagination, filtering, and search. The list response contains project identifiers; the page will fetch each project's full details via `GET /api/v1/projects/:id` before rendering. The page will preserve its current layout (table, kanban, timeline), view toggles, Arabic copy, and navigation behavior while replacing local mock filtering with API-driven data.

## Technical Context

**Language/Version**: TypeScript with React 18.3.1, Vite 6.3.5
**Primary Dependencies**: React Router 7.13.0, Tailwind CSS 4.1.12, Radix UI primitives, shadcn/ui components in `src/app/components/ui`, `lucide-react` for icons, `sonner` for toasts
**Storage**: Browser `localStorage` for JWT access token; backend persistence via `/api/v1/projects`
**Testing**: Existing project has no automated test harness configured; validation is manual via the UI
**Target Platform**: Web (desktop + responsive), single-page React application
**Project Type**: Web frontend application (Rushd platform)
**Performance Goals**: First page of projects renders within 3 seconds under normal network conditions
**Constraints**: Must reuse the existing `ApiClient` in `src/api/client.ts`, follow the existing service/hook registry pattern, preserve existing list views and styling, and use Arabic UX copy
**Scale/Scope**: Paginated lists up to hundreds or thousands of projects; no bulk operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution template is currently empty (placeholder text only), so there are no active gates to evaluate beyond the default development workflow. No violations recorded.

## Project Structure

### Documentation (this feature)

```text
specs/058-project-list-api/
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
│   │   └── project-service.ts    # EXISTING from feature 057, to be extended
│   └── hooks/
│       └── useProjects.ts        # NEW: React hook for list fetching and filtering
├── app/
│   ├── pages/
│   │   └── project-management/
│   │       ├── ProjectListPage.tsx   # EXISTING: updated for API-driven data
│   │       ├── project-types.ts        # EXISTING: extend DTO/response types
│   │       ├── project-data.ts       # EXISTING: mock data, may remain as fallback
│   │       └── ProjectCreatePage.tsx # EXISTING from feature 057
│   └── components/ui/            # Reusable UI primitives
└── types/                      # Shared domain types
```

**Structure Decision**: The frontend is a single Vite React app. We extend the existing `ProjectService` (created in feature 057) with a `getProjects` method and add a new `useProjects` hook. The existing `ProjectListPage` is refactored to use the hook while keeping its three view modes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified.

## Phase 0: Research Findings

*Research is lightweight because the existing codebase already defines the API client, service registry, and hook patterns we will reuse.*

### Decision: Extend ProjectService

- **Decision**: Add `getProjects(params)` and `getProjectById(id)` methods to the existing `src/api/services/project-service.ts`.
- **Rationale**: Keeps all project API calls in one service, consistent with the `OnboardingService` pattern and feature 057.
- **Alternatives considered**: Create a separate list service (rejected — would fragment project API logic).

### Decision: Single Hook for List + Details

- **Decision**: Create `useProjects` hook that fetches the paginated list, then fetches details for each returned project ID in parallel, and exposes `{ projects, pagination, filters, isLoading, error, setPage, setLimit, setFilters, applyFilters, clearFilters, refetch }`.
- **Rationale**: Centralizes list state and avoids prop-drilling across view modes.
- **Alternatives considered**: Separate hooks for list and details (rejected — would couple list page to multiple hooks and complicate loading/error coordination).

### Decision: Preserve Existing View Modes

- **Decision**: Keep table, kanban, and timeline views; feed them data from the hook instead of `projects` mock array.
- **Rationale**: The spec (US3) requires existing behavior to continue; the views already render correctly with `Project[]` objects.
- **Alternatives considered**: Replace views with a single list (rejected — would degrade UX and violate US3).

### Decision: Explicit Filter Application

- **Decision**: Filters and search are applied only when the user clicks an Apply/Search action, as clarified in `/speckit.clarify`.
- **Rationale**: Avoids accidental API calls while the user is still selecting filters.
- **Alternatives considered**: Immediate application with debounce (rejected during clarification).

### Decision: Loading State for Details Enrichment

- **Decision**: While list IDs and per-project details load, show a single loading spinner covering the list area.
- **Rationale**: Clarified during `/speckit.clarify`; simplest UX and matches the spec FR-013.
- **Alternatives considered**: Skeleton rows, inline loading (rejected during clarification).

## Phase 1: Design & Contracts

### Data Model

See `data-model.md` for full entity definitions. Key additions:

- `ProjectListResponse`: `{ data: string[], total: number, page: number, limit: number, totalPages: number }`
- `ProjectFilters`: `{ status?, organizationId?, managerId?, health?, type?, category?, search?, page?, limit? }`
- `ProjectListItem`: extends existing `Project` entity.

### Contracts

See `contracts/project-list-api-contract.md` for the interface contract between the frontend list page and the backend endpoint, including query parameters and enrichment via `GET /api/v1/projects/:id`.

### Quick Start

See `quickstart.md` for the minimal developer workflow to run and test the list page against a real or mock backend.

### Agent Context Update

The `AGENTS.md` references for this feature will be updated after task generation to point to `plan.md`, `data-model.md`, and `quickstart.md`.
