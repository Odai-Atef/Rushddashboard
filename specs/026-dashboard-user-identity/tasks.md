# Tasks: Dashboard User Identity Display

**Input**: Design documents from `/specs/026-dashboard-user-identity/`**
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md**

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Foundational

**Purpose**: Shared utility needed before any user story rendering can be updated.

- [X] T001 Create `getDisplayName.ts` utility in `src/app/utils/getDisplayName.ts` with display-name composition and initials fallback logic per data-model.md.
- [X] T002 [P] Write unit tests for `getDisplayName.ts` in `src/app/utils/getDisplayName.test.ts` covering: full name, firstName only, lastName only, email only, null/empty inputs.

**Checkpoint**: Utility function exists and all fallback branches are tested.

---

## Phase 2: User Story 1 – Display Logged-In User Identity (Priority: P1) 🎯 MVP

**Goal**: Show the current user's name and email in the Sidebar, MobileNav, and TopBar user dropdown.

**Independent Test**: Log in to the dashboard and confirm that the Sidebar below the navigation shows name + email, the MobileNav drawer shows name + email, and the TopBar user dropdown shows the correct name + email.

### Tests for User Story 1

- [X] T003 [P] [US1] Add component tests for `Sidebar` identity section rendering with mocked `useAuth()` values.
- [X] T004 [P] [US1] Add component tests for `TopBar` user dropdown rendering with mocked `useAuth()` values.

### Implementation for User Story 1

- [X] T005 [US1] Update `src/app/components/Sidebar.tsx` to import `useAuth()` and `getDisplayName()`. Add a compact user identity block (avatar initials + name + email) above the existing footer.
- [X] T006 [US1] Update `src/app/components/MobileNav.tsx` to import `useAuth()` and `getDisplayName()`. Add the same compact user identity block inside the mobile drawer, above the footer.
- [X] T007 [US1] Update `src/app/components/TopBar.tsx` to replace the hardcoded Arabic name/email in the `DropdownMenu` and `Avatar` with the live `user` from `useAuth()` and `getDisplayName()`.

**Checkpoint**: User Story 1 fully functional. Sidebar, MobileNav, and TopBar all display the authenticated user's identity.

---

## Phase 3: User Story 2 – Preserve Identity on Refresh (Priority: P2)

**Goal**: Ensure identity display survives page refresh by relying on the existing `localStorage` hydration in `AuthProvider`.

**Independent Test**: With the user logged in and identity visible, refresh the page. Confirm that name/email reappear within 2 seconds without requiring re-login.

- [X] T008 [US2] Verify in `src/app/hooks/useAuth.tsx` that `useEffect` reads `rushd_user` from `localStorage` on mount and restores `user` state before `isLoading` becomes `false`.
- [X] T009 [US2] Add or update a test in `src/app/hooks/useAuth.test.ts` that simulates `localStorage` containing a valid `UserProfile`, mounts the app, and asserts that the identity area renders the stored name/email.
- [X] T010 [US2] Ensure the identity area uses `isLoading` from `useAuth()` in `Sidebar.tsx` and `MobileNav.tsx` to avoid FOUC (flashing fallback then correct data).

**Checkpoint**: User Story 2 verified. Refresh reliably restores identity.

---

## Phase 4: User Story 3 – Graceful Fallback for Missing Data (Priority: P3)

**Goal**: Prevent UI breakage when `firstName`, `lastName`, or `email` are unavailable.

**Independent Test**: Simulate each of the three fallback scenarios in `getDisplayName` (name empty, email empty, both empty) and confirm the menu still renders without layout shifts.

- [X] T011 [US3] In `src/app/components/Sidebar.tsx` and `src/app/components/MobileNav.tsx`, wrap the identity block with a conditional that renders a safe fallback placeholder when `user` is `null` or `isLoading` is `true`.
- [X] T012 [P] [US3] In component tests, pass `user = null` and `isLoading = true` to both `Sidebar` and `TopBar` and assert that no text nodes crash or overflow.
- [X] T013 [US3] Add a `getDisplayName` unit test in `src/app/utils/getDisplayName.test.ts` for the case where `firstName` and `lastName` are empty strings but `email` is present, verifying the email is used as the display name.

**Checkpoint**: User Story 3 verified. All fallback paths covered by unit + component tests.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and visual QA.

- [X] T014 [P] Run `npm run lint` to ensure no ESLint/Prettier violations in changed files.
- [X] T015 [P] Run `npm run test` to confirm the full test suite still passes.
- [X] T016 Perform responsive manual check: open dashboard on mobile (< 640px), tablet, and desktop. Verify Sidebar is hidden, MobileNav drawer shows identity, and TopBar identity dropdown is reachable.
- [X] T017 Verify acceptance criteria AC-1 through AC-5 according to `quickstart.md`.

**Checkpoint**: All acceptance criteria verified. Ready for PR.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — can start immediately.
- **User Story 1 (Phase 2)**: Depends on Phase 1 completion (shared utility must exist).
- **User Story 2 (Phase 3)**: Depends on Phase 2 completion (components must already render identity).
- **User Story 3 (Phase 4)**: Depends on Phase 2 completion. Can proceed in parallel with Phase 3 once Phase 2 is done.
- **Polish (Phase 5)**: Depends on all user stories being complete.

### Execution Strategy

**MVP First (User Story 1 Only)**:
1. Complete Phase 1 (foundational utility)
2. Complete Phase 2 (US1 implementation + component tests)
3. **STOP and VALIDATE**: Log in and verify identity appears in Sidebar, MobileNav, and TopBar.
4. Proceed to Phases 3–5 (refresh resilience, fallback handling, and polish) if time allows.

### Parallel Opportunities

- T001 and T002 are parallel (utility file vs. test file, no cross-dependencies).
- T003 and T004 are parallel (different component test files).
- T005, T006, and T007 are parallel (touch three different component files with no shared edits).
- T012 and T013 are parallel (component test vs. unit test, no cross-dependencies).
- T014 and T015 are parallel (lint and test are independent).
