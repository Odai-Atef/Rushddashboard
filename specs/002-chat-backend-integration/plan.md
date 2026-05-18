# Implementation Plan: Chat Backend Integration

**Branch**: `004-rushd-frontend-executive` | **Date**: 2026-05-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-chat-backend-integration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Connect the AI chat UI to existing backend APIs for session management, messaging, and conversation history. The frontend will implement chat pages, components, and hooks to fetch sessions, send messages, receive AI responses, and restore conversation history. All API calls go through the centralized service layer with Zod validation, TypeScript typing, and consistent error handling.

## Technical Context

**Language/Version**: TypeScript 5.x with React 18.3+
**Primary Dependencies**: React 18.3+, Vite 6.x, Tailwind CSS 4.x, React Router 7.x, React Hook Form, Zod, date-fns, shadcn/ui
**Storage**: Backend PostgreSQL via REST APIs (no local persistence)
**Testing**: Vitest, React Testing Library, Playwright
**Target Platform**: Web browsers (responsive: mobile, tablet, desktop)
**Project Type**: Web application (frontend SPA)
**Performance Goals**: Chat session list loads within 2 seconds (SC-001); message send-to-display <500ms; bundle size per route <250KB gzipped
**Constraints**: No offline support (assumption); no rich media attachments (v1); synchronous AI responses for v1; 300-line max per file, 50-line max per function
**Scale/Scope**: Authenticated users; chat sessions and messages; Arabic UI locale

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate I: Component-First Architecture
**Status**: PASS
- Chat feature will be built as reusable components: `ChatPage`, `ChatSessionList`, `ChatMessageList`, `ChatMessageBubble`, `ChatInput`
- Shared logic extracted into hooks: `useChatSessions`, `useChatMessages`, `useSendMessage`
- Max 300 lines per file enforced; `ChatPage` may compose sub-components if it approaches limit

### Gate II: Clean Code & Quality Standards
**Status**: PASS
- All new code will pass ESLint/Prettier
- Naming: PascalCase components, camelCase hooks/functions
- Magic numbers extracted (e.g., `MAX_MESSAGE_LENGTH = 10000`)
- No dead code or console.log in production

### Gate III: API Integration & Resilience
**Status**: PASS
- API calls centralized through `src/app/services/chat.ts` (already exists)
- Error handling with toast notifications and fallback UI states
- Loading states for sessions, messages, and sending
- Zod schemas validate all API responses (`ChatSessionSchema`, `ChatMessageSchema`)

### Gate IV: Performance & Responsive Design
**Status**: PASS
- Responsive chat layout using Tailwind CSS breakpoints
- Route-level lazy loading for chat page
- `React.memo` on message bubbles; `useMemo` for sorted message lists
- Bundle size monitored; chat route chunk must stay <250KB gzipped

### Gate V: Containerization & Environment Consistency
**Status**: PASS
- No Docker changes required for frontend feature
- Uses existing `VITE_API_BASE_URL` environment variable
- Works identically in dev/staging/prod via Docker already configured

## Project Structure

### Documentation (this feature)

```text
specs/002-chat-backend-integration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── chat-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatPage.tsx           # Main chat route component
│   │   │   ├── ChatSessionList.tsx    # Sidebar list of sessions
│   │   │   ├── ChatMessageList.tsx    # Scrollable message thread
│   │   │   ├── ChatMessageBubble.tsx  # Individual message UI
│   │   │   ├── ChatInput.tsx          # Message input + send button
│   │   │   └── ChatEmptyState.tsx     # Empty state when no session
│   │   └── [existing components...]
│   ├── hooks/
│   │   ├── useChatContext.tsx         # Chat state context provider
│   │   ├── useChatSessions.ts         # Fetch/create/delete sessions
│   │   └── useChatMessages.ts         # Fetch/send messages (NEW)
│   ├── services/
│   │   ├── api.ts                     # Base apiFetch wrapper
│   │   └── chat.ts                    # Chat API service layer
│   ├── types/
│   │   └── chat.ts                    # Chat types + Zod schemas
│   ├── utils/
│   │   └── chat.ts                    # Date formatting, title helpers
│   └── routes.tsx                     # Add /dashboard/chat route
```

**Structure Decision**: Single frontend SPA project. Chat feature integrated into existing dashboard under `/dashboard/chat` route. All chat-specific code isolated in `components/chat/` and `hooks/` directories.

## Complexity Tracking

> **No constitution violations require justification. All gates pass.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
