# Tasks: Dashboard Backend Integration

**Input**: Design documents from `specs/004-dashboard-backend-integration/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/dashboard-api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Foundational Infrastructure (Blocking Prerequisites)

**Purpose**: Core types, services, and hooks that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Create dashboard Zod schemas and types in `src/app/types/dashboard.ts` (Dashboard, Widget, WidgetData, FilterDefinition, FilterValue, LayoutConfig, WidgetLayout, DataSource, WidgetConfig, StatConfig, ChartConfig, TableConfig)
- [x] T002 [P] Create dashboard API service in `src/app/services/dashboard.ts` (getDashboards, getDashboard, getWidgetData, createDashboard, updateDashboard) following existing `apiFetch` + Zod validation pattern
- [x] T003 [P] Create `useDashboards` hook in `src/app/hooks/useDashboards.ts` (fetches dashboard list, manages loading/error states)
- [x] T004 [P] Create `useDashboard` hook in `src/app/hooks/useDashboard.ts` (fetches single dashboard with widget definitions)
- [x] T005 Create `useWidgetData` hook in `src/app/hooks/useWidgetData.ts` (fetches widget data with filter params, supports AbortController cancellation)
- [x] T006 Create dashboard context provider in `src/app/hooks/useDashboardContext.tsx` (manages selected dashboard, filters, loading/error states across dashboard pages)

**Checkpoint**: Foundation ready - service layer tested, types validated, hooks functional

---

## Phase 2: User Story 1 - View Dashboard List (Priority: P1) 🎯 MVP

**Goal**: Users can see a list of available dashboards fetched from the backend

**Independent Test**: Navigate to `/dashboards` (or `/dashboard/list`) and verify dashboard cards appear from backend API. Test empty and error states.

### Tests for User Story 1

- [ ] T007 [P] [US1] Contract test: `GET /dashboards` returns valid response structure
- [ ] T008 [P] [US1] Component test: DashboardList renders loading state
- [ ] T009 [P] [US1] Component test: DashboardList renders empty state when no dashboards
- [ ] T010 [P] [US1] Component test: DashboardList renders error state with retry button

### Implementation for User Story 1

- [x] T011 [P] [US1] Create `DashboardList` component in `src/app/components/dashboard/DashboardList.tsx` (grid/list of dashboard cards with name, description, icon)
- [x] T012 [P] [US1] Create `DashboardListPage` in `src/app/pages/Dashboard/DashboardListPage.tsx` (wrapper with context provider, integrates `useDashboards`)
- [x] T013 [P] [US1] Create `DashboardCard` component in `src/app/components/dashboard/DashboardCard.tsx` (single dashboard card with navigation link)
- [x] T014 [US1] Add dashboard list route in `src/app/routes.tsx` (`/dashboard/list` or update `/dashboard` to show list)
- [x] T015 [US1] Handle loading state with skeleton cards in DashboardList
- [x] T016 [US1] Handle empty state (no dashboards) with message and CTA
- [x] T017 [US1] Handle error state with retry functionality
- [x] T018 [US1] Add responsive grid layout for dashboard cards (mobile: 1 col, tablet: 2 col, desktop: 3-4 col)

**Checkpoint**: User Story 1 complete - dashboard list loads from backend, handles all states

---

## Phase 3: User Story 2 - View Dashboard with Widgets (Priority: P1) 🎯 MVP

**Goal**: Users can view a specific dashboard with widgets rendered dynamically from backend configuration

**Independent Test**: Navigate to a dashboard detail page and verify widgets render with live data from backend. Test individual widget loading/error states.

### Tests for User Story 2

- [ ] T019 [P] [US2] Contract test: `GET /dashboards/:id` returns dashboard with widgets
- [ ] T020 [P] [US2] Contract test: `GET /dashboards/:id/widgets/:widgetId/data` returns widget data
- [ ] T021 [P] [US2] Component test: WidgetRenderer maps widget types correctly
- [ ] T022 [P] [US2] Component test: WidgetGrid renders correct layout from backend config
- [ ] T023 [P] [US2] Component test: Individual widget shows loading skeleton
- [ ] T024 [P] [US2] Component test: Individual widget shows error state without breaking dashboard

### Implementation for User Story 2

- [x] T025 [P] [US2] Create `WidgetRenderer` component in `src/app/components/dashboard/WidgetRenderer.tsx` (dispatcher that maps `widget.type` to specific widget components)
- [x] T026 [P] [US2] Create `StatWidget` in `src/app/components/dashboard/widgets/StatWidget.tsx` (uses existing `KPICard` component, renders stat-type widgets)
- [x] T027 [P] [US2] Create `ChartWidget` in `src/app/components/dashboard/widgets/ChartWidget.tsx` (uses existing `ChartWidget` from analysis or create dashboard-specific version supporting line, bar, pie, area)
- [x] T028 [P] [US2] Create `TableWidget` in `src/app/components/dashboard/widgets/TableWidget.tsx` (data table with sortable columns, pagination)
- [x] T029 [P] [US2] Create `UnknownWidget` fallback in `src/app/components/dashboard/widgets/UnknownWidget.tsx` (graceful placeholder for unsupported widget types)
- [x] T030 [P] [US2] Create `WidgetGrid` in `src/app/components/dashboard/WidgetGrid.tsx` (renders widgets in grid layout based on `layout` config from backend)
- [x] T031 [US2] Create `DashboardPage` in `src/app/components/dashboard/DashboardPage.tsx` (orchestrates dashboard metadata, filters, and widget grid)
- [x] T032 [US2] Create `DashboardDetailPage` in `src/app/pages/Dashboard/DashboardDetailPage.tsx` (route wrapper with context, integrates `useDashboard` and `useWidgetData`)
- [x] T033 [US2] Add dashboard detail route in `src/app/routes.tsx` (`/dashboard/:id`)
- [x] T034 [US2] Implement per-widget loading states (skeletons inside each widget card)
- [x] T035 [US2] Implement per-widget error states (error boundary or error card per widget)
- [x] T036 [US2] Handle dashboard with zero widgets (show empty state message)
- [x] T037 [US2] Handle malformed widget config (graceful degradation, log warning)

**Checkpoint**: User Story 2 complete - dashboard detail renders widgets dynamically with live data

---

## Phase 4: User Story 3 - Dashboard Filters (Priority: P2)

**Goal**: Users can apply filters to dashboard data and widget data refreshes accordingly

**Independent Test**: Apply a date range filter on a dashboard and verify all widgets refetch data with new filter params. Refresh page and verify filter state persists in URL.

### Tests for User Story 3

- [ ] T038 [P] [US3] Component test: DashboardFilters renders filter controls from config
- [ ] T039 [P] [US3] Integration test: Filter change triggers widget data refetch
- [ ] T040 [P] [US3] Integration test: Filter state persists in URL after page reload

### Implementation for User Story 3

- [x] T041 [P] [US3] Create `DashboardFilters` component in `src/app/components/dashboard/DashboardFilters.tsx` (renders filter controls based on dashboard.filterDefinitions: dateRange picker, dropdown, multiSelect, search)
- [x] T042 [US3] Create `FilterControl` sub-components in `src/app/components/dashboard/filters/` (DateRangeFilter, DropdownFilter, MultiSelectFilter, SearchFilter)
- [x] T043 [US3] Implement URL-based filter state management (sync filters to query params via React Router)
- [x] T044 [US3] Integrate filter changes with `useWidgetData` (refetch all widgets when filters change)
- [x] T045 [US3] Handle filter reset to defaults
- [x] T046 [US3] Handle filters that return no data (show empty state per widget)
- [x] T047 [US3] Add loading state during filter-triggered refetch

**Checkpoint**: User Story 3 complete - filters work, persist in URL, trigger widget refresh

---

## Phase 5: User Story 4 - Create and Update Dashboard (Priority: P3)

**Goal**: Admin users can create new dashboards and update existing ones

**Independent Test**: Navigate to dashboard creation form, submit, verify new dashboard appears in list. Edit existing dashboard, verify changes persist.

### Tests for User Story 4

- [ ] T048 [P] [US4] Contract test: `POST /dashboards` creates dashboard
- [ ] T049 [P] [US4] Contract test: `PATCH /dashboards/:id` updates dashboard
- [ ] T050 [P] [US4] Component test: DashboardForm validates required fields

### Implementation for User Story 4

- [x] T051 [P] [US4] Create `DashboardForm` component in `src/app/components/dashboard/DashboardForm.tsx` (React Hook Form + Zod validation for create/edit)
- [x] T052 [P] [US4] Create `CreateDashboardPage` in `src/app/pages/Dashboard/CreateDashboardPage.tsx`
- [x] T053 [P] [US4] Create `EditDashboardPage` in `src/app/pages/Dashboard/EditDashboardPage.tsx`
- [x] T054 [US4] Add create/edit routes in `src/app/routes.tsx` (`/dashboard/new`, `/dashboard/:id/edit`)
- [x] T055 [US4] Add permission checks (hide/show create/edit buttons based on user role)
- [x] T056 [US4] Handle 403 responses for unauthorized create/update attempts
- [x] T057 [US4] Handle 409 conflict (duplicate name) with user-friendly message
- [x] T058 [US4] Handle backend endpoints that don't exist (graceful degradation, hide admin UI)

**Checkpoint**: User Story 4 complete - admin can create/edit dashboards if backend supports it

---

## Phase 6: Migration & Cleanup

**Purpose**: Replace hardcoded dashboards with backend-driven structure

- [x] T059 [P] Create generic dashboard index route handler (`/dashboard/:id`) that renders `DashboardDetailPage`
- [x] T060 [P] Refactor existing hardcoded dashboard pages (Sales, Customers, Operations, Marketing, etc.) to use backend-driven `DashboardPage` or remove if no longer needed
- [x] T061 Update sidebar navigation to link to `/dashboard/list` instead of individual hardcoded routes
- [x] T062 [P] Remove hardcoded demo data arrays from all dashboard components
- [x] T063 [P] Update `DashboardLayout.tsx` to work with generic dashboard pages
- [x] T064 Add breadcrumbs or navigation from dashboard detail back to list

**Checkpoint**: All dashboards are backend-driven; hardcoded data removed

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Testing, documentation, and quality improvements

- [x] T065 [P] Add unit tests for dashboard service functions
- [x] T066 [P] Add unit tests for dashboard hooks
- [x] T067 [P] Add component tests for all widget types
- [x] T068 Add E2E test for dashboard list → detail → filter flow
- [x] T069 Verify responsive design across mobile, tablet, desktop
- [x] T070 Verify loading states and skeletons match design system
- [x] T071 Run ESLint and Prettier on all new files
- [x] T072 Verify no console.log or debugger statements
- [x] T073 Update quickstart.md if implementation deviates from plan
- [x] T074 Performance audit: verify bundle chunks <250KB, lazy loading applied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies - can start immediately
- **Phase 2 (US1)**: Depends on Phase 1 completion
- **Phase 3 (US2)**: Depends on Phase 1 completion. Can run in parallel with Phase 2 if team capacity allows
- **Phase 4 (US3)**: Depends on Phase 3 completion (needs widgets to filter)
- **Phase 5 (US4)**: Depends on Phase 1 completion. Can run in parallel with Phase 2/3
- **Phase 6 (Migration)**: Depends on Phase 2 and 3 completion
- **Phase 7 (Polish)**: Depends on all implementation phases

### Within Each Phase

- Tests (if included) should be written before or alongside implementation
- Types before services
- Services before hooks
- Hooks before components
- Components before pages/routes

### Parallel Opportunities

- All Phase 1 tasks marked [P] can run in parallel
- Phase 2 and Phase 3 can overlap (US1 and US2 are independent P1 stories)
- Phase 5 (US4) can run in parallel with Phase 2/3/4
- All widget components in Phase 3 can be developed in parallel
- All filter sub-components in Phase 4 can be developed in parallel
- Migration tasks in Phase 6 can be parallelized per dashboard

---

## Implementation Strategy

### MVP First (Phase 1 + Phase 2 + Phase 3)

1. Complete Phase 1: Foundational infrastructure
2. Complete Phase 2: User Story 1 (Dashboard List)
3. Complete Phase 3: User Story 2 (Dashboard with Widgets)
4. **STOP and VALIDATE**: Test end-to-end dashboard viewing
5. Deploy/demo if ready

### Incremental Delivery

1. Foundational → Dashboard List (US1) → Deploy (MVP!)
2. Add Dashboard with Widgets (US2) → Deploy
3. Add Filters (US3) → Deploy
4. Add Create/Update (US4) → Deploy
5. Migrate hardcoded dashboards → Deploy

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Existing reusable components from `src/app/components/analysis/` should be leveraged where possible (KPICard, ChartWidget, ErrorState, EmptyState)
- Follow existing patterns: `apiFetch` wrapper, Zod validation, React Context + hooks
- Widget type extensibility: new widget types require adding a case to WidgetRenderer and creating a new widget component
- File size limit: 300 lines max; split large components into sub-components
