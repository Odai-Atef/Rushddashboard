# Implementation Plan: Charity Document Upload Integration

**Branch**: `[049-charity-doc-upload]` | **Date**: 2026-06-16 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/035-charity-doc-upload/spec.md`

## Summary

Wire the existing charity onboarding documents step in `CharityOnboardingFlow.tsx` to the backend unified organization document upload API. Users must be able to upload required and optional documents, see previously uploaded documents reload into the correct slots, delete uploaded documents, and only proceed once all four required slots are completed (document status `UPLOADED` or `PENDING_REVIEW`).

## Technical Context

**Language/Version**: TypeScript 5.x compatible with Vite 6  
**Primary Dependencies**: React 18.3.1, React Router 7.13.0, Vite 6.3.5, Tailwind CSS 4.1.12, Radix UI primitives, sonner for toasts, lucide-react for icons  
**Storage**: N/A (backend persistence via REST API; files stored by the backend)  
**Testing**: No test harness currently present in the project; verification will be manual through the UI and TypeScript compilation  
**Target Platform**: Web (Vite + React SPA)  
**Project Type**: web-application (frontend SPA)  
**Performance Goals**: Existing documents should load within 2 seconds; uploads should show completion feedback within 5 seconds under normal network conditions  
**Constraints**: Must use browser-native `FormData`/`fetch` for multipart uploads because the existing `apiClient` is JSON-only; must preserve answers/state when API calls fail; must support one document per slot  
**Scale/Scope**: Single-organization onboarding flow; up to eight document slots (four required, four optional)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is a placeholder template with no active principles defined. No gates are enforced. The planned change is localized to a single service file and a single onboarding component, which keeps complexity minimal and aligned with the existing architecture.

## Project Structure

### Documentation (this feature)

```text
specs/035-charity-doc-upload/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts        # Fetch-based client with JWT interceptors (JSON-only)
│   ├── services/
│   │   └── onboarding-service.ts   # Add document API methods here
│   └── types.ts
└── app/
    ├── components/
    │   └── CharityOnboardingFlow.tsx # Integrate load, upload, delete, progress, completion
    ├── hooks/
    │   └── useOnboardingRegistration.ts # Provides organization context
    └── components/ui/
        ├── progress.tsx   # Progress bar primitive
        └── sonner.tsx     # Toast provider
```

**Structure Decision**: Use the existing onboarding service and the existing onboarding flow component. No new directories are needed for the first implementation. A `useOrganizationDocuments` hook may be extracted later if component state becomes unwieldy.

## Complexity Tracking

No constitution violations or unjustified complexity.

## Design Decisions

- **API layer**: Add `getOrganizationDocuments`, `uploadOrganizationDocument`, and `deleteOrganizationDocument` to `OnboardingService` in `src/api/services/onboarding-service.ts`.
- **Multipart upload**: Implement `uploadOrganizationDocument` using native `fetch` + `FormData` because `apiClient` only supports JSON bodies. Reuse the same JWT token retrieval and base URL used by `apiClient`.
- **State management**: Continue using local component state (`uploadedFiles`) inside `CharityOnboardingFlow.tsx`. Derive completion and pending-upload flags from this state.
- **Slot mapping**: Maintain a static mapping table from frontend slot IDs to backend `documentType` enum values.
- **Replacement semantics**: When a new file is uploaded to a slot that already has a document, replace the UI entry and delete the old backend record after the new upload succeeds.
- **Navigation guard**: Disable the Continue and Back buttons while any upload is in progress.
- **Completion logic**: Count a required slot as complete when its latest document has status `UPLOADED` or `PENDING_REVIEW`.
- **Error handling**: Show user-friendly messages via `sonner` and keep the user on the documents screen with preserved state.

## API Endpoints

### Load Documents

- `GET /api/v1/onboarding/documents?organizationId={id}`
- Returns an array of uploaded documents.

### Upload Document

- `POST /api/v1/onboarding/documents/upload`
- Content-Type: `multipart/form-data`
- Fields: `file`, `documentType`, `description`
- Response: `201 Created` with the created document.

### Delete Document

- `DELETE /api/v1/onboarding/documents/{id}`
- Response: `204 No Content`

## Next Steps

The `/speckit.plan` phase is complete. The next command is `/speckit.tasks` to generate the implementation task list.
