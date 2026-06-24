# Tasks: Send Message API Integration

**Input**: Design documents from `/specs/068-send-message-api/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated test tasks are included because the project has no configured test runner. Manual verification steps are provided instead.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing project structure and dependencies are ready for the feature.

- [x] T001 Verify `src/api/services/collaboration-service.ts` exports `sendMessage`, `CreateMessageDto`, and `Message` types
- [x] T002 [P] Verify `src/api/hooks/useConversationMessages.ts` exists and exposes `sendMessage`, `retrySend`, `isSending`, `messages`, and `error`
- [x] T003 [P] Verify `sonner` toast library and `getCollaborationErrorMessage` in `src/app/lib/error-messages.ts` are available for error display
- [x] T004 [P] Verify `src/app/components/ProjectCollaborationModule.tsx` contains the `ChatView` and `MessageBubble` sub-components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook and service adjustments that MUST be complete before user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Update `useConversationMessages.sendMessage` to support per-message optimistic state and non-blocking send in `src/api/hooks/useConversationMessages.ts`
- [x] T006 Update `useConversationMessages.retrySend` to resend the same failed message in place without creating a new optimistic message in `src/api/hooks/useConversationMessages.ts`
- [x] T007 Add monotonic client-side `createdAt` generation for rapid successive messages in `src/api/hooks/useConversationMessages.ts`
- [x] T008 Add input validation helper (trim, length 1–10000) reusable by `ChatView` in `src/api/hooks/useConversationMessages.ts` or `src/app/lib/validators.ts`

**Checkpoint**: Foundation ready - the hook can send, retry, and validate messages independently of UI changes.

---

## Phase 3: User Story 1 - Send a text message in a project chat (Priority: P1) 🎯 MVP

**Goal**: Users can type and submit a text message; it appears optimistically with a sending indicator, updates to sent on success, and persists after refresh.

**Independent Test**: Open a project chat, type "Hello", press Enter or click Send, confirm the message shows a spinner briefly then a checkmark, the input clears, and the message remains after page refresh.

### Implementation for User Story 1

- [x] T009 [US1] Connect `ChatView` send button and Enter key to `useConversationMessages.sendMessage` in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T010 [US1] Clear the message input only after `sendMessage` succeeds in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T011 [P] [US1] Disable only the send button while a message is sending; keep the input editable in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T012 [US1] Verify the message list renders `SENDING` → `SENT` status transitions using existing `MessageBubble` indicators in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T013 [US1] Manually verify `POST /api/v1/projects/{projectId}/conversations/{conversationId}/messages` is called with `content` and returns `201 Created`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Handle send failures gracefully (Priority: P1)

**Goal**: When sending fails, the user sees an Arabic error toast, the message text stays in the input, and retry resends only the selected failed message.

**Independent Test**: Block the network, send a message, confirm an Arabic toast appears, the input keeps the text, the message shows a failed state, and clicking retry resends the same message successfully once the network is restored.

### Implementation for User Story 2

- [x] T014 [US2] Preserve the message input text on send failure in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T015 [US2] Display a `sonner` toast with the mapped Arabic error message on send failure using `getCollaborationErrorMessage` in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T016 [US2] Ensure failed messages in the thread show a retry action in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T017 [US2] Wire the retry action to `useConversationMessages.retrySend` and verify only the selected failed message is resent in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T018 [US2] Manually verify session-level input retention: navigate within the app and back; the failed text is still available (page reload may clear it per spec)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - See message send progress and status (Priority: P2)

**Goal**: Users see clear visual feedback for each message status state: sending, sent, delivered, read, failed.

**Independent Test**: Send a message and confirm the correct icon appears for each status; open the chat as the recipient and confirm read receipts turn blue.

### Implementation for User Story 3

- [x] T019 [P] [US3] Confirm `MessageBubble` renders a spinner for `SENDING`, single check for `SENT`, grey double-check for `DELIVERED`, blue double-check for `READ`, and a retry button for `FAILED` in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T020 [US3] Ensure status transitions are animated smoothly using existing Tailwind/Motion utilities in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T021 [US3] Manually verify sent status appears within 1 second under normal network conditions

**Checkpoint**: User Stories 1–3 should all be independently functional.

---

## Phase 6: User Story 4 - Reply to a previous message (Priority: P1)

**Goal**: Users can reply to an existing message; the reply is visually associated with the referenced message and includes `replyToId` in the API request.

**Independent Test**: Select a previous message to reply to, type a reply, send it, confirm the reply visually references the original message, and inspect the network request contains `replyToId`. Verify a reply to a deleted/non-existent message shows an error.

### Implementation for User Story 4

- [x] T022 [US4] Add a reply action to each message bubble in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T023 [US4] Track the active `replyToId` and referenced message preview in `ChatView` state in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T024 [US4] Pass `replyToId` to `useConversationMessages.sendMessage` when sending a reply in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T025 [US4] Render a reply preview/association in the message thread (e.g., quoted original message) in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T026 [US4] Clear the reply context after successful send or on user cancel in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T027 [US4] Manually verify `422 INVALID_REPLY` response surfaces an Arabic error toast without sending the message

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T028 [P] Run `quickstart.md` manual verification steps end-to-end
- [x] T029 [P] Review and update Arabic error strings in `src/app/lib/error-messages.ts` if new send-specific wording is needed
- [x] T030 [P] Remove any stale `console.log` or debugging code added during implementation in `src/app/components/ProjectCollaborationModule.tsx` and `src/api/hooks/useConversationMessages.ts`
- [x] T031 Verify `AGENTS.md` still references `specs/068-send-message-api/plan.md`
- [x] T032 Run `npm run build` and fix any TypeScript or lint errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 US1 → P1 US2 → P2 US3 → P1 US4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Builds on US1 send behavior
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 status behavior
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - Builds on US1 send behavior and adds reply UI

### Within Each User Story

- Manual verification steps must be executed after implementation tasks
- UI tasks depend on foundational hook behavior
- Cross-cutting polish tasks must wait until all stories are verified

### Parallel Opportunities

- All Setup tasks (T001–T004) can run in parallel
- All Foundational tasks (T005–T008) can run in parallel once setup is confirmed
- Once Foundational phase completes, US1, US2, and US4 can start in parallel; US3 can proceed once US1 status behavior is present
- UI-only tasks within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Verify infrastructure in parallel:
Task: "T002 Verify src/api/hooks/useConversationMessages.ts exposes sendMessage..."
Task: "T003 Verify sonner toast library and getCollaborationErrorMessage..."
Task: "T004 Verify src/app/components/ProjectCollaborationModule.tsx contains ChatView..."

# Implement US1 UI in parallel:
Task: "T009 Connect ChatView send button and Enter key..."
Task: "T011 Disable only the send button while a message is sending..."
Task: "T012 Verify MessageBubble renders SENDING → SENT..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Manually test US1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 4 (reply) → Test independently
5. Add User Story 3 (status polish) → Test independently
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 + User Story 3
   - Developer B: User Story 2
   - Developer C: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual verification replaces automated tests because the project has no configured test runner
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
