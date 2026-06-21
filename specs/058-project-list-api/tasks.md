# Tasks: Project List API Integration

**Input**: Design documents from `/specs/058-project-list-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing codebase for the project list API integration.

- [ ] T001 Extend `src/api/services/project-service.ts` with `getProjects(params)` and `getProjectById(id)` method signatures
- [ ] T002 Create `src/api/hooks/useProjects.ts` file
- [ ] T003 [P] Extend `src/app/pages/project-management/project-types.ts` with `ProjectListResponse`, `ProjectFilters`, and related request types

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core service and hook infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Implement `ProjectService.getProjects(params)` in `src/api/services/project-service.ts` calling `apiClient.get('/api/v1/projects', { params })`
- [ ] T005 Implement `ProjectService.getProjectById(id)` in `src/api/services/project-service.ts` calling `apiClient.get(`/api/v1/projects/${id}`)`
- [ ] T006 Implement `useProjects` hook in `src/api/hooks/useProjects.ts` exposing `{ projects, pagination, filters, isLoading, error, setPage, setLimit, setFilters, applyFilters, clearFilters, refetch }`
- [ ] T007 Add Arabic error mapping in `useProjects.ts` for list load, details load, 401, 500, and timeout/network errors
- [ ] T008 Add parallel details fetching in `useProjects.ts` for project IDs returned by the list endpoint
- [ ] T009 Add pagination reset logic in `useProjects.ts` when filters, search, or page size change

**Checkpoint**: Foundation ready — service, registry, and hook are present and usable; user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - View paginated list of projects (Priority: P1) 🎯 MVP

**Goal**: Allow an authenticated user to open `/dashboard/project-management/list` and see a paginated list of projects loaded from `/api/v1/projects`.

**Independent Test**: Open `/dashboard/project-management/list`, verify a `GET /api/v1/projects?page=1&limit=10` request is made, and verify that project rows/cards/timeline items render using data from the API.

### Implementation for User Story 1

- [ ] T010 [US1] Refactor `src/app/pages/project-management/ProjectListPage.tsx` to use `useProjects`
- [ ] T011 [US1] Replace the mock `filteredProjects` source with `projects` from `useProjects`
- [ ] T012 [P] [US1] Add pagination controls to `ProjectListPage.tsx` driven by `pagination` from `useProjects`
- [ ] T013 [P] [US1] Add empty-state UI to `ProjectListPage.tsx` when `total` is zero
- [ ] T014 [US1] Show a single loading spinner over the list area while `isLoading` is true
- [ ] T015 [US1] On out-of-range page, silently redirect to the last available page using `pagination.totalPages`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Filter and search the project list (Priority: P1)

**Goal**: Allow users to filter by status, organization, manager, health, type, category and search by keywords, applying changes only after an explicit action.

**Independent Test**: Select each filter and enter a search term, click Apply/Search, and confirm the API request includes the corresponding query parameters and the displayed list updates.

### Implementation for User Story 2

- [ ] T016 [US2] Add filter state UI for `status`, `organizationId`, `managerId`, `health`, `type`, and `category` in `ProjectListPage.tsx`
- [ ] T017 [US2] Wire filter inputs to `setFilters` from `useProjects`
- [ ] T018 [US2] Add Apply action that calls `applyFilters()` and resets page to 1
- [ ] T019 [US2] Add Search action for the `search` field that calls `applyFilters()`
- [ ] T020 [US2] Add Clear action that calls `clearFilters()` and reloads the default list
- [ ] T021 [P] [US2] Ensure only non-empty filter values are included in the API request

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Navigate through pages (Priority: P2)

**Goal**: Allow users to move between pages and change page size, with the request reflecting the chosen values.

**Independent Test**: Click next/previous page controls and select a different page size, confirming the API request uses the chosen `page` and `limit` values.

### Implementation for User Story 3

- [ ] T022 [US3] Wire next/previous page controls in `ProjectListPage.tsx` to `setPage`
- [ ] T023 [US3] Add page-size selector to `ProjectListPage.tsx` wired to `setLimit`
- [ ] T024 [US3] Ensure changing page size resets to `page=1`
- [ ] T025 [US3] Ensure applying filters while on a later page resets to `page=1`
- [ ] T026 [P] [US3] Preserve existing table, kanban, and timeline view toggles and rendering

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation.

- [ ] T027 [P] Run `npm run build` and fix any errors introduced by the new service/hook/page changes
- [ ] T028 [P] Verify the quickstart.md test scenarios manually against a running dev server
- [ ] T029 [P] Update inline code comments/TSDoc for `ProjectService`, `useProjects`, and updated page components
- [ ] T030 [P] Ensure existing navigation from list items to `/dashboard/project-management/details/:id` still works

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
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Builds on US1 list rendering but is independently testable.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). Primarily pagination/UX validation.

### Within Each User Story

- UI state before service call.
- Service/hook integration before navigation/feedback behavior.
- Core implementation before edge-case handling.
- Story complete before moving to next priority.

### Parallel Opportunities

- T001, T002, T003 (Setup) can run in parallel.
- T004 and T005 (service methods) can be drafted in parallel.
- T012, T013, T014, T015 (US1 pagination/loading/empty) can be done in parallel with each other once list data flows.
- T016 through T021 (US2 filters) can be split across UI and hook in parallel.
- T027, T029, T030 (Polish) can run in parallel once implementation is stable.

---

## Parallel Example: User Story 1

```bash
# Launch list UI updates in parallel:
Task: "T012 [P] [US1] Add pagination controls"
Task: "T013 [P] [US1] Add empty-state UI"
Task: "T014 [US1] Show loading spinner"
Task: "T015 [US1] Handle out-of-range page"

# Then wire data flow:
Task: "T010 [US1] Refactor ProjectListPage to use useProjects"
Task: "T011 [US1] Replace mock filteredProjects source"
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
   - Developer A: User Story 1 + pagination/loading
   - Developer B: User Story 2 + filter/search UI
   - Developer C: User Story 3 + view preservation
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
