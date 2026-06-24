# Data Model: Collaboration Chat View Backend Integration

## Entities

### Conversation

A project chat context returned by the backend conversation list endpoint. Same entity as defined in feature 064.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| projectId | UUID | Yes | Parent project |
| title | string \| null | Yes | Display name; fallback to generated label if null |
| type | enum | Yes | `PROJECT_GROUP`, `DIRECT_MESSAGE`, `SYSTEM_ALERT` |
| status | enum | Yes | `ACTIVE`, `ARCHIVED`, `MUTED` |
| createdByUserId | UUID | Yes | Conversation creator |
| lastMessageAt | ISO datetime \| null | Yes | Sort key for recency |
| lastMessageText | string \| null | Yes | Preview text |
| unreadCount | number | Yes | Badge count |
| createdAt | ISO datetime | Yes | |
| updatedAt | ISO datetime | Yes | |

### Message

A single item in a conversation.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| conversationId | UUID | Yes | Parent conversation |
| senderUserId | UUID | Yes | Message author |
| content | string | Yes | Message body; empty not allowed |
| messageType | enum | Yes | `TEXT`, `IMAGE`, `FILE`, `VOICE`, `SYSTEM` |
| status | enum | Yes | `SENDING`, `SENT`, `DELIVERED`, `READ`, `FAILED` |
| replyToId | UUID \| null | Yes | References parent message |
| isPinned | boolean | Yes | Pin indicator |
| editedAt | ISO datetime \| null | Yes | Set when message is edited |
| deletedAt | ISO datetime \| null | Yes | Set for soft-deleted messages |
| createdAt | ISO datetime | Yes | |
| updatedAt | ISO datetime | Yes | |

**Validation rules**
- `messageType` must be one of the five declared enum values.
- `status` must be one of the five declared enum values.
- `content` length must be between 1 and 10,000 characters when sending or editing.

**UI mapping**
- `content` → message body.
- `senderUserId` → sender identity (display name resolved externally if available).
- `status` → delivery/read indicators.
- `messageType` → rendering style (text, image, file, voice, system).
- `replyToId` → threaded reply indicator.
- `isPinned` → pin icon.
- `editedAt` → edited marker.
- `deletedAt` → deleted/hidden marker.

### Cursor-Based Message Response

| Field | Type | Notes |
|-------|------|-------|
| data | Message[] | Array of messages |
| nextCursor | string \| null | Cursor for the next page |
| hasMore | boolean | Whether more pages exist |

## Relationships

```text
Project 1--* Conversation
Conversation 1--* Message
Message 0..1--* Message (replyToId)
```

## State Transitions

### Message Status

```text
SENDING -> SENT -> DELIVERED -> READ
SENDING -> FAILED -> SENDING (retry) -> SENT
```

### Message Lifecycle

```text
Active -> Edited (editedAt set)
Active -> Deleted (deletedAt set, content hidden)
```

## TypeScript Shape Summary

```typescript
type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'SYSTEM';
type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

interface Message {
  id: string;
  conversationId: string;
  senderUserId: string;
  content: string;
  messageType: MessageType;
  status: MessageStatus;
  replyToId: string | null;
  isPinned: boolean;
  editedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MessagesResponse {
  data: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface CreateMessageDto {
  content: string;
  messageType?: MessageType;
  replyToId?: string;
  attachmentIds?: string[];
}

interface UpdateMessageDto {
  content: string;
}
```
