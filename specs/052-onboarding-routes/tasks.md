# Tasks: Onboarding Route Refactor

**Input**: Design documents from `/specs/052-onboarding-routes/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new directories and module boundaries needed by all onboarding route work.

- [ ] T001 Create onboarding pages directory at `src/app/pages/onboarding/`
- [ ] T002 Create onboarding context directory at `src/app/context/`
- [ ] T003 [P] Add onboarding guard utility file at `src/app/utils/onboarding-guards.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core provider, layout, route wiring, and guard logic that MUST be complete before any user story can be fully verified.

**⚠️ CRITICAL**: No user story work can be validated until this phase is complete.

- [ ] T004 Implement `OnboardingProvider` context in `src/app/context/OnboardingContext.tsx` with state for organization, profile, funding areas, assessment status, assessment result, documents, loading, and error
- [ ] T005 Implement `useOnboardingContext` hook in `src/app/hooks/useOnboardingContext.ts`
- [ ] T006 Implement `OnboardingLayout` in `src/app/pages/onboarding/OnboardingLayout.tsx` to read `organizationId` from query parameters, hydrate provider state, and render `<Outlet />`
- [ ] T007 Implement step-order and guard helpers in `src/app/utils/onboarding-guards.ts` (`getStepOrder`, `isStepCompleted`, `evaluateStepGuard`)
- [ ] T008 Wire nested onboarding routes in `src/app/routes.tsx` using `React.lazy()` for each page and the `OnboardingLayout` as the parent route
- [ ] T009 [P] Implement lazy-loaded page shells in `src/app/pages/onboarding/LandingPage.tsx`, `RegistrationPage.tsx`, `ProfilePage.tsx`, `AssessmentPage.tsx`, `DocumentsPage.tsx`, `ProcessingPage.tsx`, `ResultsPage.tsx`, `AnalysisPage.tsx`, `RoadmapPage.tsx`, and `DecisionPage.tsx`

**Checkpoint**: Foundation ready - `OnboardingLayout` loads state, guards redirect unknown/future steps, and all routes are registered.

---

## Phase 3: User Story 1 - Direct Navigation to Onboarding Steps (Priority: P1) 🎯 MVP

**Goal**: Every onboarding step is reachable via a distinct URL, refresh restores the same step with hydrated data, and unknown routes redirect safely.

**Independent Test**: Paste `/dashboard/onboarding/assessment` into the address bar and land directly on the assessment step after authentication and data hydration. Refreshing `/dashboard/onboarding/documents` keeps the user on documents and reloads documents.

### Implementation for User Story 1

- [ ] T010 [US1] Update `src/app/routes.tsx` so `/dashboard/onboarding` index redirects to `/dashboard/onboarding/landing` and unknown `:step` values redirect to landing
- [ ] T011 [US1] Ensure `OnboardingLayout` re-hydrates state on every route mount in `src/app/pages/onboarding/OnboardingLayout.tsx`
- [ ] T012 [US1] Implement `LandingPage` content by extracting `LandingView` from `src/app/components/CharityOnboardingFlow.tsx` into `src/app/pages/onboarding/LandingPage.tsx`
- [ ] T013 [P] [US1] Implement `DocumentsPage` content by extracting document view logic from `src/app/components/CharityOnboardingFlow.tsx` into `src/app/pages/onboarding/DocumentsPage.tsx`
- [ ] T014 [US1] Handle unknown step fallback redirect in `src/app/utils/onboarding-guards.ts` and consume it in `OnboardingLayout.tsx`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Step Guards and State Hydration (Priority: P1)

**Goal**: Routes that require prior completion are guarded, and state is hydrated automatically on deep links.

**Independent Test**: Open `/dashboard/onboarding/results` directly with a completed assessment and see real data; open it without a completed assessment and be redirected to documents or assessment.

### Implementation for User Story 2

- [ ] T015 [US2] Implement `evaluateStepGuard` logic in `src/app/utils/onboarding-guards.ts` using the canonical step order and `organization.currentStep`
- [ ] T016 [US2] Apply `StepGuard` redirect in `src/app/pages/onboarding/OnboardingLayout.tsx` before rendering the requested page
- [ ] T017 [US2] Implement profile-completed guard for `documents` by redirecting to `profile` when the organization profile is missing in `src/app/utils/onboarding-guards.ts`
- [ ] T018 [US2] Ensure assessment status/result are hydrated in `OnboardingProvider` when mounting `ResultsPage`, `AnalysisPage`, `RoadmapPage`, and `DecisionPage`
- [ ] T019 [P] [US2] Implement `ResultsPage` content by extracting results view logic from `src/app/components/CharityOnboardingFlow.tsx` into `src/app/pages/onboarding/ResultsPage.tsx`
- [ ] T020 [P] [US2] Implement `AnalysisPage`, `RoadmapPage`, and `DecisionPage` shells in `src/app/pages/onboarding/` reusing their existing view JSX

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: User Story 3 - Navigation Buttons Use Routes (Priority: P2)

**Goal**: All next/back buttons and in-flow links update the URL via route navigation; browser history behaves normally.

**Independent Test**: Clicking next from profile changes the URL to `/dashboard/onboarding/assessment`; browser back returns through the actual transition history.

### Implementation for User Story 3

