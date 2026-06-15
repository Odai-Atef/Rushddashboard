# Implementation Plan: Fix History Chat UI

**Branch**: `045-fix-history-chat-ui` | **Date**: 2026-06-14 | **Spec**: [specs/028-fix-history-chat-ui/spec.md](specs/028-fix-history-chat-ui/spec.md)
**Input**: Feature specification from `specs/028-fix-history-chat-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Fix the bug where clicking an Analysis History sidebar item fails to display the chat UI in the main workspace. The root cause is that `loadHistorySession()` sets `activeAnalysis` to `null`, and the main workspace conditional `!activeAnalysis` renders the "Start Analysis" empty state instead of the chat interface. The fix involves:
1. Showing the chat UI when a historical session is loaded (regardless of `activeAnalysis` state)
2. Ensuring `streaming.loadMessages()` sets `status` to `'complete'` and `sessionId` correctly
3. Handling `activeAnalysis` being `null` inside the chat UI header for historical sessions

## Technical Context

**Language/Version**: TypeScript 5.x, React 18  
**Primary Dependencies**: Next.js, Tailwind CSS, React Markdown, Recharts, Lucide React  
**Storage**: N/A (client-side state management via React hooks)  
**Testing**: Jest / React Testing Library (project standard)  
**Target Platform**: Web browser (modern evergreen)  
**Project Type**: Web application (frontend SPA)  
**Performance Goals**: Chat UI renders within 100ms of history load; input enabled immediately  
**Constraints**: Must preserve existing SSE streaming behavior; no breaking changes to `useAnalysisStreaming` public API  
**Scale/Scope**: Single-page bug fix affecting two files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is a template with placeholder content. There are no active principles or constraints that would block this bug fix.

## Project Structure

### Documentation (this feature)

```text
specs/028-fix-history-chat-ui/
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
│   ├── components/
│   │   └── AIAnalysisPage.tsx      # Main page component (FIX TARGET)
│   ├── hooks/
│   │   ├── useAnalysisStreaming.ts  # Streaming hook (VERIFY - already correct)
│   │   └── useAnalysisHistory.ts    # History hook (NO CHANGES)
│   └── utils/
│       └── cn.ts
├── api/
│   └── services/
│       └── analysis-service.ts    # API service (NO CHANGES)
```

**Structure Decision**: Single Next.js frontend project. Only two files require changes: `AIAnalysisPage.tsx` (main fix) and optionally verifying `useAnalysisStreaming.ts` (already correct per code review).

## Complexity Tracking

No complexity violations detected. This is a targeted bug fix with minimal surface area.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Research Findings

### Phase 0: Outline & Research

After reviewing the current codebase, the root causes and required fixes are already clear:

**Root Cause Analysis:**
1. **Chat UI not showing**: In `AIAnalysisPage.tsx`, `loadHistorySession()` (line 167-176) sets `activeAnalysis` to `null` after loading messages. The main workspace conditional at line 840 (`!activeAnalysis`) renders the empty-state placeholder, which means the chat UI (inside the `else` branch at line 859) never appears.
2. **Chat input already enabled**: `useAnalysisStreaming.ts` `loadMessages()` (line 278-285) already correctly sets `status` to `'complete'` and `sessionId` to `newSessionId`. The `isChatEnabled` variable (line 551) already evaluates to `true` for historical sessions because `isAnalysisComplete` (`streaming.status === 'complete'`) is true. So fix #2 from the spec is already implemented.
3. **SessionId preserved for follow-up**: `loadMessages()` stores `newSessionId` in `sessionId` state (line 283), and `sendFollowUp()` uses `sessionId` (line 194). So fix #3 is already implemented.

**Conclusion**: Only fix #1 (show chat UI when history session is loaded) requires code changes in `AIAnalysisPage.tsx`.

### Additional Findings

- The `isHistoricalSessionLoaded` variable already exists (line 550) and correctly detects when a historical session is active: `history.selectedId !== null && streaming.status === 'complete' && streaming.sessionId === history.selectedId`.
- Inside the chat UI branch, `activeAnalysis` is dereferenced for header display (color, icon, title, category). When showing a historical session, `activeAnalysis` is `null`, so these will crash. Need to add null-safe handling.
- The right sidebar (Insights & Recommendations) is gated by `isAnalysisComplete` (line 1018). For historical sessions, this sidebar will appear but will show mock recommendations. This may be acceptable for v1, but we should document it.

## Design & Contracts

### Phase 1: Design & Contracts

#### Data Model

No new entities. Existing entities involved:

- **AnalysisHistoryEntry**: `{ id, sessionId, title, summary, status, durationMs, startedAt, completedAt, insightsCount, recommendationsCount }`
- **StreamMessage**: `{ id, role, content, isStreaming?, timestamp, sql?, data?, fallback? }`
- **AnalysisCard**: `{ id, title, description, category, estimatedTime, complexity, impact, icon, color }` — used for new analyses; `null` for historical sessions.

#### State Changes in AIAnalysisPage.tsx

1. Modify the workspace conditional from `!activeAnalysis` to `!activeAnalysis && !isHistoricalSessionLoaded` so historical sessions show the chat UI.
2. Add a fallback for `activeAnalysis` being `null` inside the chat UI header:
   - Title: show `history.entries.find(e => e.id === history.selectedId)?.title` or default text
   - Category: show `"سجل التحليلات"` (History) or similar
   - Icon: use a default icon (e.g., `Clock` or `MessageSquare`)
   - Color: use a default gradient
3. Optionally hide the right sidebar (`isAnalysisComplete && activeAnalysis`) when viewing a historical session to avoid showing irrelevant mock recommendations.

#### API Contracts (already implemented — no changes)

- `GET /api/v1/analysis/sessions/{sessionId}/messages` → `SessionMessageResponseDto[]`
- `GET /api/v1/analysis/history` → paginated list of `AnalysisHistoryEntry`
- `POST /api/v1/analysis/streaming-run` → `{ sessionId }`
- `POST /api/v1/analysis/follow-up` → `{ answer, sql?, data?, fallback? }`

#### Quickstart

See `quickstart.md` for developer testing steps.
