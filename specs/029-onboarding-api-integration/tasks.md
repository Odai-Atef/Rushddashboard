# Tasks: Onboarding API Integration

**Input**: Design documents from `specs/029-onboarding-api-integration/`
**Prerequisites**: plan.md, spec.md

**Tests**: Not requested in specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm project state and examine existing service patterns

- [x] T001 Verify current branch is `046-onboarding-api-integration` and working tree is clean
- [x] T002 [P] Examine existing `src/api/services/analysis-service.ts` and `src/api/services/auth-service.ts` to understand the service pattern and `apiClient` usage
- [x] T003 [P] Examine existing `src/api/services/index.ts` to understand export patterns
- [x] T004 [P] Review `src/app/components/CharityOnboardingFlow.tsx` to understand current local-state-only registration and profile screens

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared onboarding service and hook that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `src/api/services/onboarding-service.ts` with methods: `createOrganization`, `getOrganization`, `updateOrganization`, `createProfile`, `getProfile`, `setFundingAreas`, `getFundingAreas`
- [x] T006 Export onboarding service from `src/api/services/index.ts`
- [x] T007 Create `src/app/hooks/useOnboardingRegistration.ts` with state management for: organization data, profile data, loading states, error states, auto-save timer, and localStorage `onboardingOrgId` read/write

**Checkpoint**: Foundation ready — onboarding service and hook are implemented. User story implementation can now begin.

---

## Phase 3: User Story 1 - Register Organization Details (Priority: P1) 🎯 MVP

**Goal**: Users can enter registration details, save them to the backend, retrieve them on return, and benefit from auto-save.

**Independent Test**: Enter registration details, refresh the page, and verify data is restored from the backend. Verify auto-save works by waiting 30 seconds after editing.

### Implementation for User Story 1

- [x] T008 [P] [US1] Wire RegistrationView in `src/app/components/CharityOnboardingFlow.tsx` to call `onboardingService.createOrganization()` on first-time Next click, storing returned `id` in localStorage `onboardingOrgId`
- [x] T009 [P] [US1] Wire RegistrationView in `src/app/components/CharityOnboardingFlow.tsx` to call `onboardingService.updateOrganization()` on subsequent Next clicks when `onboardingOrgId` exists
- [x] T010 [US1] Add mount-time restoration in RegistrationView of `src/app/components/CharityOnboardingFlow.tsx`: if `onboardingOrgId` exists in localStorage, call `onboardingService.getOrganization()` and pre-fill form fields
- [x] T011 [US1] Implement auto-save in `src/app/hooks/useOnboardingRegistration.ts`: debounce PATCH to `updateOrganization` every 30 seconds while user is actively editing registration form
- [x] T012 [US1] Add error handling in RegistrationView of `src/app/components/CharityOnboardingFlow.tsx`: 409 Conflict shows inline Arabic error on licenseNumber field; 400 Validation Error displays field errors at top of form in Arabic; Network error shows retry button preserving form data
- [x] T013 [US1] Handle 401 Unauthorized in `src/app/hooks/useOnboardingRegistration.ts`: redirect to `/auth/login`

**Checkpoint**: User Story 1 fully functional — registration data persists, restores, auto-saves, and handles errors gracefully.

---

## Phase 4: User Story 2 - Create Organization Profile (Priority: P2)

**Goal**: Users can complete their organization profile, save it with funding areas, and retrieve it on return.

**Independent Test**: Complete the profile screen including selecting funding areas, submit, refresh the page, and verify all profile data and funding area selections are restored.

### Implementation for User Story 2

- [x] T014 [P] [US2] Wire ProfileView in `src/app/components/CharityOnboardingFlow.tsx` to call `onboardingService.createProfile()` on Next click, mapping `areasOfWork` to `fundingAreaIds` from `/api/v1/funding-areas`
- [x] T015 [P] [US2] Wire ProfileView in `src/app/components/CharityOnboardingFlow.tsx` to call `onboardingService.setFundingAreas()` with selected standard and custom funding areas
- [x] T016 [US2] Add mount-time restoration in ProfileView of `src/app/components/CharityOnboardingFlow.tsx`: call `onboardingService.getProfile()` and pre-fill all fields and funding area selections
- [x] T017 [US2] Add error handling in ProfileView of `src/app/components/CharityOnboardingFlow.tsx`: display validation and network errors in Arabic with retry capability

