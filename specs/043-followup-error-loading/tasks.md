# Tasks: Follow-up Chat Error Handling

**Input**: Design documents from `/specs/043-followup-error-loading/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this bug-fix feature. No test tasks are included unless explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Not applicable — this is a scoped bug fix on existing code. No new project structure or dependencies are required.

**Status**: ⏭️ Skipped

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Not applicable — the hook and component already exist. No foundational infrastructure changes are needed.

**Status**: ⏭️ Skipped

---

## Phase 3: User Story 1 - Prevent Double Submission (Priority: P1) 🎯 MVP

**Goal**: Ensure `sendFollowUp()` sets `status = 'streaming'` so `isLoading` becomes `true`, disabling the submit button and input field during the request.

**Independent Test**: Send a follow-up question and verify the input field and submit button become disabled until the response arrives (success or error).

### Implementation for User Story 1

- [ ] T001 [US1] Set `status = 'streaming'` at the start of `sendFollowUp()` in `src/app/hooks/useAnalysisStreaming.ts`
- [ ] T002 [US1] Reset `status = 'complete'` after a successful follow-up response in `src/app/hooks/useAnalysisStreaming.ts`
- [ ] T003 [US1] Reset `status = 'error'` after a failed follow-up response in `src/app/hooks/useAnalysisStreaming.ts`
- [ ] T004 [P] [US1] Disable chat input and submit button while `streaming.isLoading` is `true` in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional. Clicking "إرسال" during a follow-up request disables the button and shows a loading state.

---

## Phase 4: User Story 2 - Visible Error State for Failed Follow-ups (Priority: P1)

**Goal**: When `askFollowUp()` throws, show a distinct visual error banner above the chat input instead of only rendering error text inside the assistant bubble.

**Independent Test**: Trigger a 404 or 500 follow-up response and verify a red-bordered error banner appears above the input area with Arabic-localized text.

### Implementation for User Story 2

- [ ] T005 [US1] On `askFollowUp()` throw, update the last assistant placeholder message with Arabic-localized error text and set `isStreaming: false` in `src/app/hooks/useAnalysisStreaming.ts`
- [ ] T006 [P] [US2] Render a distinct visual error banner above the chat input when `hasError` is true in `src/app/components/AIAnalysisPage.tsx`
- [ ] T007 [P] [US2] Ensure the error banner uses existing Arabic-localized error strings and Tailwind red color tokens in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: At this point, User Story 2 should be fully functional. A 404/500 error shows a visible error banner above the chat input, not just text inside the message bubble.

---

## Phase 5: User Story 3 - Retry Failed Follow-up (Priority: P2)

**Goal**: Add a retry button to the error banner that re-sends the same follow-up question without requiring the user to retype it.

**Independent Test**: Click the retry button on the error banner and verify the same question text is re-sent.

### Implementation for User Story 3

- [ ] T008 [US3] Add `pendingRetryQuestion` component state to track the last failed follow-up question in `src/app/components/AIAnalysisPage.tsx`
- [ ] T009 [US3] Add retry button to the error banner that calls `streaming.sendFollowUp(pendingRetryQuestion)` and clears the question state in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: At this point, User Story 3 should be fully functional. The error banner includes a retry button that re-sends the same question.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify no regressions and ensure completeness.

- [ ] T010 [P] Verify `startAnalysis()` SSE streaming flow remains unchanged by code inspection in `src/app/hooks/useAnalysisStreaming.ts`
- [ ] T011 Run quickstart validation steps from `specs/043-followup-error-loading/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — existing codebase.
- **Foundational (Phase 2)**: Skipped — existing codebase.
- **User Stories (Phase 3–5)**: All user stories can be implemented sequentially or in parallel because they touch different regions of the same two files:
  - **US1** and **US2** both modify `sendFollowUp()` in `useAnalysisStreaming.ts` and should be done together to avoid merge conflicts.
  - **US3** only touches `AIAnalysisPage.tsx` and can be done in parallel with US1/US2 if desired.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories.
- **User Story 2 (P1)**: Depends on US1 being complete (shares `sendFollowUp()` error path).
- **User Story 3 (P2)**: Can start after US1/US2 hook changes are stable. No hard dependency, but retry requires the error state from US2.

### Within Each User Story

- T001 → T002/T003 (sequential: same function, status transitions)
- T001/T002/T003 → T004 (T004 is parallel because it's in a different file)
- T005 depends on T001/T003 (error state must be set first)
- T006/T007 are parallel with T005 (different file)
- T008 → T009 (sequential: same component, state then UI)

### Parallel Opportunities

- T004 (`AIAnalysisPage.tsx` input disable) can be done in parallel with T001–T003 (`useAnalysisStreaming.ts` status changes).
- T006/T007 (error banner UI) can be done in parallel with T005 (hook error handling).
- T010 (regression check) and T011 (quickstart) can be done in parallel after all implementation is complete.

---

## Parallel Example: User Story 1 + User Story 2

```bash
# Developer A works on the hook:
Task: "Set status = 'streaming' at start of sendFollowUp() in src/app/hooks/useAnalysisStreaming.ts"
Task: "Reset status to 'complete' after success in src/app/hooks/useAnalysisStreaming.ts"
Task: "Reset status to 'error' after failure in src/app/hooks/useAnalysisStreaming.ts"
Task: "On throw, update assistant message with error text in src/app/hooks/useAnalysisStreaming.ts"

# Developer B works on the component (parallel):
Task: "Disable chat input while isLoading in src/app/components/AIAnalysisPage.tsx"
Task: "Render error banner above chat input in src/app/components/AIAnalysisPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete T001–T003: Add status transitions to `sendFollowUp()`.
2. Complete T005: Update error handler to populate assistant message.
3. Complete T004: Disable input/button while loading.
4. Complete T006/T007: Add error banner above input.
5. **STOP and VALIDATE**: Test loading guard and error banner independently.
6. Deploy/demo if ready.

### Incremental Delivery

1. US1 + US2 → Test independently → Deploy/Demo (MVP!)
2. US3 → Add retry button → Test independently → Deploy/Demo
3. Polish → Regression checks → Deploy/Demo

### Parallel Team Strategy

With two developers:

1. Developer A: T001–T005 (`useAnalysisStreaming.ts`)
2. Developer B: T004, T006–T007 (`AIAnalysisPage.tsx`)
3. Both integrate; then Developer A or B: T008–T009 (retry)
4. Final: T010–T011 (polish and validation)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
