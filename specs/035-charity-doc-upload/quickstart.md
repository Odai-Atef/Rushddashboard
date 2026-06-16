# Quickstart: Charity Document Upload Integration

**Feature**: Charity Document Upload Integration  
**Date**: 2026-06-16

## What This Feature Does

Wires the existing charity onboarding documents step to the backend document upload API. Users can upload required and optional documents, see previously uploaded documents after refreshing or revisiting, delete uploaded documents, and only proceed once all four required documents are uploaded (status `UPLOADED` or `PENDING_REVIEW`).

## Implementation Overview

1. Extend the onboarding service with document API methods.
2. Update `CharityOnboardingFlow.tsx` to load existing documents on the documents step.
3. Add upload, delete, and slot-replacement handlers inside the documents view.
4. Update the documents UI to show progress, completion status, counters, and a disabled Continue button until all required slots are complete.
5. Guard navigation while uploads are in progress.

## Files Changed

- `src/api/services/onboarding-service.ts` — added `getOrganizationDocuments`, `uploadOrganizationDocument`, and `deleteOrganizationDocument`.
- `src/app/components/CharityOnboardingFlow.tsx` — integrated load, upload, delete, replacement, progress, counters, and completion logic in the documents step.
- `specs/035-charity-doc-upload/tasks.md` — all implementation tasks completed.

## Service API Additions

```typescript
export interface OrganizationDocument {
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

async getOrganizationDocuments(organizationId: string): Promise<ApiResponse<OrganizationDocument[]>> {
  return apiClient.get('/api/v1/onboarding/documents', { params: { organizationId } });
}

async uploadOrganizationDocument(
  file: File,
  documentType: string,
  description?: string
): Promise<ApiResponse<OrganizationDocument>> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  if (description) formData.append('description', description);

  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  const response = await fetch(`${apiClient.defaults.baseURL}/api/v1/onboarding/documents/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const data = await response.json();
  return { success: true, data, message: 'Upload successful' };
}

async deleteOrganizationDocument(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete(`/api/v1/onboarding/documents/${id}`);
}
```

## Document Type Mapping

| Slot ID | Backend `documentType` | Required |
|---------|------------------------|----------|
| `license` | `registration` | Yes |
| `bank` | `financial` | Yes |
| `address` | `other` | Yes |
| `profile` | `other` | Yes |
| `projects` | `other` | No |
| `financial` | `financial` | No |
| `annual` | `other` | No |
| `brand` | `other` | No |

## In-Component Helpers

`src/app/components/CharityOnboardingFlow.tsx` contains:

- `documentSlots` — static list of required and optional slots with Arabic labels and document type mapping.
- `mapSlotToDocumentType(slotId)` — returns the backend `documentType` for a slot.
- `loadExistingDocuments(organizationId)` — fetches existing documents and maps them into `uploadedFiles` state.
- `handleUpload(slotId, file)` — uploads a file for a slot, simulates progress, and replaces any existing document in the slot.
- `handleDelete(slotId)` — deletes the document for a slot and updates the UI.
- `getSlotDocument(slotId)` — returns the current document for a slot from `uploadedFiles`.
- `completedRequiredCount` / `isDocumentsComplete` — derived values controlling the Continue button and warning.
- `hasPendingUploads` — derived flag used to disable navigation during uploads.

## UI Flow

1. **On entering documents step**:
   - Verify `organization?.id` exists; if not, redirect to registration/landing.
   - Call `getOrganizationDocuments(organization.id)`.
   - Map returned documents to `uploadedFiles` with status `completed`.
   - Update counters (0/4 required, uploaded count, pending review count).
2. **On file selection**:
   - Validate basic file info (the backend enforces size/type).
   - Add an `uploading` entry to `uploadedFiles` for the slot with simulated progress.
   - Call `uploadOrganizationDocument(file, documentType, description)`.
   - On success: replace the entry with the returned document as `completed`; if a previous document existed in the slot, delete it.
   - On failure: set the entry status to `error`, show a toast error, and allow retry.
3. **On delete**:
   - Call `deleteOrganizationDocument(document.id)`.
   - On success: remove the document from `uploadedFiles`.
   - On failure: show a toast error and keep the document in the slot.
4. **On Continue**:
   - Enabled only when `completedRequiredCount === 4` and `!hasPendingUploads`.
   - If disabled, a warning explains that required documents are incomplete.
   - On click, update `organization.currentStep` to `PROCESSING` and navigate to the processing view.

## Validation Rules

- A required slot is complete when its document status is `UPLOADED` or `PENDING_REVIEW`.
- Optional slots do not affect completion.
- Each slot displays at most one document; a new upload replaces the previous one.
- Navigation away from the documents step is blocked while any upload is in progress.

## Error Handling

- Uses `sonner` for toast messages.
- On document load failure, shows an inline error and retry button.
- On upload failure, shows a toast and marks the slot as errored with a retry control.
- On delete failure, shows a toast and keeps the document in the slot.
- On a `401` response, the existing `apiClient` redirects to login.

## Testing Locally

1. Start the dev server: `npm run dev`.
2. Log in and proceed to the onboarding documents step.
3. Upload a file for each required slot:
   - Observe the progress bar.
   - Confirm the slot shows the file name and a checkmark.
   - Confirm counters update (uploaded count, 0/4 → 4/4).
4. Refresh the page:
   - Confirm previously uploaded documents appear in the correct slots.
5. Delete an uploaded document:
   - Confirm the slot returns to empty.
   - Confirm the required-documents warning reappears and Continue is disabled.
6. Upload a new file to a slot that already has a document:
   - Confirm the old file is replaced in the UI.
7. Try to proceed without all required documents:
   - Confirm the Continue button is disabled and a warning is shown.
8. Confirm the build compiles: `npm run build`.
