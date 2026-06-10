# Tasks: AI Analysis Real-Time Streaming

**Input**: Design documents from `/specs/041-analysis-sse-streaming/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/sse-events.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and dependencies are ready for streaming implementation

- [x] T001 Verify `EventSource` API is available in target browser matrix (no polyfill needed for modern browsers)
- [x] T002 Confirm `src/api/client.ts` exposes `defaults.baseURL` for SSE URL construction in `analysis-service.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Service layer and hook must be complete before any user story UI work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Add `triggerStreamingRun`, `connectToStream`, and `askFollowUp` methods to `src/api/services/analysis-service.ts`
- [x] T004 Create `src/app/hooks/useAnalysisStreaming.ts` with state types (`StreamingStatus`, `StreamMessage`) and hook interface (`startAnalysis`, `sendFollowUp`, `stopStreaming`, `reset`)
- [x] T005 [P] Implement `startAnalysis` action in `src/app/hooks/useAnalysisStreaming.ts`: POST streaming-run, open EventSource, append tokens to assistant message, handle `complete` and `error` events
- [x] T006 [P] Implement `stopStreaming` and `reset` actions in `src/app/hooks/useAnalysisStreaming.ts`: close EventSource, mark message final, clear state
- [x] T007 Implement `sendFollowUp` action in `src/app/hooks/useAnalysisStreaming.ts`: POST follow-up, append user question + assistant answer to messages
- [x] T008 Add `useEffect` cleanup in `src/app/hooks/useAnalysisStreaming.ts` to close EventSource on unmount

**Checkpoint**: Foundation ready — `useAnalysisStreaming` hook is fully functional and can be imported by `AIAnalysisPage.tsx`

---

## Phase 3: User Story 1 + 2 - Trigger Real Streaming & Live Progress (Priority: P1) 🎯 MVP

**Goal**: Replace simulated analysis startup with real backend streaming. Progress steps sync to actual SSE connection state.

**Independent Test**: Select an analysis card, verify POST `/streaming-run` fires, verify EventSource connects, verify tokens render live, and verify progress steps map to `connecting` → `streaming` → `complete`.

### Implementation for User Story 1 & 2

- [x] T009 [P] [US1] Wire `handleSelectLibraryItem` in `src/app/components/AIAnalysisPage.tsx` to call `streaming.startAnalysis(item.id, filters)` instead of simulation
- [x] T010 [P] [US1] Wire `handleStartAnalysis` in `src/app/components/AIAnalysisPage.tsx` to call `streaming.startAnalysis(card.id, filters)` instead of simulation
- [x] T011 [US1] Render messages from `streaming.messages` in `src/app/components/AIAnalysisPage.tsx` instead of `generatingText` state
- [x] T012 [US2] Sync `progressSteps` to `streaming.status` in `src/app/components/AIAnalysisPage.tsx`: `connecting` → step 1 active; `streaming` → steps 1–4 complete, step 5 active; `complete`/`error` → all complete
- [x] T013 [US1] Show loading skeleton while `streaming.status === 'connecting'` in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: At this point, User Stories 1 and 2 should be fully functional and testable independently. The MVP is complete.

---

## Phase 4: User Story 3 - Stop an In-Progress Analysis (Priority: P2)

**Goal**: Allow the user to stop an active stream on demand.

**Independent Test**: Click stop during streaming; verify no more tokens appear and the partial text remains visible.

### Implementation for User Story 3

- [x] T014 [US3] Wire `stopGenerating` in `src/app/components/AIAnalysisPage.tsx` to call `streaming.stopStreaming()` instead of setting local state
- [x] T015 [US3] Ensure stop button is visible only while `streaming.status === 'streaming'` in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: User Story 3 works independently. Stopping retains partial message and closes the connection.

---

## Phase 5: User Story 4 - Ask Follow-Up Questions (Priority: P2)

**Goal**: Enable follow-up chat after the initial analysis stream completes.

**Independent Test**: After analysis completes, type a question, submit it, and verify the question and answer appear in the chat thread.

### Implementation for User Story 4

- [x] T016 [US4] Implement `handleSendMessage` in `src/app/components/AIAnalysisPage.tsx` to call `streaming.sendFollowUp(chatInput)` and clear the input
- [x] T017 [US4] Enable chat input only when `streaming.status === 'complete'` in `src/app/components/AIAnalysisPage.tsx`; disable during `connecting` and `streaming`
- [x] T018 [US4] Render follow-up messages (both `user` and `assistant` roles) from `streaming.messages` in the chat thread in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: User Story 4 works independently. Follow-up questions are sent and answers are appended.

---

## Phase 6: User Story 5 - Regenerate Analysis (Priority: P2)

**Goal**: Allow the user to regenerate an analysis, clearing history and restarting the pipeline.

**Independent Test**: Click regenerate after an analysis completes or is stopped; verify messages clear and a new streaming session starts.

### Implementation for User Story 5

- [x] T019 [US5] Wire `regenerateAnalysis` in `src/app/components/AIAnalysisPage.tsx` to call `streaming.reset()` then `streaming.startAnalysis(activeAnalysis.id, filters)`
- [x] T020 [US5] Ensure regenerate button is visible when `streaming.status === 'complete'` or `streaming.status === 'error'` in `src/app/components/AIAnalysisPage.tsx`

