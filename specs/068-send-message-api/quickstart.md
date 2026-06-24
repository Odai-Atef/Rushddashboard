# Quickstart: Send Message API Integration

## What this feature does

Wires the Project Collaboration chat "Send" button to the backend so messages are persisted, display optimistic send status, and can be retried on failure. Also adds reply-to-message support.

## Where the code lives

- Service layer: `src/api/services/collaboration-service.ts`
- Data hook: `src/api/hooks/useConversationMessages.ts`
- UI component: `src/app/components/ProjectCollaborationModule.tsx` (the `ChatView` sub-component)
- Error mapping: `src/app/lib/error-messages.ts`
- API client: `src/api/client.ts`

## How to verify locally

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Navigate to a project chat, e.g.:
   ```text
   /dashboard/collaboration/{projectId}/chat?conv={conversationId}
   ```
3. Type a message and press Enter or click **إرسال**.
4. Expected behavior:
   - The message appears immediately with a spinner (`SENDING`).
   - Within ~1 second the spinner changes to a checkmark (`SENT`).
   - The input clears.
   - Refreshing the page shows the message persisted.
5. To test failure:
   - Block the network request in DevTools or stop the backend.
   - Send a message.
   - Expected behavior:
     - The message shows `FAILED` with a retry button.
     - An Arabic error toast appears.
     - The input retains the message text.
     - Clicking retry resends the same message.
6. To test replies:
   - Choose an existing message and trigger reply.
   - Type and send the reply.
   - The reply is visually associated with the original message.

## Tests to run

No automated test suite is configured in this project. Verify manually through the UI and browser DevTools Network tab for the `POST /api/v1/projects/{projectId}/conversations/{conversationId}/messages` calls.

## Common pitfalls

- `useConversationMessages` currently sorts by `createdAt`; rapid successive messages need monotonic client timestamps to preserve submission order.
- The existing `retrySend` function creates a new optimistic message and removes the old failed one. This can break reply context and message ordering if not adjusted to resend in place.
- `ChatView` clears the input immediately after `sendMessage` is called. If the spec requires keeping the input on failure, the clear must happen only on success or be guarded by the result.
- The `isSending` flag disables the input and send button globally; per-message `SENDING` status already exists in the message list, so global blocking may need to be relaxed to meet SC-006 (non-blocking chat).
