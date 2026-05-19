# Tasks: Registration Field-Level Error Mapping

**Input**: Design documents from `/specs/009-registration-field-errors/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted; add if TDD approach is adopted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Review existing code and prepare integration points

- [x] T001 Review `RegistrationPage.tsx`, `auth.ts`, and `types/auth.ts` for field-error mapping integration points

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, utilities, and service-layer error handling that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Add field-level validation error types to `src/app/types/auth.ts`
- [x] T003 [P] Create `FIELD_ERROR_MAP` and `parseFieldErrors` utility in `src/app/utils/fieldErrorMap.ts`
- [x] T004 Extend `AuthError` class with optional `fieldErrors` record in `src/app/services/auth.ts`
- [x] T005 Update `handleResponse` to parse 400 `string[]` and classify errors into field-level vs general in `src/app/services/auth.ts`

**Checkpoint**: Foundation ready — `fieldErrorMap.ts` parses backend arrays and `AuthError` carries field-level data

---

## Phase 3: User Story 1 — Password Validation Errors Under Password Input (Priority: P1) 🎯 MVP

**Goal**: Backend password validation errors display directly beneath the password input field

**Independent Test**: Submit a password like `"password123"` (no uppercase) and verify the message appears under the password field and the generic banner is empty

### Implementation for User Story 1

- [x] T006 [US1] Register `password` backend-to-frontend mapping in `src/app/utils/fieldErrorMap.ts`
- [x] T007 [US1] Wire `setError('password', ...)` in `RegistrationPage.tsx` catch block when `error.fieldErrors.password` exists

**Checkpoint**: At this point, password 400 errors appear under the password field. Generic banner is used only for non-password / unmapped errors.

---

## Phase 4: User Story 2 — Name Validation Errors Under Name Inputs (Priority: P2)

**Goal**: Backend `firstName` and `lastName` validation errors display under the `fullName` input field

**Independent Test**: Submit with empty first name and verify `"firstName should not be empty"` appears under the fullName field

### Implementation for User Story 2

- [x] T008 [US2] Register `firstName` → `fullName` and `lastName` → `fullName` mappings in `src/app/utils/fieldErrorMap.ts`
- [x] T009 [US2] Wire `setError('fullName', ...)` in `RegistrationPage.tsx` catch block when `error.fieldErrors.fullName` exists

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 — Company and Role Resolution Errors Near Selection UI (Priority: P2)

**Goal**: Backend `companyId` and `roleId` UUID validation errors display near their respective selection UI elements

**Independent Test**: Submit with an invalid company ID selection and verify `"companyId must be a UUID"` appears near the company UI

### Implementation for User Story 3

- [x] T010 [US3] Register `companyId` → `company` and `roleId` → `role` mappings in `src/app/utils/fieldErrorMap.ts`
- [x] T011 [US3] Wire `setError('company', ...)` in `RegistrationPage.tsx` catch block when `error.fieldErrors.company` exists
- [x] T012 [US3] Wire `setError('role', ...)` in `RegistrationPage.tsx` catch block when `error.fieldErrors.role` exists

**Checkpoint**: All User Stories 1–3 should work independently

---

## Phase 6: User Story 4 — Multiple Field Errors and Unknown Error Handling (Priority: P3)

**Goal**: Multiple backend field errors appear under their respective inputs simultaneously; unmapped and non-400 errors fall back to the generic banner

**Independent Test**: Submit data that triggers password + firstName + unmapped backend field errors; verify all mapped errors appear under fields and the unmapped error appears in the banner

### Implementation for User Story 4

- [x] T013 [US4] Loop through all `error.fieldErrors` entries and call `setError` for each in `RegistrationPage.tsx`
- [x] T014 [US4] Display unmapped backend messages in the `apiError` banner in `RegistrationPage.tsx`
- [x] T015 [US4] Ensure non-400 errors bypass `setError` and appear only in the `apiError` banner in `RegistrationPage.tsx`

**Checkpoint**: All user stories independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Arabic RTL compatibility, documentation alignment, and final validation

- [x] T016 [P] Verify RTL layout compatibility and Arabic-friendly error placement in `src/app/components/RegistrationPage.tsx`
- [x] T017 [P] Update `AGENTS.md` with current plan reference `specs/009-registration-field-errors/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion
  - US1 (P1) → US2 (P2) → US3 (P2) → US4 (P3) (recommended sequential order)
  - OR parallel: US1, US2, US3 can be developed concurrently after Foundational
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories
- **User Story 2 (P2)**: No dependencies on other stories
- **User Story 3 (P2)**: No dependencies on other stories
- **User Story 4 (P3)**: Requires US1–US3 mappings to be in place, but the underlying mechanism is independent

### Within Each User Story

- Add mapping entries before wiring UI `setError`
- Core field mapping before multi-field / fallback handling

### Parallel Opportunities

- T002 and T003 (different files, foundational types + utility)
- T006, T008, T010 (all add mapping entries; different backend fields, same file but non-conflicting)
- T007, T009, T011, T012 (all wire `setError` for different fields in RegistrationPage.tsx; non-conflicting)
- T016 and T017 (different files)

---

## Parallel Example: User Story 2

```bash
# Add name mappings:
Task: "Register firstName/lastName -> fullName mappings in src/app/utils/fieldErrorMap.ts"

# Wire UI in parallel with US1 and US3:
Task: "Wire setError for fullName field in RegistrationPage.tsx catch block"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Submit a weak password and confirm the error appears under the password field
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Password errors under password field → Deploy/Demo
3. Add User Story 2 → Name errors under fullName field → Deploy/Demo
4. Add User Story 3 → Company/role UUID errors near selection UI → Deploy/Demo
5. Add User Story 4 → Multi-field support + unknown error fallback → Deploy/Demo

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (password field)
   - Developer B: User Story 2 (name fields)
   - Developer C: User Story 3 (company/role fields)
3. Stories complete and integrate independently; User Story 4 (multiple/unknown) can be picked up by any developer after US1–US3 mappings exist

---

## Notes

- [P] tasks = different files or non-conflicting changes, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- The `apiError` banner state and the `errors` object from React Hook Form must remain separate; `setError` does not affect `apiError`
- Backend field names are embedded in message strings; `parseFieldErrors` extracts them via prefix tokenization
