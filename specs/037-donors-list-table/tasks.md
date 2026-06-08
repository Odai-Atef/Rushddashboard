# Tasks: Donors List Table

**Input**: Design documents from `/specs/037-donors-list-table/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/donor-api.md, quickstart.md

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions, service layer, and data fetching infrastructure

- [x] T001 [P] Create donor TypeScript types in `src/types/donors.ts` (FundingArea, Donor, PaginatedDonorList, DonorFilters, DonorListState)
- [x] T002 Create DonorService class in `src/api/services/donor-service.ts` with `getDonors(page, limit)` method
- [x] T003 Update service registry in `src/api/services/index.ts` to export DonorService
- [x] T004 Create `useDonors` React Query hook in `src/api/hooks/useDonors.ts` for fetching paginated donor data with caching
- [x] T005 Create `useDebounce` utility hook in `src/app/hooks/useDebounce.ts` for search input debouncing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core reusable UI components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create `FundingAreaBadge` component in `src/app/components/donors/FundingAreaBadge.tsx` (colored tags with deterministic color assignment)
- [x] T007 [P] Create `LoadingState` component in `src/app/components/donors/LoadingState.tsx` (table skeleton loader)
- [x] T008 [P] Create `EmptyState` component in `src/app/components/donors/EmptyState.tsx` (illustrated empty state for no donors/no matches)
- [x] T009 Create `ErrorState` component in `src/app/components/donors/ErrorState.tsx` (error message with retry button, handles ApiError types)

**Checkpoint**: Foundation ready - reusable components exist, service layer works, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Paginated Donors (Priority: P1) 🎯 MVP

**Goal**: Display a paginated table of donors fetched from the API with loading, empty, and error states

**Independent Test**: Navigate to `/dashboard/donors`, verify the table renders with real API data, pagination controls work, loading skeleton appears during fetch, empty state shows when appropriate, and errors display with retry option.

### Implementation for User Story 1

- [x] T010 [US1] Create `DonorsTable` component in `src/app/components/donors/DonorsTable.tsx` (TanStack Table setup with columns: Name, Type, Geographic Scope, Funding Areas, Contact, Source URL, Last Updated)
- [x] T011 [US1] Create `DonorsPagination` component in `src/app/components/donors/DonorsPagination.tsx` (Previous/Next buttons, page numbers, items-per-page selector: 10/25/50)
- [x] T012 [US1] Create `DonorsPage` container in `src/app/components/donors/DonorsPage.tsx` (wires table + pagination + useDonors hook, manages page/limit state)
- [x] T013 [US1] Update `src/app/routes.tsx` to replace `DonorDatabaseModule` import with `DonorsPage` for `/dashboard/donors` route
- [x] T014 [US1] Implement responsive table layout: desktop full table, tablet horizontal scroll, mobile stacked card view
- [x] T015 [US1] Add RTL support for Arabic donor names and content (bidirectional text rendering)
- [x] T016 [US1] Handle API race conditions: abort in-flight requests when pagination params change (use AbortController via ApiClient)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. The donors page displays real data with pagination, loading states, empty states, error handling, and responsive layout.

---

## Phase 4: User Story 2 - Search and Filter Donors (Priority: P2)

**Goal**: Add client-side search by name and filter dropdowns for donor type and funding area

**Independent Test**: With the donor list displayed, type in the search box and verify the table filters by name. Select a type from the dropdown and verify only matching donors remain. Select a funding area and verify filtering works. Combine filters and verify they work together. Clear filters and verify the full list returns.

### Implementation for User Story 2

- [x] T017 [US2] Create `DonorsFilters` component in `src/app/components/donors/DonorsFilters.tsx` (search input, type filter dropdown, funding area filter dropdown, clear-all button)
- [x] T018 [US2] Implement client-side filtering logic in `DonorsPage.tsx`: filter current page data by name (case-insensitive substring match)
- [x] T019 [US2] Implement type filter logic in `DonorsPage.tsx`: filter by donor type enum value
- [x] T020 [US2] Implement funding area filter logic in `DonorsPage.tsx`: filter by funding area name
- [x] T021 [US2] Wire `DonorsFilters` into `DonorsPage` and ensure filter state resets page to 1 when changed
- [x] T022 [US2] Add visual indicator for active filters (badges or highlighted filter chips)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. The table supports pagination AND search/filtering.

---

## Phase 5: User Story 3 - View Donor Details (Priority: P3)

**Goal**: Clicking a table row opens a side drawer with full donor profile, funding areas, and contacts

**Independent Test**: Click any row in the donors table and verify a side drawer slides in from the right (RTL-aware: left side for RTL layouts). Verify the drawer shows full donor details including name, type, description, geographic scope, all funding areas, contact details (phone, email, website), source URL, and last updated date. Close the drawer and verify the list state (page, filters, search) is preserved.

### Implementation for User Story 3

- [x] T023 [US3] Create `DonorDetailDrawer` component in `src/app/components/donors/DonorDetailDrawer.tsx` (side drawer using shadcn/ui Sheet or Vaul, shows full donor profile)
- [x] T024 [US3] Wire row click handler in `DonorsTable` to open `DonorDetailDrawer` with selected donor data
- [x] T025 [US3] Implement drawer content sections: header (name + type badge), description, geographic scope, funding areas grid, contact info (phone/email/website with icons), source URL with external link icon, last updated date
- [x] T026 [US3] Ensure drawer closes without page reload and preserves list state (page, limit, filters, search query)
- [x] T027 [US3] Add responsive drawer sizing: full-screen on mobile, half-width on tablet, 1/3 width on desktop

**Checkpoint**: All user stories should now be independently functional. The table supports pagination, search/filtering, and detail drawer.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T028 [P] Update sidebar icon for donors route in `src/app/components/Sidebar.tsx` (change from Database to HeartHandshake per spec requirement)
- [x] T029 [P] Add JSDoc comments to all public methods in `src/api/services/donor-service.ts` and hook files
- [x] T030 [P] Ensure all components follow reusable pattern: accept props for customization, no hardcoded data
- [x] T031 [P] Verify `.env.example` includes all required environment variables (VITE_API_BASE_URL)
- [x] T032 [P] Run quickstart.md validation: test loading state → empty state → error state → success state manually
- [x] T033 Test edge case: user on page 5 applies restrictive filter → reset to page 1
- [x] T034 Test edge case: donor with no funding areas → empty badge section renders gracefully
- [x] T035 Test edge case: donor with very long name → text truncates with ellipsis, full name in tooltip
- [x] T036 Test edge case: API failure → error state shows with retry button, retry fetches fresh data
- [x] T037 Verify Source URL opens in new tab with `rel="noopener noreferrer"` and external link icon

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 table but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 table but independently testable

### Within Each User Story

- UI components before page integration
- Core implementation before edge cases
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T001, T002, T003, T004, T005)
- All Foundational tasks marked [P] can run in parallel (T006, T007, T008)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within US1: T010 and T011 can run in parallel
- Within US2: T017, T018, T019, T020 can run in parallel after T017
- Within US3: T023 and T024 can run in parallel after T010/T011
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch table and pagination in parallel:
Task: "Create DonorsTable component in src/app/components/donors/DonorsTable.tsx"
Task: "Create DonorsPagination component in src/app/components/donors/DonorsPagination.tsx"

# Then wire together:
Task: "Create DonorsPage container in src/app/components/donors/DonorsPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types, service, hooks)
2. Complete Phase 2: Foundational (reusable UI components)
3. Complete Phase 3: User Story 1 (paginated table with loading/empty/error states)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Polish → Final validation → Deploy
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (table + pagination + page container)
   - Developer B: User Story 2 (filters + search)
   - Developer C: User Story 3 (drawer + row click)
3. Stories complete and integrate independently
4. Team converges on Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test tasks included (not explicitly requested in spec)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths follow the project structure defined in plan.md
