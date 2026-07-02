# Tasks: Role-Based Navigation Menu

**Input**: Design documents from `/specs/071-role-based-menu/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included because the spec includes measurable success criteria and the feature is small enough to verify with focused unit/component tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Review `src/app/components/Sidebar.tsx`, `src/app/components/MobileNav.tsx`, `src/app/routes.tsx`, and `src/api/services/auth-service.ts` to confirm integration points
- [x] T002 [P] Review `specs/071-role-based-menu/contracts/menu-access.ts` and `specs/071-role-based-menu/data-model.md` to confirm mapping rules

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `src/config/menuAccess.ts` exporting `ROLE_MENU_MAP`, `getAllowedMenuIds(roleSlug)`, and `isRouteAllowed(roleSlug, path, menuItems)`
- [x] T004 [P] Update `src/api/services/auth-service.ts` so `UserProfile` clearly exposes `roleSlug: string | null` (or reuse `role` if already canonical)
- [x] T005 [P] Update `src/app/layouts/RootLayout.tsx` to expose `roleSlug` through `useAuth` consistently

**Checkpoint**: Foundation ready - menu mapping, user profile field, and auth context are in place. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Project Manager Sees Relevant Menu (Priority: P1) 🎯 MVP

**Goal**: A user with the `project-managers` role sees exactly 'قاعدة الجهات المانحة', 'إدارة المشاريع', and 'التطابق الذكي مع المانحين' in the navigation and can access each page.

**Independent Test**: Log in as `project-managers` and verify the sidebar and mobile nav contain only the three expected items; clicking each item navigates to its page without an access-denied message.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Add unit tests for `getAllowedMenuIds('project-managers')` returning `['donors', 'project-management', 'donor-matching']`
- [x] T007 [P] [US1] Add component test rendering `Sidebar` with `roleSlug='project-managers'` and assert exactly the three expected Arabic labels are visible
- [x] T008 [P] [US1] Add component test rendering `MobileNav` with `roleSlug='project-managers'` and assert exactly the three expected Arabic labels are visible

### Implementation for User Story 1

- [x] T009 [US1] Update `src/app/components/Sidebar.tsx` to filter `navItems` by `getAllowedMenuIds(roleSlug)` for `project-managers`, preserving existing `.env` restricted-user allow-list behavior
- [x] T010 [US1] Update `src/app/components/MobileNav.tsx` to filter `navItems` by `getAllowedMenuIds(roleSlug)` for `project-managers`
- [x] T011 [US1] Add a `RoleRouteGuard` component in `src/app/components/RoleRouteGuard.tsx` that redirects unauthorized users to `/dashboard/charity-assessment`
- [x] T012 [US1] Apply `RoleRouteGuard` in `src/app/routes.tsx` to the `donors`, `project-management`, and `donor-matching` route branches

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Entity Manager Sees Relevant Menu (Priority: P2)

**Goal**: A user with the `entity-managers` role sees exactly 'معلوماتي', 'تقييم الجاهزية', and 'إدارة المشاريع' in the navigation and can access each page.

**Independent Test**: Log in as `entity-managers` and verify the sidebar and mobile nav contain only the three expected items; clicking each item navigates to its page without an access-denied message.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T013 [P] [US2] Add unit tests for `getAllowedMenuIds('entity-managers')` returning `['onboarding', 'charity-assessment', 'project-management']`
- [x] T014 [P] [US2] Add component test rendering `Sidebar` with `roleSlug='entity-managers'` and assert exactly the three expected Arabic labels are visible
- [x] T015 [P] [US2] Add component test rendering `MobileNav` with `roleSlug='entity-managers'` and assert exactly the three expected Arabic labels are visible

### Implementation for User Story 2

- [x] T016 [US2] Verify `src/config/menuAccess.ts` already maps `entity-managers` to `['onboarding', 'charity-assessment', 'project-management']`; update labels in `Sidebar.tsx`/`MobileNav.tsx` if 'معلوماتي' label is not already matched to `onboarding`
- [x] T017 [US2] Apply `RoleRouteGuard` in `src/app/routes.tsx` to the `charity-assessment` and `onboarding` route branches (if not already covered)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Menu Adapts When Role Changes (Priority: P3)

**Goal**: When a user's role slug changes, the navigation updates to reflect the new role's allowed items on the next render or session refresh.

**Independent Test**: Change the mocked `roleSlug` value in a running app or test, then confirm the sidebar and mobile nav immediately re-render with the new allowed set.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T018 [P] [US3] Add component test that switches `useAuth` role from `entity-managers` to `project-managers` and asserts the menu updates to the new allowed set
- [x] T019 [P] [US3] Add component test that switches `useAuth` role from `project-managers` to `entity-managers` and asserts the menu updates to the new allowed set

### Implementation for User Story 3

- [x] T020 [US3] Ensure `src/app/layouts/RootLayout.tsx` re-fetches profile or updates `user` state when the role changes so `useAuth` consumers re-render
- [x] T021 [US3] Verify `Sidebar.tsx` and `MobileNav.tsx` derive `visibleItems` directly from the latest `roleSlug` so changes are reflected immediately

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Edge Cases & Cross-Cutting Concerns

**Purpose**: Handle unrecognized roles, direct URL access, and navigation consistency

- [x] T022 [P] Add unit tests for `getAllowedMenuIds(null)`, `getAllowedMenuIds('')`, and `getAllowedMenuIds('unknown-role')` returning empty arrays
- [x] T023 [P] Add route-guard test asserting direct navigation to `/dashboard/donors` as `entity-managers` redirects to `/dashboard/charity-assessment`
- [x] T024 Add a component test asserting `Sidebar` shows no dashboard menu items when `roleSlug` is unrecognized
- [x] T025 Run TypeScript type check (`pnpm tsc --noEmit` or equivalent) and fix any errors introduced by the new `roleSlug` field or guard component
- [x] T026 [P] Run lint (`pnpm lint` if configured) and fix style issues in changed files
- [x] T027 Update `specs/071-role-based-menu/quickstart.md` if any manual testing steps changed during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Edge Cases & Cross-Cutting (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on `RoleRouteGuard` and `menuAccess.ts` from US1 but remains independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on auth context propagation; independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Components read from shared mapping before applying local UI logic
- Core implementation before route guard wiring
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 (setup reviews) can run in parallel
- T003, T004, and T005 (foundational files) can run in parallel once the mapping contract is agreed
- All tests for a user story (T006–T008, T013–T015, T018–T019) can run in parallel
- T022, T023, T026 in the final phase can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add unit tests for getAllowedMenuIds('project-managers')"
Task: "Add component test rendering Sidebar with roleSlug='project-managers'"
Task: "Add component test rendering MobileNav with roleSlug='project-managers'"

# Launch implementation for User Story 1 together after tests fail:
Task: "Update Sidebar.tsx to filter navItems for project-managers"
Task: "Update MobileNav.tsx to filter navItems for project-managers"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Edge Cases & Cross-Cutting Concerns → Full feature validated

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. A fourth developer handles Edge Cases & Cross-Cutting Concerns once stories are stable

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
