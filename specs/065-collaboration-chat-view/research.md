# Research: Collaboration Chat View Backend Integration

## Unknowns Resolved

### 1. Where should message API methods live?

**Decision**: Extend `src/api/services/collaboration-service.ts` with message methods rather than adding them to `project-service.ts`.

**Rationale**: Conversations and messages are part of the same collaboration domain. Keeping them together avoids scattering related endpoints and reuses the existing service/hook pattern established in feature 064.

**Alternatives considered**:
- Add methods to `project-service.ts`: rejected because it would mix project-management concerns with chat/messaging concerns.
- Create a separate `message-service.ts`: rejected because it would create unnecessary fragmentation when conversation and message endpoints share context.

### 2. How should message pagination be handled?

**Decision**: Use cursor-based infinite scroll in the message list. Newer messages appear at the bottom; older messages load as the user scrolls up. The initial load fetches the most recent page so the user sees the latest messages first.

**Rationale**: The backend uses cursor pagination for messages. Infinite scroll is the most natural chat UX and avoids manual page buttons in a conversation thread.

**Alternatives considered**:
- Page-number buttons at the bottom: rejected because it breaks the conversational flow.
- Load all messages at once: rejected due to potential volume and backend limits.

### 3. Should messages be sent optimistically or wait for backend confirmation?

**Decision**: Use optimistic sending. Show the message in the list immediately with a `SENDING` status, then update to `SENT` on success or mark as failed on error with a retry action.

**Rationale**: Optimistic sending makes the chat feel responsive. The backend status enum explicitly includes `SENDING`, supporting this approach.

**Alternatives considered**:
- Wait for confirmation before showing: rejected because it would make the UI feel sluggish.

### 4. How should real-time updates be integrated?

**Decision**: Use a WebSocket/SSE subscription if the project already has a real-time transport; otherwise implement a lightweight polling fallback. Real-time is optional and the UI must degrade gracefully to fetch-based updates.

**Rationale**: The spec marks real-time as optional. Existing codebase may already have SSE or WebSocket infrastructure (e.g., for AI analysis streaming). We will reuse existing patterns rather than introduce a new transport.

**Alternatives considered**:
- Mandatory WebSocket with fallback to polling: rejected because it exceeds the optional scope and may require backend coordination.

### 5. How are sender identities displayed?

**Decision**: Display messages using `senderUserId` as a stable identifier. If user profiles are not loaded by the chat view, show a generated display name or placeholder until profile enrichment is available. This feature does not introduce user profile loading unless already present.

**Rationale**: The backend returns `senderUserId`, not a display name. Avoiding a dependency on user profile enrichment keeps the scope focused on chat integration.

**Alternatives considered**:
- Fetch sender profiles for every message: rejected because it adds complexity and may duplicate existing work.

## Best-Practice Notes

- Debounce edit/delete actions to prevent accidental duplicate operations.
- Mark messages as read only once they enter the viewport, using an intersection observer or similar pattern.
- Keep message ordering stable: sort by `createdAt`, with real-time messages appended at the end.
- Preserve optimistic state per message so retry can resend the same content without duplicating the input.
- Reuse the existing Arabic error message helper for consistency.
