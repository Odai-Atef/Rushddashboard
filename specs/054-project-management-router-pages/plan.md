# Implementation Plan: Project Management Router Pages

**Branch**: `054-project-management-router-pages` | **Date**: 2026-06-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/054-project-management-router-pages/spec.md`

## Summary

Convert the existing monolithic `ProjectManagementModule` component into a set of routable sub-pages under `/dashboard/project-management/*`. Register nested React Router routes for the dashboard, list, create, details, lifecycle, versions, activity, and reporting views; replace internal `currentView` state navigation with URL-based navigation; preserve all existing UI behavior and data flows.

## Technical Context

**Language/Version**: TypeScript / React 18.3.1 / react-router 7.13.0 / Vite 6.3.5  
**Primary Dependencies**: `lucide-react` (icons), `recharts` (charts), existing React Router 7 routing in `src/app/routes.tsx`, Tailwind CSS  
**Storage**: N/A — project data continues to be sourced from the existing mock/project data used by `ProjectManagementModule.tsx`  
**Testing**: Project currently has no automated test harness configured. Validation is manual via the dev server and production build.  
**Target Platform**: Browser (desktop + responsive)  
**Project Type**: Single-page web application (frontend)  
**Performance Goals**: Each project management sub-page should render within 2 seconds on a stable connection; navigation between sub-pages should feel instant.  
**Constraints**: Existing `ProjectManagementModule.tsx` component logic should be reused and split rather than rewritten; no backend changes.  
**Scale/Scope**: Single-user frontend navigation refactor; no new backend endpoints or data persistence changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is a placeholder template with no active principles or gates defined. No explicit gates to evaluate. The feature does not introduce complexity requiring justification: it reuses existing React Router, existing project management UI components, existing Tailwind styling, and existing mock data. No new backend services, storage systems, or external integrations are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/054-project-management-router-pages/
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
├── app/
│   ├── routes.tsx                        # existing dashboard route config
│   └── pages/
│       └── project-management/
│           ├── ProjectManagementLayout.tsx   # optional shared wrapper/shell
│           ├── ProjectDashboardPage.tsx
│           ├── ProjectListPage.tsx
│           ├── ProjectCreatePage.tsx
│           ├── ProjectDetailsPage.tsx
│           ├── ProjectLifecyclePage.tsx
│           ├── ProjectVersionsPage.tsx
│           ├── ProjectActivityPage.tsx
│           └── ProjectReportingPage.tsx
│   └── components/
│       └── ProjectManagementModule.tsx   # existing monolithic component to refactor
```

**Structure Decision**: Create a dedicated `src/app/pages/project-management/` directory for the new routable page components. Extract each view currently defined as an inner component inside `ProjectManagementModule.tsx` into its own page component. Keep shared types, mock data, and helpers in a co-located file or reuse the existing module until a future refactor justifies splitting further. Update `src/app/routes.tsx` to register nested routes under `/dashboard/project-management/*`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
