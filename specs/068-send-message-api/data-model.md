# Data Model: Send Message API Integration

## Entities

### Message

Represents a single chat message inside a conversation.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Yes | Server-generated after persistence; optimistic messages use a temporary client id. |
| `conversationId` | string (UUID) | Yes | Identifies the parent conversation. |
| `senderUserId` | string (UUID or `'me'`) | Yes | `'me'` is used for optimistic messages before the server response. |
| `content` | string | Yes | 1–10,000 characters. |
| `messageType` | enum | Yes | `TEXT` for this feature; `IMAGE`, `FILE`, `VOICE`, `SYSTEM` out of scope. |
| `status` | enum | Yes | `SENDING`, `SENT`, `DELIVERED`, `READ`, `FAILED`. |
| `replyToId` | string (UUID) \| null | No | Identifier of the message being replied to. |
| `isPinned` | boolean | Yes | Defaults to `false`; out of scope for sending. |
| `editedAt` | ISO string \| null | Yes | Null until edited. |
| `deletedAt` | ISO string \| null | Yes | Null until soft-deleted. |
| `createdAt` | ISO string | Yes | Client sets temporary value for optimistic messages; server value replaces it on success. |
| `updatedAt` | ISO string | Yes | Same as `createdAt` on first send. |

### Conversation

A chat channel within a project. Messages are scoped to a conversation.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | Yes | Conversation identifier passed in the send URL. |
| `projectId` | string (UUID) | Yes | Project identifier passed in the send URL. |
| `title` | string \| null | Yes | Display name of the conversation. |
| `type` | enum | Yes | `PROJECT_GROUP`, `DIRECT_MESSAGE`, `SYSTEM_ALERT`. |
| `status` | enum | Yes | `ACTIVE`, `ARCHIVED`, `MUTED`. |

### Reply Reference (logical relationship)

- A message can optionally reference another message via `replyToId`.
- The referenced message must exist in the same conversation.
- If the referenced message does not exist, the backend returns `422 INVALID_REPLY` and the UI shows an error.

## Validation Rules

- `content` must be a non-empty string after trimming.
- `content` length must not exceed 10,000 characters.
- `messageType` defaults to `TEXT` when omitted.
- `replyToId`, when provided, must be a valid UUID string.
- `attachmentIds` must be an array of UUIDs; empty for this feature.

## State Transitions

```text
SENDING → SENT        (server confirms persistence)
SENT   → DELIVERED   (real-time channel reports delivery)
SENT   → READ        (real-time channel or mark-as-read reports read)
DELIVERED → READ     (real-time channel or mark-as-read reports read)
SENDING → FAILED     (network/server/client error)
FAILED  → SENDING    (user triggers retry)
FAILED  → SENT       (retry succeeds)
```

## Notes

- Optimistic messages start with `status = SENDING` and a temporary `id`.
- On successful send, the optimistic message is replaced by the server-returned message (same `content`, server-generated `id`, `status = SENT`).
- On failure, the optimistic message keeps its temporary `id` but its `status` changes to `FAILED`; the user can retry it.
- The chat thread preserves submission order by sorting on `createdAt`; client-side timestamps must be monotonic for rapid successive messages.
