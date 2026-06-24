# Tasks: Collaboration Chat View Backend Integration

**Input**: Design documents from `specs/065-collaboration-chat-view/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/backend-api.md, quickstart.md

**Tests**: Not explicitly requested. Test tasks are omitted; the implementation can still be validated manually per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare any shared utilities or route parameters needed by the Chat view.

- [x] T001 [P] Verify `src/app/routes.tsx` collaboration route includes `:projectId` segment; if missing, update it
- [x] T002 [P] Verify existing `src/app/lib/error-messages.ts` Arabic helper covers message-related errors; extend if needed
- [x] T003 [P] Verify existing `src/app/lib/formatters.ts` helpers are sufficient for message timestamps

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Service and type extensions that MUST be complete before ANY user story can fetch or mutate messages.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] Add message TypeScript types and DTOs to `src/api/services/collaboration-service.ts` (Message, MessageType, MessageStatus, CreateMessageDto, UpdateMessageDto, MessagesResponse)
- [x] T005 [P] Add message API methods to `src/api/services/collaboration-service.ts`: `getConversationMessages`, `sendMessage`, `editMessage`, `deleteMessage`, `markMessageAsRead`
- [x] T006 [P] Add conversation list method to `src/api/services/collaboration-service.ts` if not already present from feature 064

**Checkpoint**: Foundation ready - service and message types exist; user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - View Live Conversation Sidebar (Priority: P1) 🎯 MVP

**Goal**: Project team members see the Chat view sidebar populated from the backend with real conversations.

**Independent Test**: Navigate to `/dashboard/collaboration/:projectId/chat`; the sidebar renders live conversations with title, status, last message preview, timestamp, and unread count. Empty and error states render correctly.

### Implementation for User Story 1

- [x] T007 [US1] Ensure `src/api/hooks/useProjectConversations.ts` (from feature 064) is available and returns conversations, loading, error, and refetch for the Chat view
- [x] T008 [US1] Refactor the Chat view sidebar in `src/app/components/ProjectCollaborationModule.tsx` to use `useProjectConversations`, removing the hardcoded `conversations` array
- [x] T009 [US1] Add loading skeleton, empty state, error state, and retry action for the conversation sidebar in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T010 [US1] Update sidebar links so selecting a conversation navigates to `/dashboard/collaboration/:projectId/chat?conv=:conversationId`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - View Live Messages in a Conversation (Priority: P1)

**Goal**: Project team members see messages for the selected conversation loaded from the backend with cursor-based pagination.

**Independent Test**: Select a conversation in the Chat view; the message panel renders live messages in chronological order and loads older messages on scroll. Empty and error states work.

### Implementation for User Story 2

- [x] T011 [P] [US2] Create `src/api/hooks/useConversationMessages.ts` with state for messages, cursor, hasMore, loading, error, and abort-cleanup logic
- [x] T012 [US2] Implement `loadMessages` in `src/api/hooks/useConversationMessages.ts` to append older messages on cursor pagination
- [x] T013 [US2] Refactor the message list in `src/app/components/ProjectCollaborationModule.tsx` to use `useConversationMessages`, removing the hardcoded `messages` array
- [x] T014 [US2] Add loading skeleton, empty state, error state, and retry action for the message list in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T015 [US2] Implement infinite scroll (or explicit "Load more" button) in `src/app/components/ProjectCollaborationModule.tsx` wired to `loadMessages`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Send a Message (Priority: P2)

**Goal**: Project team members can send text messages in the selected conversation.

**Independent Test**: Type a message in the input and send; the message posts to the backend, appears optimistically with `SENDING` status, updates to `SENT`, and clears the input.

### Implementation for User Story 3

- [x] T016 [US3] Add `sendMessage` method to `src/api/hooks/useConversationMessages.ts` using optimistic append with `SENDING` status
- [x] T017 [US3] Wire the message input and send button in `src/app/components/ProjectCollaborationModule.tsx` to `sendMessage`
- [x] T018 [US3] Update the optimistic message to `SENT` on success and show `FAILED` with retry on error in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T019 [US3] Disable or queue send while a message is already sending to prevent duplicate in-flight sends in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional.

---

## Phase 6: User Story 4 - Edit or Delete a Message (Priority: P2)

**Goal**: Project team members can edit or soft-delete messages they previously sent.

**Independent Test**: A user can edit or delete their own message; the change is reflected in the message list after backend confirmation. Edit/delete actions are not shown for messages from other users.

### Implementation for User Story 4

- [x] T020 [P] [US4] Add `editMessage` method to `src/api/hooks/useConversationMessages.ts` that updates the message locally after backend confirmation
- [x] T021 [P] [US4] Add `deleteMessage` method to `src/api/hooks/useConversationMessages.ts` that hides or marks the message as deleted locally after backend confirmation
- [x] T022 [US4] Add edit/delete UI actions to each own-message bubble in `src/app/components/ProjectCollaborationModule.tsx`; hide actions for others' messages
- [x] T023 [US4] Implement inline edit input or modal in `src/app/components/ProjectCollaborationModule.tsx` and wire it to `editMessage`
- [x] T024 [US4] Add delete confirmation and soft-delete rendering in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: User Stories 1-4 should now be independently functional.

---

## Phase 7: User Story 5 - Mark Messages as Read (Priority: P2)

**Goal**: Unread messages are automatically marked as read when a user views a conversation.

**Independent Test**: Open a conversation with unread messages; the read endpoint is called for visible unread messages and the sidebar unread badge is cleared.

### Implementation for User Story 5

- [x] T025 [P] [US5] Add `markMessageAsRead` method to `src/api/hooks/useConversationMessages.ts`
- [x] T026 [US5] Detect unread messages entering the viewport in `src/app/components/ProjectCollaborationModule.tsx` and call `markMessageAsRead`
- [x] T027 [US5] Ensure the sidebar unread count decreases after messages are marked as read in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T028 [US5] Avoid duplicate read requests for messages already marked as read in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: User Stories 1-5 should now be independently functional.

---

## Phase 8: User Story 6 - Real-Time Message Updates (Priority: P3)

**Goal**: New messages from other users appear automatically in the active conversation.

**Independent Test**: While a conversation is open, a real-time message event causes the new message to appear at the end of the list. The UI falls back to fetch if real-time is unavailable.

### Implementation for User Story 6

- [x] T029 [P] [US6] Identify or add the project's existing real-time transport (WebSocket/SSE/polling) and create a minimal `useConversationRealtime` hook in `src/api/hooks/useConversationRealtime.ts`
- [x] T030 [US6] Subscribe to `conversation:message` events in `src/app/components/ProjectCollaborationModule.tsx` when a conversation is active
- [x] T031 [US6] Append incoming real-time messages to the message list in `src/app/components/ProjectCollaborationModule.tsx` without duplicating existing messages
- [x] T032 [US6] Ensure the Chat view still works via standard fetch when real-time transport is unavailable

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, type consistency, and removal of dead mock data.

- [x] T033 [P] Remove remaining unused mock arrays (`messages`, `conversations`) and unused interfaces from `src/app/components/ProjectCollaborationModule.tsx`
- [x] T034 [P] Run `npx vite build` and fix any build errors introduced by the Chat view changes
- [x] T035 [P] Run quickstart.md validation steps in the dev environment
- [x] T036 [P] Update `AGENTS.md` if plan path needs refreshing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories should proceed in priority order (P1 → P2 → P2 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Shares sidebar context with US1 but is independently testable
- **User Story 3 (P2)**: Can start after US2 - Requires message list to exist
- **User Story 4 (P2)**: Can start after US2 - Requires message list to exist
- **User Story 5 (P2)**: Can start after US2 - Requires message list to exist
- **User Story 6 (P3)**: Can start after US2 - Requires message list to exist

### Within Each User Story

- Types before hook methods
- Hook methods before component integration
- Core implementation before polish

### Parallel Opportunities

- US3 (send), US4 (edit/delete), US5 (mark as read), and US6 (real-time) can largely proceed in parallel once US2 is complete because they operate on the same message list.
- T011 and T016/T020/T025/T029 can be developed in parallel if the base hook structure is agreed.

---

## Parallel Example: User Story 2

```bash
# Launch in parallel:
Task: "Create src/api/hooks/useConversationMessages.ts"
Task: "Add message types and service methods in src/api/services/collaboration-service.ts" (if not done in Phase 2)

# Then sequential UI wiring:
Task: "Refactor message list in src/app/components/ProjectCollaborationModule.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (conversation sidebar)
4. Complete Phase 4: User Story 2 (message list)
5. **STOP and VALIDATE**: Test the read-only Chat view independently
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 + US2 → Read-only Chat view works
3. US3 → Users can send messages
4. US4 → Users can edit/delete messages
5. US5 → Read status updates automatically
6. US6 → Real-time updates added
7. Polish → Remove mocks, build check, quickstart validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (sidebar)
   - Developer B: US2 (message list)
3. Once US2 is done:
   - Developer C: US3 (send)
   - Developer D: US4 (edit/delete)
   - Developer E: US5 (mark as read)
   - Developer F: US6 (real-time)
4. Stories integrate via shared `useConversationMessages` hook and service

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test tasks are included because tests were not explicitly requested
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
