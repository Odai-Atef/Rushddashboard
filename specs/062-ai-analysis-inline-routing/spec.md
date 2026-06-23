# Feature Specification: AI Analysis Router Pages

**Feature Branch**: `[###-feature-name]`
**Created**: 2026-06-23
**Status**: Draft
**Input**: User description: "switch this page /dashboard/ai-analysis to routes and pages inside inline routing"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate directly to an AI analysis sub-page (Priority: P1)

As a platform user, I want to open direct URLs such as `/dashboard/ai-analysis/start`, `/dashboard/ai-analysis/chat`, or `/dashboard/ai-analysis/history` so that I can land on the correct AI analysis screen without relying on internal state.

**Why this priority**: This is the core user journey requested. Without routable sub-pages, users cannot bookmark, share, or refresh specific AI analysis screens.

**Independent Test**: This story can be fully tested by entering each AI analysis sub-page URL directly in the browser and confirming the expected screen renders.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they open `/dashboard/ai-analysis`, **Then** the AI analysis start/intro screen is shown.
2. **Given** the user is authenticated, **When** they open `/dashboard/ai-analysis/start`, **Then** the AI analysis start/intro screen is shown.
3. **Given** the user is authenticated, **When** they open `/dashboard/ai-analysis/chat`, **Then** the AI analysis chat workspace is shown.
4. **Given** the user is authenticated, **When** they open `/dashboard/ai-analysis/history`, **Then** the AI analysis history view is shown.

---

### User Story 2 - Use browser back/forward and refresh within AI analysis (Priority: P1)

As a platform user, I want to use the browser back/forward buttons and refresh the page while inside AI analysis without losing my current screen or progress within the module.

**Why this priority**: Routable pages are expected to behave like normal web pages; losing state on refresh would break the user experience and make the feature feel unfinished.

**Independent Test**: This story can be fully tested by navigating between AI analysis sub-pages using browser controls and refreshing each page.

**Acceptance Scenarios**:

1. **Given** the user is on `/dashboard/ai-analysis/chat`, **When** they click the browser back button, **Then** they return to the previous page they were viewing.
2. **Given** the user is on `/dashboard/ai-analysis/history`, **When** they refresh the browser, **Then** the same history screen is shown.
3. **Given** the user is on `/dashboard/ai-analysis/start`, **When** they click the "تحليل جديد" button, **Then** the browser navigates to `/dashboard/ai-analysis/chat`.

---

### User Story 3 - Maintain existing AI analysis functionality (Priority: P2)

As a platform user, I want all existing AI analysis features such as the start screen, recommended analysis cards, the chat workspace, the analysis history sidebar, and the history page continue working after they are converted to routable pages.

**Why this priority**: The routing change should not regress existing functionality. Existing behavior must be preserved while gaining URL-based navigation.

**Independent Test**: This story can be fully tested by performing the existing actions from the new routable pages and verifying they still produce the same results.

**Acceptance Scenarios**:

1. **Given** the user opens `/dashboard/ai-analysis`, **When** they click a recommended analysis card or the "تحليل جديد" button, **Then** the browser navigates to `/dashboard/ai-analysis/chat` and starts the selected analysis.
2. **Given** the user opens `/dashboard/ai-analysis/chat`, **When** they click the close button on the active analysis, **Then** the browser navigates back to `/dashboard/ai-analysis/start`.
3. **Given** the user opens `/dashboard/ai-analysis/history`, **When** they click a history item, **Then** the browser navigates to `/dashboard/ai-analysis/chat` and loads the selected session.
4. **Given** the user is on the analysis history page, **When** they click "تحليل جديد", **Then** the browser navigates to `/dashboard/ai-analysis/start`.

---

### Edge Cases

- What happens when a user opens an unknown sub-path such as `/dashboard/ai-analysis/unknown`?
- How does the system handle navigation from the sidebar "المحلل التنفيذي الذكي" menu item when already inside a nested AI analysis route?
- What happens to an active streaming analysis when a user navigates from `/dashboard/ai-analysis/chat` to `/dashboard/ai-analysis/history`?
- What happens when a user lands directly on `/dashboard/ai-analysis/chat` without having started an analysis?
- How does the system handle navigation state such as `continueAnalysisId` and `rerunAnalysisId` previously passed through router location state?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST register nested routes under `/dashboard/ai-analysis/*` for each existing AI analysis view.
- **FR-002**: Each AI analysis view MUST be reachable by a unique URL path.
- **FR-003**: In-app navigation between AI analysis views MUST update the browser URL to the corresponding route.
- **FR-004**: The AI analysis start view MUST be available at `/dashboard/ai-analysis` and at `/dashboard/ai-analysis/start`.
- **FR-005**: The AI analysis chat workspace view MUST be available at `/dashboard/ai-analysis/chat`.
- **FR-006**: The AI analysis history view MUST be available at `/dashboard/ai-analysis/history`.
- **FR-007**: Unknown sub-paths under `/dashboard/ai-analysis/*` MUST redirect to the AI analysis start page.
- **FR-008**: Direct access to any AI analysis route MUST render the correct view without requiring a prior visit to the start page.
- **FR-009**: Existing AI analysis functionality such as recommended cards, analysis library modal, streaming chat, follow-up questions, history sidebar, and history page actions MUST continue to work after routing conversion.
- **FR-010**: The sidebar and mobile navigation "المحلل التنفيذي الذكي" links MUST continue to route users to `/dashboard/ai-analysis`.
- **FR-011**: Navigation actions previously routed through `/dashboard/ai-analysis` with location state MUST be routed to the appropriate nested sub-page (`/dashboard/ai-analysis/chat` for continuing or rerunning an analysis, `/dashboard/ai-analysis/start` for new analysis).

### Key Entities

- **AI Analysis View**: One of the screens inside the AI analysis module: start, chat workspace, or history.
- **Analysis Session**: A single AI analysis conversation containing messages, status, and metadata.
- **Analysis History Item**: A past analysis session listed in the history sidebar or history page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate directly to any AI analysis sub-page via URL and see the expected screen within 2 seconds.
- **SC-002**: Browser back, forward, and refresh actions preserve the current AI analysis screen in 100% of tested cases.
- **SC-003**: All three AI analysis views have dedicated routable URLs under `/dashboard/ai-analysis/*`.
- **SC-004**: No existing AI analysis functionality is broken after routing conversion, verified by a manual regression check of start, chat, and history flows.
- **SC-005**: The production build compiles without errors after the routing refactor.

## Assumptions

- The existing `AIAnalysisPage.tsx` component contains the start screen, chat workspace, and history sidebar as internal state-driven sub-components.
- The routing framework is React Router 7, consistent with the rest of the application.
- No backend changes are required; analysis data will continue to be sourced from the same APIs and hooks used today.
- Navigation between views will use `useNavigate` or `NavLink` from React Router instead of internal `activeView` state changes.
- Unknown nested routes will redirect to the AI analysis start page rather than showing a 404 page, preserving the module-level experience.
- The existing `analysis-history` standalone page will be replaced by or integrated into the routable history view under `/dashboard/ai-analysis/history`.
