# Tasks: Executive Analysis Backend Integration

**Input**: Design documents from `/specs/003-executive-analysis-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/app/` at repository root
- Paths shown assume single project structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Minimal setup - project already initialized with chat feature

- [x] T001 [P] Create `src/app/components/analysis/` directory for reusable analysis components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, service layer, and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Create `src/app/types/analysis.ts` with all TypeScript interfaces and Zod schemas (AnalysisCategory, KPIBlock, AnalyticsSummary, AnalysisOutput, FilterParameters, response schemas)
- [x] T003 [P] Create `src/app/utils/analysis.ts` with helper functions (value formatters for currency/percentage/compact, filter parameter serialization, chart data transformers)
- [x] T004 Create `src/app/services/analysis.ts` with API service functions (getCategories, getAnalyticsSummary, getInsights) using existing `apiFetch` pattern
- [x] T005 Create `src/app/hooks/useAnalysisContext.tsx` with React Context provider for analysis state (categories, selectedCategory, filters, loading states, error states)

**Checkpoint**: Foundation ready - types, services, and context available for all user stories

---

## Phase 3: User Story 1 - View Dynamic Executive Dashboard (Priority: P1) 🎯 MVP

**Goal**: Executive dashboard loads categories, KPIs, charts, and insights from backend APIs dynamically

**Independent Test**: Navigate to `/dashboard` - verify categories load, selecting a category shows KPIs, charts, and insights with live data

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `src/app/hooks/useCategories.ts` hook for fetching and managing categories state
- [x] T007 [P] [US1] Create `src/app/hooks/useAnalytics.ts` hook for fetching analytics summary (KPIs + charts) by category ID
- [x] T008 [P] [US1] Create `src/app/hooks/useInsights.ts` hook for fetching insights by category ID
- [x] T009 [P] [US1] Create `src/app/components/analysis/CategorySelector.tsx` for displaying and selecting analysis categories
- [x] T010 [P] [US1] Create `src/app/components/analysis/KPICard.tsx` for displaying a single KPI with value, trend, and icon
- [x] T011 [P] [US1] Create `src/app/components/analysis/ChartWidget.tsx` for rendering charts dynamically based on backend chart configuration (supports line, bar, pie, area)
- [x] T012 [P] [US1] Create `src/app/components/analysis/InsightCard.tsx` for displaying alerts, recommendations, and AI insights
- [x] T013 [US1] Refactor `src/app/components/ExecutiveDashboard.tsx` to use `useCategories`, `useAnalytics`, and `useInsights` hooks, replacing all hardcoded data with API-fed data

**Checkpoint**: At this point, the executive dashboard should load live data from backend and render categories, KPIs, charts, and insights dynamically

---

## Phase 4: User Story 2 - Handle Data States Gracefully (Priority: P1)

**Goal**: Loading, empty, and error states are displayed appropriately for all data sections

**Independent Test**: Simulate slow network, empty responses, and API errors - verify appropriate UI states appear for each scenario

### Implementation for User Story 2

- [x] T014 [P] [US2] Create `src/app/components/analysis/KPICardSkeleton.tsx` skeleton loader for KPI cards
- [x] T015 [P] [US2] Create `src/app/components/analysis/EmptyState.tsx` for displaying informative empty states when no data is available
- [x] T016 [P] [US2] Create `src/app/components/analysis/ErrorState.tsx` for displaying user-friendly error messages with retry button
- [x] T017 [US2] Add loading states to `ExecutiveDashboard.tsx` - show skeletons during initial load and category switch
- [x] T018 [US2] Add empty state handling to `ExecutiveDashboard.tsx` - show EmptyState when categories array is empty or analytics has no data
- [x] T019 [US2] Add error state handling to `ExecutiveDashboard.tsx` - show ErrorState per section (categories, analytics, insights) with retry capability
- [x] T020 [US2] Implement request deduplication and cancellation in `useAnalytics` and `useInsights` hooks to prevent duplicate requests during rapid category switching

**Checkpoint**: At this point, the dashboard should handle all data states gracefully (loading, empty, error, partial failure)

---

## Phase 5: User Story 3 - Apply Future Filters to Analysis (Priority: P2)

**Goal**: Data-fetching layer accepts and passes filter parameters to backend requests

**Independent Test**: Verify that filter parameters appear in API request query strings and trigger data re-fetch

### Implementation for User Story 3

- [x] T021 [US3] Extend `useAnalysisContext.tsx` to include `FilterParameters` state and setter functions
- [x] T022 [US3] Update `src/app/services/analysis.ts` to serialize `FilterParameters` into query string parameters for all endpoints
- [x] T023 [US3] Update `useAnalytics.ts` to accept filter parameters and re-fetch when filters change
- [x] T024 [US3] Update `useInsights.ts` to accept filter parameters and re-fetch when filters change
- [x] T025 [US3] Update `ExecutiveDashboard.tsx` to pass current filters to hooks and handle filter-driven re-fetching

