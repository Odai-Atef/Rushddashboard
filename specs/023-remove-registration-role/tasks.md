# Tasks: Remove Role Selection from Registration Flow

**Input**: Design documents from `specs/023-remove-registration-role/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: The feature is a registration flow fix; tests are updated alongside implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new setup needed — changes are localized to existing components.

---

## Phase 2: Foundational — Update Types and Schema (Blocking Prerequisites)

**Purpose**: Update the shared registration type and Zod schema so that `roleId` is no longer required. This blocks all user story work because the form and service depend on these types.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 [P] Remove `roleId` from `RegisterRequest` interface in `src/app/types/auth.ts`
- [ ] T002 Remove `roleId` field from `registerBaseSchema` in `src/app/types/auth.ts`

**Checkpoint**: Registration types and schema no longer include `roleId`. Build/lint passes.

---

## Phase 3: User Story 1 — Remove Role Selector from Registration Form (Priority: P1) 🎯 MVP

**Goal**: The frontend registration form no longer displays a role selector, and users can complete registration without choosing a role.

**Independent Test**: Load the registration page and confirm no "الدور" (role) selector is rendered. Submit the form with valid data and verify no `roleId` is sent in the network payload.

### Tests for User Story 1

- [ ] T003 [US1] Update `RegistrationPage.test.tsx` to remove all `roleId` interactions and assertions (selecting role, role error highlighting, role error clearing)
- [ ] T004 [US1] Update `fieldErrorMap.test.ts` to remove `roleId` from test data and expected outputs

### Implementation for User Story 1

- [ ] T005 [P] [US1] Remove `roleId` default value from `useForm` in `src/app/components/RegistrationPage.tsx`
- [ ] T006 [US1] Remove role selector JSX block (label, select, error display) for "الدور" from `src/app/components/RegistrationPage.tsx`
- [ ] T007 [US1] Remove `Sparkles` import and `STATIC_ROLES` data from `src/app/components/RegistrationPage.tsx` if unused
- [ ] T008 [US1] Remove `roleId` mapping entry from `FIELD_ERROR_MAP` in `src/app/utils/fieldErrorMap.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently — the registration form renders without a role field and the payload excludes `roleId`.

---

## Phase 4: User Story 2 — Consistent Registration Contract Between Frontend and Backend (Priority: P1)

**Goal**: The frontend payload matches the backend self-registration contract exactly, with no unsupported properties sent.

**Independent Test**: Inspect the network request payload during registration submission and confirm it contains only: `email`, `password`, `firstName`, `lastName`, `companyId`.

### Implementation for User Story 2

- [ ] T009 [US2] Verify `registerApi` in `src/app/services/auth.ts` still works correctly after types update and does not manually inject `roleId`
- [ ] T010 [US2] Remove `Role` type and `roleId` references from `src/app/types/auth.ts` if no longer used elsewhere in the app

**Checkpoint**: At this point, User Story 2 should be independently verifiable via network inspection or service-layer unit tests.

---

## Phase 5: User Story 3 — Role Assignment After Registration (Priority: P2)

**Goal**: The backend assigns a safe default role to self-registered users automatically.

**Independent Test**: Complete a successful registration and inspect the response data (or user profile) to confirm a valid `roleId` was assigned by the backend.

### Implementation for User Story 3

- [ ] T011 [US3] Ensure `AuthResponse` and `UserProfile` retain `roleId` in the response type so the frontend can display the backend-assigned role if needed
- [ ] T012 [US3] Confirm no frontend code attempts to override or modify the `roleId` returned from the backend registration response

**Checkpoint**: Backend-assigned default role is preserved and accessible after registration.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, documentation, and contract updates.

- [ ] T013 [P] Update API contract documentation in `specs/023-remove-registration-role/contracts/auth-api.md` to mark `roleId` as removed from request payload
- [ ] T014 [P] Update `specs/020-align-registration-dto/contracts/auth-api.md` to reflect that `roleId` is no longer sent by the frontend during self-registration
- [ ] T015 Run frontend lint and typecheck to verify no `roleId` or `Role` references remain in registration-related files
- [ ] T016 Register tests pass after all changes: `npm test -- RegistrationPage.test.tsx` and `npm test -- fieldErrorMap.test.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: Depends on nothing — can start immediately. **BLOCKS** all user story phases.
- **User Story 1 (Phase 3)**: Depends on Phase 2 (types/schema updated). Can run in parallel with US2.
- **User Story 2 (Phase 4)**: Depends on Phase 2. Same files touched as US1, so executes together.
- **User Story 3 (Phase 5)**: Depends on Phase 2. Mostly verification — can run in parallel with US1/US2.
- **Polish (Phase 6)**: Depends on all implementation phases completing.

### Within Each User Story

- Tests MUST be updated alongside implementation so tests reflect the new behavior.
- Types/schema before component changes.
- Component before service verification.

### Parallel Opportunities

- T001 and T002 (types/schema) can be done together.
- T005 and T008 (component default value + fieldErrorMap) can run in parallel.
- T003 and T004 (test files) can be updated in parallel.
- T013 and T014 (documentation updates) can run in parallel.
- With multiple developers:
  - Dev A: T001 + T002 (types/schema)
  - Dev B: T005–T007 + T008 (component + mapping)
  - Dev C: T003 + T004 (tests)

---

## Parallel Example: User Story 1

```bash
# Launch all implementation tasks for User Story 1 together:
Task: "Remove roleId default value and role selector from RegistrationPage.tsx"
Task: "Remove roleId mapping entry from fieldErrorMap.ts"

# Launch test updates together:
Task: "Update RegistrationPage.test.tsx to remove roleId interactions"
Task: "Update fieldErrorMap.test.ts to remove roleId references"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2 Only)

1. Complete Phase 2: Update types/schema.
2. Complete Phase 3 + Phase 4: Remove role selector, update tests, verify contract alignment.
3. **STOP and VALIDATE**: Registration form works, payload excludes `roleId`, no validation errors.
4. Deploy/demo if ready.

### Incremental Delivery

1. Complete Phase 2 → Foundation ready.
2. Add Phase 3 (US1) → Registration form works without role selector → Validate.
3. Add Phase 4 (US2) → Contract verified → Validate.
4. Add Phase 5 (US3) → Backend default role confirmed → Validate.
5. Add Phase 6 → Documentation and polish → Final validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 2 together.
2. Once types are updated:
   - Developer A: RegistrationPage.tsx changes (T005–T007)
   - Developer B: fieldErrorMap.ts changes (T008) + test updates (T003, T004)
   - Developer C: Service/type verification (T009–T012) + docs (T013, T014)
3. Merge and run full test suite (T015, T016).

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Verify no `roleId` references leak into the registration payload by inspecting the network request.
- The `Role` interface and `STATIC_ROLES` data may still be used elsewhere (e.g., admin panel); only remove from registration flow.
- Commit after each logical group of tasks.
- Stop at any checkpoint to validate story independently.
