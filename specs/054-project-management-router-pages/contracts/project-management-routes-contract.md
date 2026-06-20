# Contract: Project Management Routes

**Feature**: Project Management Router Pages  
**Date**: 2026-06-20

## Overview

This contract defines the public URL interface between the user, the browser, and the project management frontend module. The goal is to make every project management screen reachable via a stable, bookmarkable URL.

## Participants

- **User**: Navigates the project management module using links, browser controls, or direct URLs.
- **Browser**: Maintains history and address bar state.
- **React Router**: Matches URLs to page components.
- **Project management page components**: Render the requested view and handle `projectId` parameters.

## Route Contract

### Public URL paths

| Path | View | Requires `projectId` |
|------|------|----------------------|
| `/dashboard/project-management` | Project dashboard | No |
| `/dashboard/project-management/list` | Project list | No |
| `/dashboard/project-management/create` | Create new project | No |
| `/dashboard/project-management/details/:projectId` | Project details | Yes |
| `/dashboard/project-management/lifecycle/:projectId` | Project lifecycle | Yes |
| `/dashboard/project-management/versions/:projectId` | Project versions | Yes |
| `/dashboard/project-management/activity/:projectId` | Project activity | Yes |
| `/dashboard/project-management/reporting` | Project reporting | No |

### Wildcard / unknown paths

Any path under `/dashboard/project-management/*` that does not match the routes above MUST redirect to `/dashboard/project-management` (dashboard view).

### `projectId` parameter

- Type: string
- Source: URL path segment (`useParams().projectId`)
- Semantics: opaque identifier used to locate the project to display
- Missing or unrecognized `projectId`: page displays an error state or redirects to `/dashboard/project-management/list`

## Navigation Contract

### In-app navigation

- Clicking a project name or card in the list view navigates to `/dashboard/project-management/details/:projectId`.
- Clicking "مشروع جديد" navigates to `/dashboard/project-management/create`.
- Clicking lifecycle/versions/activity quick actions from details navigates to the corresponding `/dashboard/project-management/:view/:projectId` route.
- Clicking "رجوع إلى قائمة المشاريع" navigates to `/dashboard/project-management/list`.
- Clicking "لوحة القيادة" from the list view navigates to `/dashboard/project-management`.

### Browser behavior

- Back/forward buttons move through the user's history of visited project management routes.
- Refreshing any valid route re-renders the same view with the same `projectId` if applicable.

## Rendering Rules

- Dashboard view shows KPI cards, charts, recent activity, and quick actions.
- List view shows search, filters, table/kanban/timeline modes, and project links.
- Create view shows the project creation form.
- Details view shows project information, status, health, progress, budget, team, and quick-action links.
- Lifecycle/versions/activity views show placeholder content with back navigation to details.
- Reporting view shows placeholder content with back navigation to dashboard.

## Error Handling

- Invalid `projectId`: error message with a link/button to return to the project list.
- Unknown nested route: redirect to dashboard.
