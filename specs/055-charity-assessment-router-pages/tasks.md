# Tasks: Charity Assessment Router Pages

**Input**: Design documents from `specs/055-charity-assessment-router-pages/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification. No automated test tasks are included. Validation is manual via the dev server and production build.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new page directory and shared files used by all user stories.

- [x] T001 [P] Create directory `src/app/pages/charity-assessment/` for the new routable page components.
- [x] T002 [P] Create shared types and mock data file `src/app/pages/charity-assessment/charity-assessment-data.ts` extracted from `src/app/components/CharityAssessmentPage.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core routing and navigation wiring that MUST be complete before any user story can be independently verified.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Create `src/app/pages/charity-assessment/CharityAssessmentStartPage.tsx` by extracting the start view from `src/app/components/CharityAssessmentPage.tsx` and replacing `setCurrentView('assessment')` with `useNavigate()` to `/dashboard/charity-assessment/assessment` and `setCurrentView('results')` with navigation to `/dashboard/charity-assessment/results`.
- [x] T004 Create `src/app/pages/charity-assessment/CharityAssessmentWizardPage.tsx` by extracting the assessment wizard view from `src/app/components/CharityAssessmentPage.tsx` and replacing the final-step `setCurrentView('results')` with navigation to `/dashboard/charity-assessment/results`.
- [x] T005 Create `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx` by extracting the results dashboard view from `src/app/components/CharityAssessmentPage.tsx` and replacing `setCurrentView('assessment')` with navigation to `/dashboard/charity-assessment/assessment` and `setCurrentView('roadmap')` with navigation to `/dashboard/charity-assessment/roadmap`.
- [x] T006 Create `src/app/pages/charity-assessment/CharityAssessmentRoadmapPage.tsx` by extracting the roadmap view from `src/app/components/CharityAssessmentPage.tsx` and replacing `setCurrentView('results')` with navigation to `/dashboard/charity-assessment/results`.
- [x] T007 Update `src/app/routes.tsx` to replace the single `/dashboard/charity-assessment` route with nested routes for `/dashboard/charity-assessment/*` mapping index to `CharityAssessmentStartPage`, `assessment` to `CharityAssessmentWizardPage`, `results` to `CharityAssessmentResultsPage`, `roadmap` to `CharityAssessmentRoadmapPage`, and a wildcard fallback redirecting to `/dashboard/charity-assessment`.

**Checkpoint**: Foundation ready — all four views are reachable via URL and in-app navigation works; user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Navigate directly to a charity assessment sub-page (Priority: P1) 🎯 MVP

**Goal**: Every charity assessment screen is reachable via a stable, bookmarkable URL under `/dashboard/charity-assessment/*`.

**Independent Test**: Open each URL directly in the browser and confirm the expected screen renders:

- `/dashboard/charity-assessment` → start screen
- `/dashboard/charity-assessment/assessment` → assessment wizard
- `/dashboard/charity-assessment/results` → results dashboard
- `/dashboard/charity-assessment/roadmap` → improvement roadmap

- [x] T008 [US1] Verify `/dashboard/charity-assessment` renders `CharityAssessmentStartPage.tsx` directly without visiting another view.
- [x] T009 [US1] Verify `/dashboard/charity-assessment/assessment` renders `CharityAssessmentWizardPage.tsx` directly.
- [x] T010 [US1] Verify `/dashboard/charity-assessment/results` renders `CharityAssessmentResultsPage.tsx` directly.
- [x] T011 [US1] Verify `/dashboard/charity-assessment/roadmap` renders `CharityAssessmentRoadmapPage.tsx` directly.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Use browser back/forward and refresh within charity assessment (Priority: P1)

**Goal**: Browser back, forward, and refresh actions preserve the current charity assessment screen.

**Independent Test**: Navigate between charity assessment sub-pages using browser controls and refresh each page; the same view should remain.

