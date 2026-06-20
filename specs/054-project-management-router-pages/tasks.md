---

description: "Task list for converting project management views into routable pages"
---

# Tasks: Project Management Router Pages

**Input**: Design documents from `specs/054-project-management-router-pages/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested. This feature will be validated manually per `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the directory structure and prepare the existing component for extraction.

- [ ] T001 Create `src/app/pages/project-management/` directory for new page components
- [ ] T002 Create a shared types/utilities file `src/app/pages/project-management/project-types.ts` to hold shared `Project`, `ProjectStatus`, `ProjectVersion`, `ActivityItem`, and `statusConfig`/`healthConfig` definitions reused across pages

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extract reusable project data and helpers so all routable pages can render independently.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Extract shared mock project data and helper configs from `src/app/components/ProjectManagementModule.tsx` into `src/app/pages/project-management/project-data.ts`
- [ ] T004 Create a `ProjectNotFound` component in `src/app/pages/project-management/ProjectNotFound.tsx` that displays an error message and a link back to `/dashboard/project-management/list`

**Checkpoint**: Foundation ready - page components can import shared data and render an invalid-project error state.

---

## Phase 3: User Story 1 - Navigate directly to a project management sub-page (Priority: P1) 🎯 MVP

**Goal**: Every project management view is reachable via a stable URL under `/dashboard/project-management/*` and renders directly.

**Independent Test**: Open each route directly in the browser (per `quickstart.md`) and confirm the expected screen renders without visiting the dashboard first.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create `src/app/pages/project-management/ProjectDashboardPage.tsx` by extracting the `DashboardView` from `src/app/components/ProjectManagementModule.tsx`
- [ ] T006 [P] [US1] Create `src/app/pages/project-management/ProjectListPage.tsx` by extracting the `ListView` from `src/app/components/ProjectManagementModule.tsx`
- [ ] T007 [P] [US1] Create `src/app/pages/project-management/ProjectCreatePage.tsx` by extracting the `CreateView` from `src/app/components/ProjectManagementModule.tsx`
- [ ] T008 [P] [US1] Create `src/app/pages/project-management/ProjectDetailsPage.tsx` by extracting the `DetailsView` from `src/app/components/ProjectManagementModule.tsx` and reading `projectId` from `useParams`
- [ ] T009 [P] [US1] Create `src/app/pages/project-management/ProjectLifecyclePage.tsx` by extracting the `LifecycleView` from `src/app/components/ProjectManagementModule.tsx` and reading `projectId` from `useParams`
- [ ] T010 [P] [US1] Create `src/app/pages/project-management/ProjectVersionsPage.tsx` by extracting the `VersionsView` from `src/app/components/ProjectManagementModule.tsx` and reading `projectId` from `useParams`
- [ ] T011 [P] [US1] Create `src/app/pages/project-management/ProjectActivityPage.tsx` by extracting the `ActivityView` from `src/app/components/ProjectManagementModule.tsx` and reading `projectId` from `useParams`
- [ ] T012 [US1] Create `src/app/pages/project-management/ProjectReportingPage.tsx` by extracting the `ReportingView` from `src/app/components/ProjectManagementModule.tsx`
- [ ] T013 [US1] Register nested routes for all project management pages in `src/app/routes.tsx` under `/dashboard/project-management/*`, including a wildcard redirect to the dashboard

**Checkpoint**: At this point, all eight project management routes should render directly via URL.

---

## Phase 4: User Story 2 - Use browser back/forward and refresh within project management (Priority: P1)

**Goal**: Navigation inside project management updates the URL, and browser controls preserve the current screen.

**Independent Test**: Navigate between routes using in-app links, then use browser back/forward and refresh; confirm the same view and project are preserved.

### Implementation for User Story 2

- [ ] T014 [US2] Replace internal `setCurrentView` navigation in `src/app/pages/project-management/ProjectDashboardPage.tsx` with `useNavigate` calls to `/dashboard/project-management/list`, `/dashboard/project-management/create`, and `/dashboard/project-management/reporting`
- [ ] T015 [US2] Replace internal `setCurrentView` navigation in `src/app/pages/project-management/ProjectListPage.tsx` with `useNavigate` calls to `/dashboard/project-management` and `/dashboard/project-management/details/:projectId`
- [ ] T016 [US2] Replace internal `setCurrentView` navigation in `src/app/pages/project-management/ProjectCreatePage.tsx` with `useNavigate` calls to `/dashboard/project-management/list`
- [ ] T017 [US2] Replace internal `setCurrentView` navigation in `src/app/pages/project-management/ProjectDetailsPage.tsx` with `useNavigate` calls to `/dashboard/project-management/list`, `/dashboard/project-management/lifecycle/:projectId`, `/dashboard/project-management/versions/:projectId`, and `/dashboard/project-management/activity/:projectId`
- [ ] T018 [US2] Replace internal `setCurrentView` navigation in `src/app/pages/project-management/ProjectLifecyclePage.tsx`, `ProjectVersionsPage.tsx`, and `ProjectActivityPage.tsx` with `useNavigate` back to `/dashboard/project-management/details/:projectId`
- [ ] T019 [US2] Replace internal `setCurrentView` navigation in `src/app/pages/project-management/ProjectReportingPage.tsx` with `useNavigate` back to `/dashboard/project-management`

