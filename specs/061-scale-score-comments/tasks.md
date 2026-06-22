# Tasks: Scale Score Descriptions

**Input**: Design documents from `/specs/061-scale-score-comments/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are NOT included because the feature specification does not request TDD and the project has no configured test runner.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing project setup is sufficient; no new dependencies required.

- [x] T001 Verify Vite + React dev environment works by running `npm run dev` from repo root.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared API types and service method used by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 [P] Add `EvaluationComment` and `EvaluationCommentsMap` TypeScript interfaces to `src/api/services/onboarding-service.ts`.
- [x] T003 [P] Add `getEvaluationComments(organizationId: string)` method to `OnboardingService` in `src/api/services/onboarding-service.ts` calling `GET /api/v1/onboarding/evaluation-comments`.
- [x] T004 Add a `useEvaluationComments(organizationId: string | undefined)` hook in `src/api/hooks/useEvaluationComments.ts` with loading/error state and `AbortController` cleanup.

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - View Contextual Score Descriptions (Priority: P1) 🎯 MVP

**Goal**: When the user hovers over or selects a score on a SCALE question, display the dynamic comment for that question and score.

**Independent Test**: Open `/dashboard/onboarding/assessment?organizationId={id}`, hover over a score, and see a backend-provided description instead of the current hard-coded Arabic text.

### Implementation for User Story 1

- [x] T005 [US1] Remove the hard-coded `getScaleDescription` placeholder from `src/app/pages/onboarding/AssessmentPage.tsx`.
- [x] T006 [US1] Call `useEvaluationComments(activeOrganizationId)` inside `AssessmentPage` and pass comments map to scale rendering.
- [x] T007 [US1] Update the scale rendering in `src/app/pages/onboarding/AssessmentPage.tsx` to look up `commentAr` by `questionId` + score-to-tier mapping (1 → CRITICAL, 2 → EMERGING, 3 → MEDIUM, 4 → ADVANCED, 5 → PIONEER) on hover/selection.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Display Localized Comment Text (Priority: P2)

**Goal**: Score descriptions respect the user's selected language (Arabic or English).

**Independent Test**: With both `commentAr` and `commentEn` available, the UI displays the text matching the active application language and falls back gracefully when one language is missing.

### Implementation for User Story 2

- [x] T008 [US2] Add a language-agnostic helper in `src/app/pages/onboarding/AssessmentPage.tsx` (or a small utility in `src/app/utils/`) that returns `commentAr` first, then `commentEn` if Arabic is missing.
- [x] T009 [US2] Ensure the selected/returned comment text renders in the correct direction/font for the current page language (RTL Arabic is the current default).

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Graceful Fallback When Comments Are Missing (Priority: P3)

**Goal**: Assessment page remains usable if comments are missing, partial, or the API fails.

**Independent Test**: Block the evaluation-comments endpoint or request a question without comments; the page still loads, scores are selectable, and no error toast/modal blocks the user.

### Implementation for User Story 3

- [x] T010 [US3] Ensure `useEvaluationComments` does NOT throw or set global error state that blocks `AssessmentPage` rendering.
- [x] T011 [US3] In `src/app/pages/onboarding/AssessmentPage.tsx`, only render the description element when a matching comment exists; otherwise hide it cleanly.
- [x] T012 [US3] Add defensive checks so missing tiers or missing question entries return `null`/empty description without runtime errors.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, performance, and documentation polish.

- [x] T013 [P] Verify score descriptions appear within 1 second of hover/select in the browser (network + render time).
- [x] T014 [P] Run TypeScript/build checks with `npm run build` and fix any errors.
- [x] T015 [P] Update `specs/061-scale-score-comments/quickstart.md` if any run/verify steps changed during implementation.
- [x] T016 Run the quickstart.md validation steps manually in the browser.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed).
  - Or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2). Builds on US1 scale rendering but is independently testable.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2). Builds on US1/US2 but is independently testable by simulating API failure.

### Within Each User Story

- Core implementation before integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- T002 and T003 can run in parallel (same file but different additions).
- T005, T008, and T010 can run in parallel once T004 is done (different files/areas).
- T013, T014, and T015 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# After Foundational phase is complete:
Task T005: Remove hard-coded placeholder in src/app/pages/onboarding/AssessmentPage.tsx
Task T006: Wire useEvaluationComments hook in src/app/pages/onboarding/AssessmentPage.tsx
Task T007: Update scale rendering in src/app/pages/onboarding/AssessmentPage.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently in the browser.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo.
4. Add User Story 3 → Test independently → Deploy/Demo.
5. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
