# Research: AI Analysis History Replay

**Date**: 2026-06-10
**Feature**: AI Analysis History Replay
**Branch**: `042-analysis-history`

## Decisions

### 1. Infinite Scroll Pagination
- **Decision**: Use infinite scroll (auto-load on scroll to bottom) for the history sidebar.
- **Rationale**: Reduces user friction; the sidebar is a narrow list where a "Load more" button would consume limited vertical space. Confirmed in clarifications.
- **Alternatives considered**: Explicit "Load more" button (rejected per clarification).

### 2. Confirmation Dialog on Active Stream Switch
- **Decision**: Show a confirmation dialog when clicking a history item while a live stream is active.
- **Rationale**: Prevents accidental loss of in-progress streaming work. Confirmed in clarifications.
- **Implementation**: A simple modal/dialog with Arabic text: "تحليل قيد التشغيل. هل تريد الانتقال إلى التحليل المحدد؟"

### 3. Historical Session Replay as Complete Messages
- **Decision**: Render historical session insights and recommendations as complete messages, not token-by-token.
- **Rationale**: Historical data is already complete; streaming replay would be artificial and confusing.
- **Implementation**: The `useAnalysisHistory` hook converts `insightText` and `recommendationText` into `StreamMessage` objects with `isStreaming: false`.

### 4. Reuse `useAnalysisStreaming` for Follow-Up
- **Decision**: Use the existing `useAnalysisStreaming.sendFollowUp()` for follow-up questions on loaded historical sessions.
- **Rationale**: The follow-up API contract is identical. The hook already manages the `sessionId` and message appending.
- **Implementation**: After loading a historical session, extract its `sessionId` and pass it to the hook's `sendFollowUp` method.

### 5. AbortController for Request Cancellation
- **Decision**: Use `AbortController` to cancel in-flight history and detail requests on unmount or rapid navigation.
- **Rationale**: Prevents memory leaks, race conditions, and state updates on unmounted components. Aligns with the existing `ApiClient` pattern.

## Technology Confirmation

- **Framework**: React 18.x + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **API Client**: Custom `ApiClient` class using `fetch`
- **State Management**: React hooks + local component state
- **Pagination**: Client-side infinite scroll with `IntersectionObserver`

## Integration Points

- `analysisService.getHistory(page, limit)` → GET `/api/v1/analysis/history?page={page}&limit={limit}`
- `analysisService.getRunDetail(runId)` → GET `/api/v1/analysis/history/{runId}`
- `useAnalysisStreaming.sendFollowUp(question, sessionId)` → POST `/api/v1/analysis/follow-up`
- `useAnalysisHistory` hook manages history list state, pagination, and session loading

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rapid scroll triggering multiple page requests | Medium | Debounce scroll handler; track `isLoading` state to prevent concurrent fetches |
| Race condition: user clicks item while detail request in-flight | Low | AbortController cancels previous detail request before starting a new one |
| Large history list causing re-render thrashing | Low | Virtualization not needed for 20-item pages; pagination bounds list size |
| User navigates away while history loading | Low | AbortController + `useEffect` cleanup cancels in-flight requests |

## Notes

- The `analysis-service.ts` already has streaming methods from the previous feature; this feature adds history-specific methods.
- The `useAnalysisStreaming` hook already supports follow-up questions; this feature leverages it for historical sessions.
- The sidebar UI already exists with hardcoded data; this feature replaces the data source and adds loading/empty/error states.
