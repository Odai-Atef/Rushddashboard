# Data Model: Collaboration Attachments View

## Entities

### Attachment

A file associated with a project.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Unique identifier |
| projectId | UUID | Yes | Parent project |
| fileId | UUID | Yes | Reference to stored file |
| fileName | string | Yes | Original filename |
| fileSize | number | Yes | Size in bytes |
| mimeType | string | Yes | MIME type reported by browser or backend |
| attachmentType | enum | Yes | `DOCUMENT`, `IMAGE`, `VIDEO`, `AUDIO`, `OTHER` |
| projectStage | string \| null | Yes | Project phase label, e.g. `planning` |
| uploadedByUserId | UUID | Yes | Uploader identifier |
| createdAt | ISO datetime | Yes | Upload timestamp |

**Validation rules**
- `fileName` must be 1-255 characters.
- `fileSize` must be a non-negative number.
- `attachmentType` must be one of `DOCUMENT`, `IMAGE`, `VIDEO`, `AUDIO`, `OTHER`.

**UI mapping**
- `fileName` → displayed name and download filename.
- `fileSize` → human-readable size via formatter.
- `mimeType` + `attachmentType` → file type icon selection.
- `attachmentType` → type filter options.
- `projectStage` → stage chip or upload selector.
- `uploadedByUserId` → uploader identity.
- `createdAt` → upload timestamp.

### Paginated Attachment Response

| Field | Type | Notes |
|-------|------|-------|
| data | Attachment[] | Array of attachments |
| total | number | Total matching attachments |
| page | number | Current page |
| limit | number | Items per page |
| totalPages | number | Total pages |

### Attachment Type

| Value | Display label | Typical MIME families |
|-------|---------------|----------------------|
| DOCUMENT | Document | application/pdf, application/msword, text/* |
| IMAGE | Image | image/* |
| VIDEO | Video | video/* |
| AUDIO | Audio | audio/* |
| OTHER | Other | everything else |

**UI mapping**
- Used as filter options and as the type selector in the upload form.
- The backend may return additional type values; the frontend should render them with a generic icon.

### Project Stage

| Value | Display label |
|-------|---------------|
| planning | Planning |
| execution | Execution |
| monitoring | Monitoring |
| closure | Closure |

**UI mapping**
- Used as optional metadata during upload.
- The frontend provides common defaults but accepts values returned by the backend.

## Relationships

```text
Project 1--* Attachment
```

## State Transitions

### Attachment Lifecycle

```text
Uploaded -> Listed -> Downloaded
Uploaded -> Listed -> Deleted (removed)
```

There is no editable state; attachments are immutable except for deletion.

## TypeScript Shape Summary

```typescript
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

interface AttachmentFilters {
  page?: number;
  limit?: number;
  type?: AttachmentType;
}

interface UploadAttachmentParams {
  file: File;
  projectStage?: string;
}
```
