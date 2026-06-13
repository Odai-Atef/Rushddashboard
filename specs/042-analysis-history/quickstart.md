# Quickstart: AI Analysis History Replay

**Feature**: AI Analysis History Replay

## Architecture Overview

This feature replaces the hardcoded `analysisHistory` array in the AI Analysis page sidebar with a real backend-driven history list. It introduces a `useAnalysisHistory` hook that manages fetching, pagination, and session loading, and updates `AIAnalysisPage.tsx` to render history items with status badges, previews, and click-to-replay behavior.

```text
AIAnalysisPage.tsx
├── useAnalysisHistory hook
│   ├── analysisService.getHistory(page, limit)   → GET /history
│   ├── analysisService.getRunDetail(runId)      → GET /history/:runId
│   └── Pagination via IntersectionObserver
├── useAnalysisStreaming hook (existing)
│   └── sendFollowUp(question, sessionId)         → POST /follow-up
└── UI (sidebar list, status badges, chat replay)
```

## Key Files

| File | Role |
|------|------|
| `src/app/hooks/useAnalysisHistory.ts` | Manages history list state: entries, pagination, loading, error, selected session |
| `src/api/services/analysis-service.ts` | Service methods: `getHistory(page, limit)`, `getRunDetail(runId)` |
| `src/app/components/AIAnalysisPage.tsx` | Updated sidebar: renders history items, handles clicks, shows loading/empty/error states |

## How History Works

1. **Fetch on Mount**: When the AI Analysis page mounts, `useAnalysisHistory` fetches page 1 (limit 20) from `GET /api/v1/analysis/history`.

2. **Render List**: Each history item shows:
   - Title
   - Status badge (color-coded)
   - Start date
   - Preview text (first 100 chars of `insightText`)

3. **Infinite Scroll**: When the user scrolls to the bottom of the sidebar, the next page is fetched and appended.

4. **Click to Replay**: Clicking an item fetches detail from `GET /api/v1/analysis/history/:runId`. The insights and recommendations are converted to complete chat messages (no token streaming) and displayed.

5. **Follow-Up**: After loading a session, the chat input is enabled. Questions are sent via `useAnalysisStreaming.sendFollowUp()` with the loaded session's `sessionId`.

6. **Confirmation Dialog**: If a live stream is active when the user clicks a history item, a confirmation dialog appears before switching.

## Adding History to a New Page

If you need history on another page:

1. Import `useAnalysisHistory`:
   ```tsx
   import { useAnalysisHistory } from '@/app/hooks/useAnalysisHistory';
   ```

2. Use the hook:
   ```tsx
   const history = useAnalysisHistory();
   ```

3. Render the list:
   ```tsx
   {history.entries.map(item => (
     <div key={item.id} onClick={() => history.loadSession(item.id)}>
       {item.title} — {item.status}
     </div>
   ))}
   ```

4. Handle states:
   ```tsx
   if (history.isLoading) return <Loading />;
   if (history.error) return <Error message={history.error} onRetry={history.retry} />;
   if (history.entries.length === 0) return <Empty />;
   ```

## Testing Locally

- Ensure the backend endpoints for `/history` and `/history/:runId` are reachable.
- Verify the user is authenticated and `access_token` exists in `localStorage`.
- Open browser DevTools Network tab to observe history list and detail requests.
- Test pagination by creating more than 20 history entries.
- Test the confirmation dialog by starting a live stream and then clicking a history item.

## UI States Reference

| State | Arabic Text | Visual |
|-------|-------------|--------|
| Loading | جاري تحميل سجل التحليلات... | Spinner in sidebar |
| Empty | لا توجد تحليلات سابقة. ابدأ بإنشاء تحليل جديد | Empty state illustration |
| Error | فشل في تحميل السجل | Error banner + retry button |
| Loading More (pagination) | — | Inline spinner at bottom |
