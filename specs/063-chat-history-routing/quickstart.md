# Quickstart: Chat History Routing

## Goal

Run the AI analysis chat page with URL-addressable chat sessions.

## Local Development

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Log in and navigate to `/dashboard/ai-analysis/chat`.

3. Start a new analysis or open an existing one from the left history panel.

4. Click a history item. The URL should update to `/dashboard/ai-analysis/chat/:chatId` and the workspace should load that chat.

5. Refresh the page or paste the URL in a new tab. The same chat should load and the history item should be highlighted.

## Common Verification Steps

| Check | Expected Result |
|-------|-----------------|
| Click history item | URL becomes `/dashboard/ai-analysis/chat/:chatId`, workspace loads messages, item active |
| Refresh chat URL | Same chat reloads, item stays active |
| Open invalid chat URL | Inline "chat not found" message appears, URL unchanged |
| Start new analysis from chat route | URL reverts to `/dashboard/ai-analysis/chat`, no active item, new analysis runs |

## Notes

- The backend must expose the existing `/api/v1/analysis/history` and `/api/v1/analysis/sessions/:sessionId/messages` endpoints for chat loading to work.
- Auth token is read from `localStorage` by the existing API client.
