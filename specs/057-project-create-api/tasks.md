# Tasks: Project Create API Integration

**Input**: Design documents from `/specs/057-project-create-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing codebase for the new project create API integration.

- [ ] T001 Create `src/api/services/project-service.ts` file and add it to `src/api/services/index.ts` registry
- [ ] T002 Create `src/api/hooks/useProjectCreate.ts` file
- [ ] T003 [P] Extend `src/app/pages/project-management/project-types.ts` with `CreateProjectDto` and `CreatedProjectResponse` interfaces

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core service and hook infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Implement `ProjectService` in `src/api/services/project-service.ts` with `createProject(dto: CreateProjectDto)` calling `apiClient.post('/api/v1/projects', dto)`
- [ ] T005 Wire `ProjectService` export into `src/api/services/index.ts` service registry
- [ ] T006 Implement `useProjectCreate` hook in `src/api/hooks/useProjectCreate.ts` exposing `{ create, isLoading, error, fieldErrors, clearError, clearFieldError }`
- [ ] T007 Add Arabic error mapping in `useProjectCreate.ts` for 400, 401 (handled by `apiClient`), 500, and timeout/network errors
- [ ] T008 Add duplicate-submission guard and `AbortSignal` handling in `useProjectCreate.ts`

**Checkpoint**: Foundation ready — service, registry, and hook are present and usable; user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Submit a new project through the create page (Priority: P1) 🎯 MVP

**Goal**: Allow an authenticated user to fill out the project creation form at `/dashboard/project-management/create`, submit it to `/api/v1/projects`, and have the project persisted.

**Independent Test**: Enter valid data in every field on the create page, click **إنشاء المشروع**, verify a `POST /api/v1/projects` request is made, and verify navigation to `/dashboard/project-management/details/:id`.

### Implementation for User Story 1

- [ ] T009 [US1] Refactor `src/app/pages/project-management/ProjectCreatePage.tsx` to use `useProjectCreate`
- [ ] T010 [P] [US1] Replace the single `duration` text input with `startDate` and `endDate` date inputs in `ProjectCreatePage.tsx`
- [ ] T011 [P] [US1] Add hidden/default `currencyCode` value of `"SAR"` to the form state in `ProjectCreatePage.tsx`
- [ ] T012 [US1] Wire the **إنشاء المشروع** submit button to `create()` instead of direct navigation
- [ ] T013 [US1] Build `CreateProjectDto` payload from form state, mapping `budget` to a number and `organization` selection to `organizationId`
- [ ] T014 [US1] On success, navigate to `/dashboard/project-management/details/${response.data.id}` in `ProjectCreatePage.tsx`
- [ ] T015 [US1] On success without `id`, navigate to `/dashboard/project-management/list` and show a warning toast/message
- [ ] T016 [P] [US1] Show inline loading state on the submit button while `isLoading` is true

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Receive clear feedback when project creation fails (Priority: P1)

**Goal**: Display actionable, Arabic-language feedback for validation, server, and network errors without clearing user-entered data.

**Independent Test**: Trigger each failure mode and confirm the user sees the correct inline or global error and can retry without re-entering data.

### Implementation for User Story 2

- [ ] T017 [US2] Display inline validation errors returned by the API next to corresponding fields in `ProjectCreatePage.tsx`
- [ ] T018 [US2] Show a global Arabic error banner/toast for server (500) and network/timeout errors in `ProjectCreatePage.tsx`
- [ ] T019 [US2] Preserve form state after validation/server errors so the user can correct and resubmit
- [ ] T020 [US2] Add retry behavior: allow a second click of **إنشاء المشروع** once the previous request completes or fails
- [ ] T021 [P] [US2] Clear field-level error for a field when the user edits it

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Maintain existing form behavior while adding persistence (Priority: P2)

**Goal**: Preserve current layout, field labels, navigation, and draft-save behavior while adding persistence.

**Independent Test**: Visually compare the create page before and after the change and confirm that cancel/back navigation and draft-save remain unchanged and that the form layout is preserved.

### Implementation for User Story 3

- [ ] T022 [US3] Ensure the **إلغاء** button still navigates to `/dashboard/project-management/list` in `ProjectCreatePage.tsx`
- [ ] T023 [US3] Ensure the back arrow link still navigates to `/dashboard/project-management/list` in `ProjectCreatePage.tsx`
- [ ] T024 [US3] Keep **حفظ كمسودة** as a no-op or independent action that does not call the create API
- [ ] T025 [P] [US3] Preserve existing Arabic labels, placeholders, and Tailwind styling in `ProjectCreatePage.tsx`
- [ ] T026 [US3] Verify the page still renders correctly at `/dashboard/project-management/create` and does not flash on initial load

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation.

- [ ] T027 [P] Run TypeScript type check (`npx tsc --noEmit` or `pnpm build`) and fix any errors introduced by the new service/hook/page changes
- [ ] T028 [P] Run `pnpm run build` and confirm the production build succeeds
- [ ] T029 Verify the quickstart.md test scenarios manually against a running dev server
- [ ] T030 [P] Update inline code comments/TSDoc for `ProjectService`, `useProjectCreate`, and updated page components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed) or sequentially in priority order (P1 → P2).
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Builds on US1 error-state plumbing but is independently testable.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). Primarily regression/UX validation.

### Within Each User Story

- UI state before service call.
- Service/hook integration before navigation/feedback behavior.
- Core implementation before edge-case handling.
- Story complete before moving to next priority.

### Parallel Opportunities

- T001, T002, T003 (Setup) can run in parallel.
- T004–T008 (Foundational) are mostly sequential because of hook/service coupling, but T004 and T006 can be drafted in parallel.
- T010 and T011 (US1 date inputs and currency default) can be done in parallel with each other.
- T017–T021 (US2 error handling) can be split across the form UI and the hook in parallel.
- T025 and T026 (US3 styling and route rendering) can be done in parallel.
- T027, T028, T030 (Polish) can run in parallel once implementation is stable.

---

## Parallel Example: User Story 1

```bash
# Launch UI field updates in parallel:
Task: "T010 [P] [US1] Replace duration input with start/end date inputs"
Task: "T011 [P] [US1] Add default SAR currencyCode value"
Task: "T016 [P] [US1] Show inline loading state on submit button"

# Then wire submission:
Task: "T012 [US1] Wire submit button to create()"
Task: "T013 [US1] Build CreateProjectDto payload"
Task: "T014 [US1] Navigate to new project details on success"
Task: "T015 [US1] Navigate to list with warning when id missing"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently via the quickstart.md scenarios.
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
   - Developer A: User Story 1 + navigation
   - Developer B: User Story 2 + error feedback
   - Developer C: User Story 3 + regression verification
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
