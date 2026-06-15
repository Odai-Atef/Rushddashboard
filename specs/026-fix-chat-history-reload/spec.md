# Feature Specification: Fix Chat History Reload

**Feature Branch**: `044-fix-chat-history-reload`  
**Created**: 2026-06-13  
**Status**: Draft  
**Input**: User description: "Fix: History chat reload renders empty messages due to DTO mismatch and wrong data source"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Historical Chat Session (Priority: P1)

As a user, I want to click a past analysis session in the history sidebar and see the complete chat transcript rendered correctly, so that I can review previous AI analysis conversations.

**Why this priority**: This is the core bug being fixed. Currently, selecting a history session results in empty assistant messages being displayed, making the history feature unusable for reviewing past work.

**Independent Test**: Can be fully tested by clicking any history sidebar item and verifying that both user prompts and assistant responses are visible with correct content.

**Acceptance Scenarios**:

1. **Given** the user is on the AI Analysis page with previous sessions in the history sidebar, **When** the user clicks a history item, **Then** the full chat transcript (user prompt + assistant response) is rendered in the chat panel.
2. **Given** a historical session with multiple message exchanges, **When** the user loads that session, **Then** all messages appear in the correct chronological order with no empty content.

---

### User Story 2 - View Follow-up Conversations (Priority: P2)

As a user, I want to see any follow-up questions and answers from historical sessions, so that I can review the complete conversation thread including clarifications and additional analysis.

**Why this priority**: Follow-up messages represent meaningful conversation context that is currently lost. This impacts the usefulness of history for understanding the full analysis journey.

**Independent Test**: Can be fully tested by loading a session that contains follow-up exchanges and verifying that questions and answers after the initial analysis are visible.

**Acceptance Scenarios**:

1. **Given** a historical session with follow-up Q&A, **When** the user loads that session, **Then** follow-up questions and assistant responses are displayed alongside the initial analysis.
2. **Given** a session with multiple follow-up rounds, **When** the transcript loads, **Then** all messages appear in chronological sequence order.

---

### User Story 3 - Continue Historical Session (Priority: P3)

As a user, I want to send a new follow-up message after loading a historical session, so that I can continue the conversation from where I left off without starting a new analysis.

**Why this priority**: Enables continued engagement with past analysis work, improving workflow efficiency. Currently this may be broken due to session state issues.

**Independent Test**: Can be fully tested by loading a historical session and attempting to send a new message through the chat input.

**Acceptance Scenarios**:

1. **Given** a historical session has been loaded, **When** the chat panel displays the transcript, **Then** the chat input field is enabled and ready for new messages.
2. **Given** the user types a follow-up question in the enabled chat input, **When** the user sends the message, **Then** the new message is associated with the original session ID and a response is streamed.

---

### Edge Cases

- What happens when the new messages endpoint is not yet deployed? The system should gracefully fall back to the existing behavior with corrected field mapping.
- How does the system handle a session with no messages? The chat panel should show an appropriate empty state.
- What happens if the backend returns messages with roles outside of user/assistant/system? Unknown roles should be handled safely without breaking the UI.
- How are messages with very long content handled? Content should display within the chat panel's scrollable area without layout breakage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When a user selects a historical analysis session, the system MUST load and display the complete chat transcript including user prompts and assistant responses.
- **FR-002**: The system MUST correctly map backend DTO fields to frontend message content, specifically using the `description` field from insights for message content.
- **FR-003**: The system MUST fetch actual chat message records (AnalysisMessage) instead of reconstructing chat from structured insights/results data.
- **FR-004**: The system MUST display historical follow-up questions and answers in chronological order.
- **FR-005**: After loading a historical session, the chat input MUST be enabled (status set to 'complete') so users can send new follow-up messages.
- **FR-006**: The system MUST preserve session continuity by maintaining the original AnalysisSession.id when loading history and sending follow-ups.
- **FR-007**: The system MUST support a fallback mechanism if the new messages endpoint is unavailable, reverting to current behavior with the corrected description field mapping.
- **FR-008**: All historical messages MUST display with `isStreaming: false` to indicate they are complete messages, not live streaming content.

### Key Entities *(include if feature involves data)*

- **Analysis Session**: Represents a complete AI analysis interaction containing metadata, insights, and a collection of messages exchanged between user and assistant.
- **Analysis Message**: An individual chat message record containing role (user, assistant, or system), content text, sequence number for ordering, and creation timestamp.
- **Stream Message**: The frontend representation of a chat message used for rendering in the UI, containing role, content, streaming status, and timestamp.
- **Insight Response**: Structured analysis results from the backend containing fields such as description, which maps to the message content displayed to users.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view a complete historical chat transcript within 2 seconds of clicking a history item.
- **SC-002**: 100% of historical messages display correct content with no empty or undefined messages rendered.
- **SC-003**: All follow-up questions and answers from historical sessions are visible and correctly ordered.
- **SC-004**: Users can successfully send follow-up messages on loaded historical sessions with 100% success rate.
- **SC-005**: Session continuity is maintained — follow-up messages sent after loading history are associated with the original session ID.

## Assumptions

- The backend will provide or already provides a GET endpoint for fetching session messages by session ID.
- If the new messages endpoint is unavailable, the existing insight-based reconstruction (with corrected field mapping) is an acceptable temporary fallback.
- The existing real-time streaming flow for new analysis sessions remains unchanged by these modifications.
- User authentication and authorization for accessing history data are already established.
- Arabic UI text and labels must remain unchanged — only data loading and mapping logic is affected.

## Constraints

- Must not break the existing StreamMessage interface contract.
- Must not break the startAnalysis streaming flow.
- Changes must be scoped to history loading, service calls, and page-level orchestration only.
- Arabic UI text must remain unchanged.
