# Tasks: ISIV Charity Assessment Results API

**Input**: Design documents from `/specs/060-isiv-results-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are not included because the feature specification does not explicitly request TDD and the project has no visible test runner configured. Validation is via `npm run build` and the quickstart.md manual scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the workspace and confirm existing patterns to reuse.

- [X] T001 Inspect existing onboarding service and hook patterns in `src/api/services/onboarding-service.ts` and `src/api/hooks/useProjectDashboard.ts`
- [X] T002 [P] Verify `recharts` and `lucide-react` dependencies are present in `package.json`
- [X] T003 Confirm route path `/dashboard/charity-assessment/results/:organizationId` is registered in the application router

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Create `src/api/hooks/useIsivAssessmentResults.ts` with interface `{ data, isLoading, error, refetch }` and request cancellation via `AbortController`
- [X] T005 Add Arabic error message helper for ISIV results failures in `src/api/hooks/useIsivAssessmentResults.ts`
- [X] T006 Export `useIsivAssessmentResults` from `src/api/hooks/index.ts` if an index file exists, otherwise ensure the hook is importable by path

**Checkpoint**: Foundation ready — the hook can be imported and returns the documented state shape.

---

## Phase 3: User Story 1 - View Live ISIV Assessment Results (Priority: P1) 🎯 MVP

**Goal**: Display the overall score, readiness badge, qualification message, radar chart, benchmark bar chart, and error/loading states using live API data.

**Independent Test**: Open `/dashboard/charity-assessment/results/:organizationId` with a completed organization and verify the header score, badge, qualification text, radar chart, and benchmark chart all match the API response. Trigger an API failure and verify an Arabic error message appears.

### Implementation for User Story 1

- [X] T007 [P] [US1] Import `useParams` and `useIsivAssessmentResults` in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T008 [US1] Replace hardcoded `overallScore` and `readinessLevel` imports with computed values from `data.overallScore` in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T009 [US1] Render the qualification section from `data.qualificationStatus` and `data.qualificationMessage` in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T010 [US1] Render the radar chart using `data.radarData` from the API in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T011 [US1] Render the benchmark bar chart using `data.benchmarks` mapped to "منظمتك", "متوسط القطاع", and "أفضل ممارسة" in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T012 [US1] Add centered loading spinner while `isLoading` is true in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T013 [US1] Add Arabic error message and optional retry button when `error` is set or `organizationId` is missing in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T014 [US1] Remove hardcoded imports from `src/app/pages/charity-assessment/charity-assessment-data.ts` in `CharityAssessmentResultsPage.tsx`
- [X] T015 [US1] Remove or hide the hardcoded "مقارنة بمتوسط القطاع" and "التقدم منذ آخر تقييم" stat cards that lack API backing

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Track Progress Over Time (Priority: P2)

**Goal**: Conditionally render the monthly progress line chart only when the API provides trend data.

**Independent Test**: Load the results page for an API response that includes `progressData` and verify the line chart renders; then load a response without `progressData` and verify the section is hidden and no hardcoded months appear.

### Implementation for User Story 2

- [X] T016 [P] [US2] Define `progressData` shape inside `IsivAssessmentResult` or as an optional field in `src/api/services/onboarding-service.ts`
- [X] T017 [US2] Conditionally render the progress tracking line chart only when `data.progressData` exists and is non-empty in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [X] T018 [US2] Remove the hardcoded `progressData` import from `src/app/pages/charity-assessment/charity-assessment-data.ts` in `CharityAssessmentResultsPage.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Understand Strengths and Improvement Areas (Priority: P1)

**Goal**: Render the strengths and gaps sections from the API with correct severity color mapping.

**Independent Test**: Compare rendered strengths and gaps cards with the API response and confirm each title, score, insight, issue, recommendation, and severity color matches.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Render the strengths section using `data.strengths` in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [ ] T020 [P] [US3] Render the gaps/weaknesses section using `data.weaknesses` in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [ ] T021 [US3] Map weakness `severity` to CSS colors (critical → red, high → orange, medium/low → yellow) in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [ ] T022 [US3] Update the top stat cards to show counts from `data.strengths.length` and `data.weaknesses.length` in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx`
- [ ] T023 [US3] Remove hardcoded `strengths` and `gaps` imports from `src/app/pages/charity-assessment/charity-assessment-data.ts` in `CharityAssessmentResultsPage.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [X] T024 [P] Run `npm run build` and fix any TypeScript errors in `src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx` or `src/api/hooks/useIsivAssessmentResults.ts`
- [X] T025 [P] Verify `charity-assessment-data.ts` is still imported by `CharityAssessmentWizardPage.tsx` and not deleted
- [ ] T026 [P] Run quickstart.md validation steps manually for loading, success, error, and missing-organizationId states
- [X] T027 Review `CharityAssessmentResultsPage.tsx` for any remaining hardcoded values from the sample data file

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed).
  - Or sequentially in priority order: US1 (P1) → US3 (P1) → US2 (P2).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories. Delivers the MVP.
- **User Story 3 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2). Independent, but logically builds on the chart rendering already working in US1.

### Within Each User Story

- Core data binding before visual polish.
- Page-level imports before component cleanup.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks marked [P] can run in parallel (within Phase 2).
- Once Foundational is done, US1 and US3 can start in parallel.
- US2 can start after either US1 chart rendering is verified.
- All Polish tasks marked [P] can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch these tasks together once Foundational is complete:
Task: "Replace hardcoded overallScore and readinessLevel imports in src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx"
Task: "Render the radar chart using data.radarData in src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx"
Task: "Render the benchmark bar chart using data.benchmarks in src/app/pages/charity-assessment/CharityAssessmentResultsPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently against the API.
5. Run `npm run build` to confirm no TypeScript errors.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Run build.
3. Add User Story 3 → Test independently → Run build.
4. Add User Story 2 → Test independently → Run build.
5. Complete Polish phase → Final build and quickstart validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 3
   - Developer C: User Story 2 (can start once US1 chart rendering is verified)
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
