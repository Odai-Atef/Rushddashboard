# Tasks: Fix Chat History Reload

**Input**: Design documents from `/specs/026-fix-chat-history-reload/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api-contracts.md, quickstart.md

**Tests**: Not requested — no test runner configured in this project. Manual verification per quickstart.md.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Preparation

**Purpose**: Review existing code, identify exact changes needed, ensure no breaking changes to streaming flow

- [x] T001 [P] Review `src/app/hooks/useAnalysisStreaming.ts` to confirm `StreamMessage` interface is unchanged and `loadMessages()` contract is stable
- [x] T002 [P] Review `src/api/services/analysis-service.ts` current `getRunDetail()` DTO to verify backend returns `description` not `content`
- [x] T003 Verify `src/app/components/AIAnalysisPage.tsx` `loadHistorySession()` logic and how `sessionId` is passed to `streaming.loadMessages()`

**Checkpoint**: Confirmed — `StreamMessage` interface will not change; `loadMessages()` accepts `(messages, sessionId)`. Ready for user story implementation.

---

## Phase 2: User Story 1 - View Historical Chat Session (Priority: P1) 🎯 MVP

**Goal**: Clicking a history sidebar item renders the complete chat transcript with correct content (no empty assistant messages).

**Independent Test**: Click any history item → verify user prompt + assistant response both visible with non-empty content.

### Implementation for User Story 1

- [x] T004 [P] [US1] Add `AnalysisMessage` interface to `src/api/services/analysis-service.ts`
- [x] T005 [P] [US1] Add `getSessionMessages(sessionId: string)` method to `src/api/services/analysis-service.ts` calling `GET /api/v1/analysis/sessions/{sessionId}/messages`
- [x] T006 [US1] Update `AnalysisSessionDetail` interface in `src/app/hooks/useAnalysisHistory.ts`: change `insights[].content` to `insights[].description`
- [x] T007 [US1] Refactor `sessionDetailToMessages()` in `src/app/hooks/useAnalysisHistory.ts` to accept `AnalysisMessage[]` (rename to `messagesToStreamMessages()`)
- [x] T008 [US1] Implement mapping logic in `messagesToStreamMessages()`: `role` → `role` (defensive lowercase), `content` → `content`, `isStreaming: false`, `createdAt` → `timestamp`, sort by `sequenceNo`
- [x] T009 [US1] Update `loadSession()` in `src/app/hooks/useAnalysisHistory.ts` to call `getSessionMessages()` first, with fallback to `getRunDetail()` using corrected `description` field
- [x] T010 [US1] Update `loadHistorySession()` in `src/app/components/AIAnalysisPage.tsx` to pass correct `sessionId` (not `runId`) to `streaming.loadMessages()`
- [x] T011 [US1] Ensure `streaming.loadMessages()` receives `StreamMessage[]` and sets `status: 'complete'` so chat input is enabled

**Checkpoint**: User Story 1 fully functional — history click shows full transcript with no empty messages.

---

## Phase 3: User Story 2 - View Follow-up Conversations (Priority: P2)

**Goal**: Historical follow-up questions and answers from the session are visible and correctly ordered.

**Independent Test**: Load a session with follow-up Q&A → verify follow-up questions and answers appear after the initial analysis in chronological order.

### Implementation for User Story 2

- [x] T012 [US2] Verify `messagesToStreamMessages()` in `src/app/hooks/useAnalysisHistory.ts` preserves all messages including follow-ups (no filtering logic that drops messages)
- [x] T013 [US2] Confirm `AnalysisMessage[]` from `getSessionMessages()` endpoint includes follow-up messages with correct `sequenceNo` ordering
- [x] T014 [US2] Add defensive handling in `messagesToStreamMessages()` for unknown roles: default to `'assistant'` instead of crashing UI

**Checkpoint**: User Story 2 functional — follow-up messages visible and correctly ordered.

---

## Phase 4: User Story 3 - Continue Historical Session (Priority: P3)

**Goal**: After loading a historical session, user can send a new follow-up message that associates with the original session.

**Independent Test**: Load historical session → type follow-up question → send → verify new message appears and response streams back.

### Implementation for User Story 3

- [x] T015 [US3] Verify `AIAnalysisPage.tsx` sets `streaming.sessionId` correctly when calling `streaming.loadMessages(messages, sessionId)` so follow-ups use the right session
- [x] T016 [US3] Ensure `useAnalysisStreaming.loadMessages()` preserves the provided `sessionId` and does not overwrite with `null` or a new value
- [x] T017 [US3] Verify chat input in `AIAnalysisPage.tsx` is enabled (`isChatEnabled`) after loading historical session (depends on `streaming.status === 'complete'`)
- [x] T018 [US3] Test end-to-end: send follow-up on loaded historical session → verify `analysisService.askFollowUp(question, sessionId)` is called with the correct preserved `sessionId`

**Checkpoint**: User Story 3 functional — follow-up on loaded history works with session continuity preserved.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, edge case handling, and codebase hygiene

- [x] T019 [P] Handle empty message arrays: if `getSessionMessages()` returns empty array, render appropriate empty state (no crash)
- [x] T020 [P] Handle unknown roles gracefully in `messagesToStreamMessages()` (already defensive; verify no gaps)
- [x] T021 Verify Arabic UI text in `src/app/components/AIAnalysisPage.tsx` is unchanged
- [x] T022 Verify `startAnalysis()` streaming flow in `useAnalysisStreaming.ts` is unaffected by changes
- [x] T023 Manual validation per `quickstart.md`: test primary path and fallback path
- [x] T024 Run `pnpm build` to verify no TypeScript compilation errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — review existing code
- **Phase 2 (US1 - P1)**: Depends on Phase 1 understanding; delivers MVP
- **Phase 3 (US2 - P2)**: Depends on Phase 2 (needs message mapping to work first); can run in parallel with Phase 2 if message array already includes follow-ups
- **Phase 4 (US3 - P3)**: Depends on Phase 2 (needs session continuity from loadMessages); can run in parallel with Phase 3
- **Phase 5 (Polish)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories. Core fix — must be first.
- **US2 (P2)**: Depends on US1 message mapping. If backend endpoint already returns all messages (including follow-ups), US2 may be satisfied by US1 with no additional work.
- **US3 (P3)**: Depends on US1 (sessionId continuity) and US2 (follow-ups visible). Session continuity is the critical dependency.

### Parallel Opportunities

- T001, T002, T003 (code review) can run in parallel
- T004, T005, T006 (interface + service additions) can run in parallel
- T007, T008 (refactoring + mapping logic) can run in parallel after T006
- T009, T010, T011 (wiring + page update) can run in parallel after T007, T008
- T012, T013, T014 (follow-up verification) can run in parallel with US1 if messages already include follow-ups
- T015, T016, T017 (session continuity) can run in parallel
- T019, T020, T021, T022 (polish) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch interface + service additions together:
Task: "Add AnalysisMessage interface to src/api/services/analysis-service.ts"
Task: "Add getSessionMessages() method to src/api/services/analysis-service.ts"
Task: "Update AnalysisSessionDetail insights field in src/app/hooks/useAnalysisHistory.ts"

# Then launch refactoring + mapping together:
Task: "Refactor sessionDetailToMessages() to accept AnalysisMessage[]"
Task: "Implement mapping logic in messagesToStreamMessages()"

# Then wire everything together:
Task: "Update loadSession() to call new endpoint with fallback"
Task: "Update loadHistorySession() in AIAnalysisPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — review existing code
2. Complete Phase 2: User Story 1 — core fix (DTO + new endpoint + fallback)
3. **STOP and VALIDATE**: Click history item → verify full transcript renders, no empty messages
4. Deploy if ready

### Incremental Delivery

1. Complete Setup + US1 → Foundation ready + core fix → Deploy (MVP!)
2. Add US2 → Verify follow-ups visible → Deploy
3. Add US3 → Verify follow-up sending works → Deploy
4. Each story adds value without breaking previous stories

### Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test runner in project — manual verification per quickstart.md
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
