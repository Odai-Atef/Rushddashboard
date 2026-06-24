# Contract: Send Message API

## Endpoint

```text
POST /api/v1/projects/{projectId}/conversations/{conversationId}/messages
```

## Authentication

- `Authorization: Bearer {jwt_token}`
- Provided automatically by the API client from `localStorage`.

## Request

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `projectId` | UUID | Project identifier |
| `conversationId` | UUID | Conversation identifier |

### Request Body

```json
{
  "content": "نص الرسالة هنا",
  "messageType": "TEXT",
  "replyToId": null,
  "attachmentIds": []
}
```

### Fields

| Field | Type | Required | Default | Constraints |
|---|---|---|---|---|
| `content` | string | Yes | — | Trimmed; 1–10,000 characters |
| `messageType` | enum | No | `TEXT` | One of `TEXT`, `IMAGE`, `FILE`, `VOICE` |
| `replyToId` | UUID \| null | No | `null` | Must reference an existing message in the conversation |
| `attachmentIds` | UUID[] | No | `[]` | Empty for this feature |

## Success Response

**Status**: `201 Created`

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "conversationId": "8358368b-c446-45f0-bec6-0d9b4af267ed",
  "senderUserId": "user-uuid-here",
  "content": "نص الرسالة هنا",
  "messageType": "TEXT",
  "status": "SENT",
  "replyToId": null,
  "isPinned": false,
  "editedAt": null,
  "deletedAt": null,
  "createdAt": "2026-06-24T14:00:00.000Z",
  "updatedAt": "2026-06-24T14:00:00.000Z"
}
```

## Error Responses

| Status | Code | Condition | Frontend Behavior |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | Empty or oversized content | Disable send + show inline validation |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT | API client redirects to login |
| 403 | `FORBIDDEN` | User not a member | Show Arabic toast error |
| 404 | `NOT_FOUND` | Project or conversation missing | Show Arabic toast error |
| 422 | `INVALID_REPLY` | `replyToId` does not exist | Show Arabic toast error, keep reply context |
| 408 / network | `TIMEOUT` / `NETWORK_ERROR` | Connectivity issue | Mark message `FAILED`, keep input, allow retry |
| 5xx | Server errors | Server failure | Mark message `FAILED`, allow retry |
