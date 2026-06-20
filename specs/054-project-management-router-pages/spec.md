# Feature Specification: Project Management Router Pages

**Feature Branch**: `054-project-management-router-pages`  
**Created**: 2026-06-20  
**Status**: Draft  
**Input**: User description: "for this page dashboard/project-management make all pages inside it as router page so I can navigate to it using dashboard/project-management/*"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate directly to a project management sub-page (Priority: P1)

As a platform user, I want to open a direct URL such as `/dashboard/project-management/create` or `/dashboard/project-management/details/123` so that I can land on the correct project management screen without first visiting the project management dashboard.

**Why this priority**: This is the core user journey requested. Without routable sub-pages, users cannot bookmark, share, or refresh specific project management screens.

**Independent Test**: This story can be fully tested by entering each project management sub-page URL directly in the browser and confirming the expected screen renders.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they open `/dashboard/project-management`, **Then** the project management dashboard screen is shown.
2. **Given** the user is authenticated, **When** they open `/dashboard/project-management/list`, **Then** the project list screen is shown.
3. **Given** the user is authenticated, **When** they open `/dashboard/project-management/create`, **Then** the create-project screen is shown.
4. **Given** the user is authenticated, **When** they open `/dashboard/project-management/details/:projectId`, **Then** the project details screen for that project is shown.
5. **Given** the user is authenticated, **When** they open `/dashboard/project-management/lifecycle/:projectId`, **Then** the project lifecycle screen for that project is shown.
6. **Given** the user is authenticated, **When** they open `/dashboard/project-management/versions/:projectId`, **Then** the project versions screen for that project is shown.
7. **Given** the user is authenticated, **When** they open `/dashboard/project-management/activity/:projectId`, **Then** the project activity screen for that project is shown.
8. **Given** the user is authenticated, **When** they open `/dashboard/project-management/reporting`, **Then** the project reporting screen is shown.

---

### User Story 2 - Use browser back/forward and refresh within project management (Priority: P1)

As a platform user, I want to use the browser back/forward buttons and refresh the page while inside project management without losing my current screen or selected project.

**Why this priority**: Routable pages are expected to behave like normal web pages; losing state on refresh would break the user experience and make the feature feel unfinished.

**Independent Test**: This story can be fully tested by navigating between project management sub-pages using browser controls and refreshing each page.

**Acceptance Scenarios**:

1. **Given** the user is on `/dashboard/project-management/details/123`, **When** they click the browser back button, **Then** they return to the previous page they were viewing.
2. **Given** the user is on `/dashboard/project-management/details/123`, **When** they refresh the browser, **Then** the same project details screen for project `123` is shown.
3. **Given** the user is on `/dashboard/project-management/list`, **When** they click a project link, **Then** the browser navigates to `/dashboard/project-management/details/:projectId`.

---

### User Story 3 - Maintain existing project management functionality (Priority: P2)

As a platform user, I want all existing project management features such as the dashboard, list, create form, details, lifecycle, versions, activity, and reporting to continue working after they are converted to routable pages.

**Why this priority**: The routing change should not regress existing functionality. Existing behavior must be preserved while gaining URL-based navigation.

**Independent Test**: This story can be fully tested by performing the existing actions from the new routable pages and verifying they still produce the same results.

**Acceptance Scenarios**:

1. **Given** the user opens `/dashboard/project-management`, **When** they click the "مشروع جديد" button, **Then** the browser navigates to `/dashboard/project-management/create`.
2. **Given** the user opens `/dashboard/project-management/list`, **When** they click a project name, **Then** the browser navigates to `/dashboard/project-management/details/:projectId`.
3. **Given** the user opens `/dashboard/project-management/details/:projectId`, **When** they click lifecycle/versions/activity quick actions, **Then** the browser navigates to the corresponding `/dashboard/project-management/:view/:projectId` route.
4. **Given** the user opens `/dashboard/project-management/details/:projectId`, **When** they click "رجوع إلى قائمة المشاريع", **Then** the browser navigates back to `/dashboard/project-management/list`.

---

### Edge Cases

- What happens when a user opens `/dashboard/project-management/details/:projectId` with an invalid or missing project ID?
- What happens when a user opens an unknown sub-path such as `/dashboard/project-management/unknown`?
- How does the system handle navigation from the project management menu item when already inside a nested project management route?
- How are query parameters or state preserved when navigating between project management sub-pages?
- What happens when a user refreshes a page that requires a selected project that was chosen through in-app navigation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST register nested routes under `/dashboard/project-management/*` for each existing project management view.
- **FR-002**: Each project management view MUST be reachable by a unique URL path.
- **FR-003**: In-app navigation between project management views MUST update the browser URL to the corresponding route.
- **FR-004**: The project dashboard view MUST be available at `/dashboard/project-management`.
- **FR-005**: The project list view MUST be available at `/dashboard/project-management/list`.
- **FR-006**: The create-project view MUST be available at `/dashboard/project-management/create`.
- **FR-007**: The project details view MUST be available at `/dashboard/project-management/details/:projectId`.
- **FR-008**: The project lifecycle view MUST be available at `/dashboard/project-management/lifecycle/:projectId`.
- **FR-009**: The project versions view MUST be available at `/dashboard/project-management/versions/:projectId`.
- **FR-010**: The project activity view MUST be available at `/dashboard/project-management/activity/:projectId`.
- **FR-011**: The project reporting view MUST be available at `/dashboard/project-management/reporting`.
- **FR-012**: Unknown sub-paths under `/dashboard/project-management/*` MUST redirect to the project management dashboard.
- **FR-013**: Direct access to any project management route MUST render the correct view without requiring a prior visit to the dashboard.
- **FR-014**: Existing project management functionality such as search, filters, forms, charts, and quick actions MUST continue to work after routing conversion.

### Key Entities

- **Project**: A charitable or development initiative with attributes such as name, organization, type, status, budget, duration, dates, progress, manager, description, beneficiaries, geographic scope, health, and version.
- **Project Management View**: One of the screens inside the project management module: dashboard, list, create, details, lifecycle, versions, activity, or reporting.
- **Project ID**: A unique identifier used in routes to identify the project being viewed or edited.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate directly to any project management sub-page via URL and see the expected screen within 2 seconds.
- **SC-002**: Browser back, forward, and refresh actions preserve the current project management screen and selected project in 100% of tested cases.
- **SC-003**: All eight project management views have dedicated routable URLs under `/dashboard/project-management/*`.
- **SC-004**: No existing project management functionality is broken after routing conversion, verified by a manual regression check of dashboard, list, create, details, lifecycle, versions, activity, and reporting flows.
- **SC-005**: The production build compiles without errors after the routing refactor.

## Assumptions

- The existing `ProjectManagementModule.tsx` component contains the dashboard, list, create, details, lifecycle, versions, activity, and reporting views as internal state-driven sub-components.
- The routing framework is React Router 7, consistent with the rest of the application.
- No backend changes are required; project data will continue to be sourced from the same mock or API data used today.
- Project IDs in URLs are treated as opaque strings; validation of the ID against existing projects is handled by the details view itself.
- The project management menu item in the sidebar already links to `/dashboard/project-management` and will continue to work after the change.
- Navigation between views will use `useNavigate` or `NavLink` from React Router instead of internal state changes.
- Unknown nested routes will redirect to the project management dashboard rather than showing a 404 page, preserving the module-level experience.