**Checkpoint**: At this point, filter parameters are correctly passed to backend and trigger data updates

---

## Phase 6: User Story 4 - Save and Revisit Analysis History (Priority: P3)

**Goal**: Architecture supports future saved analysis history without structural changes

**Independent Test**: Review data model and state structure to confirm saved analysis can be added without refactoring

### Implementation for User Story 4

- [x] T026 [US4] Add `SavedAnalysis` interface to `src/app/types/analysis.ts` with all required fields (id, userId, categoryId, filters, title, createdAt, resultsSnapshot)
- [x] T027 [US4] Extend `AnalysisContext` in `useAnalysisContext.tsx` to include placeholder state for saved analyses array
- [x] T028 [US4] Document extension points in `src/app/services/analysis.ts` for future saved analysis API endpoints (GET /saved, POST /saved, DELETE /saved/:id)

**Checkpoint**: At this point, the architecture can accommodate saved analysis history in a future iteration

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T029 [P] Run lint and typecheck across all modified files (`npm run lint`, `npm run typecheck`)
- [x] T030 [P] Verify bundle size impact - ensure analysis code does not exceed route chunk budget
- [x] T031 [P] Review and update `AGENTS.md` if any new patterns or conventions were introduced
- [x] T032 Run quickstart.md validation - manually test all scenarios in the quickstart checklist
- [x] T033 Clean up any unused imports, dead code, or commented-out blocks in modified files
- [x] T034 Verify all error messages are user-friendly and in Arabic where appropriate
- [x] T035 Add JSDoc comments to public hooks and service functions for developer documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
  - T002 (types) and T003 (utils) can run in parallel
  - T004 (service) depends on T002 (types)
  - T005 (context) depends on T002 (types)
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 and tightly coupled - implement together
  - US3 (P2) can start after US1+US2
  - US4 (P3) can start after US3 or in parallel with it
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core dashboard functionality
- **User Story 2 (P1)**: Interdependent with US1 - state handling is part of dashboard rendering; implement alongside US1
- **User Story 3 (P2)**: Can start after US1+US2 - extends data layer with filters
- **User Story 4 (P3)**: Can start after US3 or in parallel - architecture-only, minimal code changes

### Within Each User Story

- Hooks before components (components depend on hooks)
- Service functions before hooks (hooks depend on services)
- Types before everything (all depend on types)
- US1+US2: Implement core hooks → basic components → dashboard refactor → add state handling

### Parallel Opportunities

- **Phase 2 (Foundational)**: T002 (types) and T003 (utils) can run in parallel
- **Phase 3 (US1)**: T006, T007, T008 (hooks) can be developed in parallel
- **Phase 3 (US1)**: T009, T010, T011, T012 (components) can be developed in parallel after hooks
- **Phase 4 (US2)**: T014, T015, T016 (state components) can be developed in parallel
- **Phase 5 (US3)**: T021, T022 can run in parallel
- **Phase 7 (Polish)**: T029, T030, T031, T033 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all hooks for User Story 1 together:
Task: "Create useCategories hook in src/app/hooks/useCategories.ts"
Task: "Create useAnalytics hook in src/app/hooks/useAnalytics.ts"
Task: "Create useInsights hook in src/app/hooks/useInsights.ts"

# Launch all components for User Story 1 together (after hooks):
Task: "Create CategorySelector in src/app/components/analysis/CategorySelector.tsx"
Task: "Create KPICard in src/app/components/analysis/KPICard.tsx"
Task: "Create ChartWidget in src/app/components/analysis/ChartWidget.tsx"
Task: "Create InsightCard in src/app/components/analysis/InsightCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1+2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (dynamic dashboard)
4. Complete Phase 4: User Story 2 (state handling)
5. **STOP and VALIDATE**: Test dashboard independently with all state scenarios
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1+2 → Dynamic dashboard with state handling → Deploy/Demo (MVP!)
3. Add User Story 3 → Filter support → Deploy/Demo
4. Add User Story 4 → Saved analysis architecture → Deploy/Demo
5. Add Phase 7: Polish → Final QA → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 hooks (T006-T008)
   - Developer B: US1 components (T009-T012)
3. Merge and integrate into ExecutiveDashboard (T013)
4. Developer A: US2 state handling (T014-T020)
5. Developer B: US3 filter support (T021-T025)
6. Stories complete and integrate independently

---

## Task Summary

| Phase | Tasks | Story | Priority |
|-------|-------|-------|----------|
| Setup | 1 | - | - |
| Foundational | 4 | - | - |
| US1 - Dynamic Dashboard | 8 | US1 | P1 |
| US2 - State Handling | 7 | US2 | P1 |
| US3 - Filters | 5 | US3 | P2 |
| US4 - Saved Analysis | 3 | US4 | P3 |
| Polish | 7 | - | - |
| **Total** | **35** | | |

**MVP Scope**: Phases 1-4 (Tasks T001-T020) - 25 tasks
**Full Feature**: All phases (Tasks T001-T035) - 35 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
