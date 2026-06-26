# Data Model: Charity Document Upload Integration

**Feature**: Charity Document Upload Integration  
**Date**: 2026-06-16

## Entities

### Organization Document
Represents a file uploaded for an organization during the onboarding documents step.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string (UUID)` | Yes | Unique identifier of the uploaded document record. |
| `fileId` | `string (UUID) \| null` | Yes | Identifier of the stored file object. |
| `organizationId` | `string (UUID) \| null` | Yes | Identifier of the organization the document belongs to. |
| `documentType` | `"registration" \| "financial" \| "other" \| string` | Yes | Backend document type used for grouping and slot mapping. |
| `originalName` | `string` | Yes | Original filename as shown to the user. |
| `fileUrl` | `string` | Yes | URL to view or download the file. |
| `status` | `"UPLOADED" \| "PENDING_REVIEW" \| string` | Yes | Lifecycle status of the document. |
| `description` | `string \| null` | No | Optional human-readable description of the document. |
| `createdAt` | `ISO 8601 string` | Yes | Timestamp when the document was created. |
| `updatedAt` | `ISO 8601 string` | Yes | Timestamp when the document was last updated. |

### Document Slot
Represents a placeholder in the documents UI for a specific document category.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Frontend slot identifier (for example, `license`, `bank`, `address`, `profile`). |
| `label` | `string` | Yes | Localized Arabic label shown to the user. |
| `required` | `boolean` | Yes | Whether the slot is required for step completion. |
| `documentType` | `"registration" \| "financial" \| "other"` | Yes | Mapped backend document type for this slot. |

### Frontend Upload State
Represents the transient upload state displayed in a slot while a file is being uploaded.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the upload entry. |
| `slotId` | `string` | Yes | Slot this upload belongs to. |
| `name` | `string` | Yes | Original filename. |
| `type` | `string` | Yes | MIME type of the file. |
| `size` | `number` | Yes | File size in bytes. |
| `status` | `"uploading" \| "completed" \| "error"` | Yes | Current UI status of the upload. |
| `progress` | `number` | Yes | Numeric progress 0–100 for the progress bar. |

## Relationships

- An **Organization** has zero or many **Organization Document** records.
- An **Organization Document** belongs to exactly one **Organization** via `organizationId`.
- A **Document Slot** maps to exactly one backend `documentType`, but multiple slot IDs may map to the same `documentType` (for example, `address`, `profile`, `projects`, `annual`, and `brand` all map to `other`).
- The frontend displays at most one **Organization Document** per **Document Slot**, using the most recently uploaded document when multiple records share the same slot mapping.

## Document Type Mapping

| Frontend Slot ID | Backend `documentType` | Required | Arabic Label |
|------------------|------------------------|----------|--------------|
| `license` | `registration` | Yes | رخصة الجمعية الخيرية |
| `bank` | `financial` | Yes | شهادة الحساب البنكي |
| `address` | `other` | Yes | العنوان الوطني |
| `profile` | `other` | Yes | الملف التعريفي للجهه |
| `projects` | `other` | No | المشاريع السابقة |
| `financial` | `financial` | No | التقارير المالية |
| `annual` | `other` | No | التقارير السنوية |
| `brand` | `other` | No | الهوية البصرية |

## Validation Rules

- A slot is considered completed if it has a document whose `status` is `UPLOADED` or `PENDING_REVIEW`.
- Only the four required slots (`license`, `bank`, `address`, `profile`) affect step completion.
- Each slot accepts at most one displayed document; a new upload replaces any previous document in the same slot.
- The documents step requires a valid `organizationId`; if missing or invalid, the user is redirected to the organization creation/selection step.

## State Transitions

- **Empty**: No documents have been uploaded; all slots show upload controls.
- **Loading Existing**: On entering the documents step, the frontend calls `GET /api/v1/onboarding/documents?organizationId={id}` and maps returned documents into slots.
- **Uploading**: User selects a file; the slot enters `uploading` status with a progress bar; navigation buttons are disabled.
- **Completed**: On `201 Created` from `POST /api/v1/onboarding/documents/upload`, the slot shows the uploaded document name and a completion indicator; the old document (if any) is removed from the backend and UI.
- **Error**: On upload failure, the slot returns to empty with an error message and a retry option.
- **Deleting**: User clicks delete; the frontend calls `DELETE /api/v1/onboarding/documents/{id}` and, on success, removes the document from the slot.

## Frontend State Shape

```typescript
type DocumentStatus = 'UPLOADED' | 'PENDING_REVIEW' | string;

interface OrganizationDocument {
  id: string;
  fileId?: string;
  fileUrl: string;
  originalName: string;
  documentType: 'registration' | 'financial' | 'other' | string;
  status: DocumentStatus;
  createdAt?: string;
  updatedAt?: string;
}

interface DocumentSlot {
  id: string;
  label: string;
  required: boolean;
  documentType: 'registration' | 'financial' | 'other';
}

interface UploadedFile {
  id: string;
  slotId: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}
```

The component derives:
- `completedRequiredCount` from required slots that have a matching uploaded document with status `UPLOADED` or `PENDING_REVIEW`.
- `isDocumentsComplete` when `completedRequiredCount === 4`.
- `hasPendingUploads` from any `uploadedFiles` entry with `status === 'uploading'`.
