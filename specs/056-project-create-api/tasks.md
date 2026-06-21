# Tasks: Project Create API Integration

**Input**: Design documents from `/specs/056-project-create-api/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/project-create-contract.md, quickstart.md

**Tests**: Not requested for this feature. The project currently has no automated test harness; validation is manual via the dev server and production build.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify existing patterns by reading `src/api/client.ts`, `src/api/services/index.ts`, `src/api/types.ts`, and `src/app/pages/project-management/ProjectCreatePage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 [P] Create `src/api/services/project-service.ts` with `CreateProjectDto`, `ProjectResponse`, and `projectService.createProject` method calling `POST /api/v1/projects` via `apiClient`
- [ ] T003 [P] Register `ProjectService` in `src/api/services/index.ts` service registry and re-export it
- [ ] T004 [P] Verify TypeScript compiles after the new service module and registry changes by running `npm run build`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Submit a new project through the create page (Priority: P1) 🎯 MVP

**Goal**: Allow a user to fill out the project creation form and persist the project via `POST /api/v1/projects`, then navigate to the project list on success.

**Independent Test**: Open `/dashboard/project-management/create`, fill every required field with valid values, submit, and verify in DevTools that `POST /api/v1/projects` is called and returns `201`; the app then navigates to `/dashboard/project-management/list`.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Add `startDate` and `endDate` date inputs to the form in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T006 [P] [US1] Rename local state fields to match the API contract (`managerId`, `organizationId`) and remove the `duration` field in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T007 [US1] Implement `handleSubmit` in `src/app/pages/project-management/ProjectCreatePage.tsx` that converts form state to `CreateProjectDto` (including `currencyCode: "SAR"` and numeric `budget`) and calls `projectService.createProject`
- [ ] T008 [US1] Add `isSubmitting` state and disable the submit button while the request is in flight in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T009 [US1] On API success, show a brief success indicator and navigate to `/dashboard/project-management/list` in `src/app/pages/project-management/ProjectCreatePage.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive clear feedback when project creation fails (Priority: P1)

**Goal**: Display helpful, field-level and page-level error messages when the API returns validation or server errors, and preserve form values for retry.

**Independent Test**: Trigger a 400 validation error or disconnect the backend, submit the form, and confirm error messages appear while the entered values remain in the form.

### Implementation for User Story 2

- [ ] T010 [US2] Implement client-side required-field validation before calling the API in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T011 [P] [US2] Add `error` state and inline validation error display next to each field in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T012 [P] [US2] Map `ApiError.errors` field-level errors to the corresponding form inputs and display a page-level message for non-field errors in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T013 [US2] Preserve form values when any API error occurs so the user can correct and resubmit in `src/app/pages/project-management/ProjectCreatePage.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Maintain existing form behavior while adding persistence (Priority: P2)

**Goal**: Keep the existing page layout, labels, navigation, and draft-save behavior intact after API integration.

**Independent Test**: Compare the create page rendering and navigation before and after the change; confirm back/cancel buttons still go to `/dashboard/project-management/list` and the draft-save button does not call the create API.

### Implementation for User Story 3

- [ ] T014 [P] [US3] Ensure existing field labels, layout, and styling remain unchanged after adding new date fields and id-based selectors in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T015 [US3] Keep the cancel and back navigation actions routing to `/dashboard/project-management/list` in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T016 [US3] Keep the draft-save action as a no-op or local-only action and ensure it does not invoke `projectService.createProject` in `src/app/pages/project-management/ProjectCreatePage.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T017 [P] Run production build (`npm run build`) and fix any TypeScript or Vite errors introduced by the integration
- [ ] T018 [P] Run the dev server and perform a manual end-to-end walkthrough of create, validation error, server error, success navigation, cancel, and draft save flows
- [ ] T019 [P] Update `specs/056-project-create-api/quickstart.md` if any validation steps or ports changed during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Builds on the submit handler from US1 but focuses on error handling and can be implemented independently once T007 is complete
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Focuses on preserving existing behavior and can be validated independently

### Within Each User Story

- UI field changes before submit handler wiring
- Submit handler before success/error feedback
- Core implementation before integration validation
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003, and T004 in the Foundational phase can run in parallel.
- T005 and T006 in User Story 1 can run in parallel (different state/input areas of the same component).
- T011 and T012 in User Story 2 can run in parallel once T010 is complete.
- T014, T015, and T016 in User Story 3 can run in parallel.
- T017, T018, and T019 in the Polish phase can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch UI field tasks together:
Task: "Add startDate and endDate date inputs in src/app/pages/project-management/ProjectCreatePage.tsx"
Task: "Rename local state fields and remove duration in src/app/pages/project-management/ProjectCreatePage.tsx"

# Then wire the submit handler and loading state:
Task: "Implement handleSubmit and call projectService.createProject in src/app/pages/project-management/ProjectCreatePage.tsx"
Task: "Add isSubmitting state and disable submit button in src/app/pages/project-management/ProjectCreatePage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently via the dev server
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test error handling independently → Deploy/Demo
4. Add User Story 3 → Verify existing behavior preserved → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently; final Polish phase validates the whole feature.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify the build passes after each phase
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
