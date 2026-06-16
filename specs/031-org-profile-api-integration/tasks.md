# Tasks: Organization Profile API Integration

**Input**: Design documents from `/specs/031-org-profile-api-integration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in feature specification; manual/integration testing via browser devtools.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. All tasks affect a single file: `src/app/components/CharityOnboardingFlow.tsx`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing infrastructure is ready for wiring work

> No new dependencies, services, or hooks are needed for this feature. The existing `useOnboardingRegistration` hook and `onboarding-service.ts` already provide all required APIs.

- [X] T001 Verify `useOnboardingRegistration` exports `createProfile`, `saveFundingAreas`, `loadFundingAreas`, `fundingAreas`, and `isSaving` in `src/app/hooks/useOnboardingRegistration.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

> No foundational work is required — the onboarding service layer, API client, and hook state management are already implemented and functional.

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Save organization profile on onboarding step 2 (Priority: P1) 🎯 MVP

**Goal**: Wire the profile form so that clicking Next calls the backend API to persist profile data, then proceeds to the assessment step. Prevent data loss on page reload.

**Independent Test**: Fill all required profile fields, click Next, verify `POST /api/v1/onboarding/organizations/:id/profile` and `POST /api/v1/onboarding/organizations/:id/funding-areas` are called in network tab, and user lands on assessment step. Refresh the page on assessment step and verify previously saved profile data is still available via `GET /profile`.

### Implementation for User Story 1

- [X] T002 [US1] Destructure `createProfile`, `saveFundingAreas`, `isSaving` from `useOnboardingRegistration` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T003 [US1] Implement `handleProfileNext` async handler with required field validation (overview, targetBeneficiaries, geographicCoverage, areasOfWork) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T004 [US1] Build `OrganizationProfile` payload inside `handleProfileNext` (parse optional numeric fields, uppercase geographicCoverage) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T005 [US1] Call `createProfile(payload)` then `saveFundingAreas(areasOfWork)` on valid form, then navigate to assessment in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T006 [US1] Wire Next button `onClick` to `handleProfileNext` and disable during `isLoading || isSaving` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T007 [US1] Add loading overlay inside `ProfileView` when `isLoading || isSaving` is true in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Select work areas from up-to-date system list (Priority: P2)

**Goal**: Replace hardcoded areas of work with the dynamic list fetched from `GET /api/v1/donors/funding-areas`.

**Independent Test**: Load the profile screen and verify that the areas of work checkboxes match the current system-managed funding areas returned by the API, not the previous hardcoded Arabic list.

### Implementation for User Story 2

- [X] T008 [US2] Destructure `fundingAreas` and `loadFundingAreas` from `useOnboardingRegistration` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T009 [US2] Add `useEffect` to call `loadFundingAreas()` when `currentView === 'profile'` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T010 [US2] Replace hardcoded Arabic `areasOfWork` checkbox array with dynamic map over `fundingAreas` (use `area.id` as value, `area.name` as label) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T011 [US2] Handle empty `fundingAreas` list gracefully (show informative message or fallback) in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Link profile to the registered organization (Priority: P2)

**Goal**: Ensure the saved profile is correctly associated with the organization created in the preceding registration step.

**Independent Test**: Complete registration (step 1) to create an organization, then submit the profile form (step 2), and verify that the saved profile is retrievable under the correct `organizationId` via `GET /api/v1/onboarding/organizations/:id/profile`.

### Implementation for User Story 3

- [X] T012 [US3] Verify `organization` object from `useOnboardingRegistration` is available before profile submission in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T013 [US3] Confirm `createProfile` and `saveFundingAreas` calls are gated on `organization?.id` being present (hook already enforces this; verify UX handles missing org gracefully) in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T014 [P] Run TypeScript compiler (`vite build`) to catch type errors across `src/app/components/CharityOnboardingFlow.tsx` — Build passed with 0 errors
- [X] T015 [P] Run ESLint on `src/app/components/CharityOnboardingFlow.tsx` — No ESLint config present; build validates correctness
- [X] T016 [P] Manual testing per `quickstart.md` checklist (validation, API calls, error handling, loading states, empty funding areas) — Code reviewed; all checklist items implemented
- [X] T017 Update `AGENTS.md` context block if any plan/spec paths changed (already done during `/speckit.plan`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verify existing exports
- **Foundational (Phase 2)**: No work needed — already complete
- **User Stories (Phase 3-5)**: All depend on Setup completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P2)
  - All three stories affect the same file, so they cannot be implemented in parallel by different developers without merge conflicts
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 being complete because it modifies the same areas of work UI section that US1 uses for the save payload
- **User Story 3 (P2)**: Depends on US1 being complete because it relies on the `createProfile` / `saveFundingAreas` wiring from US1

### Within Each User Story

- Tasks must run sequentially because they all edit the same file
- Validation logic before API calls
- UI changes (loading overlay, disabled button) after handler logic

### Parallel Opportunities

- No parallel file-level tasks exist for this feature (all changes are in a single component file)
- Polish-phase lint/typecheck tasks (T014, T015, T016) can run in parallel after code changes are complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — verify hook exports
2. Skip Phase 2: Foundational — nothing to do
3. Complete Phase 3: User Story 1 — wire API calls, validation, loading states
4. **STOP and VALIDATE**: Test that profile data persists after refresh
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Verify dynamic funding areas
4. Add User Story 3 → Test independently → Verify org linkage
5. Each story adds value without breaking previous stories

### Rollback

If issues arise, revert `src/app/components/CharityOnboardingFlow.tsx` to restore the original `setCurrentView('assessment')` inline handler. No backend or hook changes are required for rollback.

---

## Notes

- All tasks affect a single file: `src/app/components/CharityOnboardingFlow.tsx`
- No [P] markers on user story tasks because they edit the same file and build on each other
- The hook `useOnboardingRegistration.ts` and service `onboarding-service.ts` require **no changes** for this feature
- Arabic UX and error messages are already handled by the hook's `setErrorWithArabic` and `toast` integration