**Checkpoint**: User Story 2 fully functional — profile data and funding areas persist and restore correctly.

---

## Phase 5: User Story 3 - Resume Onboarding After Interruption (Priority: P3)

**Goal**: Users returning after interruption are resumed at the correct step with all data intact.

**Independent Test**: Partially complete onboarding (save registration only), close browser, reopen, and verify the user is directed to the profile step with registration data already loaded.

### Implementation for User Story 3

- [x] T018 [US3] Add step-detection logic in `src/app/components/CharityOnboardingFlow.tsx` mount: if `onboardingOrgId` exists, fetch organization and check `currentStep` or presence of profile; if profile exists, skip to appropriate step
- [x] T019 [US3] If organization record returns 404 in `src/app/components/CharityOnboardingFlow.tsx`, clear localStorage `onboardingOrgId` and redirect to landing page
- [x] T020 [US3] Ensure both RegistrationView and ProfileView in `src/app/components/CharityOnboardingFlow.tsx` handle the resume flow without requiring re-entry of already-saved data

**Checkpoint**: User Story 3 fully functional — onboarding resumes at the correct step with all data intact after interruption.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, and regression testing

- [x] T021 [P] Add duplicate-submit protection (disable Next button while loading) in `src/app/components/CharityOnboardingFlow.tsx` for both RegistrationView and ProfileView
- [x] T022 [P] Verify JWT auth interceptor already attaches token to all onboarding requests via existing `apiClient` setup
- [x] T023 [P] Handle empty historical sessions and rapid successive clicks gracefully in `src/app/components/CharityOnboardingFlow.tsx`
- [x] T024 [P] Verify error messages are displayed in Arabic for all error scenarios (409, 404, 400, network, 401)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - Can proceed sequentially in priority order (P1 → P2 → P3)
  - US1 is the core fix; US2 builds on the service created in US1; US3 builds on both
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — Contains the service creation and registration wiring. No dependencies on other stories.
- **User Story 2 (P2)**: Can start after User Story 1 — Depends on `onboardingOrgId` being set and the service being available. Profile builds on registration.
- **User Story 3 (P3)**: Can start after User Story 2 — Depends on both registration and profile being wired to detect and resume the correct step.

### Within Each User Story

- T005 and T006 (service creation) must complete before T007 (hook creation)
- T008 must complete before T009 (same file, sequential logic)
- T010 depends on T008 (mount-time restoration needs create logic first)
- T014 and T015 can run in parallel (different concerns)
- T018 depends on T010 and T016 (resume needs both registration and profile restoration)

### Parallel Opportunities

- T002, T003, T004 can run in parallel (Setup phase — examining different files)
- T005 and T006 can run in parallel (service file + index export)
- T008 and T014 can run in parallel (different views, no file conflict)
- T011 and T012 can run in parallel (hook auto-save + component error handling)
- T021, T022, T023, T024 can run in parallel during Polish phase

---

## Parallel Example: User Story 1

```bash
# T008 and T009 both modify CharityOnboardingFlow.tsx but in different regions:
Task: "Wire createOrganization on first Next click (T008) in src/app/components/CharityOnboardingFlow.tsx"
Task: "Wire updateOrganization on subsequent Next click (T009) in src/app/components/CharityOnboardingFlow.tsx"

# T010 depends on T008/T009 completing since it's the same file:
Task: "Add mount-time restoration (T010) in src/app/components/CharityOnboardingFlow.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (T005–T013)
4. **STOP and VALIDATE**: Enter registration details, refresh, verify data restores. Test auto-save and error handling.
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Registration persists → Deploy/Demo (MVP!)
3. Add User Story 2 → Profile persists with funding areas → Deploy/Demo
4. Add User Story 3 → Resume after interruption works → Deploy/Demo
5. Polish → Edge cases and error handling → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001–T007)
2. Once Foundational is done:
   - Developer A: User Story 1 (registration wiring, auto-save, error handling)
   - Developer B: User Story 2 (profile wiring, funding areas)
3. Developer C can begin User Story 3 once US1 and US2 checkpoints pass
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
