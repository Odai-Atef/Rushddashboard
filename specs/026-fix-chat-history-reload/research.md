# Research: Fix Chat History Reload

**Date**: 2026-06-13
**Branch**: `044-fix-chat-history-reload`

## Context

This is a focused bug fix within a React + Vite SPA. The root causes are already well-understood from direct source code inspection:

1. **DTO field mismatch**: `analysis-service.ts` `getRunDetail()` returns insights with field `description`; `useAnalysisHistory.ts` `AnalysisSessionDetail` defines `content: string`. `sessionDetailToMessages()` references `insight.content` which is always `undefined`, producing empty assistant messages.

2. **Wrong data source**: The endpoint returns `AnalysisRun` structured data (insights + results arrays). The actual chat transcript (user prompts + streamed assistant text + follow-up Q&A) is stored in `AnalysisSession.messages` or `markdownResponse`. The frontend reconstructs chat from insights instead of the real transcript.

3. **Missing follow-ups**: Historical follow-ups stored in `AnalysisMessage` are never fetched because no endpoint exists to retrieve them.

## Decisions

### Decision: New endpoint vs. immediate fix
- **Decision**: Implement both — add `getSessionMessages(sessionId)` to call new endpoint, and refactor `sessionDetailToMessages()` to accept `AnalysisMessage[]`. Keep fallback to old behavior with corrected field mapping if endpoint unavailable.
- **Rationale**: The spec (FR-007) explicitly requires fallback. This aligns with progressive deployment.
- **Alternatives considered**: Wait for backend endpoint before fixing frontend (rejected: history feature is currently broken). Fix only DTO field mapping (rejected: does not address follow-ups or wrong data source).

### Decision: Message ordering
- **Decision**: Sort by `sequenceNo` ascending; use `createdAt` as secondary sort if `sequenceNo` ties or is absent.
- **Rationale**: `sequenceNo` is the explicit ordering field. `createdAt` provides stable fallback.

### Decision: Role mapping
- **Decision**: Map `AnalysisMessage.role` directly to `StreamMessage.role` via lowercase string. Unknown roles default to `'assistant'`.
- **Rationale**: Backend likely stores roles in lowercase (`user`, `assistant`, `system`). Defensive fallback prevents UI breakage.

## Technology Context

- **Language/Version**: TypeScript 5.x (React 18.3.1 SPA)
- **Build Tool**: Vite 6.3.5
- **HTTP Client**: Custom `ApiClient` (fetch-based, supports abort signals)
- **State**: React `useState` + `useCallback` hooks
- **UI**: Tailwind CSS + shadcn/ui primitives + Radix UI
- **Markdown**: `react-markdown` with `remark-gfm`
- **Testing**: None configured in this project (no test runner in devDependencies)
