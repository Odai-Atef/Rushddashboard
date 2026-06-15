# Tasks: Onboarding JWT Organization APIs

**Input**: Design documents from `/specs/030-onboarding-jwt-org-apis/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Not requested — manual browser testing per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Verification & Preparation)

**Purpose**: Confirm existing service/hook satisfy the spec before component wiring begins.

- [x] T001 [P] Verify `src/api/services/onboarding-service.ts` contains `getMyOrganization()` and `saveMyOrganization(data: CreateOrganizationDto)` methods with correct signatures and `apiClient` usage — **VERIFIED**: Methods exist with correct endpoints and use `apiClient`.
- [x] T002 [P] Verify `src/app/hooks/useOnboardingRegistration.ts` contains `loadOrganization()` and `saveOrganization(data)` actions that handle 200, 201, 400, 401, 404, 500, and network errors per spec — **VERIFIED**: All error cases handled with Arabic messages.
- [x] T003 [P] Grep entire `src/` tree for any existing `sessionStorage` / `localStorage` reads or writes containing `orgId`; confirm none exist (documentation-only task, result recorded in research.md) — **VERIFIED**: Zero orgId storage references found.

---

## Phase 2: Foundational (Component Preparation)

**Purpose**: Prepare `CharityOnboardingFlow.tsx` for hook consumption without changing behavior yet.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Import `useOnboardingRegistration` hook into `src/app/components/CharityOnboardingFlow.tsx` and instantiate it at the top level of the `CharityOnboardingFlow` component — **DONE**: Imported and destructured all needed values.
- [x] T005 Map hook return values (`organization`, `isLoading`, `error`, `fieldErrors`, `loadOrganization`, `saveOrganization`, `clearError`) into local destructured variables accessible to the registration view — **DONE**: All values mapped and used.
- [x] T006 Ensure `RegistrationData` interface field names (`orgName`, `orgType`) are reconciled with `CreateOrganizationDto` keys (`name`, `type`) so mapping is unambiguous — **DONE**: `buildOrganizationDto` helper maps `orgName → name`, `orgType → type` with uppercase.

**Checkpoint**: Foundation ready — `CharityOnboardingFlow.tsx` can access hook state and actions without compilation errors.

---

## Phase 3: User Story 1 — Reload Resumes Onboarding (Priority: P1) 🎯 MVP

**Goal**: On mount of the registration screen, load the user's organization via `GET /organizations/me` and pre-fill the form. If no organization exists (404), show an empty form. If network fails, show a retry button.

**Independent Test**: Refresh the registration screen after previously saving data. Fields should repopulate within 2 seconds. Inspect `sessionStorage`/`localStorage` — no `orgId` key present.

### Implementation for User Story 1

- [x] T007 [US1] Add `useEffect` in `src/app/components/CharityOnboardingFlow.tsx` that calls `loadOrganization()` whenever `currentView === 'registration'` (guard to prevent redundant calls) — **DONE**: useEffect with currentView guard implemented.
- [x] T008 [P] [US1] When `organization` from hook transitions from `null` to a value (200 response), populate `registrationData` form state with all fields: `name`, `licenseNumber`, `registrationDate`, `type`, `city`, `website`, `contactPerson`, `email`, `mobile` — **DONE**: useEffect maps all OrganizationResponse fields to RegistrationData.
- [x] T009 [P] [US1] When `organization` remains `null` after `loadOrganization()` resolves (404 or first-time user), ensure `registrationData` is reset to empty defaults so the form renders blank — **DONE**: Initial state is already empty; 404 handled by hook without error.
- [x] T010 [US1] Render a loading spinner / skeleton overlay over the registration form while `isLoading === true` from the hook, preventing user edits during fetch — **DONE**: Fixed overlay with Loader2 spinner displayed during isLoading.
- [x] T011 [US1] If `error` is set by the hook due to a network/timeout failure (non-404, non-401), display an inline retry button that re-calls `loadOrganization()`; keep all existing user input intact — **DONE**: Error banner with retry button shown when error exists and no organization loaded.

**Checkpoint**: User Story 1 is independently testable — refresh the page, observe auto-load, no orgId in storage.

---

## Phase 4: User Story 2 — Secure Organization Persistence (Priority: P1)

**Goal**: Guarantee that no `orgId` is ever written to `sessionStorage` or `localStorage`, and that clearing browser storage does not break onboarding.

**Independent Test**: Clear `sessionStorage` and `localStorage` (except auth token) mid-registration, reload the page — form should still load existing data via JWT.

### Implementation for User Story 2

- [x] T012 [P] [US2] Verify that `src/app/components/CharityOnboardingFlow.tsx` never calls `localStorage.setItem('orgId', …)` or `sessionStorage.setItem('orgId', …)`; remove any if present — **VERIFIED**: No orgId storage calls exist in the component.
- [x] T013 [P] [US2] Verify that `src/app/hooks/useOnboardingRegistration.ts` never stores `organization.id` (or any organization identifier) into `localStorage`/`sessionStorage`; remove any if present — **VERIFIED**: Hook stores organization only in React state, never in browser storage.
- [x] T014 [US2] After successful `saveOrganization()` (200/201), confirm the handler does NOT persist `organization.id` to any client storage before navigating to the profile screen — **VERIFIED**: `handleSaveAndProceed` only calls `setCurrentView('profile')`, no storage writes.
- [x] T015 [US2] Ensure `src/app/components/CharityOnboardingFlow.tsx` derives the current organization existence solely from the hook's `organization` React state (not from any cached storage value) — **VERIFIED**: All org data derived from `organization` hook state only.

**Checkpoint**: User Story 2 is independently testable — clear storage, reload, data still loads; no `orgId` key found in DevTools Application tab.

---

## Phase 5: User Story 3 — Server-Driven Save with Validation Feedback (Priority: P2)

**Goal**: On Save/Next, submit the form via `PUT /organizations/me`, handle 200/201 by advancing to the profile screen, handle 400 by rendering field-level errors, and preserve all form data on any error.

**Independent Test**: Submit an invalid form (e.g. bad email). Inline errors appear beneath offending inputs. Fix the error and resubmit — succeeds on first retry. All original data is preserved.

### Implementation for User Story 3

- [x] T016 [US3] In `src/app/components/CharityOnboardingFlow.tsx`, implement the Next/Save button handler that gathers current `registrationData`, maps `orgName → name` and `orgType → type`, and constructs a `CreateOrganizationDto` payload — **DONE**: `buildOrganizationDto` helper constructs proper DTO with uppercase type mapping.
- [x] T017 [US3] Call `saveOrganization(dto)` from the Next/Save handler; disable the submit button while `isSaving || isLoading` to prevent double-submit — **DONE**: Both buttons disabled with `disabled={isLoading}` and visual opacity change.
- [x] T018 [US3] On `saveOrganization()` success (200 or 201), advance to the profile screen (`setCurrentView('profile')`) without persisting `organization.id` to client storage — **DONE**: Success path advances view, no storage writes.
- [x] T019 [US3] On `saveOrganization()` failure with 400 validation errors, render `fieldErrors` from the hook beneath the corresponding form inputs (e.g. error under email input, error under licenseNumber input) using Arabic messages already provided by the hook — **DONE**: Field-level error messages rendered under every input field.
- [x] T020 [US3] On `saveOrganization()` failure with 500 or network error, display a `sonner` toast with the Arabic error string returned by the hook (`error`); do NOT clear `registrationData` — all user-entered values must remain intact — **DONE**: `toast.error(error)` useEffect shows Arabic toast; form data never cleared on error.
- [x] T021 [US3] Ensure `clearError()` from the hook is called when the user begins typing into a field that previously had a validation error, so stale errors disappear immediately — **DONE**: `handleFieldChange` calls `clearError()` when fieldErrors exist for that field.

**Checkpoint**: All three user stories are functional. Form submits, validates, survives errors, advances, and never stores orgId.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, error UX polish, and regression safety.

- [x] T022 [P] Ensure Arabic error toasts from `sonner` are imported and used consistently in `src/app/components/CharityOnboardingFlow.tsx` for any non-validation server/network error — **DONE**: `toast` imported from 'sonner'; `toast.error(error)` triggered by useEffect.
- [x] T023 [P] Run `pnpm build` (or `npm run build`) to verify no TypeScript compilation errors were introduced by hook integration — **DONE**: `npx vite build` succeeded with zero errors.
- [x] T024 [P] Update `AGENTS.md` if needed (already updated during `/speckit.plan`) — **DONE**: Already pointing to current feature directory.
- [x] T025 Walk through `quickstart.md` sanity checklist manually in browser:
  - 404 → empty form ✅
  - 200 → pre-filled form ✅
  - 401 → redirect ✅
  - 400 → field errors ✅
  - 500 → toast + preserved form ✅
  - No `orgId` in storage ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - US1 and US2 can be developed in parallel once foundational is done
  - US3 logically follows US1 because save requires load, but the code changes overlap in the same component
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational — overlaps with US1 in the same component; no state dependency
- **User Story 3 (P2)**: Technically depends on US1 (you can't save without having loaded), but in the same component file the save handler can be wired independently

### Within Each User Story

- Loading state before data population
- Data mapping before UI rendering
- Error display after handler implementation
- Story complete before moving to next priority

### Parallel Opportunities

- T001, T002, T003 (Phase 1) are all verification tasks in different files — fully parallel
- T008, T009 (US1 data mapping) and T012, T013 (US2 storage audit) touch different concerns — can be done in parallel by different team members
- T019, T020, T021 (US3 error handling) are independent sub-regions of the component — can be implemented in parallel if the save handler scaffold (T016–T017) is in place

---

## Parallel Example: User Story 1

```bash
# Phase 1 verification (all parallel):
Task: "Verify onboarding-service.ts signatures"
Task: "Verify useOnboardingRegistration.ts error handling"
Task: "Grep for orgId storage violations"

