# Implementation Plan: Collaboration Attachments View

**Branch**: `067-collaboration-attachments` | **Date**: 2026-06-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/067-collaboration-attachments/spec.md`

## Summary

Replace hardcoded mock attachment data in the Project Collaboration Module's Attachments view with live backend data, including the attachments list with type filtering and pagination, multipart file upload with progress feedback, file download, and delete with confirmation. The plan follows the existing React + TypeScript + Vite + Tailwind stack and extends the service/hook pattern established in features 064, 065, and 066.

## Technical Context

**Language/Version**: TypeScript 6.x, React 18.3, JSX/TSX
**Primary Dependencies**: React Router 7, Tailwind CSS 4, Radix UI primitives, date-fns, lucide-react, sonner
**Storage**: N/A (backend persisted; client uses React state)
**Testing**: Vitest or Jest + React Testing Library (project does not currently expose a test runner)
**Target Platform**: Modern evergreen browsers, desktop-first web app
**Project Type**: Single-page web application (frontend only)
**Performance Goals**: Attachments list renders within 3 seconds; upload progress updates within 500ms; status/delete mutations surface UI feedback within 2 seconds
**Constraints**: Must reuse existing `apiClient`, auth interceptors, `ApiResponse` envelope, and Arabic error messaging; multipart uploads require an upload method compatible with the existing client
**Scale/Scope**: Single project context; up to hundreds of attachments per project with backend pagination; file sizes expected to be in the low-to-mid MB range

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution file is still a template and contains only placeholder principles. No concrete gates are defined. We treat this as "no active gates" and proceed, aligning with existing project conventions:

- Service classes + custom React hooks for server state (`apiClient`, `collaborationService`, `useProjectAttachments`)
- Arabic user-facing error messages mapped by HTTP status (`getCollaborationErrorMessage`)
- Abort signal cleanup to avoid race conditions
- TypeScript types co-located near services
- Tailwind + Radix-based UI components

## Project Structure

### Documentation (this feature)

```text
specs/067-collaboration-attachments/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (not created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts                 # Existing base HTTP client (extended for upload)
│   ├── types.ts                  # Existing ApiResponse (reused)
│   ├── services/
│   │   ├── collaboration-service.ts # EXISTING (extend with upload/download/delete)
│   │   └── project-service.ts    # Existing project service (reused)
│   └── hooks/
│       ├── useProjectAttachments.ts # EXISTING from feature 064 (refactor/reuse)
│       └── useAttachmentMutations.ts # NEW: upload/download/delete helpers
├── app/
│   ├── components/
│   │   ├── collaboration/        # EXISTING shared panel components (reused)
│   │   └── ProjectCollaborationModule.tsx # EXISTING: refactor AttachmentsView
│   ├── lib/
│   │   ├── formatters.ts         # EXISTING formatting helpers (extend for file size)
│   │   └── error-messages.ts     # EXISTING collaboration error helper
└── types/                         # Shared domain types if needed
```

**Structure Decision**: Keep the single existing frontend project layout. Extend `collaboration-service.ts` with upload, download, and delete endpoints, add a small `useAttachmentMutations` hook, and refactor the `AttachmentsView` inside `ProjectCollaborationModule.tsx` to consume the hooks, remove local mock `attachments` array, and implement filters, pagination, upload area with progress, download actions, and delete confirmation.

## Complexity Tracking

No constitution violations. No additional complexity or projects introduced.
