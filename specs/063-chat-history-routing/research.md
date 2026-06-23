# Research: Chat History Routing

**Feature**: Chat History Routing
**Date**: 2026-06-24

## Unknowns Resolved

### 1. How should the frontend read the active chat id from the URL?

**Decision**: Use `react-router`'s `useParams` hook to read `:chatId` from the matched route.

**Rationale**: The project already uses `useParams` for other parameterized routes (e.g., `charity-assessment/assessment/:organizationId`, `project-management/edit/:projectId`). Adding `useParams<{ chatId: string }>()` to `AIAnalysisChatPage` is the idiomatic approach and requires no new dependencies.

**Alternatives considered**:
- Parsing `window.location.pathname` manually — rejected because it bypasses the router and is error-prone.
- Passing the id via location state only — rejected because it does not make the chat addressable or refresh-safe.

### 2. Which existing hook/service method loads a historical chat?

**Decision**: Use `useAnalysisHistory().loadSession(runId, sessionId?)` to fetch persisted messages, then call `useAnalysisStreaming().loadMessages(messages, sessionId)` to populate the workspace.

**Rationale**: `AIAnalysisChatPage` already uses this exact pair in the `continueAnalysisId`/`rerunAnalysisId` flow. `loadSession` handles both session-based messages and run-detail fallback when `sessionId` is null, which covers all current backend shapes.

**Alternatives considered**:
- Calling `analysisService.getSessionMessages` directly from the component — rejected because it duplicates logic already in the hook and skips the run-detail fallback.
- Adding a new `loadChatById` method — rejected because `loadSession` already satisfies the requirement.

### 3. How should the active history item be highlighted?

**Decision**: Map the URL `chatId` to `history.selectedId` and reuse the existing conditional styling in the sidebar (`selectedAnalysis === item.id`).

**Rationale**: The sidebar already has selection styling based on a local `selectedAnalysis` state. Synchronizing that state with the URL parameter makes the active item visually distinct without adding new UI state.

**Alternatives considered**:
- Introducing a new `activeChatId` field in `useAnalysisHistory` — rejected because it expands the hook API for a purely presentational concern.

### 4. What happens when a user starts a new analysis while viewing a chat-specific route?

**Decision**: Navigate back to the base `/dashboard/ai-analysis/chat` route before starting the new analysis.

**Rationale**: Clarified in `/speckit.clarify`. This keeps the URL truthful (no stale id for a new chat) and avoids confusing active-history highlighting.

## No Further Research Required

All implementation questions are resolved from the existing codebase and the clarified specification.
