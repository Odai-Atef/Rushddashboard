# Backend API Contract: Collaboration Discussions View

## Base

- All endpoints are relative to `ENV.API_BASE_URL`.
- All requests require a valid Bearer token (handled by `apiClient`).
- List endpoints use the `PaginatedResponse<T>` envelope.
- The single-discussion endpoint returns the discussion object with an embedded `replies` array.

## Endpoints

### 1. List Project Discussions

```text
GET /api/v1/projects/:projectId/discussions
```

**Query parameters**

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page |
| section | string | No | - | Filter by section (e.g., `budget`, `timeline`, `scope`, `general`) |
| status | enum | No | - | `OPEN`, `RESOLVED`, `CLOSED` |

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "section": "budget",
      "title": "Budget approval needed for Phase 2",
      "content": "Detailed discussion content...",
      "authorUserId": "uuid",
      "status": "OPEN",
      "isPinned": false,
      "replyCount": 5,
      "lastReplyAt": "2026-06-24T10:00:00Z",
      "createdAt": "2026-06-20T08:00:00Z",
      "updatedAt": "2026-06-24T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### 2. Get Single Discussion with Replies

```text
GET /api/v1/projects/:projectId/discussions/:discussionId
```

**Response 200**

```json
{
  "id": "uuid",
  "projectId": "uuid",
  "section": "budget",
  "title": "Budget approval needed for Phase 2",
  "content": "Detailed discussion content...",
  "authorUserId": "uuid",
  "status": "OPEN",
  "isPinned": false,
  "replyCount": 5,
  "lastReplyAt": "2026-06-24T10:00:00Z",
  "createdAt": "2026-06-20T08:00:00Z",
  "updatedAt": "2026-06-24T10:00:00Z",
  "replies": [
    {
      "id": "uuid",
      "discussionId": "uuid",
      "authorUserId": "uuid",
      "content": "Reply content...",
      "isAccepted": false,
      "createdAt": "2026-06-21T09:00:00Z",
      "updatedAt": "2026-06-21T09:00:00Z"
    }
  ]
}
```

### 3. Create Discussion

```text
POST /api/v1/projects/:projectId/discussions
```

**Request body**

```json
{
  "section": "budget",
  "title": "Budget approval",
  "content": "Detailed content",
  "attachmentIds": ["uuid"]
}
```

- `section` required, 1-100 chars
- `title` required, 1-500 chars
- `content` required, 1-20000 chars
- `attachmentIds` optional

**Response 201**

```json
{
  "id": "uuid",
  "projectId": "uuid",
  "section": "budget",
  "title": "Budget approval",
  "content": "Detailed content",
  "authorUserId": "uuid",
  "status": "OPEN",
  "isPinned": false,
  "replyCount": 0,
  "lastReplyAt": null,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 4. Update Discussion

```text
PUT /api/v1/projects/:projectId/discussions/:discussionId
```

**Request body**

```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

**Response 200**: Same as discussion response.

### 5. Change Discussion Status

```text
PUT /api/v1/projects/:projectId/discussions/:discussionId/status
```

**Request body**

```json
{
  "status": "RESOLVED"
}
```

**Response 200**: Updated discussion object.

### 6. Delete Discussion

```text
DELETE /api/v1/projects/:projectId/discussions/:discussionId
```

**Response 204**: No content.

### 7. Add Reply to Discussion

```text
POST /api/v1/projects/:projectId/discussions/:discussionId/replies
```

**Request body**

```json
{
  "content": "Reply content here"
}
```

- `content` required, 1-20000 chars

**Response 201**

```json
{
  "id": "uuid",
  "discussionId": "uuid",
  "authorUserId": "uuid",
  "content": "Reply content here",
  "isAccepted": false,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 8. Mark Reply as Accepted Solution

```text
PUT /api/v1/projects/:projectId/discussions/:discussionId/replies/:replyId/accept
```

**Response 200**

```json
{
  "id": "uuid",
  "discussionId": "uuid",
  "authorUserId": "uuid",
  "content": "Reply content here",
  "isAccepted": true,
  "createdAt": "datetime",
  "updatedAt": "datetime"
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
| 404 | Not found | Show missing discussion/reply state |
| 500/502/503/504 | Server error | Show retry option |

## Query-Parameter Rules

- Omit `undefined`/`null` query params.
- `page` and `limit` must be positive integers.