**Checkpoint**: Browser back, forward, and refresh preserve the project management view and selected project.

---

## Phase 5: User Story 3 - Maintain existing project management functionality (Priority: P2)

**Goal**: Existing features such as search, filters, view modes, forms, charts, and quick actions continue to work after the routing conversion.

**Independent Test**: Perform a manual regression check of dashboard, list, create, details, lifecycle, versions, activity, and reporting flows per `quickstart.md`.

### Implementation for User Story 3

- [ ] T020 [P] [US3] Verify KPI cards, charts, recent activity, deadlines, and quick actions still render in `src/app/pages/project-management/ProjectDashboardPage.tsx`
- [ ] T021 [P] [US3] Verify search, filters, table/kanban/timeline modes, and project links still work in `src/app/pages/project-management/ProjectListPage.tsx`
- [ ] T022 [P] [US3] Verify create-project form state and buttons still work in `src/app/pages/project-management/ProjectCreatePage.tsx`
- [ ] T023 [P] [US3] Verify project info, status, health, progress, budget, team, and quick-action links still work in `src/app/pages/project-management/ProjectDetailsPage.tsx`
- [ ] T024 [P] [US3] Verify placeholder lifecycle, versions, activity, and reporting views still render with back navigation in their respective page components
- [ ] T025 [US3] Remove or deprecate the old internal views from `src/app/components/ProjectManagementModule.tsx` after confirming the new page components cover all functionality

**Checkpoint**: All existing project management functionality works through the new routable pages.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, build verification, and documentation alignment.

- [ ] T026 Run `npm run build` and fix any TypeScript or build errors caused by the routing refactor
- [ ] T027 Update `src/app/components/Sidebar.tsx` and `src/app/components/MobileNav.tsx` if any menu paths need adjustment (currently `/dashboard/project-management` should remain correct)
- [ ] T028 Update `src/app/layouts/DashboardLayout.tsx` active view mapping if nested routes under `/dashboard/project-management/*` need explicit handling
- [ ] T029 Run through `quickstart.md` manual validation steps and confirm every route behaves as documented
- [ ] T030 Delete the old monolithic `src/app/components/ProjectManagementModule.tsx` if it is fully replaced by the new page components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P1 → P2)
  - US1 and US2 are tightly coupled because routing must exist before navigation can be wired; treat them sequentially if needed, or implement route registration first then navigation wiring in parallel
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - delivers routable pages
- **User Story 2 (P1)**: Can start after US1 route registration - depends on routes existing before navigation can update URLs
- **User Story 3 (P2)**: Can start after US1/US2 - regression and cleanup only

### Within Each User Story

- Extract page components before registering routes
- Register routes before wiring navigation
- Core implementation before cleanup
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Most page extraction tasks in US1 marked [P] can run in parallel
- Regression verification tasks in US3 marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all page component extractions together:
Task: "Create ProjectDashboardPage.tsx"
Task: "Create ProjectListPage.tsx"
Task: "Create ProjectCreatePage.tsx"
Task: "Create ProjectDetailsPage.tsx"
Task: "Create ProjectLifecyclePage.tsx"
Task: "Create ProjectVersionsPage.tsx"
Task: "Create ProjectActivityPage.tsx"

# Then register routes:
Task: "Register nested routes in src/app/routes.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (routable pages)
4. **STOP and VALIDATE**: Open each route directly in the browser
5. Then proceed to US2 navigation wiring and US3 regression cleanup

### Incremental Delivery

1. Setup + Foundational → shared data and error component ready
2. Add US1 → all views reachable by URL → validate with direct links
3. Add US2 → in-app navigation updates URL → validate with browser controls
4. Add US3 → regression cleanup → validate full quickstart.md
5. Polish → build passes, old component removed

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Developer A: extracts dashboard, list, create, reporting pages
3. Developer B: extracts details, lifecycle, versions, activity pages
4. Developer C: registers routes and wires navigation
5. Final cleanup done together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests are configured; validate manually per `quickstart.md`
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
