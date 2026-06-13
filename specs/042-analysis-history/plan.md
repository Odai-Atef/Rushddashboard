# Implementation Plan: AI Analysis History Replay

**Branch**: `042-analysis-history` | **Date**: 2026-06-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/042-analysis-history/spec.md`

## Summary

Replace the hardcoded `analysisHistory` array in the AI Analysis page sidebar with a real backend-driven history list. Introduce a `useAnalysisHistory` hook that manages fetching, pagination, session loading, and error states. Update `AIAnalysisPage.tsx` to render history items with status badges, previews, and click-to-replay behavior. Enable follow-up questions on loaded historical sessions via the existing `useAnalysisStreaming` hook.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x  
**Primary Dependencies**: Tailwind CSS, shadcn/ui, React Router v7, Intersection Observer API (native)  
**Storage**: N/A (state lives in React hook memory; no persistence required)  
**Testing**: Vitest (or Jest) + React Testing Library for hook and component tests  
**Target Platform**: Modern browsers supporting `fetch` and `IntersectionObserver`  
**Project Type**: Web application (frontend)  
**Performance Goals**: History list visible within 2 seconds; session detail loaded within 3 seconds  
**Constraints**: Token passed via `Authorization` header (standard `ApiClient` pattern); Arabic RTL text rendering  
**Scale/Scope**: Single user per tab; pagination at 20 items per page; no concurrent session loading

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Component Reusability | ✅ Pass | `useAnalysisHistory` is a reusable hook extracted from page logic. History item rendering is a discrete component. |
| Clean Code / OOP | ✅ Pass | `AnalysisService` encapsulates API logic. Hook has single responsibility: history list state management. |
| Environment-Driven Config | ✅ Pass | API base URL comes from `ENV.API_BASE_URL` via `ApiClient`. No hardcoded URLs. |
| API Abstraction Layer | ✅ Pass | All HTTP calls use the existing `ApiClient` class. History endpoints are brokered through `AnalysisService`. |
| Comprehensive Documentation | ✅ Pass | Service methods include JSDoc. Quickstart and data model docs generated. |

## Project Structure

### Documentation (this feature)

```text
specs/042-analysis-history/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── history-api.md   # History API contract
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
│   │   └── analysis-service.ts   # AnalysisService (history methods added)
│   └── types.ts                  # ApiResponse, ApiError types
├── app/
│   ├── components/
│   │   └── AIAnalysisPage.tsx    # Updated: history sidebar, replay, follow-up
│   ├── hooks/
│   │   ├── useAnalysisHistory.ts   # NEW: history list + pagination + session loading
│   │   └── useAnalysisStreaming.ts # Existing: reused for follow-up
│   └── utils/
│       └── icon-map.ts           # Existing
├── lib/
│   └── env.ts                    # Environment config
└── styles/
    └── ...                       # Tailwind / global styles
