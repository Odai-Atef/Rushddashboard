# Tasks: Save Assessment Answers

**Input**: Design documents from `/specs/034-save-assessment-answers/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested. No test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare existing codebase for the feature; no new project scaffolding needed.

- [x] T001 Reviewed `src/api/services/onboarding-service.ts` and `src/app/components/CharityOnboardingFlow.tsx` to confirm integration points.
- [x] T002 [P] Confirmed `sonner` is available for toast error messages (already in `package.json` dependencies).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the API contract types and service methods that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Added `SaveAnswerPayload` and `SavedAnswer` interfaces to `src/api/services/onboarding-service.ts`.
- [x] T004 Added `getAssessmentState` method to `src/api/services/onboarding-service.ts` (GET /api/v1/onboarding/assessment/state?organizationId={id}).
- [x] T005 Added `saveAssessmentAnswers` method to `src/api/services/onboarding-service.ts` (PUT /api/v1/onboarding/assessment/answers with `{ answers: [...] }` payload).
- [x] T006 Exported the new interfaces; `src/api/services/index.ts` re-exports `OnboardingService` which now includes the new methods.

**Checkpoint**: Foundation ready - the service layer can save and load assessment answers.

---

## Phase 3: User Story 1 - Persist Assessment Answers on Progression (Priority: P1) 🎯 MVP

**Goal**: Save answers to the backend when the user clicks Next or Submit, navigate forward on success, and preserve answers on failure.

**Independent Test**: Enter answers in an assessment category, click Next, verify a PUT request is sent to `/api/v1/onboarding/assessment/answers` with `{ answers: [...] }`, and verify the UI advances on success or stays with an error on failure.

### Implementation for User Story 1

- [x] T007 [US1] Implemented `buildSaveAnswerPayloads` helper in `src/app/components/CharityOnboardingFlow.tsx` that converts state values into `SaveAnswerPayload[]` based on `questionType`.
- [x] T008 [US1] Wired `handleAssessmentNext` in `src/app/components/CharityOnboardingFlow.tsx` to collect answers in the current submission scope and call `onboardingService.saveAssessmentAnswers`.
- [x] T009 [US1] Handled successful save: navigate to the next assessment category or documents step from `src/app/components/CharityOnboardingFlow.tsx`.
- [x] T010 [US1] Handled save failure: shows toast error via `sonner`, keeps the user on the assessment screen, and preserves answers in local state.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Restore Saved Answers on Return (Priority: P1)

**Goal**: Load previously saved answers when the assessment screen mounts and pre-fill inputs so returning users can continue where they left off.

**Independent Test**: Save answers, navigate away, return to the assessment, and verify all inputs are pre-filled and answered questions appear completed.

### Implementation for User Story 2

- [x] T011 [US2] Added mount effect in `src/app/components/CharityOnboardingFlow.tsx` to call `onboardingService.getAssessmentState(organizationId)` and flatten answers from `categories[].answers[]`.
- [x] T012 [US2] Implemented `mergeSavedAnswers` to convert flattened state answers into local state keyed by `questionId`, preserving local edits.
- [x] T013 [US2] Updated input rendering in `src/app/components/CharityOnboardingFlow.tsx` so SCALE, YES_NO, MULTIPLE_CHOICE, and FILE_UPLOAD questions display loaded values correctly.
- [x] T014 [US2] Added a green checkmark "completed" indicator for answered questions.
- [x] T015 [US2] Handled load failure: shows an inline error banner while keeping the form usable for new answers.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Validate Required Questions Before Saving (Priority: P2)

**Goal**: Prevent progression when required questions in the current scope are unanswered, scroll to the first missing answer, and allow optional questions to be skipped.

**Independent Test**: Leave a required question blank, click Next, and verify an error appears, the page scrolls to the question, and no save request is sent.

### Implementation for User Story 3

- [x] T016 [US3] Implemented `findUnansweredRequiredQuestions` helper in `src/app/components/CharityOnboardingFlow.tsx` that checks required questions regardless of `questionType`.
- [x] T017 [US3] In `handleAssessmentNext`, validated only the questions in the current category scope and built a list of unanswered required questions.
- [x] T018 [US3] If validation fails, shows a toast error and scrolls the first unanswered required question into view in `src/app/components/CharityOnboardingFlow.tsx`.
- [x] T019 [US3] Ensured optional unanswered questions do not block validation or saving.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve robustness and consistency across all stories.

- [x] T020 [P] Added loading states: `isSavingAnswers` disables the Next button and shows a spinner; `isLoadingAssessment` already existed for load operations in `src/app/components/CharityOnboardingFlow.tsx`.
- [x] T021 [P] Stale saved answers are naturally ignored during merge because only questions existing in `assessmentCategories` are rendered; orphaned answers remain in state harmlessly.
- [x] T022 Updated `specs/034-save-assessment-answers/quickstart.md` to reflect the actual in-component helper implementation.
- [x] T023 Ran `npm run build` successfully with no TypeScript errors.
- [x] T024 Manual browser walkthrough documented in quickstart.md is ready for validation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational phase.
  - User Story 1 (P1) is the MVP and should be completed first.
  - User Story 2 (P1) can follow US1 or be done in parallel after foundational work.
  - User Story 3 (P2) can follow US1/US2.
- **Polish (Phase 6)**: Depends on all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Requires Phase 2 service methods. No dependency on US2 or US3.
- **User Story 2 (P1)**: Requires Phase 2 service methods and US1 save behavior (to create test data), but the restore logic is independently implementable.
- **User Story 3 (P2)**: Builds on the same state and handler added in US1; can be implemented independently once foundational types exist.

### Within Each User Story

- Helpers/models before handler wiring.
- Handler wiring before navigation/error handling.
- Core behavior before polish tasks.

### Parallel Opportunities

- T003, T004, T005, T006 (Foundational) are sequential within the same file but can be committed as one unit.
- T007, T008, T009, T010 (US1) can be split across two files: utility file (T007) and component file (T008-T010).
- T011 through T015 (US2) and T016 through T019 (US3) can be worked on in parallel if the foundational service and state shape are stable.
- T020, T021, T022, T023, T024 (Polish) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch in parallel after Foundational phase:
Task T007: Implement answer-to-payload mapping helper in src/app/utils/assessment-answers.ts
Task T008: Wire Next/Submit handler in src/app/components/CharityOnboardingFlow.tsx
```

```bash
# Then launch in parallel:
Task T009: Handle successful save navigation in src/app/components/CharityOnboardingFlow.tsx
Task T010: Handle save failure with toast and preserved state in src/app/components/CharityOnboardingFlow.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational service methods.
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Manually test save success and failure paths.
5. Demo the MVP.

### Incremental Delivery

1. Setup + Foundational → Foundation ready.
2. User Story 1 → Test independently → Demo (MVP!).
3. User Story 2 → Test independently → Demo.
4. User Story 3 → Test independently → Demo.
5. Polish → Final validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (save flow)
   - Developer B: User Story 2 (restore flow)
   - Developer C: User Story 3 (validation flow)
3. Polish together after all stories are functional.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
