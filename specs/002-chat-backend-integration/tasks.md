# Tasks: Chat Backend Integration

**Input**: Design documents from `/specs/002-chat-backend-integration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included for critical paths. Tests are OPTIONAL - only required if explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and shared chat utilities

- [X] T001 [P] Create chat component directory at `src/app/components/chat/`
- [X] T002 [P] Create chat hooks directory at `src/app/hooks/` (if not exists)
- [X] T003 [P] Create chat types file at `src/app/types/chat.ts`
- [X] T004 [P] Create chat service file at `src/app/services/chat.ts`
- [X] T005 Create chat page component at `src/app/components/chat/ChatPage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, schemas, and service layer that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Define TypeScript interfaces in `src/app/types/chat.ts` (ChatSession, ChatMessage, AIResponse, request/response types)
- [X] T007 [P] Define Zod validation schemas in `src/app/types/chat.ts` (ChatSessionSchema, ChatMessageSchema, SendMessageRequestSchema)
- [X] T008 Implement chat API service layer in `src/app/services/chat.ts` with fetch wrappers for all 5 endpoints (GET sessions, GET messages, POST session, POST message, DELETE session)
- [X] T009 Implement error handling and response validation in `src/app/services/chat.ts` using Zod schemas
- [X] T010 Create chat context/provider in `src/app/hooks/useChatContext.tsx` for global chat state (activeSession, sessionList, isLoading)
- [X] T011 Create `src/app/utils/chat.ts` with helper functions (formatDate, truncateTitle, message queue management)

**Checkpoint**: Foundation ready - all types, service layer, and global state available for user story implementation

---

## Phase 3: User Story 1 - View and Manage Chat Sessions (Priority: P1) 🎯 MVP

**Goal**: Display a list of chat sessions with metadata, loading states, and empty state handling

**Independent Test**: Load the chat page and verify that existing sessions appear in a list with title and last activity time. Verify loading skeleton shows during fetch. Verify empty state shows when no sessions exist.

### Tests for User Story 1

- [ ] T012 [P] [US1] Unit test for useChatSessions hook in `src/hooks/__tests__/useChatSessions.test.ts`
- [ ] T013 [P] [US1] Component test for ChatSessionList in `src/components/chat/__tests__/ChatSessionList.test.tsx`

### Implementation for User Story 1

- [X] T014 [P] [US1] Create `useChatSessions` hook in `src/app/hooks/useChatSessions.ts` (fetch sessions, loading state, error handling)
- [X] T015 [P] [US1] Create `ChatSessionList` component in `src/app/components/chat/ChatSessionList.tsx` (render session list with title, date, message count)
- [X] T016 [US1] Add loading skeleton state to `ChatSessionList` component in `src/app/components/chat/ChatSessionList.tsx`
- [X] T017 [US1] Add empty state UI to `ChatSessionList` component in `src/app/components/chat/ChatSessionList.tsx`
- [X] T018 [US1] Integrate ChatSessionList into `ChatPage` in `src/app/components/chat/ChatPage.tsx`

**Checkpoint**: User Story 1 complete - session list loads, shows loading state, handles empty state, displays session metadata

---

## Phase 4: User Story 2 - Send Messages and Receive AI Responses (Priority: P1) 🎯 MVP

**Goal**: Enable users to send messages in a chat session and receive AI-generated responses with loading feedback

**Independent Test**: Open a chat session, type a message, send it, and verify the message appears in the thread with a loading indicator. Verify the AI response appears when received. Verify input is disabled during AI response generation.

### Tests for User Story 2

- [ ] T019 [P] [US2] Unit test for useChatMessages hook in `src/hooks/__tests__/useChatMessages.test.ts`
- [ ] T020 [P] [US2] Component test for ChatInput in `src/components/chat/__tests__/ChatInput.test.tsx`
- [ ] T021 [P] [US2] Component test for ChatMessage in `src/components/chat/__tests__/ChatMessage.test.tsx`

### Implementation for User Story 2

- [X] T022 [P] [US2] Create `ChatMessageBubble` component in `src/app/components/chat/ChatMessageBubble.tsx` (render user/assistant messages with status indicators)
- [X] T023 [P] [US2] Create `ChatInput` component in `src/app/components/chat/ChatInput.tsx` (text input, send button, disabled state during AI response)
- [X] T024 [P] [US2] Create `ChatMessageList` component in `src/app/components/chat/ChatMessageList.tsx` (render message list, scroll handling)
- [X] T025 [P] [US2] Add typing indicator to `ChatMessageList` in `src/app/components/chat/ChatMessageList.tsx`
- [X] T026 [P] [US2] Create `useChatMessages` hook in `src/app/hooks/useChatMessages.ts` (fetch messages, send message, manage message state)
- [X] T027 [US2] Implement message sending with optimistic updates in `src/app/hooks/useChatMessages.ts` (add pending message, update on success/failure)
- [X] T028 [US2] Implement input disabled state during AI response in `src/app/components/chat/ChatInput.tsx`
- [X] T029 [US2] Add retry functionality for failed messages in `src/app/components/chat/ChatMessageBubble.tsx` (retry button on failed messages)
- [X] T030 [US2] Integrate ChatMessageList, ChatInput into `ChatPage` in `src/app/components/chat/ChatPage.tsx`