```

**Structure Decision**: Single frontend web application. No backend changes. Three files created/modified: one new hook, one updated service, one updated page component.

## Complexity Tracking

> No Constitution Check violations detected. Complexity tracking table is not required.

## Phase 0: Research

**Artifact**: [research.md](research.md)

Key decisions validated:
- Infinite scroll is the right pagination pattern for a narrow sidebar.
- Confirmation dialog is needed before switching from an active live stream to a historical session.
- Historical sessions render as complete messages, not token-by-token replay.
- The existing `useAnalysisStreaming.sendFollowUp()` can be reused for historical session follow-up.
- `AbortController` is the standard pattern for canceling in-flight requests on unmount.

## Phase 1: Design

### Data Model

**Artifact**: [data-model.md](data-model.md)

Core entities:
- `AnalysisHistoryEntry`: id, title, summary, status, durationMs, startedAt, completedAt, insightsCount, recommendationsCount
- `AnalysisSessionDetail`: id, title, status, insights[], results[]
- `AnalysisResult`: id, insightText, dimensionData, recommendationText
- `HistoryPaginationState`: page, limit, total, hasMore, isLoading
- `HistoryListState`: entries[], pagination, error, selectedId

### Contracts

**Artifact**: [contracts/history-api.md](contracts/history-api.md)

Defines endpoints:
- `GET /api/v1/analysis/history?page={page}&limit={limit}` → paginated list
- `GET /api/v1/analysis/history/:runId` → session detail
- `POST /api/v1/analysis/follow-up` → follow-up question (reuse existing contract)

### Quickstart

**Artifact**: [quickstart.md](quickstart.md)

Covers architecture overview, key files, history lifecycle, and local testing.

## Implementation Strategy

### Files to Create

1. `src/app/hooks/useAnalysisHistory.ts`
   - Exports `useAnalysisHistory()` hook
   - Manages `entries`, `pagination`, `error`, `selectedId`
   - Provides `fetchHistory(page)`, `loadSession(runId)`, `retry()`, `reset()`
   - Uses `IntersectionObserver` for infinite scroll detection
   - Uses `AbortController` for request cancellation

### Files to Modify

2. `src/api/services/analysis-service.ts`
   - Add `getHistory(page, limit)` → GET
   - Add `getRunDetail(runId)` → GET

3. `src/app/components/AIAnalysisPage.tsx`
   - Replace hardcoded `analysisHistory` with `useAnalysisHistory()` hook
   - Render history items: title, status badge, date, preview
   - Wire click handler: `history.loadSession(item.id)` → sets chat messages
   - Show loading skeleton while `history.isLoading`
   - Show empty state when `history.entries.length === 0`
   - Show error banner when `history.error` is set
   - Enable chat input for loaded sessions
   - Wire `handleSendMessage` to `streaming.sendFollowUp()` with loaded session's `sessionId`
   - Show confirmation dialog before switching from active live stream to historical session

## Testing Approach

| Layer | Strategy |
|-------|----------|
| Hook (`useAnalysisHistory`) | Unit test with mocked `analysisService`. Verify pagination, state transitions, request cancellation, session loading. |
| Service (`AnalysisService`) | Mock `apiClient` to verify correct endpoint URLs, HTTP methods, and payload shapes. |
| Component (`AIAnalysisPage`) | Integration test rendering with mocked hooks. Verify history list rendering, click-to-replay, chat input enable/disable, confirmation dialog. |
| E2E (optional) | Use Cypress/Playwright to scroll sidebar, click history item, verify chat replay, submit follow-up. |

## Dependencies

- No new npm packages required. `IntersectionObserver` is a native browser API.
- Existing dependencies: `react`, `lucide-react`, `tailwind-merge`, `class-variance-authority`.

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Rapid scroll triggering multiple page requests | Debounce scroll handler; track `isLoading` to prevent concurrent fetches |
| Race condition: user clicks item while detail request in-flight | `AbortController` cancels previous detail request before starting new one |
| Large history list causing re-render thrashing | Pagination bounds list size; no virtualization needed for 20-item pages |
| User navigates away while history loading | `useEffect` cleanup + `AbortController` cancels in-flight requests |

## Post-Implementation Verification

- [ ] Sidebar fetches history from `GET /history` on page mount.
- [ ] Each item shows real title, status badge, date, preview.
- [ ] Status badges use correct colors: COMPLETED=green, RUNNING=blue, FAILED=red, PENDING=gray.
- [ ] Clicking item loads detail from `GET /history/:runId`.
- [ ] Loaded session shows previous AI messages in chat area as complete text.
- [ ] Chat input enabled for loaded sessions.
- [ ] Follow-up questions use the loaded session's `sessionId`.
- [ ] Pagination works: scroll to bottom loads next page.
- [ ] Confirmation dialog shown when switching from active live stream.
- [ ] No hardcoded history data remains.

## Suggested Next Command

`/speckit.tasks` — to generate implementation task list.