- [x] T012 [US2] Update `src/app/layouts/DashboardLayout.tsx` so the active menu detection for `charity-assessment` matches any nested route under `/dashboard/charity-assessment/*` (e.g., using `useMatch('/dashboard/charity-assessment/*')`).
- [x] T013 [US2] Verify the browser back button returns to the previous charity assessment route from `/dashboard/charity-assessment/assessment`.
- [x] T014 [US2] Verify refreshing `/dashboard/charity-assessment/results` re-renders the results dashboard.
- [x] T015 [US2] Verify refreshing `/dashboard/charity-assessment/roadmap` re-renders the roadmap view.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Maintain existing charity assessment functionality (Priority: P2)

**Goal**: All existing charity assessment features continue to work after the routing conversion.

**Independent Test**: Perform the existing actions from the new routable pages and verify they still produce the same results.

- [x] T016 [US3] Verify clicking "بدء التقييم" on `CharityAssessmentStartPage.tsx` navigates to `/dashboard/charity-assessment/assessment`.
- [x] T017 [US3] Verify clicking "عرض نتائج سابقة" on `CharityAssessmentStartPage.tsx` navigates to `/dashboard/charity-assessment/results`.
- [x] T018 [US3] Verify completing the wizard on `CharityAssessmentWizardPage.tsx` navigates to `/dashboard/charity-assessment/results`.
- [x] T019 [US3] Verify clicking "عرض خارطة الطريق" on `CharityAssessmentResultsPage.tsx` navigates to `/dashboard/charity-assessment/roadmap`.
- [x] T020 [US3] Verify clicking "إعادة التقييم" on `CharityAssessmentResultsPage.tsx` navigates to `/dashboard/charity-assessment/assessment`.
- [x] T021 [US3] Verify clicking "العودة للنتائج" on `CharityAssessmentRoadmapPage.tsx` navigates to `/dashboard/charity-assessment/results`.
- [x] T022 [US3] Verify all existing charts, strengths, gaps, categories, questions, and roadmap items render identically to the original `CharityAssessmentPage.tsx`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, build verification, and navigation integration across the application.

- [x] T023 [P] Update `src/app/components/Sidebar.tsx` so the "تقييم الجاهزية" link points to `/dashboard/charity-assessment` and remains active on nested routes.
- [x] T024 [P] Update `src/app/components/MobileNav.tsx` so the "تقييم الجاهزية" link points to `/dashboard/charity-assessment` and remains active on nested routes.
- [x] T025 Remove or deprecate `src/app/components/CharityAssessmentPage.tsx` once the four new page components fully replace it.
- [x] T026 Run `pnpm build` and confirm the production build compiles without errors.
- [x] T027 Run the quickstart validation steps from `specs/055-charity-assessment-router-pages/quickstart.md` against the dev server.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed).
  - Or sequentially in priority order (US1 → US2 → US3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) — builds on US1 routes but can be verified independently.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — builds on US1/US2 navigation but can be verified independently.

### Within Each User Story

- Core implementation before integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks (T001–T002) can run in parallel.
- All Foundational page extractions (T003–T006) can run in parallel once shared data is available (T002).
- Each user story can be verified in parallel once the Foundational phase is complete.
- Sidebar and mobile navigation updates (T023–T024) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch all direct-route verification tasks together:
Task: "Verify /dashboard/charity-assessment renders CharityAssessmentStartPage.tsx"
Task: "Verify /dashboard/charity-assessment/assessment renders CharityAssessmentWizardPage.tsx"
Task: "Verify /dashboard/charity-assessment/results renders CharityAssessmentResultsPage.tsx"
Task: "Verify /dashboard/charity-assessment/roadmap renders CharityAssessmentRoadmapPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test each direct URL independently.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test direct URLs independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test browser controls independently → Deploy/Demo.
4. Add User Story 3 → Test existing functionality independently → Deploy/Demo.
5. Complete Polish phase → build + quickstart validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (direct route verification)
   - Developer B: User Story 2 (browser controls + active menu)
   - Developer C: User Story 3 (existing functionality regression)
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- No automated tests are included because the project has no test harness and none was requested.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
