# Quickstart: Collaboration Chat View Backend Integration

## What this feature does

Replaces hardcoded mock data in the Project Collaboration Module's Chat view with live backend data for:

- Conversation sidebar list
- Messages inside a conversation
- Send, edit, delete, and mark-as-read actions

## Files you will touch

### New files

| File | Purpose |
|------|---------|
| `src/api/hooks/useConversationMessages.ts` | Hook for message state, pagination, send, edit, delete, read |

### Modified files

| File | Change |
|------|--------|
| `src/api/services/collaboration-service.ts` | Add message endpoints |
| `src/app/components/ProjectCollaborationModule.tsx` | Refactor `ChatView` to use hooks and remove mock arrays |
| `src/app/routes.tsx` | Ensure chat route includes `projectId` parameter |

## Runbook

### 1. Extend the service

Add the following methods to `src/api/services/collaboration-service.ts`:

- `getConversationMessages(projectId, conversationId, filters, config?)`
- `sendMessage(projectId, conversationId, dto, config?)`
- `editMessage(projectId, messageId, dto, config?)`
- `deleteMessage(projectId, messageId, config?)`
- `markMessageAsRead(projectId, messageId, config?)`

### 2. Create the messages hook

Implement `src/api/hooks/useConversationMessages.ts` with:

- Local state for messages, pagination cursor, loading, and error.
- `loadMessages(reset?: boolean)` for initial and paginated loads.
- `sendMessage(content, options?)` with optimistic append.
- `editMessage(messageId, content)` with local update on success.
- `deleteMessage(messageId)` with local removal/hide on success.
- `markAsRead(messageId)` to call the read endpoint.

### 3. Refactor the Chat view

In `ProjectCollaborationModule.tsx`:

- Use `useProjectConversations` for the sidebar.
- Use `useConversationMessages` for the active conversation.
- Remove the local `messages` and `conversations` mock arrays.
- Wire send/edit/delete/read actions to the hook methods.
- Add loading, error, and empty states for both panels.

### 4. Verify

1. Start the dev server: `npm run dev`
2. Navigate to `/dashboard/collaboration/:projectId/chat`
3. Select a conversation and confirm messages load.
4. Send a message and confirm it appears with status transitions.
5. Edit or delete a message you sent.
6. Open a conversation with unread messages and confirm the read endpoint is called.

## Testing hints

- Mock the service responses and verify that the hook updates state correctly.
- Test optimistic send: the message should appear immediately with `SENDING` status.
- Test pagination: simulate `hasMore: true` and verify older messages append on scroll.
- Test error handling: simulate a 500 on send and verify retry UI.

## Common pitfalls

- Appending duplicate messages when real-time and fetch responses overlap.
- Losing optimistic `SENDING` state on re-render.
- Calling `markAsRead` for messages the user has already read.
- Leaving old mock arrays in the component after integration.
