# Quick Start: Chat Backend Integration

**Feature**: Chat Backend Integration  
**Date**: 2026-05-18  
**Branch**: `004-rushd-frontend-executive`

## Prerequisites

- Node.js 20+ and npm/pnpm installed
- Backend API running (see backend project for setup)
- Environment variable `VITE_API_BASE_URL` set in `.env`
- Authenticated user session (JWT token)

## Running the Feature

### 1. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

### 2. Navigate to Chat

1. Log in to the application
2. Navigate to `/dashboard/chat` (or click Chat in sidebar when added)
3. You should see your chat sessions list

### 3. Test Core Flows

**View Sessions**:
- Open chat page → session list loads from `GET /chat/sessions`
- Empty state shown if no sessions exist

**Create Session**:
- Click "New Chat" button → `POST /chat/sessions` called
- New session appears in list

**Send Message**:
- Select a session → type message → click send
- `POST /chat/sessions/:id/messages` called
- User message appears immediately (optimistic update)
- AI response appears when backend returns

**Restore Conversation**:
- Click any previous session → `GET /chat/sessions/:id/messages` loads history
- Messages displayed in chronological order

**Delete Session**:
- Click delete on a session → `DELETE /chat/sessions/:id` called
- Session removed from list

## API Configuration

Ensure `.env` contains:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Testing

### Unit Tests

```bash
npm test -- src/app/hooks/useChatSessions.test.ts
npm test -- src/app/hooks/useChatMessages.test.ts
```

### Component Tests

```bash
npm test -- src/app/components/chat/ChatSessionList.test.tsx
npm test -- src/app/components/chat/ChatInput.test.tsx
```

### E2E Tests

```bash
npx playwright test tests/chat.spec.ts
```

## Mock Data (for development without backend)

If backend is unavailable, you can mock the service layer in `src/app/services/chat.ts`:

```typescript
// Temporary mock for development
export async function getChatSessions(): Promise<ChatSessionsResponse> {
  return {
    sessions: [
      {
        id: 'mock-session-1',
        title: 'Sample Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 3,
      },
    ],
    total: 1,
  };
}
```

## Troubleshooting

### Sessions not loading
- Check browser Network tab for `GET /chat/sessions` request
- Verify `VITE_API_BASE_URL` is correct
- Ensure auth token is present in request headers

### 401 Unauthorized errors
- Check if access token is expired
- Verify token refresh logic in `api.ts`
- May need to log out and log back in

### Messages not sending
- Check request payload format matches `SendMessageRequestSchema`
- Verify session ID is valid UUID
- Check backend logs for AI generation failures

## Architecture Notes

- All API calls go through `src/app/services/chat.ts`
- State managed via `useChatContext` React Context
- Optimistic updates for message sending
- Zod schemas validate all API responses
- Arabic locale formatting via `date-fns/arSA`
