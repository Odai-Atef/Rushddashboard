# Quickstart: Follow-up Chat Error Handling

## What Changes

Two files are modified:
- `src/app/hooks/useAnalysisStreaming.ts`
- `src/app/components/AIAnalysisPage.tsx`

## How to Verify Locally

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open the AI Analysis page and start any analysis.
3. After the analysis completes, type a follow-up question and click **إرسال**.
4. **Loading guard**: While the request is in flight, the input and submit button should be disabled.
5. **Error banner**: If the backend endpoint `/api/v1/analysis/follow-up` returns 404/500, a red error banner should appear above the chat input with Arabic text.
6. **Retry**: Click the retry button in the banner — the same question should be re-sent.
7. **Regression**: Start a new analysis via SSE (`startAnalysis`) and confirm streaming still works end-to-end.