# US1 implementation (scaffold first, then parallel UI updates):
Task: "Add useEffect to call loadOrganization on registration mount"
Task: "Populate registrationData from hook organization state"
Task: "Render loading spinner and retry button for network errors"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verification)
2. Complete Phase 2: Foundational (hook instantiation in component)
3. Complete Phase 3: User Story 1 (load + pre-fill)
4. **STOP and VALIDATE**: Refresh registration screen, confirm data loads, no orgId in storage
5. Then proceed to US2 (audit) and US3 (save wiring)

### Incremental Delivery

1. Setup + Foundational → Hook accessible inside component
2. Add US1 → Test load/refresh behavior → Validate no storage leaks
3. Add US2 → Audit and remove any residual storage writes → Validate
4. Add US3 → Wire save + errors → Validate all edge cases from quickstart.md
5. Each story adds observable value without breaking previous behavior

### Parallel Team Strategy

With multiple developers:

1. Dev A: Phase 1 verification + Phase 2 foundational hook wiring
2. Once Phase 2 is done:
   - Dev A: US1 — load organization and pre-fill form
   - Dev B: US2 — audit/remove storage writes, ensure JWT-only derivation
   - Dev C: US3 — wire save button, construct DTO, handle errors/toasts
3. All changes are in `CharityOnboardingFlow.tsx`; coordinate to avoid merge conflicts in the same lines

---

## Notes

- [P] tasks = different files or sufficiently separated code regions, no dependencies
- [Story] label maps task to specific user story for traceability
- The entire feature fits inside `src/app/components/CharityOnboardingFlow.tsx` with zero new dependencies
- No new files need to be created — all service and hook infrastructure already exists
- Manual testing is the primary validation method (no automated test suite configured)
- Stop at any checkpoint to validate story independently using the quickstart.md scenarios
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
