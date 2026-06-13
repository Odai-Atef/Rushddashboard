# Feature Specification: Follow-up Chat Error Handling

**Feature Branch**: `[043-followup-error-loading]`  
**Created**: 2025-06-13  
**Status**: Draft  
**Input**: User description: "Fix: Follow-up chat input lacks loading guard and error handling. In useAnalysisStreaming.ts, sendFollowUp() makes a POST request to /api/v1/analysis/follow-up but does not set isLoading or disable the submit button during the request. The user can double-click 'إرسال', causing duplicate requests. When the backend returns 404 (missing endpoint), the error is rendered as text inside the assistant bubble but the UI still shows an empty streaming placeholder."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prevent Double Submission (Priority: P1)

As a user asking a follow-up question in the AI analysis chat, I want the submit button and input field to be disabled while the request is in flight, so that I cannot accidentally submit the same question twice.

**Why this priority**: Duplicate requests waste backend resources and can produce confusing duplicate responses.

**Independent Test**: Can be fully tested by sending a follow-up and observing that the input and submit button become disabled until the response arrives.

**Acceptance Scenarios**:

1. **Given** the user has typed a follow-up question, **When** they click the submit button, **Then** the input field and submit button become disabled and the global loading indicator (if present) shows activity.
2. **Given** a follow-up request is in progress, **When** the user tries to click submit again, **Then** the click is ignored and no duplicate request is sent.

---

### User Story 2 - Visible Error State for Failed Follow-ups (Priority: P1)

As a user, when a follow-up request fails (e.g. 404 or 500), I want to see a clear error banner above the chat input, not just error text inside the message bubble, so I immediately understand something went wrong.

**Why this priority**: An inline error inside a streaming assistant bubble is easy to miss and looks like part of the content.

**Independent Test**: Can be fully tested by triggering a 404/500 follow-up response and verifying a distinct error banner appears.

**Acceptance Scenarios**:

1. **Given** a follow-up request returns 404, **When** the UI updates, **Then** a red-bordered error banner appears above the input area with Arabic-localized error text.
2. **Given** a follow-up request returns 500, **When** the UI updates, **Then** the assistant streaming placeholder stops showing the loading cursor and the error banner is visible.

---

### User Story 3 - Retry Failed Follow-up (Priority: P2)

As a user, after seeing an error banner, I want a retry button that re-sends my last follow-up question, so I don't have to retype it.

**Why this priority**: Retyping long or complex Arabic questions is frustrating; one-click retry improves user retention.

**Independent Test**: Can be fully tested by clicking the retry button and observing the same question is re-sent.

**Acceptance Scenarios**:

1. **Given** the error banner is visible with a retry button, **When** the user clicks retry, **Then** the same follow-up question is sent again, the banner disappears, and the input/button disable again.
2. **Given** a retry is in progress, **When** the request succeeds, **Then** the error banner stays hidden and the response replaces the previous error bubble.

---

### Edge Cases

- What happens if the user switches history while a follow-up is loading?  
  → The loading state should be tied to the active session; switching sessions resets the hook state.
- What happens if the backend returns a network-level error (no HTTP status)?  
  → The error banner should show a generic Arabic-localized connection error.
- What happens if sendFollowUp is called with no active sessionId?  
  → The function returns early and shows an appropriate error, as it does today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `sendFollowUp()` MUST set `status = 'streaming'` at the start of execution so `isLoading` evaluates to `true`.
- **FR-002**: `sendFollowUp()` MUST reset `status` to `'complete'` after a successful response or after an error response.
- **FR-003**: If `askFollowUp()` throws, the hook MUST update the last assistant placeholder message with the error text and set `isStreaming: false`.
- **FR-004**: The UI MUST display a distinct visual error state (e.g., red-bordered banner) above the chat input instead of (or in addition to) rendering error text inside the markdown bubble.
- **FR-005**: The chat input field and submit button MUST be disabled while `isLoading` is `true`, preventing double submission.
- **FR-006**: The error banner MUST include a "Retry" button that invokes `sendFollowUp()` with the same question.
- **FR-007**: The existing SSE streaming flow (`startAnalysis`) MUST remain unchanged.
- **FR-008**: Error messages MUST be Arabic-localized where possible, reusing existing error strings in the codebase.

### Key Entities *(include if feature involves data)*

- **StreamingStatus**: `'idle' | 'connecting' | 'streaming' | 'complete' | 'error'` — governs `isLoading` and UI state.
- **StreamMessage**: `{ id, role, content, isStreaming?, timestamp, sql?, data?, fallback? }` — each chat message row.
- **pendingRetryQuestion**: A transient string held in component state for the retry button to resubmit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Submitting a follow-up disables the submit button and input field within 100 ms.
- **SC-002**: A 404 or 500 error from the backend renders a visible error banner within 1 second.
- **SC-003**: The retry button re-sends the exact same question text with a single click.
- **SC-004**: No duplicate follow-up requests are generated by rapid clicking.
- **SC-005**: The existing SSE streaming flow (`startAnalysis`) passes existing regression tests unchanged.

## Assumptions

- The `useAnalysisStreaming` hook exposes `isLoading` (already derived from `status === 'connecting' || status === 'streaming'`).
- The `AIAnalysisPage` component already imports `useAnalysisStreaming` and controls the input/button visibility.
- Arabic localization strings already exist in the project or can be added inline without i18n library changes.
- The retry button should only retry the most recent failed follow-up question, not an arbitrary message in history.

