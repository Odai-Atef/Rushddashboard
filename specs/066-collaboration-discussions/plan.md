# Implementation Plan: Collaboration Discussions View

**Branch**: `066-collaboration-discussions` | **Date**: 2026-06-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/066-collaboration-discussions/spec.md`

## Summary

Replace hardcoded mock discussion data in the Project Collaboration Module's Discussions view with live backend data, including the discussions list, single discussion with replies, create discussion, add reply, change status, mark accepted solution, and delete discussion. The plan follows the existing React + TypeScript + Vite + Tailwind stack and extends the service/hook pattern established in features 064 and 065.

## Technical Context

**Language/Version**: TypeScript 6.x, React 18.3, JSX/TSX
**Primary Dependencies**: React Router 7, Tailwind CSS 4, Radix UI primitives, date-fns, lucide-react, sonner, react-markdown, @uiw/react-md-editor
**Storage**: N/A (backend persisted; client uses React state)
**Testing**: Vitest or Jest + React Testing Library (project does not currently expose a test runner)
**Target Platform**: Modern evergreen browsers, desktop-first web app
**Project Type**: Single-page web application (frontend only)
**Performance Goals**: Discussions list and first discussion detail render within 3 seconds; status/reply mutations surface a retry control within 2 seconds
**Constraints**: Must reuse existing `apiClient`, auth interceptors, `ApiResponse` envelope, and Arabic error messaging; WYSIWYG/rich-text editor must be the one already used in the project
**Scale/Scope**: Single project context; up to hundreds of discussions per project and tens of replies per discussion with backend pagination

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution file is still a template and contains only placeholder principles. No concrete gates are defined. We treat this as "no active gates" and proceed, aligning with existing project conventions:

- Service classes + custom React hooks for server state (`apiClient`, `projectService`, `collaborationService`, `useProjectDiscussions`)
- Arabic user-facing error messages mapped by HTTP status (`getCollaborationErrorMessage`)
- Abort signal cleanup to avoid race conditions
- TypeScript types co-located near services
- Tailwind + Radix-based UI components

## Project Structure

### Documentation (this feature)

```text
specs/066-collaboration-discussions/
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
│   ├── client.ts                 # Existing base HTTP client (reused)
│   ├── types.ts                  # Existing ApiResponse (reused)
│   ├── services/
│   │   ├── collaboration-service.ts # EXISTING (extend with discussion/reply CRUD)
│   │   └── project-service.ts    # Existing project service (reused)
│   └── hooks/
│       ├── useProjectDiscussions.ts # EXISTING from feature 064 (refactor/reuse)
│       └── useDiscussionDetail.ts # NEW: single discussion + replies + mutations
├── app/
│   ├── components/
│   │   ├── collaboration/        # EXISTING shared panel components (reused)
│   │   └── ProjectCollaborationModule.tsx # EXISTING: refactor DiscussionsView
│   ├── lib/
│   │   ├── formatters.ts         # EXISTING formatting helpers
│   │   └── error-messages.ts     # EXISTING collaboration error helper
│   └── pages/
│       └── project-management/   # Reused project context type
└── types/                         # Shared domain types if needed
```

**Structure Decision**: Keep the single existing frontend project layout. Extend `collaboration-service.ts` with discussion/reply endpoints and add one new hook (`useDiscussionDetail`) next to the existing hooks. Refactor the `DiscussionsView` inside `ProjectCollaborationModule.tsx` to consume the hooks, remove local mock `discussions` array, and implement filter UI, create form, reply composer, status change, accepted solution, and delete actions.

## Complexity Tracking

No constitution violations. No additional complexity or projects introduced.
