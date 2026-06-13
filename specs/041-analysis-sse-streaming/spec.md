# Feature Specification: AI Analysis Real-Time Streaming

**Feature Branch**: `041-analysis-sse-streaming`  
**Created**: 2026-06-10  
**Status**: Draft  
**Input**: User description: "Replace simulated analysis with real backend streaming via SSE, live token rendering, progress sync, and follow-up chat"

## Clarifications

### Session 2026-06-10

- **Q**: Should follow-up chat input be allowed while the initial analysis stream is active?  
  **A**: The follow-up chat input MUST be disabled while the initial analysis stream is active, to avoid session state confusion.
- **Q**: When a user stops an in-progress stream, should the partial analysis text be treated as a persistent message in the conversation history or as transient UI state?  
  **A**: The partial text rendered up to the point of stopping MUST be treated as a persistent message in the conversation history.
- **Q**: When a user regenerates an analysis, should the cleared state be permanently lost or should there be undo/history support?  
  **A**: Regeneration is a destructive retry with no undo; the previous result and messages are permanently lost.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trigger Real Analysis Streaming (Priority: P1)

A user on the AI Analysis dashboard selects an analysis card from the library. The system initiates a connection to the backend to begin a real analysis run, receives a session identifier, and opens a live streaming channel to receive the analysis result in real time. The user sees a loading state while the connection is being established, then watches the AI-generated Arabic analysis text appear token by token as the backend produces it.

**Why this priority**: This is the core deliverable. Replacing simulated text with a live backend stream restores trust and provides actual analytical value.

**Independent Test**: Can be fully tested by selecting any analysis card and verifying that the backend receives a streaming-run request and that the response text originates from the live stream, not from hardcoded or local simulation.

**Acceptance Scenarios**:

1. **Given** the user is on the AI Analysis page, **When** they click an analysis card, **Then** the system sends a request to initiate a streaming analysis run using the card’s unique identifier and any active filters (date range and row limit).
2. **Given** the backend responds with a session identifier, **When** the connection state transitions to connecting, **Then** a loading skeleton is shown to inform the user that the analysis is starting.
3. **Given** the live streaming channel is open, **When** tokens arrive from the backend, **Then** the AI response area renders each token immediately so the text appears progressively, word by word.

---

### User Story 2 - See Live Progress During Analysis (Priority: P1)

While the analysis is running, the user sees a multi-step progress indicator that reflects the actual connection and streaming state. Steps transition from connecting, through active streaming, to completion, giving the user clear feedback that the system is working.

**Why this priority**: Progress visualization reduces perceived wait time and confirms the system is actively processing rather than frozen.

**Independent Test**: Can be tested by observing the progress steps while a streaming session is active and verifying they map to the real connection lifecycle.

**Acceptance Scenarios**:

1. **Given** the user has selected an analysis card, **When** the system is establishing the streaming connection, **Then** the first progress step is active and visible.
2. **Given** the streaming connection is active and tokens are arriving, **Then** intermediate progress steps are marked complete and the final streaming step is active.
3. **Given** the backend signals that streaming is complete, **Then** all progress steps are marked complete and the final analysis text is fully rendered.

---

### User Story 3 - Stop an In-Progress Analysis (Priority: P2)

A user who has started an analysis may decide to stop it before completion, for example if they selected the wrong card or the response is taking too long. The stop action immediately terminates the live stream and halts any further rendering, leaving the user in control.

**Why this priority**: Providing an explicit stop affordance prevents user frustration and saves unnecessary backend compute.

**Independent Test**: Can be tested by clicking the stop button during an active stream and verifying no further content appears and the connection is closed.

**Acceptance Scenarios**:

1. **Given** an analysis is actively streaming, **When** the user clicks the stop button, **Then** the streaming connection is closed immediately and no additional tokens are rendered.
2. **Given** the user has stopped the stream, **Then** the analysis text rendered up to that point remains visible and the UI returns to an idle state allowing a new analysis to be started.

---

### User Story 4 - Ask Follow-Up Questions (Priority: P2)

After an analysis completes, the user can type a follow-up question in the chat input and receive an answer from the backend. The question and the backend’s answer are appended to the conversation history so the user retains context.

**Why this priority**: Follow-up chat transforms a one-off analysis into an interactive dialogue, increasing the depth of insight users can extract.

**Independent Test**: Can be tested by typing a question after an analysis completes and verifying the question and the answer both appear in the chat thread.

**Acceptance Scenarios**:

1. **Given** an analysis session has completed, **When** the user types a question and submits it, **Then** the question is sent to the backend along with the current session identifier.
2. **Given** the backend returns an answer, **When** the response is received, **Then** the answer is appended to the chat thread below the user’s question.
3. **Given** the backend cannot produce an answer, **When** a fallback response is returned, **Then** the user sees the fallback message in the chat thread.

**Constraint**: The follow-up chat input MUST remain disabled while the initial analysis stream is active, to avoid session state confusion.

---

### User Story 5 - Regenerate Analysis (Priority: P2)

A user who is unsatisfied with an analysis result can regenerate it. This clears the current result and conversation history, then re-initiates the full streaming pipeline from the beginning for the same analysis card.

**Why this priority**: Regeneration gives users a simple path to retry without having to re-select the card and re-enter filters manually.

**Independent Test**: Can be tested by clicking the regenerate button and verifying the chat clears and a new streaming session starts.

