# Implementation Plan: Project Create API Integration

**Branch**: `056-project-create-api` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/056-project-create-api/spec.md`

## Summary

Integrate the existing `/dashboard/project-management/create` form with the `POST /api/v1/projects` endpoint. Convert the page from a local-state mock submit into a real API-backed create flow while preserving the existing layout, navigation, and draft behavior. Add a thin project service module, wire the submit button to the API, and handle loading, validation, success, and error states.

## Technical Context

**Language/Version**: TypeScript / React 18.3.1 / react-router 7.13.0 / Vite 6.3.5  
**Primary Dependencies**: `lucide-react` (icons), existing `apiClient` (`src/api/client.ts`), Tailwind CSS, `sonner` or inline alerts for feedback (project currently uses neither globally; use existing patterns)  
**Storage**: N/A — projects are persisted via the backend API at `/api/v1/projects`  
**Testing**: Project currently has no automated test harness configured. Validation is manual via the dev server and production build.  
**Target Platform**: Browser (desktop + responsive)  
**Project Type**: Single-page web application (frontend)  
**Performance Goals**: Form submission to API response should complete within 3 seconds on a stable connection; page should remain interactive during submission.  
**Constraints**: Reuse the existing `apiClient` and project-management page patterns; no new backend work; keep changes scoped to the create page and a new service module.  
**Scale/Scope**: Single-user frontend form integration; no new backend endpoints or data persistence changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is a placeholder template with no active principles or gates defined. No explicit gates to evaluate. The feature does not introduce complexity requiring justification: it reuses the existing `apiClient`, existing React form state patterns, existing Tailwind styling, and an existing API endpoint contract. No new backend services, storage systems, or external integrations are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/056-project-create-api/
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
│   │   └── project-service.ts       # new: project API service + types
│   └── types.ts                     # existing base API response/error types
├── app/
│   └── pages/
│       └── project-management/
│           └── ProjectCreatePage.tsx  # existing page, extended with API submit
│           └── project-types.ts     # existing local project types (can reuse/adapt)
└── lib/
    └── env.ts                       # existing environment config
```

**Structure Decision**: Add a dedicated `src/api/services/project-service.ts` module that owns the `POST /api/v1/projects` call and its DTO/response TypeScript interfaces. Keep the UI changes minimal by extending `ProjectCreatePage.tsx` with API submit logic, loading state, and error handling. Reuse existing project types where possible; add a `CreateProjectDto` and `ProjectResponse` in the service module to match the API contract.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [current need] | [why direct DB access insufficient] |
