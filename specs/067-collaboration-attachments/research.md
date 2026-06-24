# Research: Collaboration Attachments View

## Unknowns Resolved

### 1. Where should attachment API methods live?

**Decision**: Extend `src/api/services/collaboration-service.ts` with upload, download, and delete methods.

**Rationale**: Conversations, messages, discussions, replies, and attachments all belong to the same collaboration domain. The attachment list method already exists in this service from feature 064. Keeping upload/download/delete here maintains domain cohesion and reuses the existing `Attachment` type.

**Alternatives considered**:
- Add methods to `project-service.ts`: rejected because it would mix project-management concerns with collaboration/file concerns.
- Create a separate `attachment-service.ts`: rejected because it would fragment the collaboration domain unnecessarily.

### 2. How should multipart file uploads be handled?

**Decision**: Add a dedicated `upload` method on `apiClient` (or use `fetch` directly within `collaboration-service.ts`) that accepts `FormData`, omits the `Content-Type` header so the browser sets the correct multipart boundary, and reports progress via an `onProgress` callback.

**Rationale**: The existing `apiClient.post` always stringifies JSON. Multipart uploads require `FormData` and progress tracking, which the generic methods do not support. A focused upload method keeps this complexity isolated and reusable.

**Alternatives considered**:
- Modify the generic `post` method to detect `FormData`: rejected because it would complicate the base client and risk breaking existing JSON endpoints.
- Use a third-party upload library: rejected because the browser's `XMLHttpRequest`/`fetch` with `ReadableStream` is sufficient and avoids adding dependencies.

### 3. How should download be triggered?

**Decision**: Fetch the file as a `Blob` with the existing auth token, then create a temporary anchor element with a `URL.createObjectURL` and a `download` attribute set to the original filename.

**Rationale**: The backend returns binary content with `Content-Disposition: attachment`. Programmatically creating an anchor from a Blob works reliably across modern browsers, preserves the filename, and avoids navigating away from the app.

**Alternatives considered**:
- Open the download endpoint directly in a new tab: rejected because it may lose the auth header or trigger a popup blocker.
- Use a hidden iframe: rejected because Blob + anchor is simpler and more modern.

### 4. How should file type icons be mapped?

**Decision**: Map attachment types and MIME patterns to `lucide-react` icons already used across the project. Render a generic file icon for unknown or unsupported types.

**Rationale**: The project already depends on `lucide-react`. Reusing its icons keeps the icon set consistent and avoids adding a new icon library.

**Alternatives considered**:
- Add a dedicated file-type icon library: rejected because `lucide-react` already provides sufficient document, image, video, audio, and generic file icons.

### 5. How should upload progress be tracked?

**Decision**: Use `XMLHttpRequest` for uploads when progress reporting is needed because it natively supports `progress` events. Fallback to `fetch` for simple uploads without progress.

**Rationale**: `fetch` does not expose upload progress in all environments. `XMLHttpRequest` provides reliable progress events and can still send the same FormData and auth headers.

**Alternatives considered**:
- Track progress based only on request start/end: rejected because it does not satisfy the explicit requirement to show progress during upload.

## Best-Practice Notes

- Reuse existing `getCollaborationErrorMessage` for all server errors.
- Abort in-flight list requests on unmount or when filters change to avoid race conditions.
- Reset the upload input after a successful upload so the same file can be selected again if needed.
- Keep file size formatting in a shared formatter so it can be reused in other modules.
- Do not upload until the user explicitly submits; pre-validation of file size (if a limit is known) should happen client-side to avoid unnecessary requests.
- Avoid introducing new global stores or dependencies; keep state local to the page and its hooks.