**Checkpoint**: User Story 5 works independently. Regeneration is a destructive retry with no undo.

---

## Phase 7: User Story 6 - Handle Streaming Failures Gracefully (Priority: P2)

**Goal**: Display user-friendly Arabic error messages when the stream fails.

**Independent Test**: Simulate a stream failure (e.g., block SSE endpoint in DevTools) and verify an Arabic error banner appears and controls remain usable.

### Implementation for User Story 6

- [x] T021 [US6] Display `streaming.error` in an Arabic error banner when `streaming.status === 'error'` in `src/app/components/AIAnalysisPage.tsx`
- [x] T022 [US6] Ensure stop and regenerate controls remain available when `streaming.status === 'error'` in `src/app/components/AIAnalysisPage.tsx`
- [x] T023 [US6] Handle card selection while streaming: in `handleSelectLibraryItem`, call `streaming.reset()` before `streaming.startAnalysis()` to replace the active session

**Checkpoint**: User Story 6 works independently. Errors surface Arabic messages without crashing the UI.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Remove dead simulation code and ensure clean integration

- [x] T024 [P] Remove `streamText()`, `startAnalysisWorkflow()`, and all `setTimeout` simulation loops from `src/app/components/AIAnalysisPage.tsx`
- [x] T025 [P] Remove unused local state (`generatingText`, `isGenerating`, `isAnalysisComplete`) from `src/app/components/AIAnalysisPage.tsx`
- [x] T026 [P] Verify no hardcoded Arabic text remains in `src/app/components/AIAnalysisPage.tsx` that should come from the backend stream
- [x] T027 [P] Verify `src/api/services/analysis-service.ts` passes token as query param (not header) in `connectToStream`
- [x] T028 [P] Verify `useAnalysisStreaming` hook handles `token` event type (and `partial_replay` if still needed) per `contracts/sse-events.md`
- [x] T029 [P] Verify `useAnalysisStreaming` hook correctly sets `isStreaming: false` on `complete` and `error` events
- [x] T030 [P] Run linting (`eslint`) and TypeScript compilation (`tsc --noEmit`) to verify no type errors
- [x] T031 [P] Update `AGENTS.md` to point to the current feature plan and spec

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
  - Phase 3 (US1+US2) must complete before Phase 4–7 (they build on the core streaming flow)
  - Phase 4–7 can be worked on in any order once Phase 3 is done
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1+2 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories. This is the MVP.
- **User Story 3 (P2)**: Can start after Phase 3 — Depends on active streaming being functional
- **User Story 4 (P2)**: Can start after Phase 3 — Depends on streaming completion state
- **User Story 5 (P2)**: Can start after Phase 3 — Depends on start/reset being functional
- **User Story 6 (P2)**: Can start after Phase 3 — Depends on streaming lifecycle being functional

### Within Each User Story

- Hook actions before page wiring
- Page wiring before UI polish
- Error handling after happy path

### Parallel Opportunities

- All Setup tasks (T001–T002) can run in parallel
- All Foundational tasks (T003–T008) can run in parallel (different methods in different files)
- T009 and T010 can run in parallel (different handlers in same file, but same component — may need sequential)
- T011 and T012 can run in parallel after T009/T010 (different UI concerns)
- T014 and T015 can run in parallel
- T016, T017, T018 can run in parallel (different aspects of follow-up chat)
- T019 and T020 can run in parallel
- T021, T022, T023 can run in parallel
- All Polish tasks (T024–T031) can run in parallel (different cleanup concerns)

---

## Parallel Example: User Story 1+2

```bash
# After Foundational phase is complete, launch these together:
Task: "Wire handleSelectLibraryItem to streaming.startAnalysis in src/app/components/AIAnalysisPage.tsx"
Task: "Wire handleStartAnalysis to streaming.startAnalysis in src/app/components/AIAnalysisPage.tsx"

# Then launch these together:
Task: "Render messages from streaming.messages instead of generatingText in src/app/components/AIAnalysisPage.tsx"
Task: "Sync progressSteps to streaming.status in src/app/components/AIAnalysisPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1+2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Stories 1+2 (core streaming + progress sync)
4. **STOP and VALIDATE**: Test that selecting a card triggers real streaming and progress steps sync
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1+2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 (stop) → Test independently → Deploy/Demo
4. Add User Story 4 (follow-up) → Test independently → Deploy/Demo
5. Add User Story 5 (regenerate) → Test independently → Deploy/Demo
6. Add User Story 6 (error handling) → Test independently → Deploy/Demo
7. Complete Polish phase

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Phase 3 (US1+US2 — core streaming and progress)
   - Developer B: Phase 4–5 (US3–US4 — stop and follow-up)
   - Developer C: Phase 6–7 (US5–US6 — regenerate and error handling)
3. All converge on Phase 8: Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (if tests are added later)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- The existing `useAnalysisStreaming.ts` and `analysis-service.ts` files may already contain partial implementations — tasks should verify, refine, or complete them as needed