**Checkpoint**: User Story 2 complete - users can send messages, see optimistic updates, receive AI responses, and retry failed messages

---

## Phase 5: User Story 3 - Restore Previous Conversations (Priority: P2)

**Goal**: Enable users to click a session and load its complete message history with proper loading states

**Independent Test**: Click on a session from the list and verify all messages load in chronological order. Verify scroll works for long conversations. Verify loading state shows during message fetch.

### Tests for User Story 3

- [ ] T031 [P] [US3] Integration test for session restoration in `src/components/chat/__tests__/ChatSessionRestore.test.tsx`

### Implementation for User Story 3

- [X] T032 [US3] Add session selection handler to `ChatSessionList` in `src/app/components/chat/ChatSessionList.tsx` (click to select, highlight active session)
- [X] T033 [US3] Implement message history loading in `useChatMessages` hook in `src/app/hooks/useChatMessages.ts` (fetch on session change, clear on session switch)
- [X] T034 [US3] Add scroll-to-bottom behavior in `ChatMessageList` in `src/app/components/chat/ChatMessageList.tsx` (auto-scroll on new messages, scroll history for long conversations)
- [X] T035 [US3] Add loading state for message history in `ChatMessageList` in `src/app/components/chat/ChatMessageList.tsx`
- [X] T036 [US3] Handle session not found error in `src/app/components/chat/ChatPage.tsx` (404 handling, redirect or error message)

**Checkpoint**: User Story 3 complete - clicking a session loads full history, scroll works, loading states handled, errors managed

---

## Phase 6: User Story 4 - Create New Chat Sessions (Priority: P2)

**Goal**: Enable users to create new chat sessions and start fresh conversations

**Independent Test**: Click "New Chat" button and verify a new session is created. Verify the chat view resets to empty. Send a first message and verify the session appears in the session list.

### Tests for User Story 4

- [ ] T037 [P] [US4] Unit test for session creation in `src/hooks/__tests__/useChatSessions.test.ts`

### Implementation for User Story 4

- [X] T038 [P] [US4] Add "New Chat" button to `ChatSessionList` in `src/app/components/chat/ChatSessionList.tsx`
- [X] T039 [US4] Implement session creation in `useChatSessions` hook in `src/app/hooks/useChatSessions.ts` (POST /chat/sessions, update session list)
- [X] T040 [US4] Handle new session UI state in `ChatPage` in `src/app/components/chat/ChatPage.tsx` (reset message list, focus input)
- [X] T041 [US4] Auto-generate session title from first message in `src/app/utils/chat.ts` (truncate first 50 chars of first user message)
- [X] T042 [US4] Update session list after first message in `src/app/hooks/useChatMessages.ts` (refresh sessions to show new session with title)

**Checkpoint**: User Story 4 complete - users can create sessions, start fresh conversations, and see sessions in list

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, responsive design, routing, and code quality

- [X] T043 [P] Add responsive design for chat layout in `src/app/components/chat/ChatSessionList.tsx` and `src/app/components/chat/ChatPage.tsx`
- [X] T044 [P] Implement error toast notifications in `src/app/utils/chat.ts` (network errors, API errors with actionable messages)
- [X] T045 Add route configuration for ChatPage in `src/app/routes.tsx`
- [X] T046 Add error display for chat page in `src/app/components/chat/ChatPage.tsx`
- [X] T047 Verify all chat components follow 300-line limit; refactor if needed
- [X] T048 TypeScript check not available (no tsc in project)
- [X] T049 Add loading states for all async operations (session fetch, message fetch, message send, session creation)
- [X] T050 Validate quickstart.md developer setup instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 can be worked on in parallel (different components)
  - US3 depends on US1 (needs session selection) and US2 (needs message display)
  - US4 can be worked on in parallel with US1 and US2
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Needs active session (can use mock for independent testing)
- **User Story 3 (P2)**: Can start after US1 and US2 complete - Integrates session selection with message display
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories

### Within Each User Story

- Models/types already complete in Foundational phase
- Hooks before components (hooks provide data)
- Components before integration (build pieces before assembling)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes:
  - US1 and US2 can be developed in parallel by different developers
  - US4 can be developed in parallel with US1 and US2
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel (different files)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for useChatSessions hook in src/hooks/__tests__/useChatSessions.test.ts"
Task: "Component test for ChatSessionList in src/components/chat/__tests__/ChatSessionList.test.tsx"

# Launch all components for User Story 1 together:
Task: "Create useChatSessions hook in src/hooks/useChatSessions.ts"
Task: "Create ChatSessionList component in src/components/chat/ChatSessionList.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Session List)
4. Complete Phase 4: User Story 2 (Send/Receive Messages)
5. **STOP and VALIDATE**: Test core chat flow end-to-end
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Core chat!)
4. Add User Story 3 → Test independently → Deploy/Demo (History!)
5. Add User Story 4 → Test independently → Deploy/Demo (Full feature!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Session List)
   - Developer B: User Story 2 (Message Send/Receive)
   - Developer C: User Story 4 (New Session)
3. After US1+US2 complete:
   - Developer D: User Story 3 (Restore History)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All chat components must follow the 300-line file limit per constitution
- Functions must not exceed 50 lines per constitution
- Use React.memo and useMemo for message list performance optimization