# API Contract: Chat Endpoints

**Feature**: Chat Backend Integration
**Date**: 2026-05-18
**Base URL**: `${VITE_API_BASE_URL}/chat`

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /chat/sessions

List all chat sessions for the authenticated user.

**Query Parameters**:
- `limit` (optional): number, default 20, max 100
- `offset` (optional): number, default 0

**Response (200 OK)**:
```json
{
  "sessions": [
    {
      "id": "uuid",
      "title": "string",
      "createdAt": "2026-05-18T12:00:00Z",
      "updatedAt": "2026-05-18T12:00:00Z",
      "messageCount": 0
    }
  ],
  "total": 0
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

### GET /chat/sessions/:id/messages

Get all messages for a specific chat session.

**Path Parameters**:
- `id`: string (UUID) - Session ID

**Query Parameters**:
- `limit` (optional): number, default 50, max 200
- `offset` (optional): number, default 0

**Response (200 OK)**:
```json
{
  "messages": [
    {
      "id": "uuid",
      "sessionId": "uuid",
      "role": "user",
      "content": "string",
      "createdAt": "2026-05-18T12:00:00Z"
    }
  ],
  "total": 0
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Session not found or not owned by user
- `500 Internal Server Error`: Server error

---

### POST /chat/sessions

Create a new chat session.

**Request Body**:
```json
{
  "title": "string" // optional
}
```

**Response (201 Created)**:
```json
{
  "session": {
    "id": "uuid",
    "title": "string",
    "createdAt": "2026-05-18T12:00:00Z",
    "updatedAt": "2026-05-18T12:00:00Z",
    "messageCount": 0
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

### POST /chat/sessions/:id/messages

Send a message in a chat session and receive AI response.

**Path Parameters**:
- `id`: string (UUID) - Session ID

**Request Body**:
```json
{
  "content": "string"
}
```

**Response (200 OK) - Standard**:
```json
{
  "userMessage": {
    "id": "uuid",
    "sessionId": "uuid",
    "role": "user",
    "content": "string",
    "createdAt": "2026-05-18T12:00:00Z"
  },
  "assistantMessage": {
    "id": "uuid",
    "sessionId": "uuid",
    "role": "assistant",
    "content": "string",
    "createdAt": "2026-05-18T12:00:00Z"
  }
}
```

**Response (200 OK) - Streaming**:
If backend supports SSE, returns `text/event-stream` with incremental chunks.

**Error Responses**:
- `400 Bad Request`: Invalid request body or empty message
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Session not found or not owned by user
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error or AI generation failure

---

### DELETE /chat/sessions/:id

Delete a chat session and all its messages.

**Path Parameters**:
- `id`: string (UUID) - Session ID

**Response (204 No Content)**:
Empty body on success.

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Session not found or not owned by user
- `500 Internal Server Error`: Server error

## Error Response Format

```json
{
  "statusCode": number,
  "message": "string",
  "error": "string"
}
```

## Notes

- All endpoints return messages ordered by `createdAt` ascending (oldest first).
- The `POST /chat/sessions/:id/messages` endpoint is synchronous for v1. Streaming support via SSE is optional and should be handled gracefully.
- When a session has no explicit title, the backend should auto-generate one from the first user message (first 50 characters).
- Token refresh follows the same pattern as auth: on 401, attempt refresh; if refresh fails, redirect to login.