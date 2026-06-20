# Feature Specification: Charity Assessment Router Pages

**Feature Branch**: `055-charity-assessment-router-pages`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "convert this dashboard/charity-assessment to pages like dashboard/charity-assessment/* instead of inline routing"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate directly to a charity assessment sub-page (Priority: P1)

As a charity user or platform administrator, I want to open a direct URL such as `/dashboard/charity-assessment/assessment` or `/dashboard/charity-assessment/results` so that I can land on the correct assessment screen without first visiting the charity assessment start page.

**Why this priority**: This is the core user journey requested. Without routable sub-pages, users cannot bookmark, share, or refresh specific charity assessment screens.

**Independent Test**: This story can be fully tested by entering each charity assessment sub-page URL directly in the browser and confirming the expected screen renders.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they open `/dashboard/charity-assessment`, **Then** the charity assessment start/intro screen is shown.
2. **Given** the user is authenticated, **When** they open `/dashboard/charity-assessment/assessment`, **Then** the assessment wizard screen is shown.
3. **Given** the user is authenticated, **When** they open `/dashboard/charity-assessment/results`, **Then** the results dashboard screen is shown.
4. **Given** the user is authenticated, **When** they open `/dashboard/charity-assessment/roadmap`, **Then** the improvement roadmap screen is shown.

---

### User Story 2 - Use browser back/forward and refresh within charity assessment (Priority: P1)

As a charity user, I want to use the browser back/forward buttons and refresh the page while inside charity assessment without losing my current screen or assessment progress.

**Why this priority**: Routable pages are expected to behave like normal web pages; losing state on refresh would break the user experience and make the feature feel unfinished.

**Independent Test**: This story can be fully tested by navigating between charity assessment sub-pages using browser controls and refreshing each page.

**Acceptance Scenarios**:

1. **Given** the user is on `/dashboard/charity-assessment/assessment`, **When** they click the browser back button, **Then** they return to the previous page they were viewing.
2. **Given** the user is on `/dashboard/charity-assessment/results`, **When** they refresh the browser, **Then** the same results screen is shown.
3. **Given** the user is on `/dashboard/charity-assessment`, **When** they click the "بدء التقييم" button, **Then** the browser navigates to `/dashboard/charity-assessment/assessment`.

---

### User Story 3 - Maintain existing charity assessment functionality (Priority: P2)

As a charity user, I want all existing charity assessment features such as the start screen, assessment wizard, results dashboard, and improvement roadmap to continue working after they are converted to routable pages.

**Why this priority**: The routing change should not regress existing functionality. Existing behavior must be preserved while gaining URL-based navigation.

**Independent Test**: This story can be fully tested by performing the existing actions from the new routable pages and verifying they still produce the same results.

**Acceptance Scenarios**:

1. **Given** the user opens `/dashboard/charity-assessment`, **When** they click the "بدء التقييم" button, **Then** the browser navigates to `/dashboard/charity-assessment/assessment`.
2. **Given** the user opens `/dashboard/charity-assessment`, **When** they click the "عرض نتائج سابقة" button, **Then** the browser navigates to `/dashboard/charity-assessment/results`.
3. **Given** the user opens `/dashboard/charity-assessment/results`, **When** they click the "عرض خارطة الطريق" button, **Then** the browser navigates to `/dashboard/charity-assessment/roadmap`.
4. **Given** the user opens `/dashboard/charity-assessment/assessment`, **When** they complete or skip the wizard, **Then** the browser navigates to `/dashboard/charity-assessment/results`.
5. **Given** the user opens `/dashboard/charity-assessment/roadmap`, **When** they click the "العودة للنتائج" button, **Then** the browser navigates to `/dashboard/charity-assessment/results`.
6. **Given** the user opens `/dashboard/charity-assessment/results`, **When** they click the "إعادة التقييم" button, **Then** the browser navigates to `/dashboard/charity-assessment/assessment`.

---

### Edge Cases

- What happens when a user opens an unknown sub-path such as `/dashboard/charity-assessment/unknown`?
- How does the system handle navigation from the sidebar "تقييم الجاهزية" menu item when already inside a nested charity assessment route?
- What happens to in-progress assessment answers when a user refreshes the assessment wizard page?
- How does the system behave when a user lands directly on `/dashboard/charity-assessment/results` without having completed an assessment?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST register nested routes under `/dashboard/charity-assessment/*` for each existing charity assessment view.
- **FR-002**: Each charity assessment view MUST be reachable by a unique URL path.
- **FR-003**: In-app navigation between charity assessment views MUST update the browser URL to the corresponding route.
- **FR-004**: The charity assessment start view MUST be available at `/dashboard/charity-assessment`.
- **FR-005**: The assessment wizard view MUST be available at `/dashboard/charity-assessment/assessment`.
- **FR-006**: The results dashboard view MUST be available at `/dashboard/charity-assessment/results`.
- **FR-007**: The improvement roadmap view MUST be available at `/dashboard/charity-assessment/roadmap`.
- **FR-008**: Unknown sub-paths under `/dashboard/charity-assessment/*` MUST redirect to the charity assessment start page.
- **FR-009**: Direct access to any charity assessment route MUST render the correct view without requiring a prior visit to the start page.
- **FR-010**: Existing charity assessment functionality such as category questions, progress tracking, charts, strengths, gaps, roadmap items, and AI recommendations MUST continue to work after routing conversion.
- **FR-011**: The sidebar and mobile navigation "تقييم الجاهزية" links MUST continue to route users to `/dashboard/charity-assessment`.

### Key Entities

- **Charity Assessment View**: One of the screens inside the charity assessment module: start, assessment wizard, results dashboard, or improvement roadmap.
- **Assessment Category**: A readiness dimension such as governance, financial stability, human resources, volunteers, technology, projects, fundraising, impact measurement, strategy, or risk management, containing one or more questions.
- **Roadmap Item**: A prioritized improvement initiative with status, effort, impact, category, and due date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate directly to any charity assessment sub-page via URL and see the expected screen within 2 seconds.
- **SC-002**: Browser back, forward, and refresh actions preserve the current charity assessment screen in 100% of tested cases.
- **SC-003**: All four charity assessment views have dedicated routable URLs under `/dashboard/charity-assessment/*`.
- **SC-004**: No existing charity assessment functionality is broken after routing conversion, verified by a manual regression check of start, assessment wizard, results, and roadmap flows.
- **SC-005**: The production build compiles without errors after the routing refactor.

## Assumptions

- The existing `CharityAssessmentPage.tsx` component contains the start, assessment wizard, results, and roadmap views as internal state-driven sub-components.
- The routing framework is React Router 7, consistent with the rest of the application.
- No backend changes are required; assessment data will continue to be sourced from the same mock data used today.
- Navigation between views will use `useNavigate` or `NavLink` from React Router instead of internal `currentView` state changes.
- Unknown nested routes will redirect to the charity assessment start page rather than showing a 404 page, preserving the module-level experience.
- Assessment state during the wizard is expected to reset when refreshing the assessment page, consistent with the current mock-only behavior.
