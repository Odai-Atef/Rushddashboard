# Tasks: Use Full Name Across Frontend

**Input**: Design documents from `/specs/069-use-full-name/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/auth-contract.md, research.md, quickstart.md

**Tests**: No automated test framework is currently installed, so no test tasks are included. Validation is manual per `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify development environment by running `pnpm dev` and confirming the app loads without errors.
- [x] T002 Search the entire `src/` directory to confirm no stale `firstName`, `lastName`, `first_name`, or `last_name` references exist.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update the shared data contract so all user stories can rely on the same `fullName` type.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Update `UserProfile.fullName` from `string | null` to required `string` in `src/api/services/auth-service.ts`.
- [x] T004 Verify `RegisterData.fullName` is already typed as required `string` in `src/api/services/auth-service.ts`; document if any change is needed.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Profile Menu Shows Correct Name (Priority: P1) 🎯 MVP

**Goal**: The top-bar avatar and profile dropdown display the user's `fullName` as returned by the backend.

**Independent Test**: Open the app while authenticated, click the profile avatar in the top bar, and confirm the dropdown shows the correct `fullName` and that the avatar initials match the `fullName` value.

### Implementation for User Story 1

- [x] T005 [US1] Update `getInitials` in `src/app/components/TopBar.tsx` to handle required `fullName` safely (keep null/undefined guard for robustness).
- [x] T006 [US1] Update the avatar fallback in `src/app/components/TopBar.tsx` to use `user.fullName` directly.
- [x] T007 [US1] Update the profile dropdown name display in `src/app/components/TopBar.tsx` to show `user.fullName` without a fallback string.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Registration Page Uses Full Name (Priority: P1)

**Goal**: The standalone user registration page collects and submits a single required `fullName` field.

**Independent Test**: Navigate to `/auth/register`, submit the form with a valid `fullName`, and confirm via DevTools that the `POST /api/v1/auth/register` payload contains `fullName` and no `firstName`/`lastName` fields.

### Implementation for User Story 2

- [x] T008 [US2] Add `fullName` length validation (2–100 characters, not only whitespace) in `src/app/components/RegistrationPage.tsx`.
- [x] T009 [US2] Update the `fullName` input label and placeholder in `src/app/components/RegistrationPage.tsx` to reflect the single required field.
- [x] T010 [US2] Confirm the `authService.register` call in `src/app/components/RegistrationPage.tsx` sends `fullName` and no legacy name fields.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Other Views Displaying User Name Are Updated (Priority: P2)

**Goal**: The settings/profile page and any other visible user-name surfaces render `fullName` consistently.

**Independent Test**: Navigate to Settings → الملف الشخصي, confirm the full name field displays the current `fullName`, and confirm the avatar initials match.

### Implementation for User Story 3

- [x] T011 [P] [US3] Update `getInitials` in `src/app/components/SettingsPage.tsx` to handle required `fullName` safely.
- [x] T012 [P] [US3] Update the avatar display in `src/app/components/SettingsPage.tsx` to use `user.fullName` directly.
- [x] T013 [US3] Update the full name input in `src/app/components/SettingsPage.tsx` to use `user.fullName` and bind to `updateProfile` when the save flow is implemented.
- [x] T014 [US3] Search the entire `src/app/` tree for any remaining user-name display that could still assume `firstName`/`lastName`; update or document as not applicable.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T015 [P] Run `pnpm build` and fix any TypeScript errors introduced by making `fullName` required.
- [x] T016 [P] Run the search verification from `quickstart.md` to confirm no stale `firstName`/`lastName`/`first_name`/`last_name` references remain in `src/`.
- [x] T017 Re-test all three user stories manually per `quickstart.md`.
- [x] T018 Update `AGENTS.md` reference to the current plan if not already updated.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed).
  - Or sequentially in priority order (US1 → US2 → US3).
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). No dependencies on other stories.

### Within Each User Story

- UI type updates before visual rendering updates.
- Validation rules before form submission.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks (Phase 1) can run in parallel.
- T005/T006/T007 (US1 top-bar changes) are sequential within the same file.
- T011/T012 (US3 avatar/settings updates) can run in parallel because they touch different parts of `SettingsPage.tsx` with no shared state, though they are in the same file.
- T015 and T016 (build + search verification) can run in parallel.
- Different user stories can be worked on in parallel by different team members once the Foundational phase is complete.

---

## Parallel Example: User Story 1

```bash
# T005, T006, T007 must be done in order because they edit the same file sequentially:
Task: "Update getInitials in src/app/components/TopBar.tsx"
Task: "Update avatar fallback in src/app/components/TopBar.tsx"
Task: "Update profile dropdown name display in src/app/components/TopBar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test the profile menu independently.
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
   - Developer A: User Story 1 (top bar).
   - Developer B: User Story 2 (registration page).
   - Developer C: User Story 3 (settings page + remaining views).
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
