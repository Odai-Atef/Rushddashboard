# Tasks: Settings Page User Info

**Input**: Design documents from `/specs/024-settings-user-info/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/auth-api.md

**Tests**: Not explicitly requested in feature specification; test tasks were generated for validation of core user stories and are now passing.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure prerequisite files and types exist before binding data

- [X] T001 [P] Verify existing auth types in `src/app/types/auth.ts` support optional user fields (firstName, lastName, companyName)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend TypeScript types and localStorage utilities to carry optional user fields; make auth service aware of extended user shape

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Extend `UserProfile` interface in `src/app/types/auth.ts` to include optional `firstName`, `lastName`, `companyName`
- [X] T003 Update `AuthResponse` interface in `src/app/types/auth.ts` to reflect extended `UserProfile`
- [X] T004 [P] Update `setUser` / `getUser` utilities in `src/app/utils/auth.ts` to persist and restore extended `UserProfile` fields
- [X] T005 Update `AuthProvider` in `src/app/hooks/useAuth.tsx` to keep extended fields in state and context
- [X] T006 Update `login` and `register` service functions in `src/app/services/auth.ts` to store full user object including optional fields

**Checkpoint**: Foundation ready — extended user data flows from API → service → context → localStorage

---

## Phase 3: User Story 1 - View own profile on settings page (Priority: P1) 🎯 MVP

**Goal**: Replace all hardcoded placeholder values in SettingsPage with real authenticated user data (name, email, company)

**Independent Test**: Navigate to `dashboard/settings` after login; verify displayed name/email match the auth session; no hardcoded Arabic text remains in profile/company fields.

### Tests for User Story 1

- [X] T007 [P] [US1] Write component test in `src/app/components/SettingsPage.test.tsx` that mocks `useAuth` with full user and asserts profile fields render correctly
- [X] T008 [P] [US1] Write component test in `src/app/components/SettingsPage.test.tsx` that asserts no hardcoded placeholder text appears in profile inputs

### Implementation for User Story 1

- [X] T009 [US1] Import `useAuth` into `src/app/components/SettingsPage.tsx` and read `user` from context
- [X] T010 [US1] Bind profile first-name input in `src/app/components/SettingsPage.tsx` to `user.firstName`
- [X] T011 [P] [US1] Bind profile last-name input in `src/app/components/SettingsPage.tsx` to `user.lastName`
- [X] T012 [P] [US1] Bind profile email input in `src/app/components/SettingsPage.tsx` to `user.email`
- [X] T013 [US1] Bind company name input in `src/app/components/SettingsPage.tsx` to `user.companyName`
- [X] T014 [US1] Replace hardcoded avatar initials in `src/app/components/SettingsPage.tsx` with dynamic initials derived from `user.firstName` and `user.lastName`
- [X] T015 [US1] Remove or replace any remaining hardcoded placeholder/static text in profile and company sections of `src/app/components/SettingsPage.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Handle partial or missing data gracefully (Priority: P2)

**Goal**: Ensure SettingsPage renders safely when optional user fields are absent from auth state

**Independent Test**: Simulate auth state with only `id` and `email` present; open `dashboard/settings` and verify layout is intact and no errors appear.

### Tests for User Story 2

- [X] T016 [P] [US2] Write component test in `src/app/components/SettingsPage.test.tsx` that mocks `useAuth` with only `id` and `email` and asserts layout renders without errors
- [X] T017 [P] [US2] Write component test in `src/app/components/SettingsPage.test.tsx` that asserts empty-string optional fields do not show placeholder text

### Implementation for User Story 2

- [X] T018 [US2] Add null-safe/empty-string fallbacks for optional fields (`firstName`, `lastName`, `companyName`) in `src/app/components/SettingsPage.tsx`
- [X] T019 [US2] Add loading-state guard in `src/app/components/SettingsPage.tsx`: do not render user-specific inputs until `isLoading` is false
- [X] T020 [US2] Verify conditional rendering in `src/app/components/SettingsPage.tsx` does not break layout when optional fields evaluate to empty strings

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, validation, and quickstart alignment

- [X] T021 [P] Run existing linter/type-checker (`npm run lint`, `npm run typecheck`) to ensure no TypeScript or ESLint regressions
- [X] T022 [P] Run existing test suite (`npm run test`) to ensure no breaking changes in auth or other components
- [X] T023 Verify `quickstart.md` scenarios pass: navigate to settings after login, see real data, refresh preserves info
- [X] T024 Clean up dead code: remove any unused imports or leftover static demo strings from `src/app/components/SettingsPage.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational + User Story 1 (uses same component)
- **Polish (Phase 5)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Must finish before US2 because both modify the same component file.
- **User Story 2 (P2)**: Builds on US1; cannot be independently merged before US1 but can be planned in parallel.

### Parallel Opportunities

- T001 and T002 can run in parallel (different files, but T002 depends on auth.ts knowledge).
- T007 and T008 (tests) can run in parallel.
- T010, T011, T012 (input bindings) can run in parallel.
- T016 and T017 (tests) can run in parallel.
- T021, T022, T023 (polish) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch all model/input bindings together:
Task: "Bind profile first-name input in src/app/components/SettingsPage.tsx to user.firstName"
Task: "Bind profile last-name input in src/app/components/SettingsPage.tsx to user.lastName"
Task: "Bind profile email input in src/app/components/SettingsPage.tsx to user.email"
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
4. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
