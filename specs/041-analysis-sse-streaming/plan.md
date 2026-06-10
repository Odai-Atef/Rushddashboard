# Implementation Plan: AI Analysis Real-Time Streaming

**Branch**: `041-analysis-sse-streaming` | **Date**: 2026-06-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/041-analysis-sse-streaming/spec.md`

## Summary

Replace the simulated AI analysis workflow in `AIAnalysisPage.tsx` with a real backend streaming pipeline powered by Server-Sent Events (SSE). The implementation introduces a reusable `useAnalysisStreaming` hook that manages the full lifecycle of an analysis session—initiating a streaming run, connecting to a live token stream, stopping on demand, handling follow-up chat, and resetting for regeneration. The page component is updated to render live tokens, sync progress steps to the actual connection state, and wire all user actions to the hook.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x  
**Primary Dependencies**: Tailwind CSS, shadcn/ui, React Router v7, recharts (for embedded charts)  
**Storage**: N/A (state lives in React hook memory; no persistence required)  
**Testing**: Vitest (or Jest) + React Testing Library for hook and component tests  
**Target Platform**: Modern browsers supporting `EventSource` and `fetch`  
**Project Type**: Web application (frontend)  
**Performance Goals**: First token rendered within 3 seconds; stop action completes within 1 second  
**Constraints**: Token passed as URL query param for SSE auth (EventSource limitation); Arabic RTL text rendering  
**Scale/Scope**: Single user per tab; no concurrent sessions per user; chat history is ephemeral per session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Component Reusability | ✅ Pass | `useAnalysisStreaming` is a reusable hook extracted from page logic. Service methods are in `AnalysisService` class. |
| Clean Code / OOP | ✅ Pass | `AnalysisService` encapsulates API logic. Hook has single responsibility: streaming session state management. |
| Environment-Driven Config | ✅ Pass | API base URL comes from `ENV.API_BASE_URL` via `ApiClient`. No hardcoded URLs. |
| API Abstraction Layer | ✅ Pass | All HTTP calls use the existing `ApiClient` class. SSE connection is brokered through `AnalysisService.connectToStream()`. |
| Comprehensive Documentation | ✅ Pass | Service methods include JSDoc. Quickstart and data model docs generated. |

## Project Structure

### Documentation (this feature)

```text
specs/041-analysis-sse-streaming/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── sse-events.md    # SSE event contract
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts                 # Existing ApiClient
│   ├── services/
│   │   └── analysis-service.ts   # AnalysisService (streaming methods added)
│   └── types.ts                  # ApiResponse, ApiError types
├── app/
│   ├── components/
│   │   └── AIAnalysisPage.tsx    # Updated: hooks into real streaming
│   ├── hooks/
│   │   ├── useAnalysisStreaming.ts   # NEW: streaming session hook
│   │   ├── useAnalysisCategories.ts  # Existing
│   │   └── useAnalysisLibraryItems.ts # Existing
│   └── utils/
│       └── icon-map.ts           # Existing
├── lib/
│   └── env.ts                    # Environment config
└── styles/
    └── ...                       # Tailwind / global styles
