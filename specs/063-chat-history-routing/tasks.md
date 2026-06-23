# Tasks: Chat History Routing

**Input**: Design documents from `/specs/063-chat-history-routing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification, so no test tasks are included. Manual verification via `quickstart.md` is expected.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure the feature branch and base route are in a known good state before adding the chat-specific route.

- [X] T001 Verify current branch is `065-chat-history-routing` and the working tree is clean
- [X] T002 Confirm `src/app/routes.tsx` has the existing `/dashboard/ai-analysis/chat` route without conflicts
- [X] T003 [P] Confirm `src/app/components/ai-analysis/AIAnalysisChatPage.tsx` builds without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the parameterized route and route-level data source so all user stories can build on it.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Add `/dashboard/ai-analysis/chat/:chatId` route to `src/app/routes.tsx` rendering `AIAnalysisChatPage`
- [X] T005 Add fallback `Navigate` for unknown sub-paths under `/dashboard/ai-analysis/chat/*` to the base chat route
- [X] T006 Verify the route resolves `chatId` correctly when using `react-router` `useParams`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Open a Saved Chat from History (Priority: P1) 🎯 MVP

**Goal**: Clicking a history item navigates to `/dashboard/ai-analysis/chat/:chatId`, loads the chat, and highlights the item as active.

**Independent Test**: On `/dashboard/ai-analysis/chat`, click a history item and verify URL change, workspace content, and active highlight.

### Implementation for User Story 1

- [X] T007 [P] [US1] Read `chatId` from `useParams` in `src/app/components/ai-analysis/AIAnalysisChatPage.tsx`
- [X] T008 [P] [US1] Add effect in `AIAnalysisChatPage.tsx` to load the chat session when `chatId` changes using `history.loadSession`
- [X] T009 [US1] Populate the workspace with loaded messages via `streaming.loadMessages` in `AIAnalysisChatPage.tsx`
- [X] T010 [US1] Synchronize `selectedAnalysis` state with URL `chatId` in `AIAnalysisChatPage.tsx`
- [X] T011 [US1] Make history item click in `AIAnalysisChatPage.tsx` navigate to `/dashboard/ai-analysis/chat/${item.id}` instead of using location state
- [X] T012 [US1] Ensure the active history item styling uses the URL-derived `chatId` and not stale local state

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Refresh and Direct Link Resilience (Priority: P2)

**Goal**: Direct links and page refresh restore the requested chat and highlight the correct history item.

**Independent Test**: Paste `/dashboard/ai-analysis/chat/:chatId` in a fresh tab; the chat loads and the item is active after the history list finishes loading.

### Implementation for User Story 2

- [ ] T013 [P] [US2] Ensure `history.fetchHistory` is called on mount of `AIAnalysisChatPage.tsx` even when `chatId` is present
- [ ] T014 [US2] Load the chat session after `history.entries` contains the matching entry for the URL `chatId`
- [ ] T015 [US2] Prevent the `continueAnalysisId`/`rerunAnalysisId` location-state flow from conflicting with URL-based chat loading in `AIAnalysisChatPage.tsx`
- [ ] T016 [US2] Verify active highlight is set once the matching history entry is loaded

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Start a New Analysis Without Breaking History (Priority: P3)

**Goal**: Starting a new analysis from a chat-specific route navigates to the base route and keeps the history list usable.

**Independent Test**: From `/dashboard/ai-analysis/chat/:chatId`, start a new analysis and confirm navigation to `/dashboard/ai-analysis/chat` and no broken history interactions.

### Implementation for User Story 3

- [ ] T017 [US3] Update `startCardAnalysis` / `startLibraryAnalysis` in `AIAnalysisChatPage.tsx` to navigate to `/dashboard/ai-analysis/chat` before starting the analysis
- [ ] T018 [US3] Clear `selectedAnalysis` when navigating back to the base route so no history item appears active
- [ ] T019 [US3] Verify the "New Analysis" button on `AIAnalysisChatPage.tsx` respects the same base-route navigation behavior

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Edge Cases & Cross-Cutting Concerns

**Purpose**: Handle invalid chats, not-found states, and cleanup.

- [ ] T020 [P] Implement inline "chat not found" state in `AIAnalysisChatPage.tsx` when URL `chatId` does not match any history entry
- [ ] T021 [P] Add guard in `AIAnalysisChatPage.tsx` to avoid auto-loading a chat while a streaming session is already active
- [ ] T022 Verify existing standalone `src/app/components/ai-analysis/AIAnalysisHistoryPage.tsx` still navigates to base route for continue/rerun flows (no regression)
- [ ] T023 Verify `src/app/routes.tsx` base `/dashboard/ai-analysis/chat` route and new `/:chatId` route do not overlap incorrectly
- [ ] T024 Run the manual verification steps in `specs/063-chat-history-routing/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed in priority order or in parallel after foundation.
- **Edge Cases (Phase 6)**: Depends on all user stories being functionally complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) and ideally after US1 route handling is in place.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) and after US1/US2 routing logic is in place.

### Within Each User Story

- Read `chatId` and load session before updating the workspace.
- Update active highlight only after the session is loaded.
- Verify manually per `quickstart.md` before moving to the next story.

### Parallel Opportunities

- T007, T008, T010, T011 can run in parallel during US1 because they touch different concerns within `AIAnalysisChatPage.tsx`.
- T013 and T014 can run in parallel during US2.
- T020 and T021 can run in parallel during Phase 6.

---

## Parallel Example: User Story 1

```bash
# These US1 tasks can be worked on in parallel:
Task: "Read chatId from useParams in src/app/components/ai-analysis/AIAnalysisChatPage.tsx"
Task: "Add effect to load chat session when chatId changes in src/app/components/ai-analysis/AIAnalysisChatPage.tsx"
Task: "Synchronize selectedAnalysis state with URL chatId in src/app/components/ai-analysis/AIAnalysisChatPage.tsx"
Task: "Make history item click navigate to /dashboard/ai-analysis/chat/:chatId in src/app/components/ai-analysis/AIAnalysisChatPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently via `quickstart.md`.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently.
4. Add User Story 3 → Test independently.
5. Add Phase 6 edge cases → Full feature validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently; edge-case work follows.

---

## Notes

- [P] tasks = different files or different concerns, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and manually testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently using `quickstart.md`.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
