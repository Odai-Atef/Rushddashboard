# Backend API Contract: Collaboration Attachments View

## Base

- All endpoints are relative to `ENV.API_BASE_URL`.
- All requests require a valid Bearer token (handled by `apiClient`).
- List endpoint uses the `PaginatedResponse<T>` envelope.

## Endpoints

### 1. List Project Attachments

```text
GET /api/v1/projects/:projectId/attachments
```

**Query parameters**

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page |
| type | string | No | - | Filter by attachment type (`DOCUMENT`, `IMAGE`, `VIDEO`, `AUDIO`, `OTHER`) |

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "fileId": "uuid",
      "fileName": "budget_q2_2026.pdf",
      "fileSize": 2048576,
      "mimeType": "application/pdf",
      "attachmentType": "DOCUMENT",
      "projectStage": "planning",
      "uploadedByUserId": "uuid",
      "createdAt": "2026-06-20T08:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### 2. Upload Attachment

```text
POST /api/v1/projects/:projectId/attachments
```

**Request**

- `Content-Type: multipart/form-data` (set automatically by the browser).
- Form fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| file | File | Yes | The file to upload |
| projectStage | string | No | Project stage label |

**Response 201**

```json
{
  "id": "uuid",
  "projectId": "uuid",
  "fileId": "uuid",
  "fileName": "budget_q2_2026.pdf",
  "fileSize": 2048576,
  "mimeType": "application/pdf",
  "attachmentType": "DOCUMENT",
  "projectStage": "planning",
  "uploadedByUserId": "uuid",
  "createdAt": "2026-06-24T12:00:00Z"
}
```

### 3. Download Attachment

```text
GET /api/v1/projects/:projectId/attachments/:attachmentId/download
```

**Response 200**

- Binary file content.
- Headers:
  - `Content-Disposition: attachment; filename="budget_q2_2026.pdf"`
  - `Content-Type: application/pdf`

### 4. Delete Attachment

```text
DELETE /api/v1/projects/:projectId/attachments/:attachmentId
```

**Response 204**: No content.

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
| 400 | Bad request | Show validation error (e.g., file too large, disallowed type) |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission message |
| 404 | Not found | Show missing attachment state |
| 413 | Payload too large | Show file size limit message |
| 415 | Unsupported media type | Show disallowed file type message |
| 500/502/503/504 | Server error | Show retry option |

## Query-Parameter Rules

- Omit `undefined`/`null` query params.
- `page` and `limit` must be positive integers.
- `type` must match a known `AttachmentType` value when provided.