```

**Structure Decision**: Single frontend web application. No backend changes. The existing `src/` layout is preserved; only three files are created or materially modified.

## Complexity Tracking

> No Constitution Check violations detected. Complexity tracking table is not required.

## Phase 0: Research

**Artifact**: [research.md](research.md)

Key decisions validated:
- EventSource is the correct API for SSE streaming.
- Token-as-query-param is the standard workaround for SSE authentication.
- Custom hook (`useAnalysisStreaming`) is the right abstraction for streaming state.
- Follow-up input must be disabled during initial streaming to avoid session confusion.
- Regenerate is a destructive retry with no undo.

## Phase 1: Design

### Data Model

**Artifact**: [data-model.md](data-model.md)

Core entities:
- `StreamMessage`: id, role, content, isStreaming, timestamp, sql?, data?, fallback?
- `AnalysisSession`: sessionId, analysisRunId, status, messages, error
- `StreamingStatus`: idle | connecting | streaming | complete | error

### Contracts

**Artifact**: [contracts/sse-events.md](contracts/sse-events.md)

Defines SSE event types:
- `token` → append content to assistant message
- `complete` → mark session complete, stop streaming
- `error` → mark session error, display Arabic message

### Quickstart

**Artifact**: [quickstart.md](quickstart.md)

Covers architecture overview, key files, streaming lifecycle, and local testing.

## Implementation Strategy

### Files to Create

1. `src/app/hooks/useAnalysisStreaming.ts`
   - Exports `useAnalysisStreaming()` hook
   - Manages messages array, status, error, sessionId
   - Provides `startAnalysis`, `sendFollowUp`, `stopStreaming`, `reset`
   - Handles EventSource lifecycle: open, message, error, close, cleanup

### Files to Modify

2. `src/api/services/analysis-service.ts`
   - Add `triggerStreamingRun(analysisItemId, filters)` → POST
   - Add `connectToStream(sessionId)` → returns EventSource with token query param
   - Add `askFollowUp(question, sessionId)` → POST

3. `src/app/components/AIAnalysisPage.tsx`
   - Remove `streamText()`, `startAnalysisWorkflow()`, all `setTimeout` simulation loops
   - Remove `generatingText`, `isGenerating`, `isAnalysisComplete` local simulation states
   - Import and use `useAnalysisStreaming` hook
   - Wire `handleSelectLibraryItem` → `streaming.startAnalysis(item.id, filters)`
   - Wire `handleSendMessage` → `streaming.sendFollowUp(chatInput)`
   - Wire `stopGenerating` → `streaming.stopStreaming()`
   - Wire `regenerateAnalysis` → `streaming.reset()` then `startAnalysis()`
   - Map `streaming.status` to `progressSteps` states
   - Render messages from `streaming.messages` instead of `generatingText`
   - Show loading skeleton when `streaming.status === 'connecting'`
   - Disable chat input when `streaming.status !== 'complete'`
   - Show Arabic error message when `streaming.error` is set

## Testing Approach

| Layer | Strategy |
|-------|----------|
| Hook (`useAnalysisStreaming`) | Unit test with mock EventSource and mocked `analysisService`. Verify state transitions, message accumulation, stop/reset behavior. |
| Service (`AnalysisService`) | Mock `apiClient` to verify correct endpoint URLs, HTTP methods, and payload shapes. |
| Component (`AIAnalysisPage`) | Integration test rendering with mocked hook. Verify progress step sync, message rendering, chat input enable/disable. |
| E2E (optional) | Use Cypress/Playwright to click a card, intercept SSE, verify token-by-token rendering. |

## Dependencies

- No new npm packages required. `EventSource` is a native browser API.
- Existing dependencies: `react`, `lucide-react`, `recharts`, `tailwind-merge`, `class-variance-authority`.

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| EventSource not supported in older browsers | Target is modern browsers; `EventSource` is supported in all evergreen browsers. |
| Token exposure in URL query param | HTTPS prevents leakage in transit. Token is short-lived JWT. |
| Memory leak from unclosed EventSource | `useEffect` cleanup in hook closes EventSource on unmount. |
| Rapid token updates causing re-render thrashing | Tokens are appended via functional state update (`setMessages(prev => ...)`), not batched imperatively. |

## Post-Implementation Verification

- [ ] Clicking analysis card triggers POST to `/streaming-run` with correct payload.
- [ ] EventSource connects to `/stream/{sessionId}?token={jwt}`.
- [ ] Tokens appear progressively in the chat area.
- [ ] Progress steps reflect actual SSE status.
- [ ] Stop button closes EventSource and retains partial text.
- [ ] Regenerate clears messages and starts a new session.
- [ ] Follow-up question POSTs to `/follow-up` and appends answer.
- [ ] Error state displays Arabic message.
- [ ] Loading skeleton shown while `connecting`.
- [ ] No simulation code (`setTimeout`, `streamText`, `startAnalysisWorkflow`) remains.

## Suggested Next Command

`/speckit.tasks` — to generate implementation task list.
