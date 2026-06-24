# Backend API Contract: Collaboration Hub

## Base

- All endpoints are relative to `ENV.API_BASE_URL`.
- All requests require a valid Bearer token (handled by `apiClient`).
- All list responses use the `PaginatedResponse<T>` envelope.

## Endpoints

### 1. List Project Conversations

```text
GET /api/v1/projects/:projectId/conversations
```

**Path parameters**

| Param | Type | Required |
|-------|------|----------|
| projectId | UUID | Yes |

**Query parameters**

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| page | number | No | 1 | 1-based page index |
| limit | number | No | 20 | Items per page |
| status | enum | No | - | `ACTIVE`, `ARCHIVED`, `MUTED` |

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "title": "string | null",
      "type": "PROJECT_GROUP | DIRECT_MESSAGE | SYSTEM_ALERT",
      "status": "ACTIVE | ARCHIVED | MUTED",
      "createdByUserId": "uuid",
      "lastMessageAt": "datetime | null",
      "lastMessageText": "string | null",
      "unreadCount": 0,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### 2. Get Single Conversation

```text
GET /api/v1/projects/:projectId/conversations/:conversationId
```

**Response 200**: Same object as list item.

> **Note**: Single-conversation fetch is documented but not required for the Hub view in this feature. The hook/service should still expose it for future chat view reuse.

### 3. List Project Discussions

```text
GET /api/v1/projects/:projectId/discussions
```

**Query parameters**

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| page | number | No | 1 | |
| limit | number | No | 20 | |
| section | string | No | - | e.g., `budget`, `timeline` |
| status | enum | No | - | `OPEN`, `RESOLVED`, `CLOSED` |

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "section": "string",
      "title": "string",
      "content": "string",
      "authorUserId": "uuid",
      "status": "OPEN | RESOLVED | CLOSED",
      "isPinned": false,
      "replyCount": 5,
      "lastReplyAt": "datetime | null",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### 4. List Project Attachments

```text
GET /api/v1/projects/:projectId/attachments
```

**Query parameters**

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| page | number | No | 1 | |
| limit | number | No | 20 | |
| type | string | No | - | Filter by attachment type or MIME class |

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "fileId": "uuid",
      "fileName": "string",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "attachmentType": "DOCUMENT | IMAGE | VIDEO | AUDIO | OTHER",
      "projectStage": "string | null",
      "uploadedByUserId": "uuid",
      "createdAt": "datetime"
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 20,
  "totalPages": 2
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
| 400 | Bad request | Show generic Arabic error with retry |
| 401 | Unauthorized | `apiClient` redirects to login |
| 403 | Forbidden | Show permission message |
| 404 | Not found | Show empty/no-project state |
| 408 | Timeout (client-generated) | Show timeout message with retry |
| 500/502/503/504 | Server error | Show server-error message with retry |

## Query-Parameter Rules

- Omit `undefined`/`null` filters entirely; do not send empty strings.
- `page` is 1-based.
- `limit` must be a positive integer; the frontend default is 20 for all three panels.
