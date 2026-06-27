# Tasks: Merge User and Organization Registration

**Input**: Design documents from `/specs/070-org-registration-merge/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and not requested in the feature specification. This task list focuses on implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure and confirm no new dependencies are needed.

- [X] T001 Confirm project structure matches plan.md: `src/api/services/auth-service.ts`, `src/app/pages/auth/OrgRegistrationPage.tsx`, `src/app/routes.tsx` exist and are importable.
- [X] T002 [P] Confirm `npm run dev` starts the Vite dev server without errors.
- [X] T003 [P] Confirm `src/app/components/RegistrationPage.tsx` and `src/app/pages/onboarding/RegistrationPage.tsx` are unchanged and load correctly.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare the API service contract and shared types so all user stories can build on a consistent foundation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Update `OrgRegistrationData` interface in `src/api/services/auth-service.ts` to include `fullName`, `registrationDate`, and `city` fields per `data-model.md`.
- [X] T005 Update `AuthService.registerOrganization()` in `src/api/services/auth-service.ts` so it no longer auto-stores the returned access token (the consumer will decide whether to log in).
- [X] T006 [P] Verify `src/api/types.ts` error shape supports field-level errors; no changes needed unless the backend contract changes.

**Checkpoint**: Foundation ready — the atomic registration endpoint contract and types are aligned with the clarified spec.

---

## Phase 3: User Story 1 - Combined Organization Registration Page (Priority: P1) 🎯 MVP

**Goal**: A visitor can visit `/auth/register/org`, fill a single merged form, submit it, and the system creates both a user account and an organization through one atomic API call.

**Independent Test**: Visit `/auth/register/org`, complete all required fields, submit the form, and verify that the API call is made to `POST /api/v1/auth/register-organization` and the user is redirected to `/auth/login?registered=true` with a success message.

### Implementation for User Story 1

- [X] T007 [US1] Add `fullName` field to the `FormData` interface, initial state, validation, and JSX form layout in `src/app/pages/auth/OrgRegistrationPage.tsx`.
- [X] T008 [US1] Add `registrationDate` field to the `FormData` interface, initial state, validation, and JSX form layout in `src/app/pages/auth/OrgRegistrationPage.tsx`.
- [X] T009 [US1] Add `city` field to the `FormData` interface, initial state, validation, and JSX form layout in `src/app/pages/auth/OrgRegistrationPage.tsx`.
- [X] T010 [US1] Update the `handleSubmit` payload in `src/app/pages/auth/OrgRegistrationPage.tsx` to include `fullName`, `registrationDate`, and `city` and to send them to `authService.registerOrganization()`.
- [X] T011 [US1] Remove the `login()` call and `/dashboard/onboarding/assessment` redirect from the success path in `src/app/pages/auth/OrgRegistrationPage.tsx`; redirect to `/auth/login?registered=true` with a `toast.success` message instead.
- [X] T012 [P] [US1] Ensure the form error banner in `src/app/pages/auth/OrgRegistrationPage.tsx` still displays a single, clear message when the atomic API returns an error.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - No Duplicate Fields (Priority: P1)

**Goal**: The combined page removes duplicated fields so that email, phone, and company/organization name appear exactly once while the backend still receives all data needed for both entities.

**Independent Test**: Inspect the `/auth/register/org` form and confirm that email, phone, and organization/company name each appear exactly once. Submit the form and verify the payload includes the values for both the user and organization contexts.

### Implementation for User Story 2

- [X] T013 [US2] Confirm the merged `orgName` field in `src/app/pages/auth/OrgRegistrationPage.tsx` is the single source for both user `companyName` and organization `name`; update the payload to send `name` from `orgName` and also include a `companyName` field if required by the backend.
- [X] T014 [US2] Confirm the merged `email` field in `src/app/pages/auth/OrgRegistrationPage.tsx` appears once and is sent to the atomic endpoint once; no separate user-email field exists.
- [X] T015 [US2] Confirm the merged `phone` field in `src/app/pages/auth/OrgRegistrationPage.tsx` appears once and is sent to the atomic endpoint once; no separate user-phone field exists.
- [X] T016 [US2] Add inline comment or small payload-shape verification log in `src/app/pages/auth/OrgRegistrationPage.tsx` (or remove before commit) to assert that no duplicate keys are sent for shared fields.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Preserved Existing Registration Pages (Priority: P2)

**Goal**: The existing `/auth/register` and `/dashboard/onboarding/registration` pages remain functional and unchanged in behavior while the new combined page is rolled out.

**Independent Test**: Visit `/auth/register` and `/dashboard/onboarding/registration` and confirm both still load and submit successfully exactly as before.

### Implementation for User Story 3

- [X] T017 [US3] Verify `src/app/components/RegistrationPage.tsx` has not been modified in this feature; run its existing happy-path flow and confirm redirect to `/auth/login?registered=true` still works.
- [X] T018 [US3] Verify `src/app/pages/onboarding/RegistrationPage.tsx` has not been modified in this feature; run its existing save-and-proceed flow and confirm redirect to `/dashboard/onboarding/assessment` still works.
- [X] T019 [US3] Run a `git diff` check to confirm no unintended changes to `src/app/components/RegistrationPage.tsx` or `src/app/pages/onboarding/RegistrationPage.tsx`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-cutting improvements and final validation that affect all user stories.

- [X] T020 [P] Run `npm run build` and fix any TypeScript or Vite errors in `src/app/pages/auth/OrgRegistrationPage.tsx` or `src/api/services/auth-service.ts`.
- [X] T021 [P] Perform manual smoke test on `/auth/register/org` per `specs/070-org-registration-merge/quickstart.md` happy-path and error-path scenarios.
- [X] T022 [P] Perform regression smoke test on `/auth/register` and `/dashboard/onboarding/registration` per `specs/070-org-registration-merge/quickstart.md`.
- [X] T023 Review password validation in `src/app/pages/auth/OrgRegistrationPage.tsx` to ensure it matches `src/app/components/RegistrationPage.tsx` (presence + confirmation match only).
- [X] T024 Review duplicate-account error handling in `src/app/pages/auth/OrgRegistrationPage.tsx` to confirm it surfaces the atomic API response without making separate existence-check calls.
- [X] T025 Update `specs/070-org-registration-merge/quickstart.md` if any verification steps changed during implementation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed) or sequentially in priority order (P1 → P1 → P2).
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) and after User Story 1 form structure is mostly in place; mostly independent but shares the same form file.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — independent verification task.

### Within Each User Story

- Core fields/validation before submit handler changes.
- Submit handler changes before success/error path changes.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel.
- All Foundational tasks marked [P] (T006) can run in parallel with T004 and T005.
- User Story 1 field additions (T007, T008, T009) can be done in parallel if carefully coordinated to avoid JSX conflicts.
- User Story 2 duplicate-field verifications (T013-T015) can run in parallel once T010 is complete.
- User Story 3 regression tests (T017-T019) can run in parallel.
- Polish tasks (T020-T025) can mostly run in parallel after user stories are complete.

---

## Parallel Example: User Story 1

```bash
# Launch all field additions together:
Task: "T007 [US1] Add fullName field in src/app/pages/auth/OrgRegistrationPage.tsx"
Task: "T008 [US1] Add registrationDate field in src/app/pages/auth/OrgRegistrationPage.tsx"
Task: "T009 [US1] Add city field in src/app/pages/auth/OrgRegistrationPage.tsx"

# Then update submit/redirect logic:
Task: "T010 [US1] Update handleSubmit payload in src/app/pages/auth/OrgRegistrationPage.tsx"
Task: "T011 [US1] Remove login call and redirect to /auth/login?registered=true in src/app/pages/auth/OrgRegistrationPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3: User Story 1 (combined page works end-to-end).
4. **STOP and VALIDATE**: Test User Story 1 independently.
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
   - Developer A: User Story 1 (form fields + redirect).
   - Developer B: User Story 2 (duplicate-field mapping verification).
   - Developer C: User Story 3 (regression tests on existing pages).
3. Stories complete and integrate independently; final Polish phase validates everything.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
