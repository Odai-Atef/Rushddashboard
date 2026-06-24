# Implementation Plan: Collaboration Chat View Backend Integration

**Branch**: `main` | **Date**: 2026-06-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/065-collaboration-chat-view/spec.md`

## Summary

Replace hardcoded mock data in the Project Collaboration Module's Chat view with live backend data for the conversation sidebar and message list, and add interactive send, edit, delete, and read-status actions. The plan follows the existing React + TypeScript + Vite + Tailwind stack and extends the service/hook pattern already established in the codebase.

## Technical Context

**Language/Version**: TypeScript 6.x, React 18.3, JSX/TSX
**Primary Dependencies**: React Router 7, Tailwind CSS 4, Radix UI primitives, date-fns, lucide-react, sonner
**Storage**: N/A (backend persisted; client uses React state)
**Testing**: Vitest or Jest + React Testing Library (project does not currently expose a test runner)
**Target Platform**: Modern evergreen browsers, desktop-first web app
**Project Type**: Single-page web application (frontend only)
**Performance Goals**: Sidebar and first message page render within 3 seconds; older message pages load within 2 seconds
**Constraints**: Must reuse existing `apiClient`, auth interceptors, and Arabic error messaging; keep Chat UI layout unchanged
**Scale/Scope**: Single project context; up to hundreds of conversations and thousands of messages per conversation with backend pagination

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution file is still a template and contains only placeholder principles. No concrete gates are defined. We treat this as "no active gates" and proceed, aligning with existing project conventions:

- Service classes + custom React hooks for server state (`apiClient`, `projectService`, `useProjects`, `useProjectDetails`)
- Arabic user-facing error messages mapped by HTTP status
- Abort signal cleanup to avoid race conditions
- TypeScript types co-located near services
- Tailwind + Radix-based UI components

## Project Structure

### Documentation (this feature)

```text
specs/065-collaboration-chat-view/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts                 # Existing base HTTP client (reused)
│   ├── types.ts                  # Existing ApiResponse (reused)
│   ├── services/
│   │   ├── project-service.ts    # Existing project service (reused/extended)
│   │   └── collaboration-service.ts # Existing collaboration service (reused/extended)
│   └── hooks/
│       ├── useProjectConversations.ts # EXISTING from feature 064
│       └── useConversationMessages.ts # NEW: messages + send/edit/delete/read
├── app/
│   ├── components/
│   │   ├── collaboration/        # EXISTING shared panel components
│   │   └── ProjectCollaborationModule.tsx # EXISTING: refactor ChatView
│   └── lib/
│       ├── formatters.ts         # EXISTING formatting helpers
│       └── error-messages.ts     # EXISTING collaboration error helper
└── types/                         # Shared domain types if needed
```

**Structure Decision**: Keep the single existing frontend project layout. Extend the existing `collaboration-service.ts` with message endpoints and add one new hook (`useConversationMessages`) next to the existing hooks. Refactor the `ChatView` inside `ProjectCollaborationModule.tsx` to consume the hooks and remove local mock arrays.

## Complexity Tracking

No constitution violations. No additional complexity or projects introduced.
