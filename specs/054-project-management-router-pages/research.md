# Research: Project Management Router Pages

**Feature**: Project Management Router Pages  
**Date**: 2026-06-20

## Resolved Unknowns

No external research was required. All technical decisions are based on the existing codebase and standard React Router 7 patterns used throughout the application.

## Decisions

### Routing approach

- **Decision**: Use React Router 7 nested routes registered under `/dashboard/project-management/*` in `src/app/routes.tsx`.
- **Rationale**: The application already uses `createBrowserRouter` in `src/app/routes.tsx` and the same pattern is used for onboarding nested routes under `/dashboard/onboarding/*`. This is the idiomatic and consistent approach.
- **Alternatives considered**: Moving to a different router library or using dynamic route generation — rejected because React Router 7 is already in use and the route count is small and static.

### State management for selected project

- **Decision**: Pass `projectId` via URL parameters (`useParams`) and look up the project in the existing project list. For views that need a selected project (details, lifecycle, versions, activity), the page component reads `projectId` from the route and finds the matching project.
- **Rationale**: This makes each route independently accessible and refresh-safe. It removes the need for a shared "selected project" state between pages.
- **Alternatives considered**: Using React context or query parameters to share selected project — rejected because URL parameters are bookmarkable and simpler for this use case.

### Invalid project ID handling

- **Decision**: If `projectId` is missing or does not match a project, show an error/empty state with a button to return to the project list, per the clarification in the spec.
- **Rationale**: Aligns with the accepted clarification and avoids silent redirects that could confuse users.

### Component split strategy

- **Decision**: Extract each inner view component from `ProjectManagementModule.tsx` into a dedicated page component under `src/app/pages/project-management/`. Replace internal `setCurrentView` calls with `useNavigate` / `NavLink` calls.
- **Rationale**: Minimal rewrite of existing UI logic. The existing JSX, hooks, and mock data remain largely intact; only navigation wiring changes.
- **Alternatives considered**: Keeping a single component and parsing the URL manually — rejected because it would not provide clean route definitions or lazy-loading opportunities.

### URL mapping

| View | Route |
|------|-------|
| Dashboard | `/dashboard/project-management` |
| List | `/dashboard/project-management/list` |
| Create | `/dashboard/project-management/create` |
| Details | `/dashboard/project-management/details/:projectId` |
| Lifecycle | `/dashboard/project-management/lifecycle/:projectId` |
| Versions | `/dashboard/project-management/versions/:projectId` |
| Activity | `/dashboard/project-management/activity/:projectId` |
| Reporting | `/dashboard/project-management/reporting` |
| Unknown nested path | redirect to `/dashboard/project-management` |

### Sidebar / menu navigation

- **Decision**: Keep the existing sidebar link pointing to `/dashboard/project-management` (dashboard). The active view detection in `DashboardLayout.tsx` already maps `/dashboard/project-management` to `project-management`.
- **Rationale**: No change needed; the dashboard remains the module entry point.

## Open Questions

None remaining. All clarification from `/speckit.clarify` has been incorporated.
