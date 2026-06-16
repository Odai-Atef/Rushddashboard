# Tasks: Assessment Results Display

**Input**: Design documents from `/specs/050-assessment-results-display/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested; tasks below include manual validation steps instead of automated test files.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the service layer for the new assessment result contract without changing unrelated application code.

- [ ] T001 [P] Add `IsivDimension` and `IsivAssessmentResult` interfaces to `src/api/services/onboarding-service.ts`
- [ ] T002 Add `submitAssessment(organizationId: string)` method to `src/api/services/onboarding-service.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Update `AssessmentResult` imports and usages in `src/app/components/CharityOnboardingFlow.tsx` to reference the new `IsivAssessmentResult` type where appropriate
- [ ] T004 [P] Verify `recharts` imports in `src/app/components/CharityOnboardingFlow.tsx` support a 4-dimension static radar chart
- [ ] T005 Add a small Arabic qualification-status mapping helper in `src/app/components/CharityOnboardingFlow.tsx` (renders Arabic labels supplied by backend; no hard-coded enums)

**Checkpoint**: Foundation ready — service methods exist, types are available, and the component can import the new result shape.

---

## Phase 3: User Story 1 - Submit and View Evaluation Results (Priority: P1) 🎯 MVP

**Goal**: Clicking **إرسال التقييم** submits the assessment, fetches the ISIV evaluation result, and opens the results view populated with real data.

**Independent Test**: Complete the documents step, click submit, and see the results view with overall score, qualification status, radar chart, tier badges, diagnosis, strengths, and weaknesses populated from the API.

### Implementation for User Story 1

- [ ] T006 [US1] Replace the simulated `handleDocumentsNext` timer in `src/app/components/CharityOnboardingFlow.tsx` with a real async submit-and-fetch flow
- [ ] T007 [US1] Add loading state during submit + evaluation in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T008 [US1] Wire `setAssessmentResult(evalRes.data)` and `setCurrentView('results')` after successful fetch in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T009 [US1] Display overall score out of 120 in the results view using `assessmentResult.overallScore`
- [ ] T010 [US1] Display qualification status using the Arabic label supplied by the backend in the results view

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Understand Dimension-Level Performance (Priority: P2)

**Goal**: The results view shows each ISIV dimension with its symbol, Arabic label, score, percentage, tier, and Arabic tier label, plus a tier badge.

**Independent Test**: View the results screen and verify each of the four dimensions appears with correct symbol, label, percentage, and tier badge; verify the radar chart uses all four dimensions.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Render the four ISIV dimensions as a static radar chart in `src/app/components/CharityOnboardingFlow.tsx` using `recharts`
- [ ] T012 [P] [US2] Render per-dimension cards in `src/app/components/CharityOnboardingFlow.tsx` showing symbol, Arabic label, score, percentage, tier badge, and Arabic tier label
- [ ] T013 [US2] Ensure tier badge styling uses the `color` supplied by the backend for each dimension

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Read Arabic Diagnostic Feedback (Priority: P3)

**Goal**: The results view displays the Arabic diagnostic summary, strengths list, and weaknesses list returned by the evaluation engine, with graceful empty states.

**Independent Test**: Verify the diagnosis text, strengths list, and weaknesses list are visible on the results screen; remove them from a mock response and confirm the layout does not break.

### Implementation for User Story 3

- [ ] T014 [US3] Display the Arabic `diagnosis` text in the results view in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T015 [US3] Display the `strengths` list in the results view in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T016 [US3] Display the `weaknesses` list in the results view in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T017 [US3] Add empty-state handling for missing or empty `strengths`/`weaknesses` in the results view in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, returning-user support, duplicate-submit prevention, and type validation.

- [ ] T018 [P] Add error state and manual retry action for evaluation fetch failures in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T019 [P] Prevent duplicate assessment submission while evaluation is in progress in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T020 [P] Verify returning users can view persisted results by confirming `getAssessmentResults` is called on results-view mount in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T021 Run TypeScript type checks with `pnpm exec tsc --noEmit`
- [ ] T022 Run `pnpm dev` and validate the quickstart.md scenarios manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2). Builds on the results view layout introduced in US1 but can be developed in parallel.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2). Adds text sections to the same results view; can be developed in parallel with US2.

### Within Each User Story

- Core data rendering before styling/polish
- Service integration before UI updates
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 in Phase 1 are independent.
- T011 and T012 in US2 can be done in parallel.
- T014, T015, T016, T017 in US3 can be done in parallel.
- T018, T019, T020 in Polish are independent.

---

## Parallel Example: User Story 2

```bash
# Launch independent UI tasks together:
Task: "T011 Render the four ISIV dimensions as a static radar chart in src/app/components/CharityOnboardingFlow.tsx"
Task: "T012 Render per-dimension cards in src/app/components/CharityOnboardingFlow.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Submit assessment and confirm results view opens with real data
5. Demo/deploy if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test submit-to-results flow → Demo (MVP!)
3. Add User Story 2 → Test radar chart and dimension cards → Demo
4. Add User Story 3 → Test diagnosis/strengths/weaknesses → Demo
5. Add Polish → Test error/retry, duplicate prevention, and returning-user behavior → Demo

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (submit/fetch/results navigation)
   - Developer B: User Story 2 (radar chart + dimension cards)
   - Developer C: User Story 3 (diagnosis + strengths/weaknesses)
3. Stories complete and integrate into the same results view independently

---

## Notes

- [P] tasks = different files or independent UI sections, no runtime dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify the submit endpoint returns successfully before wiring the results fetch
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
