# Feature Specification: AI Analysis History Replay

**Feature Branch**: `042-analysis-history`  
**Created**: 2026-06-10  
**Status**: Draft  
**Input**: User description: "Replace hardcoded analysisHistory array in AIAnalysisPage sidebar with real data from GET /api/v1/analysis/history. Enable clicking a history item to load its session detail and replay chat messages, plus continue with follow-up questions."

## Clarifications

### Session 2026-06-10

- **Q**: When a user clicks a history item while a live stream is active, should the switch be immediate or require confirmation?  
  **A**: Show a confirmation dialog before switching from an active live stream to a historical session, to avoid accidental loss of in-progress work.
- **Q**: Should pagination use infinite scroll or an explicit "Load more" button?  
  **A**: Infinite scroll: the next page loads automatically when the user scrolls to the bottom of the sidebar.
- **Q**: Should the user be able to start a new live analysis while a historical session is loaded, or must they clear it first?  
  **A**: Starting a new live analysis is always allowed and replaces the loaded historical session directly, consistent with existing regenerate behavior.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Analysis History in Sidebar (Priority: P1)

A user opens the AI Analysis page and sees a sidebar listing their past analysis sessions. Each entry shows the title, date, status badge, and a preview of the result. The list is fetched from the backend rather than being hardcoded.

**Why this priority**: This is the core deliverable. Users need visibility into past analyses to resume work or review insights.

**Independent Test**: Can be tested by opening the page and verifying the sidebar populates with entries matching the backend response shape.

**Acceptance Scenarios**:

1. **Given** the user navigates to the AI Analysis page, **When** the page mounts, **Then** a request is sent to fetch the first page of analysis history.
2. **Given** the backend returns a list of sessions, **When** the sidebar renders, **Then** each item displays the session title, a status badge, the start date, and a preview derived from the first insight text.
3. **Given** the history list is loading, **Then** a loading indicator with the text "جاري تحميل سجل التحليلات..." is shown.
4. **Given** the history list is empty, **Then** an empty state message "لا توجد تحليلات سابقة. ابدأ بإنشاء تحليل جديد" is shown.
5. **Given** the history fetch fails, **Then** an error message "فشل في تحميل السجل" appears with a retry button.

---

### User Story 2 - Click History Item to Replay Session (Priority: P1)

A user clicks a completed analysis session in the sidebar. The system loads the full session details and replays the analysis insights and recommendations into the chat area so the user can review the full result without re-running the analysis.

**Why this priority**: Replay is the primary value of the history feature—enabling users to revisit past insights instantly.

**Independent Test**: Can be tested by clicking any history item and verifying the chat area shows the full insight and recommendation text, not token-by-token.

**Acceptance Scenarios**:

1. **Given** the sidebar shows history items, **When** the user clicks an item, **Then** a request is sent to fetch the full session details for that run.
2. **Given** the detail response includes insights and recommendations, **When** the chat area renders, **Then** each insight and recommendation appears as a complete message (not streamed token by token).
3. **Given** a session has been loaded, **Then** the active session identifier is set so follow-up questions can be sent with the correct context.

---

### User Story 3 - Continue Follow-Up on Loaded Session (Priority: P2)

After loading a past analysis session, the user can type follow-up questions in the chat input. The question is sent to the backend using the loaded session identifier, and the answer is appended to the chat thread.

**Why this priority**: Follow-up on historical sessions turns the history into a living knowledge base rather than static records.

**Independent Test**: Can be tested by loading a session, typing a question, and verifying the question and answer appear in the chat thread.

**Acceptance Scenarios**:

1. **Given** a historical session is loaded, **When** the user types a question and submits it, **Then** the question is sent to the follow-up endpoint along with the loaded session identifier.
2. **Given** the backend returns an answer, **When** the response arrives, **Then** the answer is appended to the chat thread below the user’s question.
3. **Given** the backend cannot produce an answer, **When** a fallback response is returned, **Then** the user sees the fallback message in the chat thread.

---

### User Story 4 - Paginate History List (Priority: P2)

When a user has many past analysis sessions, the sidebar initially shows the first 20 entries. Scrolling to the bottom of the sidebar automatically requests the next page and appends new entries.

**Why this priority**: Pagination ensures performance remains acceptable for users with extensive history.

**Independent Test**: Can be tested by having more than 20 history entries and verifying that scrolling triggers a new page request.

**Acceptance Scenarios**:

