# Tasks: AI Analysis History Replay

**Input**: Design documents from `/specs/042-analysis-history/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/history-api.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies are ready for history implementation

- [X] T001 Verify `IntersectionObserver` API is available in target browser matrix (no polyfill needed for modern browsers)
- [X] T002 Confirm `src/api/services/analysis-service.ts` has base endpoint `/api/v1/analysis` for history URL construction

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Service layer and hook must be complete before any user story UI work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Add `getHistory(page, limit)` and `getRunDetail(runId)` methods to `src/api/services/analysis-service.ts`
- [X] T004 Create `src/app/hooks/useAnalysisHistory.ts` with state types (`AnalysisHistoryEntry`, `HistoryPaginationState`) and hook interface (`fetchHistory`, `loadSession`, `retry`, `reset`)
- [X] T005 [P] Implement `fetchHistory` action in `src/app/hooks/useAnalysisHistory.ts`: GET history, append entries, update pagination state, handle errors
- [X] T006 [P] Implement `loadSession` action in `src/app/hooks/useAnalysisHistory.ts`: GET detail, convert results to chat messages, set active session ID
- [X] T007 [P] Implement pagination logic in `src/app/hooks/useAnalysisHistory.ts`: track `hasMore`, `isLoading`, prevent concurrent fetches
- [X] T008 Add `useEffect` cleanup in `src/app/hooks/useAnalysisHistory.ts` to abort in-flight requests on unmount

**Checkpoint**: Foundation ready — `useAnalysisHistory` hook is fully functional and can be imported by `AIAnalysisPage.tsx`

---

## Phase 3: User Story 1 - View Analysis History in Sidebar (Priority: P1) 🎯 MVP

**Goal**: Replace hardcoded `analysisHistory` array with real backend data. Show loading, empty, and error states.

**Independent Test**: Open the AI Analysis page and verify the sidebar populates with real history entries, shows loading spinner initially, empty state when no data, and error state with retry on failure.

### Implementation for User Story 1

- [X] T009 [P] [US1] Replace hardcoded `analysisHistory` array in `src/app/components/AIAnalysisPage.tsx` with `useAnalysisHistory()` hook
- [X] T010 [P] [US1] Render history items from `history.entries` in `src/app/components/AIAnalysisPage.tsx`: title, status badge, date, preview
- [X] T011 [US1] Implement status badge color mapping in `src/app/components/AIAnalysisPage.tsx`: COMPLETED=green, RUNNING=blue, FAILED=red, PENDING=gray
- [X] T012 [US1] Show loading skeleton/spinner while `history.isLoading` in `src/app/components/AIAnalysisPage.tsx` with Arabic text "جاري تحميل سجل التحليلات..."
- [X] T013 [US1] Show empty state when `history.entries.length === 0` in `src/app/components/AIAnalysisPage.tsx` with Arabic text "لا توجد تحليلات سابقة. ابدأ بإنشاء تحليل جديد"
- [X] T014 [US1] Show error banner with retry button when `history.error` is set in `src/app/components/AIAnalysisPage.tsx` with Arabic text "فشل في تحميل السجل"

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. The MVP is complete.

---

## Phase 4: User Story 2 - Click History Item to Replay Session (Priority: P1)

**Goal**: Clicking a history item loads full session details and replays insights/recommendations as complete messages in the chat area.

**Independent Test**: Click a history item and verify the chat area shows full insight and recommendation text (not token-by-token), and the active session ID is set.

### Implementation for User Story 2

- [X] T015 [US2] Wire history item click handler in `src/app/components/AIAnalysisPage.tsx` to call `history.loadSession(item.id)`
- [X] T016 [US2] Show confirmation dialog when clicking history item while a live stream is active (`streaming.status === 'streaming'` or `'connecting'`) in `src/app/components/AIAnalysisPage.tsx`
- [X] T017 [US2] Display loaded session messages in chat area from `streaming.messages` (set by `loadSession`) in `src/app/components/AIAnalysisPage.tsx`
- [X] T018 [US2] Ensure loaded session messages render as complete text (no streaming cursor) in `src/app/components/AIAnalysisPage.tsx`
- [X] T019 [US2] Show inline loading state while session detail is loading in `src/app/components/AIAnalysisPage.tsx`
- [X] T020 [US2] Show inline error state if session detail fetch fails in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: User Story 2 works independently. Clicking a history item replays the session in the chat area.

---

## Phase 5: User Story 3 - Continue Follow-Up on Loaded Session (Priority: P2)

**Goal**: Enable follow-up chat on loaded historical sessions using the loaded session ID.

**Independent Test**: Load a historical session, type a question, submit it, and verify the question and answer appear in the chat thread with the correct session ID.

### Implementation for User Story 3

- [X] T021 [US3] Enable chat input when a historical session is loaded (`history.selectedId` is set and `streaming.status === 'complete'`) in `src/app/components/AIAnalysisPage.tsx`
- [X] T022 [US3] Wire `handleSendMessage` in `src/app/components/AIAnalysisPage.tsx` to call `streaming.sendFollowUp(chatInput)` using the loaded session's `sessionId`
- [X] T023 [US3] Ensure follow-up questions append to the chat thread below the loaded session messages in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: User Story 3 works independently. Follow-up questions are sent and answers are appended to the loaded session.

---

## Phase 6: User Story 4 - Paginate History List (Priority: P2)

**Goal**: Support infinite scroll pagination in the history sidebar.

**Independent Test**: Scroll to the bottom of the sidebar with more than 20 entries and verify the next page loads and appends.

### Implementation for User Story 4

- [X] T024 [US4] Add `IntersectionObserver` to the bottom of the history sidebar in `src/app/components/AIAnalysisPage.tsx` to detect scroll-to-bottom
- [X] T025 [US4] Wire scroll-to-bottom event to call `history.fetchHistory(nextPage)` in `src/app/components/AIAnalysisPage.tsx`
- [X] T026 [US4] Show inline loading indicator at bottom while fetching next page in `src/app/components/AIAnalysisPage.tsx`
- [X] T027 [US4] Ensure no further page requests are sent when `history.pagination.hasMore === false` in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: User Story 4 works independently. Pagination loads next pages on scroll.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Clean up, verify integration, and ensure no hardcoded data remains

- [X] T028 [P] Remove any remaining hardcoded `analysisHistory` data or mock constants from `src/app/components/AIAnalysisPage.tsx`
- [X] T029 [P] Verify `src/api/services/analysis-service.ts` endpoints match `contracts/history-api.md`
- [X] T030 [P] Verify `useAnalysisHistory` hook handles empty `results` / `insights` arrays gracefully (no crash)
- [X] T031 [P] Verify preview text derivation logic in `src/app/components/AIAnalysisPage.tsx` (first 100 chars of `insightText` or `summary` fallback)
- [X] T032 [P] Verify `AbortController` is used for all history and detail requests in `src/app/hooks/useAnalysisHistory.ts`
- [X] T033 [P] Verify confirmation dialog Arabic text is correct: "تحليل قيد التشغيل. هل تريد الانتقال إلى التحليل المحدد؟"
- [X] T034 [P] Run linting (`eslint`) and TypeScript compilation (`tsc --noEmit`) to verify no type errors
- [X] T035 [P] Update `AGENTS.md` to point to the current feature plan and spec

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion
  - Phase 3 (US1) must complete before Phase 4–6 (they build on the history list being visible)
  - Phase 4–6 can be worked on in any order once Phase 3 is done
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories. This is the MVP.
- **User Story 2 (P1)**: Can start after Phase 3 — Depends on history list being rendered
- **User Story 3 (P2)**: Can start after Phase 4 — Depends on session loading being functional
- **User Story 4 (P2)**: Can start after Phase 3 — Depends on history list being rendered

### Within Each User Story

- Hook actions before page wiring
- Page wiring before UI polish
- Error handling after happy path

### Parallel Opportunities

- All Setup tasks (T001–T002) can run in parallel
- All Foundational tasks (T003–T008) can run in parallel (different methods in different files)
- T009 and T010 can run in parallel (different UI concerns)
- T011, T012, T013, T014 can run in parallel (different state handling)
- T015, T016 can run in parallel (click handler + confirmation dialog)
- T017, T018, T019, T020 can run in parallel (different aspects of session replay)
- T021, T022, T023 can run in parallel (different aspects of follow-up)
- T024, T025, T026, T027 can run in parallel (different aspects of pagination)
- All Polish tasks (T028–T035) can run in parallel (different cleanup concerns)

---

## Parallel Example: User Story 1

```bash
# After Foundational phase is complete, launch these together:
Task: "Replace hardcoded analysisHistory with useAnalysisHistory hook in src/app/components/AIAnalysisPage.tsx"
Task: "Render history items from history.entries in src/app/components/AIAnalysisPage.tsx"

# Then launch these together:
Task: "Implement status badge color mapping in src/app/components/AIAnalysisPage.tsx"
Task: "Show loading skeleton while history.isLoading in src/app/components/AIAnalysisPage.tsx"
Task: "Show empty state when no entries in src/app/components/AIAnalysisPage.tsx"
Task: "Show error banner with retry button in src/app/components/AIAnalysisPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (history list with loading/empty/error states)
4. **STOP and VALIDATE**: Test that sidebar populates with real history and shows correct states
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (replay) → Test independently → Deploy/Demo
4. Add User Story 3 (follow-up) → Test independently → Deploy/Demo
5. Add User Story 4 (pagination) → Test independently → Deploy/Demo
6. Complete Polish phase

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Phase 3 (US1 — history list rendering)
   - Developer B: Phase 4 (US2 — session replay + confirmation dialog)
   - Developer C: Phase 5–6 (US3–US4 — follow-up + pagination)
3. All converge on Phase 7: Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (if tests are added later)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- The existing `useAnalysisStreaming` hook is reused for follow-up; no modifications needed unless the follow-up API contract changes
