# Implementation Plan: Send Message API Integration

**Branch**: `067-collaboration-attachments` | **Date**: 2026-06-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/068-send-message-api/spec.md`

## Summary

Wire the Project Collaboration chat view "Send" button to the existing `POST /api/v1/projects/{projectId}/conversations/{conversationId}/messages` backend endpoint. Provide optimistic send status, error handling with retry, input retention on failure, message ordering guarantees for rapid sends, and reply-to-message support. The implementation is frontend-only and builds on the existing `CollaborationService`, `useConversationMessages`, and `ProjectCollaborationModule.ChatView`.

## Technical Context

**Language/Version**: TypeScript 6.x with React 18.x (Vite-based SPA)
**Primary Dependencies**: React Router v7, Radix UI primitives, Tailwind CSS v4, Lucide icons, Sonner toasts, `fetch`-based `apiClient`
**Storage**: Browser localStorage for JWT; backend persistence for messages
**Testing**: No automated test runner configured; manual UI/DevTools verification
**Target Platform**: Desktop and responsive web browsers
**Project Type**: Frontend web application (single-page React app)
**Performance Goals**: Sent status visible within 1 second of pressing Send under normal network conditions; non-blocking send UI
**Constraints**: Must reuse existing collaboration service and hook; must preserve submission order for rapid successive messages; must keep failed message text for the current app session
**Scale/Scope**: Single project chat view; text messages and replies only; attachments/voice/file out of scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project's `constitution.md` is an empty template with placeholder principles, so no active gates apply. No violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/068-send-message-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── send-message-api.md
├── spec.md              # Input specification
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts                    # Bearer token, retry, error handling
│   ├── services/
│   │   └── collaboration-service.ts # sendMessage(), types
│   └── hooks/
│       └── useConversationMessages.ts # optimistic send, retry, status
└── app/
    ├── components/
    │   └── ProjectCollaborationModule.tsx # ChatView UI, input, MessageBubble
    └── lib/
        └── error-messages.ts        # Arabic error messages
```

**Structure Decision**: Single-project frontend SPA. The feature touches the existing service layer, data hook, and the `ChatView` sub-component inside `ProjectCollaborationModule.tsx`. No new top-level directories are needed.

## Complexity Tracking

No constitution violations or unjustified complexity at this stage.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0 Research Summary

See [research.md](research.md). Key decisions:

1. Reuse `collaborationService.sendMessage` and `useConversationMessages`.
2. Preserve submission order using monotonic client-side `createdAt` timestamps.
3. Keep input field state in `ChatView`; session-level retention is handled by component state while mounted.
4. Use existing `sonner` toasts + `getCollaborationErrorMessage` for errors.
5. Use existing status icons in `MessageBubble`.
6. Reply support is required in this ticket; file/voice/image remain out of scope.

## Phase 1 Design Summary

See [data-model.md](data-model.md), [contracts/send-message-api.md](contracts/send-message-api.md), and [quickstart.md](quickstart.md). The data model, API contract, and quickstart manual verification steps are documented. The existing `CreateMessageDto` / `Message` types already match the backend contract.

## Next Steps

Run `/speckit.tasks` to generate the implementation task list from this plan.
