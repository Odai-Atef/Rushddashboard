# Tasks: Fix History Chat UI

**Input**: Design documents from `specs/028-fix-history-chat-ui/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Not requested in specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm project state and branch readiness

- [x] T001 Verify current branch is `045-fix-history-chat-ui` and working tree is clean
- [x] T002 [P] Review existing `src/app/hooks/useAnalysisStreaming.ts` to confirm `loadMessages()` already sets `status` to `'complete'` and `sessionId` correctly

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirm no breaking changes needed in shared hooks before UI fix

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Verify `useAnalysisStreaming.ts` `sendFollowUp()` uses the stored `sessionId` state (line 194-224) — already implemented per research
- [x] T004 [P] Verify `useAnalysisHistory.ts` `loadSession()` calls `getSessionMessages()` and returns `StreamMessage[]` in chronological order (line 261-328) — already implemented per research

**Checkpoint**: Foundation ready — `useAnalysisStreaming` and `useAnalysisHistory` are confirmed correct. UI fix can now begin.

---

## Phase 3: User Story 1 - View Historical Chat Session (Priority: P1) 🎯 MVP

**Goal**: Clicking a history item in the sidebar opens the chat interface in the main workspace with historical messages displayed in correct chronological order.

**Independent Test**: Click a history item in the sidebar. The chat UI replaces the "Start Analysis" empty state. Historical messages appear in chronological order.

### Implementation for User Story 1

- [x] T005 [P] [US1] Modify workspace conditional in `src/app/components/AIAnalysisPage.tsx` (line ~840): change `!activeAnalysis` to `!activeAnalysis && !isHistoricalSessionLoaded` so historical sessions render the chat UI
- [x] T006 [P] [US1] Add null-safe header fallbacks in `src/app/components/AIAnalysisPage.tsx` (Analysis Header section, line ~864): when `activeAnalysis` is `null` (historical session), display the history entry title, default icon, and category label instead of crashing
- [x] T007 [US1] Hide the right sidebar (Insights & Recommendations) in `src/app/components/AIAnalysisPage.tsx` (line ~1018) when viewing a historical session by changing the conditional from `isAnalysisComplete` to `isAnalysisComplete && activeAnalysis !== null`

**Checkpoint**: User Story 1 fully functional — clicking a history item shows the chat UI with messages in order, and the header displays correctly without runtime errors.

---

## Phase 4: User Story 2 - Send Follow-up in Historical Session (Priority: P2)

**Goal**: Chat input is enabled for historical sessions, and follow-up questions use the correct sessionId.

**Independent Test**: Load a historical session, verify chat input is enabled, send a follow-up, and confirm the network request includes the correct historical sessionId.

### Implementation for User Story 2

- [x] T008 [P] [US2] Verify `isChatEnabled` logic in `src/app/components/AIAnalysisPage.tsx` (line ~551) evaluates to `true` for historical sessions because `isAnalysisComplete` (`streaming.status === 'complete'`) is already true after `loadMessages()`
- [x] T009 [P] [US2] Verify `sendFollowUp()` in `src/app/hooks/useAnalysisStreaming.ts` (line 194-260) sends the request with the `sessionId` stored by `loadMessages()` (line 283)
- [x] T010 [US2] Verify historical sessions with multiple follow-up exchanges display all messages in chronological order in `src/app/components/AIAnalysisPage.tsx` messages area (line ~946)

**Checkpoint**: User Story 2 fully functional — chat input is enabled for historical sessions, and follow-ups use the correct sessionId without cross-session contamination.

---

## Phase 5: User Story 3 - Empty State Visibility (Priority: P3)

**Goal**: The "Start Analysis" empty-state placeholder only appears when no analysis is active and no history session is loaded.

**Independent Test**: On initial page load with no active session, the empty state is visible. After clicking a history item, the empty state disappears. After clearing the session, it reappears.

### Implementation for User Story 3

- [x] T011 [US3] Verify "Start Analysis" empty state in `src/app/components/AIAnalysisPage.tsx` (line ~841) only renders when `!activeAnalysis && !isHistoricalSessionLoaded`
- [x] T012 [US3] Verify clearing an active analysis (clicking X on header) resets `activeAnalysis` to `null`, and if no history is selected, the empty state reappears

**Checkpoint**: User Story 3 fully functional — empty state visibility behaves correctly in all UI states.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Regression testing and edge case validation

- [x] T013 [P] Run quickstart.md validation steps: start a new analysis and confirm normal streaming flow still works (connecting → streaming → complete)
- [x] T014 [P] Verify edge cases in `src/app/components/AIAnalysisPage.tsx`: handle empty historical sessions (no messages), rapid successive history item clicks, and network failure during `loadSession()`
- [x] T015 [P] Verify `handleRegenerate()` in `src/app/components/AIAnalysisPage.tsx` (line ~488) does not crash when `activeAnalysis` is `null` (historical session) — add guard if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - Can proceed sequentially in priority order (P1 → P2 → P3)
  - US1 is the core fix; US2 and US3 are verifications of existing behavior
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories. Contains the actual code changes.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Independent verification task; no code changes needed in hooks per research.
- **User Story 3 (P3)**: Can start after User Story 1 — Verifies the conditional fix from T005 works correctly for empty state.

### Within Each User Story

- T005 must complete before T006 (same file, sequential edits)
- T006 must complete before T007 (same file, sequential edits)
- All other tasks within a story are verification-only and can proceed in any order

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 and T004 can run in parallel
- T005 and T008 can run in parallel (different concerns, no file conflicts)
- T013, T014, T015 can run in parallel during Polish phase

---

## Parallel Example: User Story 1

```bash
# T005 and T006 both modify AIAnalysisPage.tsx but in different regions:
Task: "Modify workspace conditional (T005) in src/app/components/AIAnalysisPage.tsx"
Task: "Add header fallbacks (T006) in src/app/components/AIAnalysisPage.tsx"

# T007 depends on T005/T006 completing since it's the same file:
Task: "Hide right sidebar (T007) in src/app/components/AIAnalysisPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (T005, T006, T007)
4. **STOP and VALIDATE**: Click a history item, verify chat UI appears, messages display in order, header shows correctly
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Core bug fixed → Deploy/Demo (MVP!)
3. Add User Story 2 → Verify follow-ups work for historical sessions → Deploy/Demo
4. Add User Story 3 → Verify empty state behavior → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
