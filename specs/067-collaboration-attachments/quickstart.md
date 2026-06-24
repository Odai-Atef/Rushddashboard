# Quickstart: Collaboration Attachments View

## What this feature does

Replaces hardcoded mock attachment data in the Project Collaboration Module's Attachments view with live backend data for:

- Attachments list with pagination and type filtering
- File upload with progress indicator
- File download
- File delete with confirmation

## Files you will touch

### New files

| File | Purpose |
|------|---------|
| `src/api/hooks/useAttachmentMutations.ts` | Hook for upload, download, and delete helpers |

### Modified files

| File | Change |
|------|--------|
| `src/api/client.ts` | Add `upload` method supporting FormData and progress callbacks |
| `src/api/services/collaboration-service.ts` | Add upload, download, and delete attachment methods |
| `src/app/components/ProjectCollaborationModule.tsx` | Refactor `AttachmentsView` to use hooks and remove mock data |
| `src/app/lib/formatters.ts` | Add human-readable file size formatter |

## Runbook

### 1. Extend the API client

Add an `upload` method to `src/api/client.ts` that:

- Accepts `endpoint`, `FormData` body, `onProgress` callback, and optional `RequestConfig`.
- Uses `XMLHttpRequest` to enable progress reporting.
- Sends the auth token in the `Authorization` header.
- Does **not** set `Content-Type` so the browser supplies the correct multipart boundary.
- Returns a typed `ApiResponse<T>` on success or throws `ApiError` on failure.

### 2. Extend the service

Add the following methods to `src/api/services/collaboration-service.ts`:

- `uploadAttachment(projectId, file, projectStage?, onProgress?, config?)`
- `downloadAttachment(projectId, attachmentId, fileName, config?)`
- `deleteAttachment(projectId, attachmentId, config?)`

The upload method should construct a `FormData` with `file` and optional `projectStage`.

### 3. Create the mutations hook

Implement `src/api/hooks/useAttachmentMutations.ts` with:

- `upload(file, projectStage?, onProgress?)` returning the created attachment.
- `download(attachment)` triggering a Blob download with the original filename.
- `deleteAttachment(attachmentId)` returning success boolean.
- `isUploading`, `uploadProgress`, `isDeleting`, and `error` states.

### 4. Refactor the Attachments view

In `ProjectCollaborationModule.tsx`:

- Use `useProjectAttachments` for the list.
- Use `useAttachmentMutations` for upload/download/delete.
- Remove the local `attachments` mock array.
- Add type filter controls and pagination controls.
- Add an upload area supporting file picker and drag-and-drop.
- Show upload progress during active uploads.
- Add download actions to each file row/card.
- Add delete buttons with a confirmation modal.
- Add loading, error, and empty states.

### 5. Add file size formatter

Add `formatFileSize(bytes: number): string` to `src/app/lib/formatters.ts` using KB/MB/GB units.

### 6. Verify

1. Start the dev server: `npm run dev`
2. Navigate to `/dashboard/collaboration/:projectId/attachments`
3. Confirm the attachments list loads and type filters work.
4. Upload a file and confirm progress indicator appears and the file is added to the list.
5. Download a file and confirm the correct filename and content.
6. Delete a file and confirm the list updates after confirmation.

## Testing hints

- Mock service responses and verify that the hook updates state correctly.
- Test upload progress by simulating `XMLHttpRequest` progress events.
- Test download by verifying the temporary anchor click and `URL.revokeObjectURL` cleanup.
- Test delete confirmation cancellation and success paths.
- Test error handling for 413 (file too large) and 415 (unsupported type).

## Common pitfalls

- Setting `Content-Type` manually on multipart requests, which breaks the boundary.
- Forgetting to revoke the object URL after download, causing memory leaks.
- Leaving the file input value set after upload, preventing re-upload of the same file.
- Not handling `413` and `415` status codes with user-friendly messages.
- Mixing the local `Attachment` mock type with the service `Attachment` type.
