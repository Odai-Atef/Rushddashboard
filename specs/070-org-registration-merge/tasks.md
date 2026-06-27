# Tasks: Merge User and Organization Registration

**Input**: Design documents from `/specs/070-org-registration-merge/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/org-registration-contract.md, research.md, quickstart.md

**Tests**: No automated test framework is currently installed, so no test tasks are included. Validation is manual per `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify development environment by running `npm run dev` and confirming the app loads without errors.
- [x] T002 Read `src/app/components/RegistrationPage.tsx` and `src/app/pages/onboarding/RegistrationPage.tsx` to identify shared and unique fields.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the new atomic API contract and service method so the combined page can submit data.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Define `OrgRegistrationData` and `OrgRegistrationResponse` types in `src/api/services/auth-service.ts`.
- [x] T004 Add `registerOrganization(data: OrgRegistrationData)` method to `src/api/services/auth-service.ts` that calls the new atomic backend endpoint.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Combined Organization Registration Page (Priority: P1) 🎯 MVP

**Goal**: The new `/auth/register/org` page renders a single form containing all merged user and organization fields.

**Independent Test**: Visit `/auth/register/org`, confirm the page loads, and verify all required fields are visible.

### Implementation for User Story 1

- [x] T005 [US1] Create the new page component at `src/app/pages/auth/OrgRegistrationPage.tsx`.
- [x] T006 [US1] Build the merged form state object covering all user and organization fields.
- [x] T007 [US1] Add form inputs for user account fields: `fullName`, `email`, `phone`, `password`, `confirmPassword`, `agreeToTerms`.
- [x] T008 [US1] Add form inputs for organization fields: `orgName`, `licenseNumber`, `registrationDate`, `orgType`, `city`, `activity`, `fundingAreas`.
- [x] T009 [US1] Render `activity` field only when `orgType === 'private_company'`.
- [x] T010 [US1] Render `fundingAreas` selection only when `orgType === 'charity'`.
- [x] T011 [US1] Implement client-side validation for all required fields and conditional fields.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - No Duplicate Fields (Priority: P1)

**Goal**: Shared fields (email, phone, organization/company name) appear exactly once on the combined page.

**Independent Test**: Inspect the `/auth/register/org` form and confirm no duplicated labels or inputs for shared fields.

### Implementation for User Story 2

- [x] T012 [US2] Use a single `email` input and map it to both user and organization payloads.
- [x] T013 [US2] Use a single `phone` input and map it to both user phone and organization mobile.
- [x] T014 [US2] Use a single `orgName` input and map it to both `companyName` (user) and `name` (organization).
- [x] T015 [US2] Verify no `companyName`, `mobile`, or duplicate `email` inputs exist in `src/app/pages/auth/OrgRegistrationPage.tsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Preserved Existing Registration Pages (Priority: P2)

**Goal**: The existing `/auth/register` and `/dashboard/onboarding/registration` pages remain functional and unchanged.

**Independent Test**: Visit `/auth/register` and `/dashboard/onboarding/registration` and confirm both still load and submit successfully.

### Implementation for User Story 3

- [x] T016 [US3] Add the new `/auth/register/org` route to `src/app/routes.tsx` without modifying existing auth or onboarding routes.
- [x] T017 [US3] Confirm `src/app/components/RegistrationPage.tsx` has no changes to its behavior or fields.
- [x] T018 [US3] Confirm `src/app/pages/onboarding/RegistrationPage.tsx` has no changes to its behavior or fields.
- [x] T019 [US3] Test the existing `/auth/register` page manually to verify it still works.
- [x] T020 [US3] Test the existing `/dashboard/onboarding/registration` page manually to verify it still works.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T021 [P] Wire form submission in `src/app/pages/auth/OrgRegistrationPage.tsx` to call `authService.registerOrganization` and redirect on success.
- [x] T022 [P] Add error handling to display a single, clear error message when the atomic registration API fails.
- [x] T023 [P] Run `npm run build` and fix any TypeScript errors introduced by the new types and component.
- [x] T024 [P] Update `AGENTS.md` reference to the current plan if not already updated.
- [x] T025 Re-test all three user stories manually per `quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed).
  - Or sequentially in priority order (US1 → US2 → US3).
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories; easiest to implement alongside US1 in the same component.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). No dependencies on other stories.

### Within Each User Story

- Service contract before UI implementation.
- Form state and inputs before validation.
- Validation before submission wiring.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks (Phase 1) can run in parallel.
- T003 and T004 (service types and method) are sequential.
- T005–T011 (US1 form building) are sequential within the same file.
- T012–T015 (US2 deduplication) can be done alongside T005–T011 since they all edit the same new component.
- T016–T020 (US3 route preservation) can run in parallel with US1/US2 work because they touch different files.
- T021/T022/T023/T024 (Polish) can run in parallel after the form is complete.
- Different user stories can be worked on in parallel by different team members once the Foundational phase is complete.

---

## Parallel Example: User Story 1 + User Story 2

```bash
# US1 form building is sequential within the same file:
Task: "Create new page component in src/app/pages/auth/OrgRegistrationPage.tsx"
Task: "Build merged form state object"
Task: "Add user account field inputs"
Task: "Add organization field inputs"
Task: "Render conditional fields based on orgType"
Task: "Implement client-side validation"

# US2 deduplication is done at the same time in the same file:
Task: "Use single email input"
Task: "Use single phone input"
Task: "Use single orgName input"
```

---

## Implementation Strategy

### MVP First (User Story 1 + US2)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1 (combined page with all fields).
4. Complete Phase 4: User Story 2 (deduplicate shared fields) in the same pass.
5. **STOP and VALIDATE**: Test the new page independently.
6. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 + 2 → Combined page with no duplicate fields → Deploy/Demo (MVP!).
3. Add User Story 3 → Route added, existing pages preserved → Deploy/Demo.
4. Add Polish → Submission wiring, error handling, build verification → Deploy/Demo.
5. Each increment adds value without breaking previous work.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 + 2 (combined page component).
   - Developer B: User Story 3 (route integration + regression checks).
   - Developer C: Polish phase (submission, error handling, build).
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
