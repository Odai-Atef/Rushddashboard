# Quickstart: Fix Chat History Reload

**Date**: 2026-06-13

## Running the Development Server

```bash
cd /Users/odai/.openclaw/workspace/Rushd/apps/frontend
pnpm dev
```

The Vite dev server runs on the port configured in `vite.config.ts`.

## Project Structure

```text
src/
├── api/
│   ├── client.ts              # Base fetch-based ApiClient
│   ├── types.ts               # Shared API types (ApiResponse, ApiError, etc.)
│   ├── config.ts              # AUTH_CONFIG, API base URLs
│   └── services/
│       └── analysis-service.ts  # ← ADD: getSessionMessages()
├── app/
│   ├── components/
│   │   └── AIAnalysisPage.tsx   # ← UPDATE: loadHistorySession()
│   └── hooks/
│       ├── useAnalysisHistory.ts  # ← UPDATE: DTO fields, sessionDetailToMessages refactor
│       └── useAnalysisStreaming.ts  # ← NO CHANGES (must not break contract)
│   └── utils/
│       └── cn.ts
```

## Key Files for This Feature

1. **`src/api/services/analysis-service.ts`**
   - Add `AnalysisMessage` interface
   - Add `getSessionMessages(sessionId: string)` method

2. **`src/app/hooks/useAnalysisHistory.ts`**
   - Update `AnalysisSessionDetail` insights field: `content` → `description`
   - Add `AnalysisMessage` interface (or import from analysis-service)
   - Refactor `sessionDetailToMessages()` to accept `AnalysisMessage[]`
   - Update `loadSession()` to call new endpoint with fallback logic

3. **`src/app/components/AIAnalysisPage.tsx`**
   - Update `loadHistorySession()` to use new method when available
   - Ensure session continuity (pass correct `sessionId` to `streaming.loadMessages`)

## Testing Manually

1. Log in to the application (auth token required for API calls).
2. Navigate to `/dashboard/ai-analysis`.
3. In the history sidebar, click a previous analysis session.
4. **Verify**: Chat transcript displays with user prompt + assistant response (not empty).
5. **Verify**: If session has follow-ups, they appear in correct order.
6. **Verify**: Chat input is enabled after loading (status = `complete`).
7. Type and send a new follow-up question. **Verify**: It associates with the same session.

## Testing Fallback

If the new endpoint is not deployed:
1. Click a history item.
2. The code should fall back to `getRunDetail()`.
3. **Verify**: Insights display using `description` field (not empty).

## Notes

- Arabic UI text is in `AIAnalysisPage.tsx` — do not modify.
- `StreamMessage` interface in `useAnalysisStreaming.ts` must remain unchanged.
- `startAnalysis()` streaming flow must remain unchanged.
