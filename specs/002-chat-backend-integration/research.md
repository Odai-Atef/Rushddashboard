# Research: Chat Backend Integration

**Feature**: Chat Backend Integration  
**Date**: 2026-05-18  
**Status**: Complete - All clarifications resolved

## Decision Log

### 1. State Management: React Context + Hooks

**Decision**: Use existing React Context (`useChatContext`) for global chat state rather than introducing Zustand or Redux.

**Rationale**:
- Chat state is localized to one feature and one route
- Context + hooks pattern already established in codebase
- No cross-feature state sharing requirements
- Constitution recommends Context + hooks unless "global state complexity grows"

**Alternatives considered**:
- Zustand: Excellent but unnecessary overhead for single-route feature
- Redux Toolkit: Too heavy for this scope
- TanStack Query: Good for server state, but backend APIs are simple CRUD; manual service layer sufficient for v1

### 2. AI Response Handling: Synchronous POST (v1)

**Decision**: Use synchronous `POST /chat/sessions/:id/messages` for v1. No SSE streaming implementation.

**Rationale**:
- API contract defines standard synchronous response as v1
- Streaming support marked as optional in contract
- Simpler error handling and state management
- Can be upgraded to SSE in future iteration without breaking changes

**Alternatives considered**:
- SSE streaming: Better UX for long AI responses but adds complexity for v1
- WebSocket: Overkill for request-response pattern; backend doesn't support it

### 3. Message Status Tracking

**Decision**: Track message status (`pending` | `sent` | `failed`) in the frontend state for optimistic updates.

**Rationale**:
- Improves perceived performance (messages appear immediately)
- Allows retry on failure
- Schema already supports `status` field

**Implementation**:
- Add message to list immediately with `status: 'pending'`
- Update to `sent` on success
- Update to `failed` on error with retry option

### 4. Session Title Generation

**Decision**: Frontend generates session title from first user message if backend doesn't auto-generate.

**Rationale**:
- API contract says backend "should" auto-generate but doesn't guarantee it
- `generateSessionTitle()` utility already exists in `utils/chat.ts`
- Defensive frontend handling ensures good UX regardless of backend behavior

### 5. Error Handling Patterns

**Decision**: Reuse existing `apiFetch` error handling pattern with Arabic error messages.

**Rationale**:
- `apiFetch` already catches errors and throws with `statusCode` and `code`
- Toast notifications via `sonner` already configured
- Consistent with auth feature error handling

**Error scenarios handled**:
- 401 Unauthorized: Trigger token refresh, redirect to login if refresh fails
- 404 Not Found: Show "session not found" message, redirect to chat list
- 429 Too Many Requests: Show rate limit message with retry timer
- 500 Internal Server Error: Generic error toast with retry option

### 6. Pagination Strategy

**Decision**: Use limit/offset pagination for sessions and messages.

**Rationale**:
- Backend API supports `limit` and `offset` query parameters
- Simple to implement, no cursor state complexity
- Suitable for chat (users rarely have >100 sessions)

**Default values**:
- Sessions: limit=20, offset=0
- Messages: limit=50, offset=0

### 7. Responsive Design Approach

**Decision**: Mobile-first chat layout with collapsible session sidebar.

**Rationale**:
- Dashboard already uses responsive breakpoints
- Chat needs session list visible on desktop, hidden behind drawer/toggle on mobile
- Tailwind's `md:` and `lg:` breakpoints sufficient

### 8. Route Placement

**Decision**: Place chat at `/dashboard/chat` within the existing protected dashboard layout.

**Rationale**:
- Chat is a dashboard feature, not a standalone page
- Reuses `DashboardLayout`, `ProtectedRoute`, and sidebar navigation
- Consistent with other dashboard pages (sales, customers, etc.)

## Resolved Unknowns

| Unknown | Resolution | Source |
|---------|------------|--------|
| Backend API availability | Confirmed - API contract exists and service layer implemented | `contracts/chat-api.md`, `services/chat.ts` |
| Authentication flow | Confirmed - Bearer token via `apiFetch`, refresh on 401 | `services/api.ts`, auth feature |
| Message format | Confirmed - `{id, sessionId, role, content, createdAt}` | `types/chat.ts` |
| Streaming support | Confirmed - Not required for v1, optional SSE for future | `contracts/chat-api.md` |
| UI locale | Confirmed - Arabic (arSA) via date-fns | `utils/chat.ts` |

## Open Questions for Future Iterations

1. **SSE Streaming**: Should v2 implement streaming AI responses?
2. **Message Search**: Do users need to search within conversation history?
3. **File Attachments**: When should rich media support be added?
4. **Real-time Updates**: Should new messages from other sessions be pushed?
