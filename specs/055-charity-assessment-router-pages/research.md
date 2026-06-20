# Research: Charity Assessment Router Pages

**Feature**: Charity Assessment Router Pages  
**Date**: 2026-06-21

## Resolved Unknowns

No external research was required. All technical decisions are based on the existing codebase and standard React Router 7 patterns used throughout the application.

## Decisions

### Routing approach

- **Decision**: Use React Router 7 nested routes registered under `/dashboard/charity-assessment/*` in `src/app/routes.tsx`.
- **Rationale**: The application already uses `createBrowserRouter` in `src/app/routes.tsx` and the same pattern is used for onboarding nested routes under `/dashboard/onboarding/*` and project-management nested routes under `/dashboard/project-management/*`. This is the idiomatic and consistent approach.
- **Alternatives considered**: Moving to a different router library or using dynamic route generation — rejected because React Router 7 is already in use and the route count is small and static.

### State management during the wizard

- **Decision**: Keep the wizard `currentStep` as local component state. On refresh, the wizard restarts from step 0 because assessment answers are not persisted.
- **Rationale**: The existing `CharityAssessmentPage.tsx` uses local state for the wizard step. No persistent store or API exists for answers, so refreshing resets the flow. This matches current behavior and avoids inventing new persistence mechanisms for this routing-only refactor.
- **Alternatives considered**: Storing step in query parameters or localStorage — rejected because it adds scope beyond the routing conversion and the current mock-only behavior is acceptable per the spec assumption.

### Component split strategy

- **Decision**: Extract each inner view from `CharityAssessmentPage.tsx` into a dedicated page component under `src/app/pages/charity-assessment/`. Replace internal `setCurrentView` calls with `useNavigate` / `NavLink` calls.
- **Rationale**: Minimal rewrite of existing UI logic. The existing JSX, hooks, mock data, and helpers remain largely intact; only navigation wiring changes. This mirrors the project-management refactor already completed in the codebase.
- **Alternatives considered**: Keeping a single component and parsing the URL manually — rejected because it would not provide clean route definitions or lazy-loading opportunities.

### URL mapping

| View | Route |
|------|-------|
| Start | `/dashboard/charity-assessment` |
| Assessment wizard | `/dashboard/charity-assessment/assessment` |
| Results dashboard | `/dashboard/charity-assessment/results` |
| Improvement roadmap | `/dashboard/charity-assessment/roadmap` |
| Unknown nested path | redirect to `/dashboard/charity-assessment` |

### Sidebar / menu navigation

- **Decision**: Update the sidebar and mobile navigation links for "تقييم الجاهزية" to point to `/dashboard/charity-assessment` and mark the route as active for any nested path.
- **Rationale**: The current `DashboardLayout.tsx` maps `/dashboard/charity-assessment` to `charity-assessment`. The active-state logic should use `startsWith` or React Router's `useMatch('/dashboard/charity-assessment/*')` so nested routes keep the menu highlighted.

## Open Questions

None remaining. All clarification from `/speckit.clarify` has been incorporated.