- [ ] T021 [US3] Replace `setCurrentView('registration')` call in `LandingPage` with `useNavigate` to `/dashboard/onboarding/registration` in `src/app/pages/onboarding/LandingPage.tsx`
- [ ] T022 [US3] Replace `setCurrentView('profile')` call in `RegistrationPage` save handler with `useNavigate` to `/dashboard/onboarding/profile` in `src/app/pages/onboarding/RegistrationPage.tsx`
- [ ] T023 [US3] Replace `setCurrentView('assessment')` call in `ProfilePage` next handler with `useNavigate` to `/dashboard/onboarding/assessment` in `src/app/pages/onboarding/ProfilePage.tsx`
- [ ] T024 [US3] Replace `setCurrentView('documents')` call in `AssessmentPage` completion handler with `useNavigate` to `/dashboard/onboarding/documents` in `src/app/pages/onboarding/AssessmentPage.tsx`
- [ ] T025 [US3] Replace remaining back/next `setCurrentView(...)` calls inside page components with `useNavigate` to the corresponding route in `src/app/pages/onboarding/*.tsx`
- [ ] T026 [US3] Update "عرض خطة التطوير" and similar in-flow links to navigate to `/dashboard/onboarding/roadmap` using `useNavigate` in `src/app/pages/onboarding/ResultsPage.tsx`

**Checkpoint**: User Story 3 is fully functional and independently testable.

---

## Phase 6: User Story 4 - Shared State and Required Parameters (Priority: P2)

**Goal**: Onboarding state and `organizationId` are available to every route page so each page renders independently on direct access.

**Independent Test**: Open `/dashboard/onboarding/results` in a new tab after submission and see the correct score and qualification status; navigate to `/dashboard/onboarding/documents?organizationId=123` and the correct documents load.

### Implementation for User Story 4

- [ ] T027 [US4] Ensure `OnboardingProvider` loads `organization` via `getMyOrganization()` or `getOrganization(organizationId)` in `src/app/context/OnboardingContext.tsx`
- [ ] T028 [US4] Expose `organizationId` resolution helper in `src/app/utils/onboarding-guards.ts` (query param → context organization → redirect)
- [ ] T029 [US4] Implement `RegistrationPage` content by extracting registration view/state from `src/app/components/CharityOnboardingFlow.tsx` into `src/app/pages/onboarding/RegistrationPage.tsx`, reading `organization` from context
- [ ] T030 [US4] Implement `ProfilePage` content by extracting profile view/state from `src/app/components/CharityOnboardingFlow.tsx` into `src/app/pages/onboarding/ProfilePage.tsx`, reading `fundingAreas` and `organization` from context
- [ ] T031 [US4] Implement `AssessmentPage` content by extracting assessment view/state from `src/app/components/CharityOnboardingFlow.tsx` into `src/app/pages/onboarding/AssessmentPage.tsx`, preserving answer restore/save behavior
- [ ] T032 [US4] Implement `ProcessingPage` content by extracting processing view from `src/app/components/CharityOnboardingFlow.tsx` into `src/app/pages/onboarding/ProcessingPage.tsx`
- [ ] T033 [US4] Persist `organizationId` query parameter when navigating between onboarding routes in `src/app/pages/onboarding/OnboardingLayout.tsx` and page navigation helpers

**Checkpoint**: User Story 4 is fully functional and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Ensure the refactor has no regressions, passes build, and cleans up the old monolithic component.

- [ ] T034 Remove or deprecate `CharityOnboardingFlow.tsx` after all views are extracted in `src/app/components/CharityOnboardingFlow.tsx`
- [ ] T035 [P] Verify `npm run build` passes with no new warnings or errors
- [ ] T036 [P] Verify all existing loading, error, and toast behaviors from the original flow remain intact across `src/app/pages/onboarding/*.tsx`
- [ ] T037 Update `src/app/routes.tsx` import paths and remove unused `CharityOnboardingFlow` import if the component is removed
- [ ] T038 Update AGENTS.md and quickstart.md if route paths or implementation details changed during implementation
- [ ] T039 Run quickstart.md validation steps manually in the dev server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P2)
  - US1 and US2 are P1 and should be completed before US3 and US4
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Builds on the same guard/hydration foundation as US1
- **User Story 3 (P2)**: Can start after Foundational and US1/US2 page shells exist - Replaces navigation calls inside extracted pages
- **User Story 4 (P2)**: Can start after Foundational - Populates pages with state and handles parameter passing

### Within Each User Story

- Provider/layout/guard changes before page content
- Page content extraction before navigation call replacement
- Core implementation before cross-page integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel
- All lazy-loaded page shells (T009) can be created in parallel
- `ResultsPage`, `AnalysisPage`, `RoadmapPage`, and `DecisionPage` extraction (T019-T020) can run in parallel
- `RegistrationPage`, `ProfilePage`, `AssessmentPage`, and `ProcessingPage` extraction (T029-T032) can run in parallel once context is ready
- Build and verification tasks (T035-T039) must run after implementation

---

## Parallel Example: User Story 1

```bash
# Create page shells in parallel:
Task: "Implement LandingPage content in src/app/pages/onboarding/LandingPage.tsx"
Task: "Implement DocumentsPage content in src/app/pages/onboarding/DocumentsPage.tsx"

# Then wire the fallback redirect:
Task: "Handle unknown step fallback redirect in src/app/utils/onboarding-guards.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + Foundational)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test direct navigation and refresh behavior
5. Demo the MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Direct navigation works → Demo
3. User Story 2 → Guards and hydration work → Demo
4. User Story 3 → Route-based navigation works → Demo
5. User Story 4 → Full state sharing and parameter passing work → Demo
6. Polish → Remove old component, verify build, run quickstart validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (direct navigation/refresh)
   - Developer B: User Story 2 (guards/hydration)
   - Developer C: User Story 4 (state/parameter sharing)
3. Developer D: User Story 3 (replace navigation calls) after page shells exist
4. Final polish done together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are not included because the project has no formal test framework configured
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
