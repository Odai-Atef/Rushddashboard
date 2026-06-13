# Quickstart: AI Analysis Streaming

**Feature**: AI Analysis Real-Time Streaming

## Architecture Overview

This feature replaces the simulated analysis workflow in `AIAnalysisPage.tsx` with a real backend streaming pipeline. It introduces a single custom hook (`useAnalysisStreaming`) that encapsulates the full lifecycle of an analysis session, and updates the page component to render live tokens and follow-up chat from that hook.

```text
AIAnalysisPage.tsx
├── useAnalysisStreaming hook
│   ├── analysisService.triggerStreamingRun()   → POST /streaming-run
│   ├── analysisService.connectToStream()       → EventSource SSE
│   └── analysisService.askFollowUp()           → POST /follow-up
└── UI (progress steps, messages, chat input)
```

## Key Files

| File | Role |
|------|------|
| `src/app/hooks/useAnalysisStreaming.ts` | Manages streaming state: messages, status, sessionId, start/stop/send/reset |
| `src/api/services/analysis-service.ts` | Service methods: `triggerStreamingRun`, `connectToStream`, `askFollowUp` |
| `src/app/components/AIAnalysisPage.tsx` | Page component: renders progress, messages, chat input; wires hook to handlers |

## How Streaming Works

1. **Start**: User clicks an analysis card.
   - `handleSelectLibraryItem` calls `streaming.startAnalysis(item.id, filters)`.
   - The hook POSTs to `/streaming-run`, gets a `sessionId`, and opens an `EventSource`.

2. **Live Tokens**: The hook listens to SSE events.
   - Each `token` event appends `content` to the latest assistant message.
   - The page re-renders automatically because `messages` is React state.

3. **Progress Sync**: The page maps `streaming.status` to progress step states:
   - `connecting` → step 1 active
   - `streaming` → steps 1–4 complete, step 5 active
   - `complete` / `error` → all steps complete

4. **Follow-up**: After streaming completes, the chat input is enabled.
   - `handleSendMessage` calls `streaming.sendFollowUp(question)`.
   - The hook POSTs to `/follow-up` and appends the answer as a new assistant message.

5. **Stop**: User clicks "Stop".
   - `stopGenerating` calls `streaming.stopStreaming()`, which closes the `EventSource`.
   - The partial message remains in the chat history.

6. **Regenerate**: User clicks "Regenerate".
   - `regenerateAnalysis` calls `streaming.reset()` then `startAnalysis()` again.
   - All previous messages are cleared and a new session begins.

## Adding a New Streaming Feature

If you need to add a new streaming endpoint in the future:

1. Add the service method to `AnalysisService` in `src/api/services/analysis-service.ts`.
2. Create a new hook (or extend `useAnalysisStreaming`) that:
   - Calls the new trigger endpoint.
   - Opens an `EventSource` via the service method.
   - Accumulates tokens into a message array.
   - Provides `stopStreaming` and `reset` actions.
3. Wire the hook into your component, mapping status to UI states.

## Testing Locally

- Verify the backend endpoints are reachable.
- Ensure the user is authenticated and `access_token` exists in `localStorage`.
- Open the browser DevTools Network tab to observe the `streaming-run` POST and the SSE stream connection.
- Simulate an error by blocking the SSE endpoint in DevTools; verify the Arabic error message appears.
