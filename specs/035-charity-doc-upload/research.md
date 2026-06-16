# Research Notes: Charity Document Upload Integration

**Feature**: Charity Document Upload Integration  
**Date**: 2026-06-16

## Decisions

### API Layer
- **Decision**: Extend the existing `OnboardingService` class in `src/api/services/onboarding-service.ts` to add three document-related methods: `getOrganizationDocuments`, `uploadOrganizationDocument`, and `deleteOrganizationDocument`.
- **Rationale**: The project already centralizes onboarding APIs in `OnboardingService`, uses JWT-based auth via `apiClient`, and exposes `ApiResponse<T>` typing. Keeping document operations in the same service follows the pattern used for assessment answers and organization/profile APIs.
- **Alternatives considered**: Creating a separate `document-service.ts` file. Rejected because onboarding operations are already colocated and a separate file adds unnecessary indirection for a three-endpoint feature.

### Multipart Upload Transport
- **Decision**: Use the browser's native `FormData` and `fetch` directly for the upload call rather than routing through the existing `apiClient.post` helper.
- **Rationale**: `apiClient.post` always sets `Content-Type: application/json` and stringifies the body. Multipart file uploads require the browser to set the `Content-Type: multipart/form-data` boundary automatically, which only works when the body is a raw `FormData` object and no explicit `Content-Type` header is supplied.
- **Alternatives considered**: Extending `apiClient` with a generic `upload` method. Rejected to keep the change localized; the upload can be implemented directly inside `OnboardingService` and wrapped with the same error handling and auth header patterns used by `apiClient`.

### Upload Progress UX
- **Decision**: Simulate progress by transitioning the slot through `uploading` with an indeterminate/intermediate progress bar and then to `completed` (or `error`) once the API response returns.
- **Rationale**: The current `Progress` primitive supports a numeric `value`, and the existing UI has a progress indicator area. Native `fetch` does not expose upload progress; using `XMLHttpRequest` would add complexity. A smooth animation from 0% to ~90% during the request and then 100% on success gives adequate feedback without new dependencies.
- **Alternatives considered**: Using `axios` or `XMLHttpRequest` for real upload progress events. Rejected to avoid adding a new HTTP library solely for this feature.

### State Management
- **Decision**: Keep document state inside `CharityOnboardingFlow.tsx` as local component state (`uploadedFiles`) and derive required-slot completion from that state.
- **Rationale**: The existing documents UI already maintains `uploadedFiles` state. No global store is evident, and the documents step is a self-contained part of the onboarding flow. A dedicated `useOrganizationDocuments` hook is listed as optional in the request and may be introduced if component state becomes unwieldy, but the first implementation will use local state plus small helper functions.
- **Alternatives considered**: Introducing a global context or Zustand/Jotai store. Rejected because the scope is limited to one step and the current local-state pattern is sufficient.

### Document Type Mapping
- **Decision**: Implement a deterministic mapping table from frontend slot IDs to backend `documentType` values:
  - `license` → `registration`
  - `bank` → `financial`
  - `address` → `other`
  - `profile` → `other`
  - `projects` → `other`
  - `financial` → `financial`
  - `annual` → `other`
  - `brand` → `other`
- **Rationale**: Matches the contract provided in the feature description and allows existing documents to be placed in the correct slot on reload.
- **Alternatives considered**: Sending the frontend slot ID directly and letting the backend map it. Rejected because the backend contract explicitly expects `documentType` enum values.

### Slot Replacement Semantics
- **Decision**: When a user uploads a new file to a slot that already has a document, the UI immediately replaces the existing entry with the new upload entry and, on success, deletes the old backend record before or after the new upload completes.
- **Rationale**: The specification clarifies that each slot displays exactly one document. To avoid orphaned backend records, the old document should be removed. Because the backend does not support an atomic replace, the implementation will delete the old document after the new one succeeds (safer) or before the upload (simpler UX but riskier if upload fails).
- **Alternatives considered**: Leaving old documents on the backend and only showing the latest in the UI. Rejected because it pollutes the document store and complicates reload logic.

### Navigation Guard During Upload
- **Decision**: Track in-progress uploads in a ref or state flag and disable the Continue/Back buttons while any upload is in progress.
- **Rationale**: The specification requires blocking navigation during uploads. Disabling the navigation buttons is the simplest reliable mechanism in this SPA; a full beforeunload handler can be added for browser-level protection.
- **Alternatives considered**: Using `react-router`'s navigation blocker. Rejected because the component uses internal `currentView` state rather than route transitions, so button disabling is sufficient.

### Completion Logic
- **Decision**: A required slot counts as completed when its latest document has a backend status of `UPLOADED` or `PENDING_REVIEW`. Optional slots never affect completion.
- **Rationale**: Matches the clarification that `PENDING_REVIEW` should not block progression and that only the four required slots matter.

## Open Questions / Risks

- The project has no existing multipart upload abstraction; the first implementation will need to be careful not to break the JSON-only assumption in `apiClient`.
- There is no test harness in the project; validation will be manual through the UI and TypeScript compilation.
- The exact backend status enum strings (`UPLOADED`, `PENDING_REVIEW`) must match what the API returns; the implementation should treat unknown statuses as not-completed.
- The `description` field on the upload endpoint is not specified in the user request beyond being part of the contract; the frontend can send an empty string or a localized description per slot.
