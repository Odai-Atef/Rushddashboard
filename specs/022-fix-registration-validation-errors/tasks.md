# Tasks: Fix Registration Error Rendering and Field Highlighting from Backend Validation

**Input**: Design documents from `specs/022-fix-registration-validation-errors/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/auth-api-errors.md, quickstart.md

**Tests**: This is a frontend UX/behavior fix. Unit and component tests are included per quickstart.md recommendations.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Minimal setup — this is a bug fix on existing files; no new project scaffolding needed.

- [x] T001 [P] Verify branch `022-rushd-frontend-fix` is active and dev server starts with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fix the parser and service layer that all user stories depend on. These MUST complete before touching the registration page UI.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Update `src/app/utils/fieldErrorMap.ts` `parseFieldErrors` to handle `"property {field} should not exist"` prefix before field lookup
- [x] T003 Update `src/app/services/auth.ts` `handleResponse` to construct `AuthError.message` by joining the **entire** `message` array (not just `unmapped` or `message[0]`)
- [x] T004 [P] Add unit tests in `src/app/utils/fieldErrorMap.test.ts` covering: normal prefix, property prefix, unmapped field, empty array

**Checkpoint**:
- Parser correctly extracts field from `"property roleId should not exist"`
- `AuthError.message` contains all backend messages joined with `; `
- Unit tests for `fieldErrorMap.ts` pass

---

## Phase 3: User Story 1 — Password Validation Errors Under Password Input with Highlighting (Priority: P1) 🎯 MVP

**Goal**: When backend returns password validation errors, they appear under the password input and the password field is highlighted.

**Independent Test**: Fill registration form with password `password123`, submit, mock `registerApi` to return an `AuthError` with `fieldErrors: { password: ["must contain at least one uppercase letter"] }`, assert error text appears under password input and input has `border-red-500` class.

- [x] T005 [US1] Verify `src/app/components/RegistrationPage.tsx` `onSubmit` catch block correctly sets password field error via `setError('password', { type: 'server', message: ... })`
- [x] T006 [US1] Confirm password `input` applies `border-red-500` class when `errors.password` exists from `formState`
- [x] T007 [P] [US1] Add component test in `src/app/components/RegistrationPage.test.tsx` asserting password backend error renders under input with red border

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 — Role-Related Errors Under Role Selection with Highlighting (Priority: P2)

**Goal**: When backend returns role validation errors (e.g. `"property roleId should not exist"`), the role select is highlighted and the message appears under it.

**Independent Test**: Mock `registerApi` with `AuthError` containing `fieldErrors: { roleId: ["property roleId should not exist"] }`, submit form, assert error text appears under role select and select has `border-red-500`.

- [x] T008 [US2] Verify `src/app/components/RegistrationPage.tsx` `onSubmit` catch block correctly sets role field error via `setError('roleId', { type: 'server', message: ... })`
- [x] T009 [US2] Confirm role `select` applies `border-red-500` class when `errors.roleId` exists from `formState`
- [x] T010 [P] [US2] Add component test in `src/app/components/RegistrationPage.test.tsx` asserting role backend error renders under select with red border

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 — Top-of-Form Summary of All Validation Errors (Priority: P2)

**Goal**: All returned validation messages are visible in a summary error block at the top of the form, regardless of whether they are mapped to fields.

**Independent Test**: Mock `registerApi` with `AuthError` where `message` contains 3 joined messages (some mapped, some unmapped). Submit form, assert summary banner renders all 3 messages.

- [x] T011 [US3] Update `src/app/components/RegistrationPage.tsx` to unconditionally render `apiError` summary banner whenever `apiError` is non-empty (remove the conditional that hides it when field errors are present)
- [x] T012 [US3] Ensure the `onSubmit` catch block always calls `setApiError(error.message)` so the summary contains **all** backend messages
- [x] T013 [P] [US3] Add component test in `src/app/components/RegistrationPage.test.tsx` asserting summary banner contains all backend messages including mapped ones

**Checkpoint**: Summary block displays all messages; field-level displays remain independently functional.

---

## Phase 6: User Story 4 — Multiple Simultaneous Field Errors with Granular Clearing (Priority: P3)

**Goal**: When multiple fields have errors, editing one field clears only that field's error while unrelated errors remain.

**Independent Test**: Mock `registerApi` with errors on both password and role. Simulate editing the password field, assert password error clears, assert role error remains.

- [x] T014 [US4] Verify `src/app/components/RegistrationPage.tsx` uses RHF `register()` (not uncontrolled inputs) so `onChange` clears field-specific `formState.errors` automatically
- [x] T015 [US4] Confirm `select` elements for company and role also clear their errors on change (add `onChange` handlers if needed for select fields)
- [x] T016 [P] [US4] Add component test in `src/app/components/RegistrationPage.test.tsx` asserting granular clearing works for password/role simultaneous errors

**Checkpoint**: Editing a field removes only that field's error and highlight.

---

## Phase 7: User Story 5 — Replace Generic "Fetch Error" with Actionable Backend Messages (Priority: P1)

**Goal**: Frontend never collapses backend 400 validation responses into a generic "Fetch error".

**Independent Test**: Mock `registerApi` with a plain validation `AuthError`. Assert UI never contains text "Fetch error" and instead shows actual backend message(s).

- [x] T017 [US5] Audit `src/app/components/RegistrationPage.tsx` catch block to remove any fallback string that could display "Fetch error" for 400 responses
- [x] T018 [US5] Confirm `src/app/services/auth.ts` `handleResponse` preserves full `message` array even when `fieldErrors` parse fails partially
- [x] T019 [P] [US5] Add component test in `src/app/components/RegistrationPage.test.tsx` asserting no "Fetch error" text appears for 400 validation responses

**Checkpoint**: All backend 400 messages surface to the user directly.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: RTL layout preservation, type safety, and regression checks across all user stories.

- [x] T020 [P] Run `npm run typecheck` on `src/app/services/auth.ts`, `src/app/utils/fieldErrorMap.ts`, and `src/app/components/RegistrationPage.tsx`
- [x] T021 [P] Run `npx vitest run` to verify no regressions in existing tests
- [x] T022 [P] Manual QA: submit registration form with Arabic locale active and confirm error placement does not break RTL layout
- [x] T023 Verify `src/app/components/RegistrationPage.tsx` checkbox `agreeToTerms` error clearing also works on change/toggle
- [ ] T024 [P] Update `src/app/components/RegistrationPage.tsx` to use `shadcn/ui/form.tsx` primitives (`FormField`, `FormItem`, `FormMessage`) if doing so simplifies error display (optional refactor)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1; BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Phase 2 completion
  - US1 (P1), US5 (P1) are highest priority
  - US2 (P2), US3 (P2) can follow
  - US4 (P3) depends on US1–3 being wired
- **Polish (Phase 8)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2. No dependency on other stories.
- **US2 (P2)**: Can start after Phase 2. No dependency on other stories.
- **US3 (P2)**: Can start after Phase 2. Depends on T002 (auth.ts summary fix).
- **US4 (P3)**: Can start after Phase 2. Needs US1–3 field wiring in place.
- **US5 (P1)**: Can start after Phase 2. Depends on T002/T003 and RegistrationPage catch block.

### Within Each User Story

1. Verify/setError wiring in RegistrationPage.tsx
2. Verify visual highlight (border class)
3. Add component test

### Parallel Opportunities

- T001–T003 can be developed in parallel (different files).
- T005/T008/T011/T014/T017 can start once Phase 2 is merged.
- Component tests T007/T010/T013/T016/T019 can be written in parallel with their implementation tasks (if mocks are ready).
- Typecheck T020 and existing test run T021 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Implementation + test can be worked on together:
Task: "Verify RegistrationPage.tsx password error setError wiring"
Task: "Add component test for password error display in RegistrationPage.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 5)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (T001–T004)
3. Complete Phase 3: User Story 1 (password errors + highlight)
4. Complete Phase 7: User Story 5 (no generic "Fetch error")
5. **STOP and VALIDATE**: Submit form with bad password, confirm:
   - Password message appears under password input
   - Password input has red border
   - Top banner shows all messages
   - No "Fetch error" text appears
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (P1) → Password errors render and highlight → Validate
3. Add US5 (P1) → No generic error fallback → Validate
4. Add US2 (P2) → Role errors render and highlight → Validate
5. Add US3 (P2) → Summary shows all messages → Validate
6. Add US4 (P3) → Granular clearing verified → Validate
7. Polish → Typecheck, tests, RTL QA

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 2 together (T001–T004)
2. Once Phase 2 is done:
   - Developer A: US1 (T005–T007)
   - Developer B: US2 (T008–T010) + US3 (T011–T013)
   - Developer C: US5 (T017–T019) + US4 (T014–T016)
3. Polish phase (T020–T024) done together

---

## Notes

- All RegistrationPage.tsx changes should preserve existing Arabic RTL layout.
- No new npm dependencies should be added.
- `fieldErrorMap.ts` parser changes must be backward-compatible with normal `"field message"` entries.
- `auth.ts` changes must continue to handle non-400 errors correctly.
- Component tests in `RegistrationPage.test.tsx` should mock `registerApi` and `useAuth` hook.
