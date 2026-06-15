# Feature Specification: Fix History Chat UI

**Feature Branch**: `045-fix-history-chat-ui`  
**Created**: 2026-06-14  
**Status**: Draft  
**Input**: User description: "In the /dashboard/ai-analysis page, when a user clicks on an item in the left sidebar "Analysis History" list, the API call to GET /api/v1/analysis/sessions/{sessionId}/messages succeeds and returns the chat message history. However, the chat UI does not appear in the main workspace area. Instead, the "Start Analysis" empty-state placeholder remains visible. Fix: show chat UI when history session is loaded, enable chat input for loaded history sessions, ensure sessionId is preserved for follow-up."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Historical Chat Session (Priority: P1)

A user wants to revisit a previous AI analysis conversation by clicking on it in the Analysis History sidebar. The system should display the historical chat messages in the main workspace, replacing the "Start Analysis" empty state.

**Why this priority**: This is the core bug being fixed — users cannot currently access their historical chat sessions at all, which breaks a primary feature of the Analysis History sidebar.

**Independent Test**: Can be fully tested by clicking a history item in the sidebar and verifying the chat UI replaces the empty state.

**Acceptance Scenarios**:

1. **Given** the user is on the /dashboard/ai-analysis page with at least one item in the Analysis History sidebar, **When** the user clicks on a history item, **Then** the chat interface appears in the main workspace and the "Start Analysis" empty state is no longer visible.
2. **Given** the user has clicked a history item, **When** the session messages are loaded from the API, **Then** the messages display in chronological order (user request, assistant response, follow-ups).

---

### User Story 2 - Send Follow-up in Historical Session (Priority: P2)

A user viewing a historical chat session wants to continue the conversation by sending a follow-up question. The chat input should be enabled, and the follow-up should be sent using the correct historical sessionId.

**Why this priority**: This enables users to continue past conversations rather than starting new analyses, improving productivity and user experience.

**Independent Test**: Can be fully tested by verifying the chat input is enabled after loading history and that a follow-up message is sent with the correct sessionId.

**Acceptance Scenarios**:

1. **Given** a historical session is loaded and displayed in the chat UI, **When** the user types a follow-up question and submits it, **Then** the follow-up request includes the correct historical sessionId.
2. **Given** a historical session with multiple follow-up exchanges is loaded, **When** the user views the chat, **Then** all messages (initial request, assistant response, and all follow-ups) display in correct chronological order.

---

### User Story 3 - Empty State Visibility (Priority: P3)

The "Start Analysis" empty-state placeholder should only appear when no analysis is active and no history session is loaded.

**Why this priority**: Ensures the UI behaves correctly in all states and doesn't confuse users with conflicting empty states.

**Independent Test**: Can be tested by verifying the empty state only appears on initial load and disappears when any session (new or historical) is active.

**Acceptance Scenarios**:

1. **Given** the user is on the /dashboard/ai-analysis page with no active analysis and no history loaded, **When** the page renders, **Then** the "Start Analysis" empty-state placeholder is visible.
2. **Given** the user clicks a history item and then navigates away or clears the session, **When** the workspace returns to its initial state, **Then** the "Start Analysis" empty-state placeholder becomes visible again.

---

### Edge Cases

- What happens when a history session has no messages (empty conversation)?
- How does the system handle a network failure when loading a historical session's messages?
- What happens if a user clicks multiple history items rapidly in succession?
- What happens when the API returns messages for a non-existent or unauthorized sessionId?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When a user clicks an item in the Analysis History sidebar, the system MUST display the chat interface in the main workspace and hide the "Start Analysis" empty-state placeholder.
- **FR-002**: The system MUST load and display historical chat messages in correct chronological order (user request, assistant response, follow-ups).
- **FR-003**: The chat input MUST be enabled for loaded historical sessions so users can send follow-up questions.
- **FR-004**: When a user sends a follow-up question in a historical session, the system MUST include the correct historical sessionId in the request.
- **FR-005**: The "Start Analysis" empty-state placeholder MUST only be visible when no analysis is active and no historical session is loaded.
- **FR-006**: The system MUST support sessions with multiple follow-up exchanges, displaying all messages in chronological order.

### Key Entities *(include if feature involves data)*

- **Analysis History Item**: Represents a previously completed AI analysis session in the sidebar, identified by a sessionId. Attributes: sessionId, title/summary, timestamp.
- **Historical Chat Session**: A loaded conversation from the past, consisting of ordered messages exchanged between user and assistant. Attributes: sessionId, messages (user request, assistant response, follow-ups), status.
- **Chat Message**: A single message within a historical or active session. Attributes: role (user/assistant), content, timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of clicks on Analysis History sidebar items result in the chat UI appearing in the main workspace (zero instances of the empty state remaining visible after a successful history load).
- **SC-002**: Historical chat messages always display in correct chronological order, with 100% accuracy for all message sequences tested.
- **SC-003**: Chat input is enabled within 1 second of a historical session loading, allowing immediate follow-up questions.
- **SC-004**: Follow-up questions sent from historical sessions use the correct sessionId in 100% of cases, with no cross-session contamination.
- **SC-005**: The "Start Analysis" empty state is only visible when no session (new or historical) is active.

## Assumptions

- The backend API endpoints GET /api/v1/analysis/sessions/{sessionId}/messages and GET /api/v1/analysis/history are functioning correctly and return properly formatted data.
- The Analysis History sidebar is already implemented and displays session list items with a sessionId field.
- The useAnalysisHistory hook's loadSession function already calls getSessionMessages() and converts responses to StreamMessage[] format.
- The streaming.loadMessages(messages, sessionId) method exists and receives the message array and sessionId.
- Users have stable internet connectivity when interacting with historical sessions.
