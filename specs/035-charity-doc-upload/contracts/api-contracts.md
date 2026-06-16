# API Contracts: Charity Document Upload Integration

**Feature**: Charity Document Upload Integration  
**Date**: 2026-06-16

## Endpoints

### GET /api/v1/onboarding/documents

Retrieve all uploaded documents for the authenticated organization.

**Authentication**: Bearer JWT

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | `string (UUID)` | Required | Organization identifier to scope the request. |

**Example**: `GET /api/v1/onboarding/documents?organizationId=uuid`

**Response**: `200 OK`

```json
[
  {
    "id": "doc-uuid-1",
    "fileId": "file-uuid-1",
    "fileUrl": "https://api.example.com/files/file-uuid-1",
    "originalName": "license.pdf",
    "documentType": "registration",
    "status": "UPLOADED",
    "description": "رخصة الجمعية الخيرية",
    "createdAt": "2026-06-16T10:00:00Z",
    "updatedAt": "2026-06-16T10:00:00Z"
  },
  {
    "id": "doc-uuid-2",
    "fileId": "file-uuid-2",
    "fileUrl": "https://api.example.com/files/file-uuid-2",
    "originalName": "bank_certificate.pdf",
    "documentType": "financial",
    "status": "PENDING_REVIEW",
    "description": "شهادة الحساب البنكي",
    "createdAt": "2026-06-16T10:05:00Z",
    "updatedAt": "2026-06-16T10:05:00Z"
  }
]
```

**Error Responses**:

- `401 Unauthorized`

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

- `404 Not Found` (organization not found)

```json
{
  "statusCode": 404,
  "message": "Organization not found"
}
```

---

### POST /api/v1/onboarding/documents/upload

Upload a new document for the authenticated organization.

**Authentication**: Bearer JWT

**Content-Type**: `multipart/form-data` (must be set automatically by the browser; do not set manually).

**Request Body** (multipart form fields):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | Required | The file to upload. |
| `documentType` | `string` | Required | Backend document type (`registration`, `financial`, `other`). |
| `description` | `string` | Optional | Human-readable description of the document. |

**Success Response**: `201 Created`

```json
{
  "id": "doc-uuid-3",
  "fileId": "file-uuid-3",
  "fileUrl": "https://api.example.com/files/file-uuid-3",
  "originalName": "national_address.pdf",
  "documentType": "other",
  "status": "UPLOADED",
  "description": "العنوان الوطني",
  "createdAt": "2026-06-16T10:10:00Z",
  "updatedAt": "2026-06-16T10:10:00Z"
}
```

**Error Responses**:

- `400 Bad Request` (validation error, unsupported file type, or file too large)

```json
{
  "statusCode": 400,
  "message": "File exceeds maximum allowed size"
}
```

- `401 Unauthorized`

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### DELETE /api/v1/onboarding/documents/{id}

Delete an uploaded document by its identifier.

**Authentication**: Bearer JWT

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string (UUID)` | Required | Unique identifier of the document to delete. |

**Success Response**: `204 No Content`

**Error Responses**:

- `401 Unauthorized`

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

- `404 Not Found` (document not found)

```json
{
  "statusCode": 404,
  "message": "Document not found"
}
```

## Document Type Enum

| Value | Meaning |
|-------|---------|
| `registration` | Association / charity registration license |
| `financial` | Bank certificate or financial reports |
| `other` | National address, profile, projects, annual reports, brand identity, etc. |

## Document Status Enum

| Value | Meaning |
|-------|---------|
| `UPLOADED` | Document is uploaded and accepted. |
| `PENDING_REVIEW` | Document is uploaded but awaiting backend review. |

The frontend considers both `UPLOADED` and `PENDING_REVIEW` as valid for required-slot completion.

## Frontend Service Methods

```typescript
interface OrganizationDocument {
  id: string;
  fileId?: string;
  fileUrl: string;
  originalName: string;
  documentType: 'registration' | 'financial' | 'other' | string;
  status: 'UPLOADED' | 'PENDING_REVIEW' | string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// GET /api/v1/onboarding/documents?organizationId=...
async getOrganizationDocuments(organizationId: string): Promise<ApiResponse<OrganizationDocument[]>>

// POST /api/v1/onboarding/documents/upload (multipart/form-data)
async uploadOrganizationDocument(
  file: File,
  documentType: string,
  description?: string
): Promise<ApiResponse<OrganizationDocument>>

// DELETE /api/v1/onboarding/documents/{id}
async deleteOrganizationDocument(id: string): Promise<ApiResponse<void>>
```

## Integration Notes

- The frontend MUST map each slot to the correct `documentType` before uploading or loading documents.
- The frontend MUST send `multipart/form-data` for the upload endpoint. Setting `Content-Type` manually will break the boundary, so the browser must compute it from the raw `FormData` body.
- The frontend SHOULD delete the previous document in a slot after a replacement upload succeeds to avoid orphaned records.
- On a `401` response, the frontend SHOULD redirect to login or surface a session-expired message using existing auth handling.
- On a `400` response from the upload endpoint, the frontend MUST show a user-friendly error and allow the user to retry.
