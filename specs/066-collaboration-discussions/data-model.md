# Data Model: Collaboration Discussions View

## Entities

### Discussion

A project conversation tied to a section.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| projectId | UUID | Yes | Parent project |
| section | string | Yes | e.g., `budget`, `timeline`, `scope`, `general` |
| title | string | Yes | Display title (1-500 chars) |
| content | string | Yes | Body in markdown/HTML (1-20000 chars) |
| authorUserId | UUID | Yes | Discussion creator |
| status | enum | Yes | `OPEN`, `RESOLVED`, `CLOSED` |
| isPinned | boolean | Yes | Pin indicator (out of scope for mutations) |
| replyCount | number | Yes | Cached reply count |
| lastReplyAt | ISO datetime \| null | Yes | Recency sort key |
| createdAt | ISO datetime | Yes | |
| updatedAt | ISO datetime | Yes | |

**Validation rules**
- `section` must be 1-100 characters.
- `title` must be 1-500 characters.
- `content` must be 1-20000 characters.
- `status` must be one of `OPEN`, `RESOLVED`, `CLOSED`.

**UI mapping**
- `title` → discussion list title and detail header.
- `content` → rendered body.
- `authorUserId` → author identity.
- `status` → status badge.
- `section` → section chip/filter.
- `replyCount`/`lastReplyAt` → list metadata.
- `createdAt`/`updatedAt` → timestamps.

### Reply

A response to a discussion.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| discussionId | UUID | Yes | Parent discussion |
| authorUserId | UUID | Yes | Reply author |
| content | string | Yes | Reply body (1-20000 chars) |
| isAccepted | boolean | Yes | Accepted solution marker |
| createdAt | ISO datetime | Yes | |
| updatedAt | ISO datetime | Yes | |

**Validation rules**
- `content` must be 1-20000 characters.

**UI mapping**
- `content` → rendered reply body.
- `authorUserId` → author identity.
- `isAccepted` → accepted-solution highlight.
- `createdAt`/`updatedAt` → timestamps.

### Paginated Discussion Response

| Field | Type | Notes |
|-------|------|-------|
| data | Discussion[] | Array of discussions |
| total | number | Total matching discussions |
| page | number | Current page |
| limit | number | Items per page |
| totalPages | number | Total pages |

### Project Section

A category used to classify discussions.

| Value | Display label |
|-------|---------------|
| budget | Budget |
| timeline | Timeline |
| scope | Scope |
| general | General |

**UI mapping**
- Used as filter options and as the section selector in the create/edit form.
- The backend may accept additional section values; the frontend should render them gracefully.

## Relationships

```text
Project 1--* Discussion
Discussion 1--* Reply
```

## State Transitions

### Discussion Status

```text
OPEN -> RESOLVED
OPEN -> CLOSED
RESOLVED -> OPEN
RESOLVED -> CLOSED
CLOSED -> OPEN
CLOSED -> RESOLVED
```

Only authorized users can change status. The status change is explicit via a dedicated endpoint.

### Accepted Solution

```text
Reply.isAccepted = false -> true
```

Only one reply per discussion can be marked as accepted. The frontend assumes the backend enforces this; if another reply is accepted, the UI updates from the refreshed detail response.

### Soft-Deleted Discussion

```text
Discussion active -> deleted (hidden from list, placeholder shown)
```

Replies and accepted-solution history become inaccessible from the discussion view. The list entry is replaced by a placeholder.

## TypeScript Shape Summary

```typescript
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

interface DiscussionWithReplies extends Discussion {
  replies: Reply[];
}

interface Reply {
  id: string;
  discussionId: string;
  authorUserId: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CreateDiscussionDto {
  section: string;
  title: string;
  content: string;
  attachmentIds?: string[];
}

interface UpdateDiscussionDto {
  title?: string;
  content?: string;
}

interface ChangeDiscussionStatusDto {
  status: DiscussionStatus;
}

interface CreateReplyDto {
  content: string;
}

interface DiscussionFilters {
  page?: number;
  limit?: number;
  section?: string;
  status?: DiscussionStatus;
}
```
