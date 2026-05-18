# Data Model: Chat Backend Integration

**Feature**: Chat Backend Integration  
**Date**: 2026-05-18  
**Source**: Feature spec requirements + existing types (`src/app/types/chat.ts`)

## Entities

### ChatSession

Represents a single conversation thread belonging to an authenticated user.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | UUID string | Yes | Valid UUID v4 | Unique identifier |
| `title` | string | Yes | Max 200 chars | Session title (auto-generated from first message if empty) |
| `createdAt` | ISO 8601 datetime | Yes | Valid datetime | When session was created |
| `updatedAt` | ISO 8601 datetime | Yes | Valid datetime | Last activity timestamp |
| `messageCount` | integer | Yes | ≥ 0 | Number of messages in session |

**Relationships**:
- One ChatSession has many ChatMessages
- Belongs to one User (implied by auth context)

**State Transitions**:
- `created` → `active` → `deleted`
- No explicit status field; existence implies active

### ChatMessage

Represents an individual message within a chat session.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | UUID string | Yes | Valid UUID v4 | Unique identifier |
| `sessionId` | UUID string | Yes | Valid UUID v4 | Parent session reference |
| `role` | enum | Yes | `user` or `assistant` | Message sender type |
| `content` | string | Yes | 1-10,000 chars | Message text content |
| `status` | enum | No | `pending`, `sent`, `failed` | Frontend-only delivery status |
| `createdAt` | ISO 8601 datetime | Yes | Valid datetime | When message was sent |

**Relationships**:
- Belongs to one ChatSession (via `sessionId`)
- `assistant` messages are replies to `user` messages in the same session

**State Transitions**:
- `pending` → `sent` (on successful API response)
- `pending` → `failed` (on API error)
- `failed` → `pending` → `sent` (on retry)

## Validation Rules

### Request Validation

**CreateSessionRequest**:
- `title`: optional string, max 200 characters

**SendMessageRequest**:
- `content`: required string, 1-10,000 characters, cannot be empty or whitespace-only

### Response Validation

All API responses validated with Zod schemas:
- `ChatSessionsResponseSchema`: `{ sessions: ChatSession[], total: number }`
- `ChatMessagesResponseSchema`: `{ messages: ChatMessage[], total: number }`
- `SendMessageResponseSchema`: `{ userMessage: ChatMessage, assistantMessage: ChatMessage }`
- `CreateSessionResponseSchema`: `{ session: ChatSession }`

## API to Entity Mapping

| API Endpoint | HTTP Method | Request Entity | Response Entity |
|--------------|-------------|----------------|-----------------|
| `/chat/sessions` | GET | - | `ChatSessionsResponse` |
| `/chat/sessions/:id/messages` | GET | - | `ChatMessagesResponse` |
| `/chat/sessions` | POST | `CreateSessionRequest` | `CreateSessionResponse` |
| `/chat/sessions/:id/messages` | POST | `SendMessageRequest` | `SendMessageResponse` |
| `/chat/sessions/:id` | DELETE | - | `void` (204) |

## Zod Schemas

```typescript
export const ChatSessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  messageCount: z.number().int().nonnegative(),
});

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string().max(10000),
  status: z.enum(['pending', 'sent', 'failed']).optional(),
  createdAt: z.string().datetime(),
});

export const SendMessageRequestSchema = z.object({
  content: z.string().min(1).max(10000),
});

export const CreateSessionRequestSchema = z.object({
  title: z.string().max(200).optional(),
});
```

## Data Flow

1. **Load Sessions**: `GET /chat/sessions` → validate with `ChatSessionsResponseSchema` → store in context
2. **Create Session**: `POST /chat/sessions` → validate with `CreateSessionResponseSchema` → add to session list
3. **Load Messages**: `GET /chat/sessions/:id/messages` → validate with `ChatMessagesResponseSchema` → display in thread
4. **Send Message**: `POST /chat/sessions/:id/messages` → optimistically add to list with `pending` status → validate response → update both messages to `sent`
5. **Delete Session**: `DELETE /chat/sessions/:id` → remove from session list → clear active session if deleted
