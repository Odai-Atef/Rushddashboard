# Tasks: Collaboration Hub Backend Integration

**Input**: Design documents from `specs/064-collaboration-hub-api/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/backend-api.md, quickstart.md

**Tests**: Not explicitly requested. Test tasks are omitted; the implementation can still be validated manually per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature branch context and align the collaboration route with the project ID requirement.

- [x] T001 Update `src/app/routes.tsx` to add required `:projectId` segment to `/dashboard/collaboration/:projectId/:view?` and default `view` to `hub`
- [x] T002 Update existing navigation links inside `src/app/components/ProjectCollaborationModule.tsx` that hardcode `/dashboard/collaboration/*` so they include the active `projectId`
- [x] T003 [P] Create `src/lib/formatters.ts` with `formatBytes(bytes: number): string` and `formatDateTime(iso: string | null): string` helpers

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can fetch live data.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Create `src/api/services/collaboration-service.ts` with types and service methods: `getProjectConversations`, `getProjectDiscussions`, `getProjectAttachments`
- [x] T005 [P] Add TypeScript interfaces in `src/api/services/collaboration-service.ts`: `Conversation`, `Discussion`, `Attachment`, `PaginatedResponse<T>`, filters, and enums
- [x] T006 [P] Create `src/lib/error-messages.ts` Arabic helper `getCollaborationErrorMessage(error)` modeled on existing `useProjectDetails` / `useProjects` mappings

**Checkpoint**: Foundation ready - service and shared error helpers exist; user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - View Live Project Conversations (Priority: P1) 🎯 MVP

**Goal**: Project team members see the Hub conversations panel populated from the backend instead of hardcoded mock data.

**Independent Test**: Navigate to `/dashboard/collaboration/:projectId/hub`; the conversations panel renders live conversations with title, status, last message, timestamp, and unread count. Empty and error states render correctly.

### Implementation for User Story 1

- [x] T007 [US1] Create `src/api/hooks/useProjectConversations.ts` with state, pagination, filters, and abort-cleanup logic
- [x] T008 [US1] Refactor the Conversations list in `src/app/components/ProjectCollaborationModule.tsx` to use `useProjectConversations`, removing the hardcoded `conversations` array
- [x] T009 [US1] Add loading skeleton, empty state, error state, and retry action for the conversations panel in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T010 [US1] Add "Load more" pagination button for conversations and wire it to `setPage` in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T011 [US1] Replace the Hub KPI stats derived from `conversations` with computed values from the live conversation list

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - View Live Project Discussions (Priority: P2)

**Goal**: Project stakeholders see the Hub discussions panel populated from the backend with section, status, pin state, reply count, and last reply timestamp.

**Independent Test**: Navigate to `/dashboard/collaboration/:projectId/hub`; the discussions panel renders live discussions grouped/labeled by section and supports section/status filtering if UI controls are present.

### Implementation for User Story 2

- [x] T012 [P] [US2] Create `src/api/hooks/useProjectDiscussions.ts` with state, pagination, filters, and abort-cleanup logic
- [x] T013 [US2] Refactor the Discussions view in `src/app/components/ProjectCollaborationModule.tsx` to use `useProjectDiscussions`, removing the hardcoded `discussions` array
- [x] T014 [US2] Add loading skeleton, empty state, error state, and retry action for the discussions panel in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T015 [US2] Add "Load more" pagination button for discussions and wire section/status filters to `setFilters`/`applyFilters` in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - View Live Project Attachments (Priority: P2)

**Goal**: Project team members see the Hub attachments panel populated from the backend with file name, size, type, stage, and upload timestamp.

**Independent Test**: Navigate to `/dashboard/collaboration/:projectId/hub`; the attachments panel renders real files with formatted size and supports type filtering if UI controls are present.

### Implementation for User Story 3

- [x] T016 [P] [US3] Create `src/api/hooks/useProjectAttachments.ts` with state, pagination, filters, and abort-cleanup logic
- [x] T017 [US3] Refactor the Attachments view in `src/app/components/ProjectCollaborationModule.tsx` to use `useProjectAttachments`, removing the hardcoded `attachments` array
- [x] T018 [US3] Add loading skeleton, empty state, error state, and retry action for the attachments panel in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T019 [US3] Add "Load more" pagination button for attachments and wire type filter to `setFilters`/`applyFilters` in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T020 [US3] Use `formatBytes` from `src/lib/formatters.ts` to render `fileSize` in the attachments grid/list

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional.

---

## Phase 6: User Story 4 - Consistent Loading, Error, and Pagination Experience (Priority: P3)

**Goal**: All three panels behave consistently for loading, error, empty, and paginated states without blocking each other.

**Independent Test**: Open the Hub with one panel forced to error and another forced to loading; each panel shows its own state and the rest of the Hub remains usable.

### Implementation for User Story 4

- [x] T021 [US4] Extract reusable `PanelLoading`, `PanelError`, `PanelEmpty`, and `LoadMoreButton` components into `src/app/components/collaboration/` and replace inline states in `src/app/components/ProjectCollaborationModule.tsx`
- [x] T022 [US4] Ensure each hook aborts in-flight requests on unmount or filter/page change in `useProjectConversations.ts`, `useProjectDiscussions.ts`, and `useProjectAttachments.ts`
- [x] T023 [US4] Verify each panel failure only affects itself by testing error injection in `src/app/components/ProjectCollaborationModule.tsx`

**Checkpoint**: All user stories should now be independently functional and consistent.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, type consistency, and removal of dead mock data.

- [x] T024 [P] Remove remaining unused mock arrays (`messages`, `revisions`, `notifications`) and unused interfaces from `src/app/components/ProjectCollaborationModule.tsx` if still present
- [x] T025 [P] Delete or move to tests any standalone mock-data files referenced by the collaboration module
- [x] T026 Run TypeScript compile check: `tsc --noEmit`
- [x] T027 Run quickstart.md validation steps in the dev environment
- [x] T028 Update AGENTS.md if plan path needs refreshing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but may share formatter/error helpers
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2 but may share formatter/error helpers
- **User Story 4 (P3)**: Can start after Phase 3, 4, and 5 - Requires all three panel implementations to standardize their loading/error/pagination UI

### Within Each User Story

- Models/types before hooks
- Hooks before component integration
- Core implementation before polish

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks marked [P] can run in parallel (within Phase 2).
- Once Foundational phase completes, US1, US2, and US3 can start in parallel if team capacity allows.
- T012 and T016 (discussion and attachment hooks) can be implemented in parallel with US1.

---

## Parallel Example: User Story 1

```bash
# Launch in parallel:
Task: "Create src/api/hooks/useProjectConversations.ts"
Task: "Update existing hardcoded links in src/app/components/ProjectCollaborationModule.tsx"

# Then sequential UI wiring:
Task: "Refactor conversations list in src/app/components/ProjectCollaborationModule.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (conversations)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (conversations) → Test independently
3. US2 (discussions) → Test independently
4. US3 (attachments) → Test independently
5. US4 (consistent UX) → Test all panels together
6. Polish → Type-check, remove mocks, run quickstart validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (conversations)
   - Developer B: US2 (discussions)
   - Developer C: US3 (attachments)
3. A fourth developer prepares US4 reusable components once any panel is complete
4. Stories integrate independently via shared service and helpers

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test tasks are included because tests were not explicitly requested
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
