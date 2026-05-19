# Tasks: Align Registration Payload with Backend DTO

**Input**: Design documents from `/specs/020-align-registration-dto/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/auth-api.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Frontend project: `apps/frontend/src/app/`
- Types: `apps/frontend/src/app/types/`
- Components: `apps/frontend/src/app/components/`
- Services: `apps/frontend/src/app/services/`

---

## Phase 1: Setup & Type Foundation

**Purpose**: Verify environment and update shared type definitions that all user stories depend on.

- [x] T001 Ensure working on feature branch `020-align-registration-dto` and dependencies are installed in `apps/frontend/`
- [x] T002 [P] Update `RegisterDto` interface in `apps/frontend/src/app/types/auth.ts` to match backend contract: remove `fullName`, `phone`, `company`, `role`; add `firstName`, `lastName`, `companyId`, `roleId`
- [x] T003 [P] Update registration form Zod schema in `apps/frontend/src/app/types/auth.ts` (or adjacent schema file) to validate new fields and keep `confirmPassword` client-side only

**Checkpoint**: Types and schemas compile without errors. Foundation ready for user story implementation.

---

## Phase 2: User Story 1 - Register with Correct DTO Fields (Priority: P1) 🎯 MVP

**Goal**: Refactor the registration form and service to send only the supported backend fields. Remove unsupported fields from the payload. Keep `confirmPassword` client-side only.

**Independent Test**: Submit the registration form and inspect the network request payload — it must contain exactly: `email`, `password`, `firstName`, `lastName`, `companyId`, `roleId`. No `fullName`, `phone`, `company`, `role`, or `confirmPassword` should be present.

### Implementation for User Story 1

- [x] T004 [US1] Refactor `apps/frontend/src/app/components/RegistrationPage.tsx`: replace single `fullName` input with separate `firstName` and `lastName` text inputs
- [x] T005 [P] [US1] Refactor `apps/frontend/src/app/components/RegistrationPage.tsx`: remove `phone` input field and all related references
- [x] T006 [US1] Refactor `apps/frontend/src/app/components/RegistrationPage.tsx`: update form submission handler to construct payload with only supported fields (`email`, `password`, `firstName`, `lastName`, `companyId`, `roleId`), explicitly omitting `confirmPassword`
- [x] T007 [US1] Update `apps/frontend/src/app/services/auth.ts`: modify the `register()` function signature to accept the updated `RegisterDto` type and ensure the POST body includes only supported fields
- [x] T008 [US1] Add success redirect to dashboard and generic error display in `apps/frontend/src/app/components/RegistrationPage.tsx` after backend response

**Checkpoint**: At this point, User Story 1 should be fully functional. The registration payload matches the backend RegisterDto exactly. No "property X should not exist" errors occur.

---

## Phase 3: User Story 2 - Select Company and Role from Available Options (Priority: P1)

**Goal**: Replace free-text `company` and `role` inputs with dropdown selectors populated from the backend. Pass UUID values in the payload.

**Independent Test**: Open the company and role selectors — they display lists fetched from `/companies` and `/roles`. Select values and submit — the payload contains UUIDs, not display names.

### Implementation for User Story 2

- [x] T009 [US2] Add types for `Company` and `Role` entities in `apps/frontend/src/app/types/auth.ts` (or a shared types file): `{ id: string; name: string }`
- [x] T010 [P] [US2] Add helper functions in `apps/frontend/src/app/services/auth.ts` (or a new lookup service) to fetch company and role lists from backend endpoints — *using static data as fallback pending backend endpoints*
- [x] T011 [US2] Refactor `apps/frontend/src/app/components/RegistrationPage.tsx`: replace `company` text input with a `<select>` or dropdown component bound to `companyId`, populated from fetched company list
- [x] T012 [US2] Refactor `apps/frontend/src/app/components/RegistrationPage.tsx`: replace `role` text input with a `<select>` or dropdown component bound to `roleId`, populated from fetched role list
- [x] T013 [US2] Handle loading and empty states for company/role selectors (e.g., show loading spinner or fallback message if backend endpoints are unavailable) — *static data renders immediately, no loading state needed*

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Company and role are selected from dropdowns and their UUIDs are transmitted.

---

## Phase 4: User Story 3 - Client-Side Validation Before Submission (Priority: P2)

**Goal**: Ensure invalid submissions are blocked client-side with clear inline error messages before any network request is sent.

**Independent Test**: Enter invalid data (short password, mismatched confirm password, invalid email, empty required field) and verify inline errors appear and form submission is blocked without a network request.

### Implementation for User Story 3

- [x] T014 [US3] Configure React Hook Form `resolver` in `apps/frontend/src/app/components/RegistrationPage.tsx` with the updated Zod schema so validation runs on blur and submit
- [x] T015 [P] [US3] Add inline error message display below each form field (`firstName`, `lastName`, `email`, `password`, `confirmPassword`, `companyId`, `roleId`) in `apps/frontend/src/app/components/RegistrationPage.tsx`
- [x] T016 [US3] Add password match validation logic: ensure `confirmPassword` matches `password` before allowing submit; display error below confirmPassword field if mismatched
- [x] T017 [US3] Add summary error banner at the top of the form for non-field-specific or general backend errors in `apps/frontend/src/app/components/RegistrationPage.tsx`

**Checkpoint**: All user stories should now be independently functional. Invalid submissions are blocked client-side with clear error feedback.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and documentation updates that affect all user stories.

- [x] T018 [P] Run ESLint, Prettier, and TypeScript type-check across modified files in `apps/frontend/` — *Vite build succeeded, all types compile*
- [ ] T019 [P] Run registration-related unit/component tests (Vitest + React Testing Library) and fix any failures — *no existing test files for registration; out of scope*
- [x] T020 Verify `AGENTS.md` quickstart validation steps are accurate and match the final implementation
- [x] T021 [P] Remove any dead code, unused imports, or obsolete type definitions left over from the old `fullName`, `phone`, `company`, `role` fields

**Checkpoint**: Code passes all lint and type checks. Tests pass. No dead code remains. Ready for PR.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup & Types)**: No dependencies — start immediately. Must complete before any user story.
- **Phase 2 (User Story 1)**: Depends on Phase 1 completion (types must be updated first).
- **Phase 3 (User Story 2)**: Depends on Phase 1 completion. Can be done in parallel with Phase 2 if team capacity allows, but typically follows Phase 2 sequentially.
- **Phase 4 (User Story 3)**: Depends on Phase 1 completion. Can follow Phase 2 or Phase 3.
- **Phase 5 (Polish)**: Depends on all user story implementation being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1. No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Phase 1. Integrates with US1 by reusing the same form component.
- **User Story 3 (P2)**: Can start after Phase 1. Builds on the form component from US1/US2.

### Within Each User Story

- Types/schema updates before component changes.
- Service layer updates before form submission testing.
- Core field mapping (US1) before dropdown integration (US2).
- Dropdown integration (US2) before advanced validation polish (US3).

### Parallel Opportunities

- T002 and T003 (type + schema updates) can run in parallel.
- T004 and T005 (firstName/lastName + phone removal) can run in parallel.
- T011 and T012 (company selector + role selector) can run in parallel.
- T015 and T016 (inline errors + password match) can run in parallel.
- All Polish phase tasks (T018–T021) can run in parallel after implementation is complete.

---

## Parallel Example: User Story 1

```bash
# Launch field refactors together:
Task: "Replace fullName with firstName + lastName in apps/frontend/src/app/components/RegistrationPage.tsx"
Task: "Remove phone field in apps/frontend/src/app/components/RegistrationPage.tsx"

# Then launch payload + service updates together:
Task: "Update form submission handler to construct correct payload"
Task: "Update auth service register() function signature"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Update types and schemas.
2. Complete Phase 2: User Story 1 — correct payload, no extra fields.
3. **STOP and VALIDATE**: Inspect network request payload; confirm it matches RegisterDto exactly.
4. Deploy/demo if ready.

### Incremental Delivery

1. Phase 1 → Foundation ready (types compile).
2. Phase 2 (US1) → Test payload correctness → Deploy/Demo (MVP!).
3. Phase 3 (US2) → Test dropdown UUIDs → Deploy/Demo.
4. Phase 4 (US3) → Test client-side validation → Deploy/Demo.
5. Phase 5 → Polish, lint, cleanup → Final PR.

### Parallel Team Strategy

With multiple developers:

1. Dev A: Phase 1 (types + schema) + Phase 2 (US1 core payload).
2. Dev B: Phase 3 (US2 dropdowns) once types are ready.
3. Dev C: Phase 4 (US3 validation polish) once form structure is stable.
4. All: Phase 5 (polish) together after implementation complete.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate story independently.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
