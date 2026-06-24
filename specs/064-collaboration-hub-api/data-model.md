# Data Model: Collaboration Hub Backend Integration

## Entities

### Conversation

A project chat context returned by the backend conversation list endpoint.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| projectId | UUID | Yes | Parent project |
| title | string \| null | Yes | Display name; fallback to generated label if null |
| type | enum | Yes | `PROJECT_GROUP`, `DIRECT_MESSAGE`, `SYSTEM_ALERT` |
| status | enum | Yes | `ACTIVE`, `ARCHIVED`, `MUTED` |
| createdByUserId | UUID | Yes | Conversation creator |
| lastMessageAt | ISO datetime \| null | Yes | Sort key for recency |
| lastMessageText | string \| null | Yes | Preview text; may be null |
| unreadCount | number | Yes | Badge count |
| createdAt | ISO datetime | Yes | |
| updatedAt | ISO datetime | Yes | |

**Validation rules**
- `type` must be one of the three declared enum values.
- `status` must be one of the three declared enum values.
- `unreadCount` is non-negative.

**UI mapping**
- `title` → conversation heading.
- `lastMessageText` + `lastMessageAt` → preview and time.
- `status` → badge/color (`ACTIVE` green, `ARCHIVED` gray, `MUTED` yellow/orange).
- `unreadCount` → badge number.

### Discussion

A threaded project topic returned by the backend discussions endpoint.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| projectId | UUID | Yes | Parent project |
| section | string | Yes | e.g., `budget`, `timeline` |
| title | string | Yes | Display heading |
| content | string | Yes | Body preview |
| authorUserId | UUID | Yes | Original author |
| status | enum | Yes | `OPEN`, `RESOLVED`, `CLOSED` |
| isPinned | boolean | Yes | Pin indicator |
| replyCount | number | Yes | Number of replies |
| lastReplyAt | ISO datetime \| null | Yes | Latest activity |
| createdAt | ISO datetime | Yes | |
| updatedAt | ISO datetime | Yes | |

**Validation rules**
- `status` must be one of `OPEN`, `RESOLVED`, `CLOSED`.
- `replyCount` is non-negative.

**UI mapping**
- `title` + `section` → card header.
- `content` → truncated preview.
- `status` → badge (`OPEN` green, `RESOLVED` gray, `CLOSED` blue).
- `isPinned` → pin icon.
- `replyCount` + `lastReplyAt` → activity summary.

### Attachment

A file linked to a project returned by the backend attachments endpoint.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| projectId | UUID | Yes | Parent project |
| fileId | UUID | Yes | Points to file storage record |
| fileName | string | Yes | Display name |
| fileSize | number | Yes | Bytes |
| mimeType | string | Yes | e.g., `application/pdf` |
| attachmentType | enum | Yes | `DOCUMENT`, `IMAGE`, `VIDEO`, `AUDIO`, `OTHER` |
| projectStage | string \| null | Yes | e.g., `budget review` |
| uploadedByUserId | UUID | Yes | Uploader |
| createdAt | ISO datetime | Yes | |

**Validation rules**
- `fileSize` is non-negative.
- `attachmentType` must be one of the five declared enum values.

**UI mapping**
- `fileName` + `attachmentType`/`mimeType` → icon and label.
- `fileSize` → human-readable size.
- `projectStage` → stage badge.
- `createdAt` → upload date.

### Pagination Envelope

All three list endpoints return the same envelope shape:

| Field | Type | Notes |
|-------|------|-------|
| data | T[] | Array of Conversation, Discussion, or Attachment |
| total | number | Total items across all pages |
| page | number | Current page number |
| limit | number | Items per page |
| totalPages | number | Total available pages |

## Relationships

```text
Project 1--* Conversation
Project 1--* Discussion
Project 1--* Attachment
```

## State Transitions

No client-side state transitions are introduced by this feature. Lists are read-only from the Hub perspective. Future features may add create/update, but that is out of scope here.

## TypeScript Shape Summary

```typescript
type ConversationType = 'PROJECT_GROUP' | 'DIRECT_MESSAGE' | 'SYSTEM_ALERT';
type ConversationStatus = 'ACTIVE' | 'ARCHIVED' | 'MUTED';

interface Conversation {
  id: string;
  projectId: string;
  title: string | null;
  type: ConversationType;
  status: ConversationStatus;
  createdByUserId: string;
  lastMessageAt: string | null;
  lastMessageText: string | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

type DiscussionStatus = 'OPEN' | 'RESOLVED' | 'CLOSED';

interface Discussion {
  id: string;
  projectId: string;
  section: string;
  title: string;
  content: string;
  authorUserId: string;
  status: DiscussionStatus;
  isPinned: boolean;
  replyCount: number;
  lastReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type AttachmentType = 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'OTHER';

interface Attachment {
  id: string;
  projectId: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  attachmentType: AttachmentType;
  projectStage: string | null;
  uploadedByUserId: string;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```
