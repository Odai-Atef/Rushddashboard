# Backend API Contract: Collaboration Chat View

## Base

- All endpoints are relative to `ENV.API_BASE_URL`.
- All requests require a valid Bearer token (handled by `apiClient`).
- Conversation list uses the `PaginatedResponse<T>` envelope.
- Message list uses a cursor-based envelope (`MessagesResponse`).

## Endpoints

### 1. List Project Conversations

```text
GET /api/v1/projects/:projectId/conversations
```

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "title": "string | null",
      "type": "PROJECT_GROUP",
      "status": "ACTIVE",
      "createdByUserId": "uuid",
      "lastMessageAt": "datetime",
      "lastMessageText": "Last message preview",
      "unreadCount": 3,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### 2. List Messages in Conversation

```text
GET /api/v1/projects/:projectId/conversations/:conversationId/messages
```

**Query parameters**

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| cursor | string | No | - | Opaque cursor for pagination |
| limit | number | No | 50 | Items per page |

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "senderUserId": "uuid",
      "content": "string",
      "messageType": "TEXT | IMAGE | FILE | VOICE | SYSTEM",
      "status": "SENDING | SENT | DELIVERED | READ | FAILED",
      "replyToId": "uuid | null",
      "isPinned": false,
      "editedAt": "datetime | null",
      "deletedAt": "datetime | null",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "nextCursor": "uuid-or-null",
  "hasMore": true
}
```

### 3. Send Message

```text
POST /api/v1/projects/:projectId/conversations/:conversationId/messages
```

**Request body**

```json
{
  "content": "string (required, 1-10000 chars)",
  "messageType": "TEXT | IMAGE | FILE | VOICE (optional, default: TEXT)",
  "replyToId": "uuid (optional)",
  "attachmentIds": ["uuid"] (optional)
}
```

**Response 201**

```json
{
  "id": "uuid",
  "conversationId": "uuid",
  "senderUserId": "uuid",
  "content": "string",
  "messageType": "TEXT",
  "status": "SENT",
  "replyToId": null,
  "isPinned": false,
  "editedAt": null,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 4. Edit Message

```text
PUT /api/v1/projects/:projectId/messages/:messageId
```

**Request body**

```json
{
  "content": "string (required, 1-10000 chars)"
}
```

**Response 200**: Same as message response.

### 5. Delete Message (Soft Delete)

```text
DELETE /api/v1/projects/:projectId/messages/:messageId
```

**Response 204**: No content.

### 6. Mark Message as Read

```text
POST /api/v1/projects/:projectId/messages/:messageId/read
```

**Response 200**

```json
{
  "success": true
}
```

## Error Contract

Uses the existing `ApiError` shape returned by `apiClient.parseError`:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  errors?: Array<{ field?: string; message?: string; value?: unknown }> | Record<string, string[]>;
  statusCode: number;
}
```

Common status codes:

| Code | Meaning | Client behavior |
|------|---------|---------------|
| 400 | Bad request | Show validation error |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission message |
| 404 | Not found | Show missing conversation/message state |
| 500/502/503/504 | Server error | Show retry option |

## Query-Parameter Rules

- Omit `undefined`/`null` query params.
- `limit` must be a positive integer.