1. **Given** the sidebar shows the first page of history, **When** the user scrolls to the bottom, **Then** a request for the next page is sent.
2. **Given** the next page returns entries, **When** the response arrives, **Then** the new entries are appended to the bottom of the sidebar list.
3. **Given** the next page returns no entries, **Then** no further page requests are sent.

### Edge Cases

- What happens if the user clicks a history item while a live streaming session is active?  
  → A confirmation dialog is shown. If the user confirms, the live stream is replaced by the loaded historical session. If cancelled, the live stream continues uninterrupted.
- What happens if the user starts a new live analysis while viewing a loaded historical session?  
  → The new analysis replaces the historical session view. The sidebar remains showing the history list.
- What happens if the detail endpoint for a history item fails?  
  → An Arabic error message is shown and the sidebar remains usable.
- What happens if a history item has no insights or recommendations?  
  → The chat area shows an empty state indicating no results are available for that session.
- What happens if the user navigates away from the page while history is loading?  
  → Any in-flight history requests should be safely aborted.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On page mount, the system MUST fetch analysis history from the backend using pagination parameters (page 1, limit 20).
- **FR-002**: The system MUST display each history item with the session title, status badge, start date, and a preview derived from the first insight text.
- **FR-003**: Status badges MUST use color coding: completed sessions in green, running in blue, failed in red, and pending in gray.
- **FR-004**: The system MUST show a loading indicator in the sidebar while history is being fetched.
- **FR-005**: The system MUST show an empty state message when no history entries exist.
- **FR-006**: The system MUST show an error state with a retry button if fetching history fails.
- **FR-007**: When a user clicks a history item, the system MUST fetch the full session details for that run.
- **FR-008**: The system MUST convert the session details (insights and recommendations) into chat messages and display them in the chat area as complete text (not streamed token by token).
- **FR-009**: After loading a historical session, the system MUST enable the chat input so the user can submit follow-up questions.
- **FR-010**: Follow-up questions sent from a loaded historical session MUST include the loaded session identifier.
- **FR-011**: The system MUST support pagination by fetching the next page of history when the user scrolls to the bottom of the sidebar.
- **FR-012**: The system MUST abort any in-flight history requests when the component unmounts.

### Key Entities *(include if feature involves data)*

- **Analysis History Entry**: A summary of a past analysis session.
  - `id`: Unique run identifier.
  - `title`: Human-readable session title.
  - `summary`: Brief description of the analysis.
  - `status`: Lifecycle state (`COMPLETED`, `RUNNING`, `FAILED`, `PENDING`).
  - `durationMs`: Total duration in milliseconds.
  - `startedAt`: Timestamp when the session began.
  - `completedAt`: Timestamp when the session finished (optional).
  - `insightsCount`: Number of insights generated.
  - `recommendationsCount`: Number of recommendations generated.
- **Analysis Session Detail**: Full session data including results.
  - `id`: Run identifier.
  - `title`: Session title.
  - `status`: Session state.
  - `insights`: Array of insight objects.
  - `results`: Array of result objects containing `insightText`, `dimensionData`, and `recommendationText`.
- **Analysis Result**: A single result from a session.
  - `insightText`: Full textual insight.
  - `dimensionData`: Structured data for chart rendering.
  - `recommendationText`: Textual recommendation.
- **Follow-Up Question**: A user question sent after loading a historical session.
  - `question`: The text entered by the user.
  - `sessionId`: The identifier of the loaded historical session.
  - `answer`: The backend response appended to the chat thread.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see their analysis history within 2 seconds of opening the AI Analysis page under normal network conditions.
- **SC-002**: 100% of history items render with the correct status badge color.
- **SC-003**: Clicking a history item loads the full session detail and replays messages in the chat area within 3 seconds.
- **SC-004**: Follow-up questions sent from a loaded historical session use the correct session identifier in 100% of cases.
- **SC-005**: The sidebar paginates correctly, loading the next 20 entries when scrolled to the bottom.
- **SC-006**: When a history fetch fails, an Arabic error message is displayed to the user in 100% of failure cases.
- **SC-007**: Navigating away from the AI Analysis page while history is loading does not leave orphaned requests.

## Assumptions

- The backend endpoints for fetching history, session details, and follow-up are already implemented and available.
- Users are authenticated and possess a valid token required to authorize history requests.
- The existing chat UI already supports rendering complete messages; this feature adds the data source for historical sessions.
- The `insightText` field contains enough content to derive a meaningful preview (first 100 characters).
- Pagination is cursor-based or offset-based with a fixed page size of 20.
- Historical sessions do not support token-by-token replay; they render as full messages.
- The existing `useAnalysisStreaming` hook already supports follow-up questions with a session identifier.
