# UI/Route Contracts: Chat History Routing

## User-Facing Route

| Route | Purpose |
|-------|---------|
| `/dashboard/ai-analysis/chat` | Base chat page. Shows history list and an empty/new-analysis workspace. |
| `/dashboard/ai-analysis/chat/:chatId` | Addressable chat session. Loads the chat identified by `chatId` and highlights it in the history list. |

## Component Contract: AIAnalysisChatPage

### Inputs

| Source | Value | Description |
|--------|-------|-------------|
| React Router `useParams` | `chatId?: string` | The id of the chat to load. Absent on the base route. |
| Existing hooks | `history.entries`, `history.selectedId`, `history.loadSession`, `streaming.loadMessages`, `streaming.reset` | Used to load and display the chat. |

### Side Effects

- On mount and when `chatId` changes: if `chatId` is present, load the matching session.
- When the user starts a new analysis: navigate to `/dashboard/ai-analysis/chat` (base route).

### Outputs

- Workspace displays the loaded chat messages or an inline not-found/error state.
- History sidebar highlights the item whose `id` equals the URL `chatId`.

## Not-Found Contract

When `chatId` is present but does not match any loaded history entry:

- The URL remains `/dashboard/ai-analysis/chat/:chatId`.
- The workspace shows a translatable "chat not found" message.
- No history item is highlighted as active.

## Backend Contract (existing)

The feature relies on the following existing endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/analysis/history` | Paginated list of history entries. |
| `GET /api/v1/analysis/sessions/:sessionId/messages` | Messages for a session-based chat. |
| `GET /api/v1/analysis/history/:runId` | Run detail fallback for chats without a session. |

No new backend endpoints are required.
