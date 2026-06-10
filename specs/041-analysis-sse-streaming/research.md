# Research: AI Analysis Real-Time Streaming

**Date**: 2026-06-10
**Feature**: AI Analysis Real-Time Streaming
**Branch**: `041-analysis-sse-streaming`

## Decisions

### 1. EventSource for SSE Streaming
- **Decision**: Use the browser-native `EventSource` API to connect to the backend SSE endpoint.
- **Rationale**: The project already uses standard browser APIs for HTTP (via `fetch` in `ApiClient`). EventSource is purpose-built for SSE and handles reconnection logic automatically. It is simpler than WebSockets for a one-way token stream.
- **Alternatives considered**: WebSockets (overkill for one-way text streaming), manual `fetch` with `ReadableStream` parsing (more code, less reliable reconnection).

### 2. Token Passed as Query Parameter
- **Decision**: Pass the JWT token as a `token` query parameter on the SSE URL, rather than in an HTTP header.
- **Rationale**: `EventSource` does not support custom headers, including the `Authorization` header. The backend contract explicitly requires this approach.
- **Note**: The `analysis-service.ts` already implements this pattern.

### 3. Custom Hook (`useAnalysisStreaming`) for State Management
- **Decision**: Encapsulate all streaming state (messages, status, error, sessionId) in a single reusable React hook.
- **Rationale**: This follows the project's constitution (Core Principle I: Component Reusability and shared logic in custom hooks). It centralizes streaming lifecycle management and makes `AIAnalysisPage.tsx` declarative.

### 4. Message Model with `isStreaming` Flag
- **Decision**: Track whether a message is still receiving tokens via an `isStreaming` boolean on the `StreamMessage` type.
- **Rationale**: This allows the UI to show a typing indicator (cursor) while tokens are arriving and to distinguish between active and finalized messages when rendering.

### 5. Follow-up Chat Disabled During Initial Stream
- **Decision**: Disable the chat input while the initial analysis stream is active.
- **Rationale**: Clarified in the spec. Prevents race conditions between the streaming session state and the follow-up API, which both rely on the same `sessionId`.

### 6. Regenerate as Destructive Retry
- **Decision**: Regenerate clears all current messages and starts a fresh streaming session with no undo or history.
- **Rationale**: Clarified in the spec. A lightweight retry pattern; analysis history is out of scope for this feature.

## Technology Confirmation

- **Framework**: React 18.x + TypeScript (confirmed by `src/` structure)
- **Styling**: Tailwind CSS + shadcn/ui (confirmed by usage in `AIAnalysisPage.tsx`)
- **API Client**: Custom `ApiClient` class using `fetch` (confirmed by `src/api/client.ts`)
- **HTTP Transport**: Native `fetch` + `EventSource` for SSE (no additional libraries needed)
- **State Management**: React hooks + local component state (no Redux/Zustand needed for this scope)

## Integration Points

- `analysisService.triggerStreamingRun()` initiates the session.
- `analysisService.connectToStream(sessionId)` returns the `EventSource`.
- `analysisService.askFollowUp(question, sessionId)` is a standard `POST` via the existing `ApiClient`.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| EventSource connection drops | Medium | `onerror` handler sets status to `error` and displays Arabic message. User can retry via regenerate or new card selection. |
| Token in URL query param | Low | Token is already in localStorage; query param is the standard workaround for SSE auth. HTTPS prevents leakage in transit. |
| Large message history causing re-renders | Low | Messages array is bounded by chat length. If needed, virtualization can be added later. |
| User navigates away mid-stream | Low | `useEffect` cleanup in `useAnalysisStreaming` closes the `EventSource` on unmount. |

## Notes

- The codebase already contains a fully implemented `useAnalysisStreaming.ts` hook and updated `analysis-service.ts` service, as well as an updated `AIAnalysisPage.tsx` that consumes the hook. This research validates those implementation choices.
