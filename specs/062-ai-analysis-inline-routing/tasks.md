# Tasks: AI Analysis Router Pages

**Input**: Design documents from `/specs/062-ai-analysis-inline-routing/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included for routing/UI integration validation. Tests are OPTIONAL per project policy; they are included here because this is a routing refactor where manual regression is required.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure the existing project is ready for the refactor; no new infrastructure needed.

- [ ] T001 Verify project dependencies and dev server run successfully from repository root
- [ ] T002 Review `src/app/routes.tsx`, `src/app/layouts/DashboardLayout.tsx`, `src/app/components/AIAnalysisPage.tsx`, and `src/app/components/AnalysisHistoryPage.tsx` to confirm current inline-routing behavior

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Split the existing `AIAnalysisPage.tsx` into route-aligned page components and create the new component directory.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Create `src/app/components/ai-analysis/AIAnalysisStartPage.tsx` by extracting the start cards, header, and empty-state from `src/app/components/AIAnalysisPage.tsx`
- [ ] T004 [P] Create `src/app/components/ai-analysis/AIAnalysisChatPage.tsx` by extracting the chat workspace, progress steps, and history sidebar from `src/app/components/AIAnalysisPage.tsx`
- [ ] T005 Create `src/app/components/ai-analysis/AIAnalysisHistoryPage.tsx` by adapting the existing `src/app/components/AnalysisHistoryPage.tsx` content into the nested module view
- [ ] T006 Refactor `src/app/components/AIAnalysisPage.tsx` to act as a thin wrapper or remove it once routes point to the new sub-pages
- [ ] T007 Add a barrel export for new AI analysis page components in `src/app/components/ai-analysis/index.ts`

**Checkpoint**: Foundation ready - the new page components exist and can be imported by the router

---

## Phase 3: User Story 1 - Navigate directly to an AI analysis sub-page (Priority: P1) 🎯 MVP

**Goal**: Register nested routes under `/dashboard/ai-analysis/*` so each sub-page is reachable by direct URL and unknown paths redirect to the start view.

**Independent Test**: Enter each sub-page URL directly in the browser and confirm the expected screen renders.

### Implementation for User Story 1

- [ ] T008 [US1] Update `src/app/routes.tsx` to replace the flat `ai-analysis` route with nested children for `start`, `chat`, `history`, and a catch-all redirect
- [ ] T009 [US1] Update `src/app/layouts/DashboardLayout.tsx` to map any `location.pathname` starting with `/dashboard/ai-analysis` to `activeView === 'ai-analysis'`
- [ ] T010 [US1] Update `src/app/components/Sidebar.tsx` and `src/app/components/MobileNav.tsx` so the `ai-analysis` nav link points to `/dashboard/ai-analysis` and stays active on nested paths
- [ ] T011 [US1] Ensure direct access to `/dashboard/ai-analysis/chat` without an active session renders a sensible fallback (empty-state or redirect to start)
- [ ] T012 [US1] Ensure direct access to `/dashboard/ai-analysis/unknown` redirects to `/dashboard/ai-analysis`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Use browser back/forward and refresh within AI analysis (Priority: P1)

**Goal**: Ensure browser back/forward/refresh and in-app navigation update the URL and preserve the current AI analysis screen.

**Independent Test**: Navigate between AI analysis sub-pages using browser controls and refresh each page.

### Implementation for User Story 2

- [ ] T013 [US2] Replace internal state-driven view switches in `src/app/components/ai-analysis/AIAnalysisStartPage.tsx` with `useNavigate` calls to `/dashboard/ai-analysis/chat`
- [ ] T014 [US2] Replace internal reset/close actions in `src/app/components/ai-analysis/AIAnalysisChatPage.tsx` with `useNavigate` back to `/dashboard/ai-analysis/start`
- [ ] T015 [US2] Ensure `src/app/components/ai-analysis/AIAnalysisHistoryPage.tsx` uses `useNavigate` for internal navigation to `/dashboard/ai-analysis/chat`
- [ ] T016 [US2] Verify browser back/forward transitions between `/dashboard/ai-analysis/start`, `/dashboard/ai-analysis/chat`, and `/dashboard/ai-analysis/history` work correctly
- [ ] T017 [US2] Verify refreshing any AI analysis route re-renders the same view without crashing

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Maintain existing AI analysis functionality (Priority: P2)

**Goal**: Preserve all existing AI analysis features after routing conversion: recommended cards, streaming chat, follow-up questions, history sidebar, history page actions, and location-state navigation.

**Independent Test**: Perform existing actions from the new routable pages and verify they still produce the same results.

### Implementation for User Story 3

- [ ] T018 [US3] Wire recommended analysis card click in `src/app/components/ai-analysis/AIAnalysisStartPage.tsx` to start analysis and navigate to `/dashboard/ai-analysis/chat`
- [ ] T019 [US3] Wire "تحليل جديد" / library modal selection in `src/app/components/ai-analysis/AIAnalysisStartPage.tsx` to start analysis and navigate to `/dashboard/ai-analysis/chat`
- [ ] T020 [US3] Read `continueAnalysisId` and `rerunAnalysisId` from `useLocation().state` in `src/app/components/ai-analysis/AIAnalysisChatPage.tsx` and load/restart the session on mount
- [ ] T021 [US3] Update `src/app/components/AnalysisHistoryPage.tsx` (or its successor) so continue/rerun actions navigate to `/dashboard/ai-analysis/chat` with the correct location state, and "تحليل جديد" navigates to `/dashboard/ai-analysis/start`
- [ ] T022 [US3] Ensure the streaming chat, follow-up input, error retry, regenerate, copy, and stop actions still work in `src/app/components/ai-analysis/AIAnalysisChatPage.tsx`
- [ ] T023 [US3] Ensure the analysis history sidebar and infinite scroll still work in `src/app/components/ai-analysis/AIAnalysisChatPage.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ensure quality, consistency, and a clean build after the refactor.

- [ ] T024 [P] Run the quickstart.md regression checklist in the browser and verify direct URLs, back/forward/refresh, navigation highlighting, chat flows, and history flows
- [ ] T025 [P] Run `npm run build` and confirm the production build compiles without errors
- [ ] T026 [P] Run lint/typecheck (`npm run lint`, `npm run typecheck`, or equivalent) and fix any issues introduced by the refactor
- [ ] T027 Update `AGENTS.md` plan references if additional design documents were produced

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Builds on the routes created in US1 but focuses on navigation behavior
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on the chat page from US1 and navigation from US2 to wire existing actions

### Within Each User Story

- Foundational component split must be complete before route wiring
- Routes before layout active-view mapping
- Navigation behavior before integration with existing actions
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational page-split tasks (T003, T004, T005) can run in parallel after T001/T002
- T008 route registration and T009 layout mapping can run in parallel
- T018/T019/T020/T021/T022/T023 can be split across developers once chat and history components exist

---

## Parallel Example: User Story 1

```bash
# Launch page split and route wiring in parallel after Foundation:
Task: "Create src/app/components/ai-analysis/AIAnalysisStartPage.tsx"
Task: "Create src/app/components/ai-analysis/AIAnalysisChatPage.tsx"
Task: "Create src/app/components/ai-analysis/AIAnalysisHistoryPage.tsx"

# Then wire routes and layout in parallel:
Task: "Update src/app/routes.tsx nested AI analysis routes"
Task: "Update src/app/layouts/DashboardLayout.tsx activeView mapping"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test direct URL access for every route and unknown-path redirect
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test direct route access independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test browser back/forward/refresh and in-app navigation → Deploy/Demo
4. Add User Story 3 → Test existing feature regression (chat, history, streaming) → Deploy/Demo
5. Run Polish phase (build, lint, full regression)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (route registration + layout mapping)
   - Developer B: User Story 2 (navigation behavior in start/chat/history)
   - Developer C: User Story 3 (wire existing actions and location state)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- The existing `AIAnalysisPage.tsx` can be kept as a thin wrapper during the refactor and removed at the end to minimize risk
- Verify the build passes after each major phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
