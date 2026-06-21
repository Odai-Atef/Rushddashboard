# Tasks: Project Dashboard Summary API Integration

**Input**: Design documents from `/specs/059-project-dashboard-summary/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are not explicitly requested in the feature specification. Type-check validation via `npm run build` is used instead.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the dashboard summary hook endpoint integration and shared types.

- [x] T001 [P] Add `getProjectDashboardSummary` method to `src/api/services/project-service.ts` calling `GET /api/v1/projects/dashboard/summary`
- [x] T002 [P] Add `ProjectDashboardData` types and API response interfaces to `src/api/services/project-service.ts` or a shared types file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the reusable hook that all dashboard UI will depend on.

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete.

- [x] T003 Create `useProjectDashboard` hook in `src/api/hooks/useProjectDashboard.ts` with loading, error, and cancellation handling
- [x] T004 Add Arabic relative-time helper using `date-fns/ar` in `src/api/hooks/useProjectDashboard.ts` or a shared utility file

**Checkpoint**: Hook fetches dashboard summary, exposes `{ data, isLoading, error }`, and cancels on unmount.

---

## Phase 3: User Story 1 - View Live Project Statistics (Priority: P1) 🎯 MVP

**Goal**: Render live stat counts from the API in the top dashboard cards.

**Independent Test**: Open `/dashboard/project-management`; confirm stat card numbers match the backend `stats` response and differ from old hardcoded values.

### Implementation for User Story 1

- [x] T005 [US1] Import `useProjectDashboard` into `src/app/pages/project-management/ProjectDashboardPage.tsx`
- [x] T006 [US1] Add loading spinner and Arabic error state to `ProjectDashboardPage.tsx`
- [x] T007 [P] [US1] Replace hardcoded stat counts in `ProjectDashboardPage.tsx` with values from `data.stats`

**Checkpoint**: User Story 1 is independently testable: stat cards show live API numbers.

---

## Phase 4: User Story 2 - Visualize Project Status Distribution (Priority: P1)

**Goal**: Render the status distribution pie chart from the API.

**Independent Test**: The pie chart displays slices matching `statusDistribution` from the API.

### Implementation for User Story 2

- [x] T008 [P] [US2] Replace hardcoded `statusDistribution` array in `ProjectDashboardPage.tsx` with `data.statusDistribution`
- [x] T009 [US2] Add empty-state placeholder for the pie chart when `statusDistribution` is empty

**Checkpoint**: User Stories 1 and 2 both work; stat cards and pie chart are API-driven.

---

## Phase 5: User Story 3 - Monitor Budget Trend and Recent Activity (Priority: P2)

**Goal**: Render the budget trend line chart and recent activity feed from the API.

**Independent Test**: The line chart plots `budgetTrend`; the activity feed shows entries with Arabic relative time.

### Implementation for User Story 3

- [x] T010 [P] [US3] Replace hardcoded `budgetTrend` array in `ProjectDashboardPage.tsx` with `data.budgetTrend`
- [x] T011 [P] [US3] Replace hardcoded `recentActivity` array in `ProjectDashboardPage.tsx` with `data.recentActivity` and apply Arabic relative-time formatting
- [x] T012 [US3] Handle invalid/future timestamps gracefully without crashing

**Checkpoint**: User Stories 1, 2, and 3 work; charts and activity feed are API-driven.

---

## Phase 6: User Story 4 - Track Upcoming Deadlines (Priority: P2)

**Goal**: Render upcoming deadlines with priority badges from the API.

**Independent Test**: The deadlines list shows API entries with project name, date, days left, and priority badge.

### Implementation for User Story 4

- [x] T013 [P] [US4] Replace hardcoded `upcomingDeadlines` array in `ProjectDashboardPage.tsx` with `data.upcomingDeadlines`
- [x] T014 [US4] Add empty-state placeholder when `upcomingDeadlines` is empty

**Checkpoint**: All four user stories work independently.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Remove legacy hardcoded data and ensure build/type safety.

- [x] T015 Remove `import { projects } from './project-data';` from `ProjectDashboardPage.tsx`
- [x] T016 [P] Remove remaining `findProjectById`/`projects` imports from `ProjectActivityPage.tsx`, `ProjectLifecyclePage.tsx`, and `ProjectVersionsPage.tsx` OR replace them with API-backed lookups
- [x] T017 Delete `src/app/pages/project-management/project-data.ts` after confirming no imports remain
- [x] T018 Run `npm run build` and fix any TypeScript errors
- [x] T019 Update `AGENTS.md` plan reference if any task or spec paths changed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of US1 except shared hook
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent

### Within Each User Story

- UI components before integration
- Empty/error states after primary render path
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 can run in parallel (different concerns in the same service file).
- All user story UI tasks can run in parallel once the hook is ready.
- T016 deadline replacement and T014 activity replacement can run in parallel.
- T016 (other pages) can run in parallel with dashboard UI changes, but must complete before T017 deletes `project-data.ts`.

---

## Parallel Example: User Story 1

```bash
# Launch all UI tasks for User Story 1 together:
Task: "T005 [US1] Import useProjectDashboard into ProjectDashboardPage.tsx"
Task: "T006 [US1] Add loading spinner and Arabic error state to ProjectDashboardPage.tsx"
Task: "T007 [P] [US1] Replace hardcoded stat counts in ProjectDashboardPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Open the dashboard and confirm stat cards show live numbers
5. Continue to User Stories 2-4 only after MVP validation

### Incremental Delivery

1. Complete Setup + Foundational → Hook ready
2. Add User Story 1 → Stat cards live → Validate
3. Add User Story 2 → Pie chart live → Validate
4. Add User Story 3 → Budget trend + activity live → Validate
5. Add User Story 4 → Deadlines live → Validate
6. Polish: remove `project-data.ts` and verify build

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once hook is ready:
   - Developer A: User Story 1 (stat cards)
   - Developer B: User Story 2 (pie chart)
   - Developer C: User Story 3 (line chart + activity)
   - Developer D: User Story 4 (deadlines)
3. One developer handles cross-cutting cleanup (T016-T019) after stories complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
