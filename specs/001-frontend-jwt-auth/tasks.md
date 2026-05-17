# Tasks: Frontend JWT Authentication Integration

**Input**: Design documents from `/specs/001-frontend-jwt-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this feature - not explicitly requested in the specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Project Configuration)

**Purpose**: Configure environment and ensure project is ready for auth integration

- [ ] T001 Configure API base URL environment variable in `.env` and `.env.example`
- [ ] T002 Verify React Hook Form and validation libraries are properly installed
- [ ] T003 [P] Review existing LoginPage.tsx and RegistrationPage.tsx for integration points

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create TypeScript auth interfaces and types in `src/app/types/auth.ts`
- [ ] T005 [P] Create token storage utilities in `src/app/utils/auth.ts`
- [ ] T006 Create centralized auth API service in `src/app/services/auth.ts`
- [ ] T007 Extract and enhance AuthContext in `src/app/layouts/RootLayout.tsx` with JWT support
- [ ] T008 Create useAuth hook in `src/app/hooks/useAuth.ts` (extract from RootLayout)
- [ ] T009 Configure fetch wrapper/interceptor for attaching Bearer tokens in `src/app/services/api.ts`

**Checkpoint**: Foundation ready - all auth infrastructure in place, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Account Registration (Priority: P1) 🎯 MVP

**Goal**: Connect registration form to backend register endpoint with validation and auto-login

**Independent Test**: Complete the registration form with valid data and verify automatic redirection to dashboard with active session

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create registration form validation schema (Zod) in `src/app/types/auth.ts`
- [ ] T011 [P] [US1] Update RegistrationPage.tsx to use React Hook Form with Zod validation
- [ ] T012 [US1] Implement registration API integration in `src/app/components/RegistrationPage.tsx`
- [ ] T013 [US1] Add registration error handling and user-friendly error messages
- [ ] T014 [US1] Implement auto-login after successful registration with token storage

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Secure Sign-In (Priority: P1)

**Goal**: Connect sign-in form to backend login endpoint with JWT token storage

**Independent Test**: Submit valid credentials on login page and verify redirection to dashboard with JWT stored in localStorage

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create login form validation schema (Zod) in `src/app/types/auth.ts`
- [ ] T016 [P] [US2] Update LoginPage.tsx to use React Hook Form with Zod validation
- [ ] T017 [US2] Implement login API integration in `src/app/components/LoginPage.tsx`
- [ ] T018 [US2] Add login error handling and user-friendly error messages
- [ ] T019 [US2] Ensure JWT access token is stored in localStorage after successful login

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Session Persistence (Priority: P1)

**Goal**: Restore auth state from localStorage on app load and handle token expiration

**Independent Test**: Sign in, refresh the browser page, and verify the user remains authenticated without re-entering credentials

### Implementation for User Story 3

- [ ] T020 [US3] Implement auth state restoration from localStorage in `src/app/layouts/RootLayout.tsx`
- [ ] T021 [US3] Add token validation check during state restoration
- [ ] T022 [US3] Implement silent token refresh logic in `src/app/services/auth.ts`
- [ ] T023 [US3] Handle expired/invalid tokens by clearing state and redirecting to login
- [ ] T024 [US3] Add loading state during auth state restoration

**Checkpoint**: At this point, all P1 stories (US1-US3) should be fully functional

---

## Phase 6: User Story 4 - Secure Sign-Out (Priority: P2)

**Goal**: Implement logout flow that clears tokens and redirects to login

**Independent Test**: Click logout button and verify session termination and redirection to login page

### Implementation for User Story 4

- [ ] T025 [US4] Implement logout function in `src/app/hooks/useAuth.ts`
- [ ] T026 [US4] Add logout UI trigger (button/link) in dashboard layout or navigation
- [ ] T027 [US4] Ensure logout clears all tokens from localStorage
- [ ] T028 [US4] Redirect to login page after successful logout

**Checkpoint**: At this point, User Story 4 should work independently

---

## Phase 7: User Story 5 - Protected Feature Access (Priority: P2)

**Goal**: Add route guards to prevent unauthorized access to dashboard pages

**Independent Test**: Attempt to access `/dashboard` without authentication and verify redirection to login page

### Implementation for User Story 5

- [ ] T029 [US5] Create ProtectedRoute component in `src/app/components/ProtectedRoute.tsx`
- [ ] T030 [US5] Update routes.tsx to wrap dashboard routes with ProtectedRoute
- [ ] T031 [US5] Ensure authenticated requests include Bearer token in Authorization header
- [ ] T032 [US5] Handle 401 responses by clearing auth state and redirecting to login

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T033 [P] Add Arabic error messages for all auth flows (consistent with existing UI)
- [ ] T034 [P] Add loading skeletons/spinners for auth state restoration
- [ ] T035 Review and optimize bundle size - ensure no unnecessary dependencies added
- [ ] T036 Run quickstart.md validation steps
- [ ] T037 Code cleanup: remove simulated auth logic (setTimeout placeholders)
- [ ] T038 [P] Verify all auth-related files are under 300 lines (constitution requirement)
- [ ] T039 Verify no secrets or hardcoded API keys in client-side code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Depends on US1/US2 being functional for testing
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on auth context being complete
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Depends on auth context being complete

### Within Each User Story

- Validation schemas before form integration
- Form integration before API integration
- API integration before error handling
- Core implementation before polish

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- T010 and T015 (validation schemas) can run in parallel
- T011 and T016 (form updates) can run in parallel
- T012 and T017 (API integration) can run in parallel
- T020-T024 (session persistence) can start in parallel with US4/US5 once US1/US2 are done
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch validation schema and form update together:
Task: "Create registration form validation schema in src/app/types/auth.ts"
Task: "Update RegistrationPage.tsx to use React Hook Form with Zod validation"

# Then launch API integration:
Task: "Implement registration API integration in src/app/components/RegistrationPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Registration)
4. Complete Phase 4: User Story 2 (Sign-In)
5. Complete Phase 5: User Story 3 (Session Persistence)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently (core auth complete!)
5. Add User Story 4 → Test independently
6. Add User Story 5 → Test independently
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Registration)
   - Developer B: User Story 2 (Sign-In)
3. Once US1/US2 are done:
   - Developer A: User Story 3 (Session Persistence)
   - Developer B: User Story 4 (Sign-Out)
   - Developer C: User Story 5 (Protected Routes)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All error messages should be in Arabic to match existing UI language
- Token storage keys: `rushd_access_token`, `rushd_refresh_token`, `rushd_user`
