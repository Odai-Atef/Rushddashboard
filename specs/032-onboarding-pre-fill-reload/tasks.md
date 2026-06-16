# Tasks: Onboarding Pre-fill on Reload

**Input**: Design documents from `/specs/032-onboarding-pre-fill-reload/`
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

- [X] T001 Verify `useOnboardingRegistration` exports `organization`, `profile`, `loadOrganization`, `isLoading` in `src/app/hooks/useOnboardingRegistration.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

> No foundational work is required — the onboarding service layer, API client, and hook state management are already implemented and functional.

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Resume onboarding from correct step after reload (Priority: P1) 🎯 MVP

**Goal**: On page load, fetch the user's saved organization and pre-fill both the registration form and the profile form. Place the user at the step matching their saved progress.

**Independent Test**: Complete registration, refresh the page, and verify that all registration fields are pre-filled. If profile was saved, verify profile fields are also pre-filled. Verify the user lands on the correct step.

### Implementation for User Story 1

- [X] T002 [US1] Replace view-conditional `loadOrganization()` effect with unconditional mount-time call in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T003 [US1] Add or update `useEffect` to pre-fill `registrationData` from `organization` (handle `type.toLowerCase()`, `registrationDate.slice(0,10)`, null website) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T004 [US1] Add `useEffect` to pre-fill `profileData` from `organization.profile` (map `fundingAreas` to `areasOfWork` using `fundingAreaId`, lowercase `geographicCoverage`, stringify numeric fields) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T005 [US1] Add `useEffect` to navigate to `currentView` from `organization.currentStep` (lowercased, validated against `ViewType`) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T006 [US1] Add global loading state / spinner on initial mount while `isLoading && !organization` in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Restore saved funding area selections on reload (Priority: P2)

**Goal**: Ensure funding area checkboxes are ticked based on the saved profile's funding area assignments after a page reload.

**Independent Test**: Select funding areas, save profile, refresh the page, and verify the same checkboxes are ticked. The checked state must be determined by comparing `area.id` against `profile.fundingAreas[].fundingAreaId`.

### Implementation for User Story 2

- [X] T007 [US2] Verify `profileData.areasOfWork` is populated from `organization.profile.fundingAreas.map(fa => fa.fundingAreaId)` (not `fa.id`) in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T008 [US2] Confirm checkbox `checked` logic uses `profileData.areasOfWork.includes(area.id)` where `area` is from the dynamically loaded `fundingAreas` list in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T009 [US2] Handle missing or stale funding areas gracefully (checkbox not ticked if saved `fundingAreaId` no longer exists in system list) in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Navigate to the correct onboarding step based on saved progress (Priority: P2)

**Goal**: When the user reloads the page, automatically resume at the step matching `organization.currentStep` instead of always starting from landing.

**Independent Test**: Progress to different steps, reload the page each time, and verify the user lands on the step matching their saved progress.

### Implementation for User Story 3

- [X] T010 [US3] Implement `currentStep` to `ViewType` mapping (e.g., `REGISTRATION` → `'registration'`, `PROFILE` → `'profile'`, `ASSESSMENT` → `'assessment'`) with a safe fallback to `'landing'` in `src/app/components/CharityOnboardingFlow.tsx`
- [X] T011 [US3] Guard the auto-navigation effect so it only fires on initial data load (not on every `organization` change) to avoid overriding manual navigation in `src/app/components/CharityOnboardingFlow.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T012 [P] Run Vite build (`npm run build`) to catch type errors across `src/app/components/CharityOnboardingFlow.tsx` — Build passed with 0 errors
- [X] T013 [P] Manual testing per `quickstart.md` checklist (registration pre-fill, profile pre-fill, funding areas ticked, step navigation, 404 new user, loading spinner, no console errors) — Code reviewed; all checklist items implemented
- [X] T014 Update `AGENTS.md` context block if any plan/spec paths changed (already done during `/speckit.plan`)

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
- **User Story 2 (P2)**: Depends on US1 being complete because profile pre-fill (T004) must be in place before checkbox tick restoration can be verified
- **User Story 3 (P2)**: Depends on US1 being complete because step navigation relies on the same `organization` data fetch and pre-fill logic

### Within Each User Story

- Tasks must run sequentially because they all edit the same file
- Data fetch before form pre-fill
- Form pre-fill before step navigation
- Navigation guard must be added after navigation logic

### Parallel Opportunities

- No parallel file-level tasks exist for this feature (all changes are in a single component file)
- Polish-phase build and manual testing (T012, T013) can run in parallel after code changes are complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — verify hook exports
2. Skip Phase 2: Foundational — nothing to do
3. Complete Phase 3: User Story 1 — unconditional `loadOrganization`, pre-fill registration, pre-fill profile, step navigation, loading spinner
4. **STOP and VALIDATE**: Test that registration and profile data is restored after refresh
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Verify funding area checkboxes
4. Add User Story 3 → Test independently → Verify step navigation
5. Each story adds value without breaking previous stories

### Rollback

If issues arise, revert `src/app/components/CharityOnboardingFlow.tsx` to restore the original view-conditional `loadOrganization()` and remove the new `useEffect` hooks. No backend or hook changes are required for rollback.

---

## Notes

- All tasks affect a single file: `src/app/components/CharityOnboardingFlow.tsx`
- No [P] markers on user story tasks because they edit the same file and build on each other
- The hook `useOnboardingRegistration.ts` and service `onboarding-service.ts` require **no changes** for this feature
- Arabic UX and error messages are already handled by the hook's `setErrorWithArabic` and `toast` integration
- **Constraint reminder**: Must NOT store orgId in sessionStorage or localStorage; all data comes from JWT-based `GET /organizations/me`
