# Feature Specification: Project Dashboard Summary API Integration

**Feature Branch**: `059-project-dashboard-summary`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "ProjectDashboardPage.tsx imports hardcoded data... Replace all hardcoded data with live API calls to the backend."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Live Project Statistics (Priority: P1)

As a project stakeholder, I want to see up-to-date project statistics on the dashboard so that I can understand the current portfolio state without relying on stale, hardcoded sample data.

**Why this priority**: This is the primary value of the dashboard page; the stats cards are the first thing users see and drive decision-making.

**Independent Test**: Load the project dashboard page and verify that each stat card displays values returned by the backend API, not the static sample numbers.

**Acceptance Scenarios**:

1. **Given** the user navigates to the project dashboard, **When** the dashboard summary API returns successfully, **Then** the stat cards display `total`, `active`, `draft`, `awaitingApproval`, `approved`, `funded`, and `completed` from the response.
2. **Given** the dashboard summary API is unavailable, **When** the user opens the dashboard, **Then** an Arabic error message is shown instead of hardcoded numbers.

---

### User Story 2 - Visualize Project Status Distribution (Priority: P1)

As a project stakeholder, I want the status distribution pie chart to reflect real project data so that I can quickly assess how projects are distributed across lifecycle stages.

**Why this priority**: The pie chart is a core visualization on the dashboard and must be trustworthy for portfolio oversight.

**Independent Test**: Load the dashboard and verify the pie chart slices match the `statusDistribution` array returned by the API.

**Acceptance Scenarios**:

1. **Given** the API returns a `statusDistribution` array, **When** the dashboard renders, **Then** the pie chart displays each entry with the provided Arabic `name`, numeric `value`, and `color`.
2. **Given** the `statusDistribution` array is empty, **When** the dashboard renders, **Then** the chart area shows an empty-state indicator rather than the hardcoded distribution.

---

### User Story 3 - Monitor Budget Trend and Recent Activity (Priority: P2)

As a project stakeholder, I want to see a trend of budget allocation over recent months and the latest project-related activities so that I can track financial momentum and recent changes.

**Why this priority**: These sections add operational context but are secondary to the high-level stats and status overview.

**Independent Test**: Load the dashboard and verify the line chart uses `budgetTrend` data and the activity feed shows entries from `recentActivity` with relative Arabic timestamps.

**Acceptance Scenarios**:

1. **Given** the API returns `budgetTrend` data, **When** the dashboard renders, **Then** the line chart plots each month against its budget value.
2. **Given** the API returns `recentActivity` entries, **When** the dashboard renders, **Then** each entry displays the user name, action, project name, and a relative Arabic time such as "منذ ساعتين".

---

### User Story 4 - Track Upcoming Deadlines (Priority: P2)

As a project stakeholder, I want to see upcoming project deadlines with priority badges so that I can anticipate time-sensitive work.

**Why this priority**: Helps users focus on imminent deliverables; not strictly required for the dashboard to be useful, but expected as part of a complete view.

**Independent Test**: Load the dashboard and verify the upcoming deadlines list reflects `upcomingDeadlines` returned by the API, with color-coded priority badges.

**Acceptance Scenarios**:

1. **Given** the API returns `upcomingDeadlines`, **When** the dashboard renders, **Then** each deadline shows the project name, date, days remaining, and a priority badge (high/medium/low).
2. **Given** there are no upcoming deadlines, **When** the dashboard renders, **Then** the section shows an empty-state message instead of the hardcoded sample entries.

---

### Edge Cases

- What happens when the dashboard summary API returns a `200` with an empty body or missing fields? The page must gracefully fall back to empty states or zero values instead of crashing.
- How does the system handle a network error or 5xx response? It must display an Arabic error message and a retry mechanism is optional for this iteration.
- What happens if `recentActivity` timestamps are in the future or invalid? The relative time helper should not throw and should render the raw timestamp or a fallback string.
- How should the page behave while data is loading? A loading spinner or skeleton must be shown until the API response is received.
- What happens if `project-data.ts` is still imported by other pages when deletion is attempted? Deletion must be deferred until no remaining imports exist, verified by a build/compile check.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project dashboard page MUST fetch summary data from `GET /api/v1/projects/dashboard/summary` when it mounts.
- **FR-002**: The dashboard MUST display live stat counts for total, active, draft, awaiting approval, approved, funded, and completed projects from the API response.
- **FR-003**: The status distribution pie chart MUST render using the `statusDistribution` array returned by the API.
- **FR-004**: The budget trend line chart MUST render using the `budgetTrend` array returned by the API.
- **FR-005**: The recent activity feed MUST render using the `recentActivity` array returned by the API, with each timestamp converted to Arabic relative time.
- **FR-006**: The upcoming deadlines section MUST render using the `upcomingDeadlines` array returned by the API, with priority badges for high, medium, and low priorities.
- **FR-007**: The dashboard MUST show a loading indicator while the summary data is being fetched.
- **FR-008**: The dashboard MUST show an Arabic error message if the summary data cannot be loaded.
- **FR-009**: All hardcoded sample data in `ProjectDashboardPage.tsx` MUST be removed and no longer referenced.
- **FR-010**: The static `project-data.ts` file MUST be removed once the live integration is verified and no other page imports it.

### Key Entities *(include if feature involves data)*

- **DashboardStats**: Aggregate counts representing the portfolio snapshot (total, active, draft, awaitingApproval, approved, funded, completed).
- **StatusDistributionItem**: A single slice of the status pie chart containing an Arabic display name, a numeric count, and a color code.
- **BudgetTrendItem**: A monthly budget data point containing an Arabic month name and a budget amount.
- **RecentActivityItem**: A record of a project-related action containing the user name, action description, affected project name, and ISO timestamp.
- **UpcomingDeadlineItem**: A future project deadline containing the project name, deadline date, days remaining, and priority level.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see dashboard numbers that update automatically when backend data changes, with no hardcoded values visible on the page.
- **SC-002**: Dashboard data loads and renders within 3 seconds under normal network conditions.
- **SC-003**: All five dashboard sections (stats, status distribution, budget trend, recent activity, upcoming deadlines) render correctly from a single API call.
- **SC-004**: The page continues to display a meaningful state (spinner, empty state, or error message) when the API fails or returns incomplete data.

## Assumptions

- The dashboard summary endpoint is already implemented and returns the response shape described by the API contract.
- The existing JWT-based authorization mechanism will attach the required `Authorization` header automatically.
- The `date-fns` Arabic locale is available in the project for relative time formatting.
- Removing `project-data.ts` is safe after verifying that no other pages still import it.
- The dashboard page currently uses Recharts for charts, and the same library will continue to render API-driven data.