**Acceptance Scenarios**:

1. **Given** an analysis has completed or been stopped, **When** the user clicks regenerate, **Then** the previous messages and analysis text are cleared.
2. **Given** the regenerate action is triggered, **Then** a new streaming-run request is issued for the same analysis card and filters, and the progress steps and token rendering begin anew.

---

### User Story 6 - Handle Streaming Failures Gracefully (Priority: P2)

If the live stream fails at any point—due to network interruption, backend error, or session expiry—the user sees a friendly message in Arabic explaining what happened. The UI remains stable and allows the user to retry or start a different analysis.

**Why this priority**: Network and backend failures are inevitable; graceful handling preserves user trust and prevents app crashes.

**Independent Test**: Can be tested by simulating a stream failure and verifying an Arabic error message is shown and the UI does not become unresponsive.

**Acceptance Scenarios**:

1. **Given** an active streaming session, **When** the connection is unexpectedly lost or the backend returns an error, **Then** an Arabic error message is displayed to the user.
2. **Given** a stream error has occurred, **Then** the stop and regenerate controls remain available so the user can retry.

### Edge Cases

- What happens if the user clicks a second analysis card while one is already streaming?  
  → The new selection should replace the current streaming session: stop the existing stream, clear the current state, and start a new one.
- What happens if the user submits a follow-up question while the initial analysis is still streaming?  
  → The follow-up should be queued or the user input should be disabled until the initial stream completes, to avoid session confusion.
- What happens if the backend streaming-run endpoint responds but the stream endpoint never opens?  
  → The connecting state should eventually surface an Arabic error message prompting the user to retry.
- What happens if the user navigates away from the AI Analysis page while streaming?  
  → The streaming connection should be safely closed so no background processes or leaks remain.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When a user selects an analysis card, the system MUST request a new streaming-run session from the backend using the card identifier and any active filter values (date range and row limit).
- **FR-002**: The system MUST establish a live streaming connection using the session identifier returned by the backend.
- **FR-003**: The system MUST display a loading skeleton while the streaming connection is in the connecting state.
- **FR-004**: As tokens arrive from the live stream, the system MUST append them immediately to the analysis text area so the response appears progressively in real time.
- **FR-005**: The progress indicator MUST synchronize its step states to the actual streaming lifecycle: connecting, actively streaming, and complete.
- **FR-006**: The system MUST provide a stop control that closes the active streaming connection on demand.
- **FR-007**: After an analysis completes, the system MUST allow the user to submit follow-up questions, sending each question with the current session identifier and appending the backend answer to the conversation.
- **FR-008**: The system MUST provide a regenerate control that clears the current result and messages, then re-initiates the full streaming pipeline for the same analysis card.
- **FR-009**: If the streaming connection fails or the backend returns an error during streaming, the system MUST display a user-friendly error message in Arabic.
- **FR-010**: The system MUST pass the user’s authentication token as part of the streaming connection request so the backend can authorize the session.
- **FR-011**: When a user selects a different analysis card while one is already in progress, the system MUST terminate the current stream and begin a new one.

### Key Entities *(include if feature involves data)*

- **Analysis Session**: Represents a single streaming analysis lifecycle.
  - `sessionId`: Unique identifier returned by the backend after initiating a streaming run.
  - `analysisRunId`: Identifier for the specific analysis run.
  - `status`: Current lifecycle state of the session (connecting, streaming, complete, error).
  - `messages`: Conversation history including the initial analysis text and any follow-up question/answer pairs.
- **Analysis Card**: An available analysis that a user can select to run.
  - `id`: Unique identifier used to request a streaming run.
  - `title`, `description`, `category`, etc.: Display fields.
- **Filter**: Constraints applied to an analysis run.
  - `date_from`, `date_to`: Date range boundaries.
  - `limit`: Maximum number of rows to analyze.
- **Follow-Up Question**: A user question submitted after an analysis completes.
  - `question`: The text entered by the user.
  - `answer`: The backend’s response, which may include explanatory text, structured data, or a fallback message.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see the first token of an analysis response within 3 seconds of selecting a card under normal network conditions.
- **SC-002**: 100% of analysis selections result in a backend streaming-run request rather than a local simulation.
- **SC-003**: The progress indicator accurately reflects the actual streaming connection state in 100% of observed sessions.
- **SC-004**: Users can stop an active stream and the system ceases rendering new content within 1 second of the stop action.
- **SC-005**: Follow-up questions submitted after an analysis complete are answered and displayed in the chat thread within 5 seconds under normal network conditions.
- **SC-006**: When a stream error occurs, an Arabic error message is displayed to the user in 100% of failure cases.
- **SC-007**: Navigating away from the AI Analysis page while streaming does not leave orphaned connections or memory leaks.

## Assumptions

- The backend endpoints for streaming-run, live stream, and follow-up are already implemented and available.
- Users are authenticated and possess a valid token required to authorize streaming connections.
- Analysis cards already include unique identifiers compatible with the streaming-run request schema.
- The existing filter controls (date range and row limit) are preserved and their values are forwarded to the streaming-run request.
- Token-by-token rendering is sufficient for displaying Arabic text; no additional right-to-left layout changes are required beyond what already exists.
- The current chat UI already supports appending messages in a thread; this feature only changes the source of the message content from local simulation to backend API.
