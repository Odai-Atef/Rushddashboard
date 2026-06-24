# Research: Send Message API Integration

## Decisions

### 1. Reuse existing `collaborationService.sendMessage` and `useConversationMessages`

- **Decision**: Use the existing `collaborationService.sendMessage` endpoint wrapper and `useConversationMessages` hook; the API client already attaches the Bearer token and the service already maps to `POST /api/v1/projects/{projectId}/conversations/{conversationId}/messages`.
- **Rationale**: The backend contract (`CreateMessageDto`, `Message`, `MessageStatus`) is already defined and matches the feature requirements. Reusing existing abstractions avoids duplication and keeps the implementation consistent with the rest of the collaboration module.
- **Alternatives considered**: Creating a new dedicated send hook or service — rejected because the current hook already includes optimistic send, status transitions, and a `retrySend` API that only need minor adjustments to satisfy the spec.

### 2. Keep optimistic messages stable by submission order

- **Decision**: Optimistic messages are appended in submission order and replaced in-place when the server confirms. Sorting is by `createdAt`; for rapid sends, the optimistic `createdAt` is set client-side with monotonic ordering so later API completions do not reorder messages.
- **Rationale**: The spec requires messages to remain in submission order even if responses arrive out of order. Using client-side timestamps with a small monotonic offset guarantees stable ordering without additional server metadata.
- **Alternatives considered**: Reordering by server `createdAt` on every response — rejected because it could move a confirmed message ahead of an earlier optimistic message that is still pending.

### 3. Track per-message status and input field state in the component

- **Decision**: The message list state lives in `useConversationMessages`; the input field and any reply-selection state live in `ChatView` (the UI component). On failure, the input text is preserved for the current app session; on success it is cleared.
- **Rationale**: Separating list state from ephemeral UI state keeps the hook reusable and matches the existing component structure. Session-level retention of failed input is achieved by keeping it in component state while the chat remains mounted or while navigating within the SPA; a full reload resets it as the spec allows.
- **Alternatives considered**: Storing failed input in `localStorage` — rejected because the spec explicitly scopes retention to the current app session and does not require persistence across reloads.

### 4. Show Arabic error toasts via existing `sonner` + `getCollaborationErrorMessage`

- **Decision**: Use the project's existing `sonner` toast library and the existing `getCollaborationErrorMessage` mapper for all send/retry errors.
- **Rationale**: The collaboration module already uses these utilities for other error surfaces, so this keeps UX and wording consistent. It also satisfies the acceptance criterion to show an error toast on failure.
- **Alternatives considered**: Inline error text below the input — rejected because the existing pattern is toast-based and the spec explicitly requests a toast.

### 5. Status indicators mapping

- **Decision**: Map `MessageStatus` directly to the icons already present in `MessageBubble`:
  - `SENDING` → `Loader2` spinner
  - `SENT` → single `Check`
  - `DELIVERED` → double `CheckCheck` (gray)
  - `READ` → double `CheckCheck` (blue)
  - `FAILED` → red retry text/button
- **Rationale**: These icons already exist in the component and match the visual indicators listed in the ticket.

### 6. Reply support required in this ticket

- **Decision**: Implement reply-to-message as a required feature. The hook already accepts `replyToId`; the UI needs a reply action and visual association.
- **Rationale**: Clarification confirmed reply support is required. The API contract already supports it, so the work is limited to UI/UX wiring.
- **Out of scope**: Voice, image, file message sending and attachment handling remain out of scope as documented in the spec assumptions.
