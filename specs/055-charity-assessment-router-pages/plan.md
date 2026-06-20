# Implementation Plan: Charity Assessment Router Pages

**Branch**: `055-charity-assessment-router-pages` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/055-charity-assessment-router-pages/spec.md`

## Summary

Convert the existing monolithic `CharityAssessmentPage` component into a set of routable sub-pages under `/dashboard/charity-assessment/*`. Register nested React Router routes for the start, assessment, results, and roadmap views; replace internal `currentView` state navigation with URL-based navigation; preserve all existing UI behavior and data flows.

## Technical Context

**Language/Version**: TypeScript / React 18.3.1 / react-router 7.13.0 / Vite 6.3.5  
**Primary Dependencies**: `lucide-react` (icons), `recharts` (charts), existing React Router 7 routing in `src/app/routes.tsx`, Tailwind CSS  
**Storage**: N/A — assessment data continues to be sourced from the existing mock data used by `CharityAssessmentPage.tsx`  
**Testing**: Project currently has no automated test harness configured. Validation is manual via the dev server and production build.  
**Target Platform**: Browser (desktop + responsive)  
**Project Type**: Single-page web application (frontend)  
**Performance Goals**: Each charity assessment sub-page should render within 2 seconds on a stable connection; navigation between sub-pages should feel instant.  
**Constraints**: Existing `CharityAssessmentPage.tsx` component logic should be reused and split rather than rewritten; no backend changes.  
**Scale/Scope**: Single-user frontend navigation refactor; no new backend endpoints or data persistence changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is a placeholder template with no active principles or gates defined. No explicit gates to evaluate. The feature does not introduce complexity requiring justification: it reuses existing React Router, existing charity assessment UI components, existing Tailwind styling, and existing mock data. No new backend services, storage systems, or external integrations are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/055-charity-assessment-router-pages/
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
│       └── charity-assessment/
│           ├── CharityAssessmentStartPage.tsx
│           ├── CharityAssessmentWizardPage.tsx
│           ├── CharityAssessmentResultsPage.tsx
│           └── CharityAssessmentRoadmapPage.tsx
│   └── components/
│       └── CharityAssessmentPage.tsx     # existing monolithic component to refactor
```

**Structure Decision**: Create a dedicated `src/app/pages/charity-assessment/` directory for the new routable page components. Extract each view currently rendered conditionally inside `CharityAssessmentPage.tsx` into its own page component. Keep shared types, mock data, and helpers in a co-located file or reuse the existing module until a future refactor justifies splitting further. Update `src/app/routes.tsx` to register nested routes under `/dashboard/charity-assessment/*`. Update `Sidebar.tsx`, `MobileNav.tsx`, and `DashboardLayout.tsx` so the menu item links to `/dashboard/charity-assessment` and remains active for nested paths.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [current need] | [why direct DB access insufficient] |
