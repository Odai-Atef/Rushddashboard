# Implementation Plan: Chat History Routing

**Branch**: `065-chat-history-routing` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/063-chat-history-routing/spec.md`

## Summary

Add URL-addressable chat sessions to the AI analysis chat page. A user can click any item in the left history panel to navigate to `/dashboard/ai-analysis/chat/:chatId`, load the full conversation, and see the item highlighted as active. Direct links and browser refresh must also restore the requested chat. Starting a new analysis from a chat-specific route navigates back to the base route.

## Technical Context

**Language/Version**: TypeScript 6.x / React 18.3.1
**Primary Dependencies**: react-router 7.13.0, Vite 6.3.5, Tailwind CSS 4.1.12, Radix UI primitives, Lucide icons, react-markdown
**Storage**: Browser `localStorage` for auth token; `sessionStorage` for active streaming session recovery. Backend history/session data via REST/SSE.
**Testing**: No test framework currently configured in `package.json`; manual/Playwright-based verification is the practical path.
**Target Platform**: Modern web browsers (desktop primary, mobile responsive)
**Project Type**: Single-page web application (frontend-only monolith)
**Performance Goals**: Chat opens in <2 seconds from history click (per spec SC-001)
**Constraints**: Must reuse existing `useAnalysisHistory` and `useAnalysisStreaming` hooks; avoid duplicating history-fetch or session-load logic.
**Scale/Scope**: One route addition under `/dashboard/ai-analysis/chat/:chatId`; affects `AIAnalysisChatPage.tsx` and `src/app/routes.tsx`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution template is currently a placeholder (no ratified principles). No explicit gates are enforced. We apply default frontend best practices:

- Keep changes localized to the AI analysis module.
- Reuse existing hooks and service methods rather than introducing new abstractions.
- Do not break the existing base `/dashboard/ai-analysis/chat` behavior.

No violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/063-chat-history-routing/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── routes.tsx                    # Add chat-specific route
│   ├── components/
│   │   └── ai-analysis/
│   │       ├── AIAnalysisChatPage.tsx    # Read :chatId param, load session, active highlight
│   │       ├── AIAnalysisHistoryPage.tsx # Existing standalone history page (no changes required)
│   │       └── AIAnalysisStartPage.tsx   # Starts new analyses; navigates to base route
│   ├── hooks/
│   │   ├── useAnalysisHistory.ts     # Provides history.entries, selectedId, loadSession/runDetail
│   │   └── useAnalysisStreaming.ts   # Manages SSE stream, messages, reset
│   └── api/services/
│       └── analysis-service.ts       # getHistory, getSessionMessages, getRunDetail endpoints
└── main.tsx
```

**Structure Decision**: Single frontend SPA. The implementation is confined to the existing AI analysis module under `src/app/components/ai-analysis/` plus one new route definition in `src/app/routes.tsx`.

## Research Findings

No external research tasks were needed. The existing codebase already provides:

- `react-router` v7 with `useParams` support.
- `useAnalysisHistory.loadSession(runId, sessionId?)` for retrieving persisted messages.
- `useAnalysisStreaming.loadMessages(messages, sessionId)` for populating the workspace with historical messages.
- `analysisService.getSessionMessages(sessionId)` and `analysisService.getRunDetail(runId)` for backend data.

**Decision**: Use `useParams` to read `:chatId`, map it to a history entry, and call the existing `loadSession` path. Reuse `history.selectedId` for active highlighting.

**Rationale**: Minimal change, no new service contracts, consistent with current data flow.

**Alternatives considered**:
- Adding a dedicated endpoint keyed by run id only — rejected because `sessionId` may be null and `loadSession` already handles run-detail fallback.
- Storing active chat id in global state — rejected because the URL should be the source of truth.

## Data Model

See [data-model.md](./data-model.md).

## Contracts

See `/contracts/README.md`.

## Quickstart

See [quickstart.md](./quickstart.md).

## Complexity Tracking

No complexity violations.
