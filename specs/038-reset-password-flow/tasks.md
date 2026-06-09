# Tasks: Reset Password Page and Token Flow

**Input**: Design documents from `specs/038-reset-password-flow/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested. Manual validation steps per `quickstart.md` are included instead of automated tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure with all frontend code under `src/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare reusable utilities and routing for the new reset-password page.

- [x] T001 [P] Extract password validation rules utility in `src/lib/password-rules.ts` (reusable across RegistrationPage and ResetPasswordPage)
- [x] T002 [P] Add `/auth/reset-password` route entry with `ResetPasswordPage` import in `src/app/routes.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the component shell and layout that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Create `ResetPasswordPage.tsx` component shell in `src/app/components/ResetPasswordPage.tsx` with split-screen layout matching existing auth pages and `URLSearchParams` token extraction

**Checkpoint**: Foundation ready — component file exists, route wired, and layout shell renders. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 – Reset Password with Valid Token (Priority: P1) 🎯 MVP

**Goal**: Allow a user with a valid token to enter a new password, submit it to the backend, and be redirected to the sign-in page on success.

**Independent Test**: Navigate to `/auth/reset-password?token=VALID_UUID` (simulated), fill the form with matching valid passwords, submit, and verify redirect to `/auth/login` with success message.

### Implementation for User Story 1

- [x] T004 [P] [US1] Implement new password and confirm password form fields with RTL styling and Lucide icons in `src/app/components/ResetPasswordPage.tsx`
- [x] T005 [US1] Integrate `authService.resetPassword(token, newPassword)` submission handler with loading state in `src/app/components/ResetPasswordPage.tsx`
- [x] T006 [US1] Implement success state with Arabic confirmation message and `navigate('/auth/login')` redirect in `src/app/components/ResetPasswordPage.tsx`

**Checkpoint**: User Story 1 is fully functional. A valid token + strong matching password triggers a successful reset and redirect.

---

## Phase 4: User Story 2 – Handle Invalid or Expired Token (Priority: P1)

**Goal**: Surface clear, actionable error states when the token is missing, expired, already-used, or the backend returns a 400.

**Independent Test**: Navigate with an invalid/missing token, or submit with a valid-looking token that the backend rejects. Verify a unified error message appears with a call-to-action linking to `/auth/forgot-password`.

### Implementation for User Story 2

- [x] T007 [P] [US2] Implement unified "الرمز غير صالح أو منتهي الصلاحية" error state with CTA button to `/auth/forgot-password` in `src/app/components/ResetPasswordPage.tsx`
- [x] T008 [P] [US2] Implement missing `?token=` query param error state on initial page load in `src/app/components/ResetPasswordPage.tsx`
- [x] T009 [US2] Integrate network error handling with retry-friendly Arabic message in the submission handler in `src/app/components/ResetPasswordPage.tsx`

**Checkpoint**: User Stories 1 and 2 are independently functional. Invalid tokens show actionable errors; valid tokens succeed.

---

## Phase 5: User Story 3 – Client-Side Validation and Feedback (Priority: P2)

**Goal**: Provide real-time password strength feedback and confirmation matching to prevent unnecessary backend submissions.

**Independent Test**: Type a weak password or mismatched confirmation. Verify inline rule checklist updates and the submit button remains disabled until all rules pass.

### Implementation for User Story 3

- [x] T010 [P] [US3] Integrate password strength rules checklist (min length, uppercase, lowercase, number, special char) using the extracted utility in `src/app/components/ResetPasswordPage.tsx`
- [x] T011 [US3] Implement `confirmPassword` mismatch validation with inline Arabic error message in `src/app/components/ResetPasswordPage.tsx`
- [x] T012 [US3] Disable submit button while client-side validation errors exist in `src/app/components/ResetPasswordPage.tsx`

**Checkpoint**: All user stories are functional. Form prevents submissions of weak or mismatched passwords and displays clear real-time feedback.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ensure consistency, compliance with the constitution, and readiness for manual validation.

- [x] T013 [P] Verify RTL layout and Arabic text consistency across `src/app/components/ResetPasswordPage.tsx` against `LoginPage.tsx` and `ForgetPasswordPage.tsx`
- [x] T014 [P] Run `quickstart.md` manual testing validation for all token states (valid, expired, used, malformed, missing)
- [x] T015 Review Constitution compliance: no hardcoded API endpoints, reusable patterns used, JSDoc added for new component

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–5)**: All depend on Foundational phase completion
  - User stories procede sequentially (P1 → P2) since they target the same component file
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)** → Depends on Foundational (T003)
- **User Story 2 (P1)** → Depends on User Story 1 (T005, T006). Error state rendering depends on the form + submission handler being in place.
- **User Story 3 (P2)** → Depends on User Story 1 (T004). Validation requires the form fields to exist.

### Within Each User Story

- Form fields before submission handler
- Submission handler before success/error states
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 can run in parallel (different files, no dependencies)
- T004, T007, and T008 can run in parallel once T003 is complete (different UI states within the same file, but can be drafted independently and merged)
- T010 and T013 can run in parallel once T003 is complete
- T014 and T015 can run in parallel during Polish

---

## Parallel Example: User Story 1 + Foundational

```bash
# After Foundational (T003):
Task: "T004 [US1] Implement new password and confirm password form fields in ResetPasswordPage.tsx"
Task: "T007 [US2] Implement unified error state in ResetPasswordPage.tsx"
Task: "T008 [US2] Implement missing token error state in ResetPasswordPage.tsx"

# After form fields (T004):
Task: "T005 [US1] Integrate authService.resetPassword() submission handler"
Task: "T010 [US3] Integrate password strength rules checklist"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003)
3. Complete Phase 3: US1 (T004–T006)
4. Complete Phase 4: US2 (T007–T009)
5. **STOP and VALIDATE**: Test the core reset flow (valid + invalid tokens) per `quickstart.md`
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Component shell renders at `/auth/reset-password`
2. User Story 1 → Valid token flow works; success redirects to login
3. User Story 2 → Invalid tokens show actionable errors
4. User Story 3 → Real-time validation improves UX
5. Polish → RTL consistency, manual testing, compliance review

---

## Notes

- `[P]` tasks = different files or independent UI state branches within the same file, no runtime dependencies
- `[Story]` label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
