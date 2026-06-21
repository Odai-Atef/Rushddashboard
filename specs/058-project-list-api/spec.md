# Feature Specification: Project List API Integration

**Feature Branch**: `059-058-project-list`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "implement /dashboard/project-management/list by calling this api /api/v1/projects params page number (query) Default value : 1, limit number (query) Default value : 10, status string (query) Available values : DRAFT, CHARITY_REVIEW, INCUBATOR_MODIFICATIONS, CHARITY_APPROVAL, PM_APPROVAL, FINANCIAL_APPROVAL, APPROVED, DESIGN_TEAM, READY_DONOR, SUBMITTED_DONOR, FUNDED, EXECUTION, COMPLETED, CLOSED, organizationId string (query), managerId string (query), health string (query) Available values : EXCELLENT, GOOD, AT_RISK, CRITICAL, type string (query), category string (query), search string (query) and response is { \"data\": [ \"string\" ], \"total\": 0, \"page\": 0, \"limit\": 0, \"totalPages\": 0 }"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View paginated list of projects (Priority: P1)

As a platform user, I want to open `/dashboard/project-management/list` and see a paginated list of projects loaded from the `/api/v1/projects` endpoint so that I can browse and manage all projects.

**Why this priority**: This is the core requested capability. The list page must display real project data instead of static or mock data.

**Independent Test**: This story can be fully tested by opening `/dashboard/project-management/list` and verifying that project cards or rows render with data returned by the API.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they open `/dashboard/project-management/list`, **Then** a request is made to `/api/v1/projects` with default `page=1` and `limit=10`.
2. **Given** the API returns a paginated response, **When** the list page loads, **Then** the projects in the `data` array are displayed along with pagination controls reflecting `total`, `page`, `limit`, and `totalPages`.
3. **Given** the API returns an empty list, **When** the list page loads, **Then** an empty-state message is shown indicating there are no projects.

---

### User Story 2 - Filter and search the project list (Priority: P1)

As a platform user, I want to filter projects by status, organization, manager, health, type, or category and search by keywords so that I can quickly find relevant projects.

**Why this priority**: Filtering and searching are essential for usability once the list contains more than a few projects.

**Independent Test**: This story can be fully tested by selecting each filter and entering a search term, then confirming the API is called with the corresponding query parameters and the displayed list updates.

**Acceptance Scenarios**:

1. **Given** the user is on the project list page, **When** they select a status from the status filter, **Then** the API request includes that `status` and the list refreshes to show only matching projects.
2. **Given** the user is on the project list page, **When** they type a keyword in the search field and confirm, **Then** the API request includes that `search` term and the list refreshes.
3. **Given** the user is on the project list page, **When** they select a combination of filters and a search term, **Then** the API request includes all active parameters and the list refreshes accordingly.
4. **Given** the user clears all filters and search, **When** the list reloads, **Then** the request reverts to the default `page=1` and `limit=10` without filter parameters.

---

### User Story 3 - Navigate through pages (Priority: P2)

As a platform user, I want to navigate between pages of results and change the number of items shown per page so that I can browse large project lists efficiently.

**Why this priority**: Pagination controls let users access projects beyond the first page without overwhelming the interface.

**Independent Test**: This story can be fully tested by clicking next/previous page controls and selecting a different page size, then confirming the API request uses the chosen `page` and `limit` values.

**Acceptance Scenarios**:

1. **Given** the list has more than one page, **When** the user clicks the next page control, **Then** the API request uses `page=2` and the list displays the second page of results.
2. **Given** the user is on a later page, **When** they click the previous page control, **Then** the API request decrements the page number and the list updates.
3. **Given** the user selects a different page size, **When** the list reloads, **Then** the API request uses the selected `limit` and resets to `page=1`.
4. **Given** the user applies a filter while on page 3, **When** the list reloads, **Then** the request resets to `page=1` with the new filter applied.

---

## Clarifications

### Session 2026-06-21

- **Q**: Should the list display only project IDs returned by the API, or should the frontend fetch/enrich each project with its name, status, and manager? → **A**: Fetch full project details for each item via separate API calls.

### Edge Cases

- What happens when the API request fails while loading the list?
- What happens when the user selects a page number greater than `totalPages`?
- How does the system behave if the user applies filters that return zero results?
- What happens when the user changes page size while on the last page?
- How are invalid filter values handled before sending them to the API?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project list page at `/dashboard/project-management/list` MUST fetch projects from `/api/v1/projects` using server-side pagination.
- **FR-002**: The default request MUST use `page=1` and `limit=10` when no user preference is set.
- **FR-003**: The page MUST support optional query parameters: `status`, `organizationId`, `managerId`, `health`, `type`, `category`, and `search`.
- **FR-004**: Each filter parameter MUST only be sent when the user has selected or entered a value.
- **FR-005**: The list MUST display the projects returned in the `data` array from the API response. For each project identifier returned, the page MUST fetch its full details (name, status, manager, etc.) via a separate API call or a documented enrichment mechanism before rendering.
- **FR-006**: The pagination controls MUST reflect the `page`, `limit`, `total`, and `totalPages` values returned by the API.
- **FR-007**: The page MUST provide an empty state when the API returns no projects.
- **FR-008**: The page MUST display a user-friendly error message and a retry option when the API request fails.
- **FR-009**: Changing any filter or search term MUST reset the current page to `1`.
- **FR-010**: Changing the page size MUST reset the current page to `1`.
- **FR-011**: Existing navigation behavior such as clicking a project to open its details page MUST continue to work.

### Key Entities

- **Project List Item**: A summary representation of a project returned by `/api/v1/projects`. The response contract describes `data` as an array of string identifiers, but the frontend may enrich these identifiers with display fields such as name, status, and manager.
- **Pagination Metadata**: The response fields `total`, `page`, `limit`, and `totalPages` used to drive pagination controls.
- **Project Filter**: One of status, organizationId, managerId, health, type, category, or search used to narrow the list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open `/dashboard/project-management/list` and see the first page of projects loaded from `/api/v1/projects` within 3 seconds under normal network conditions.
- **SC-002**: Users can apply any combination of available filters and search terms, and the list refreshes within 2 seconds of the API response.
- **SC-003**: Pagination controls accurately reflect the current page, limit, total count, and total pages returned by the API.
- **SC-004**: 95% of list load attempts succeed on the first try under normal conditions.
- **SC-005**: Existing navigation from a project list item to its details page continues to work without regression.

## Assumptions

- The `/api/v1/projects` endpoint returns a paginated JSON response with `data`, `total`, `page`, `limit`, and `totalPages`.
- The items in `data` are project identifiers. The frontend MUST fetch or enrich each identifier with display fields such as name, status, and manager before rendering the list.
- Status values follow the backend enum format `DRAFT`, `CHARITY_REVIEW`, etc., and are mapped to the existing frontend `ProjectStatus` values when needed for display.
- Health values follow the backend enum format `EXCELLENT`, `GOOD`, `AT_RISK`, `CRITICAL` and are mapped to the existing frontend `ProjectHealth` values when needed for display.
- Manager and organization selection options are populated from existing data sources or from the list response itself; this feature focuses on fetching and filtering the list.
- The user is authenticated and authorized to view the project list when they reach the page.
