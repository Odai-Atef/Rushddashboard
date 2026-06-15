# Tasks: Handle 401 Session Expired

**Input**: Design documents from `specs/027-handle-401-session-expired/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested. Manual browser validation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Understand existing code before making changes

- [X] T001 Review `src/api/client.ts` to understand current request flow, error handling, and existing `clearAuthToken()` method
- [X] T002 [P] Review `src/app/components/LoginPage.tsx` to understand current login flow and hardcoded `/dashboard` redirect
- [X] T003 [P] Review `src/app/routes.tsx` to confirm login route path is `/auth/login`

---

## Phase 2: Foundational

**Purpose**: No blocking infrastructure needed — this feature reuses existing auth patterns

> **Note**: This phase is intentionally minimal. The project already has `ApiClient`, `AuthContext`, and `LoginPage`. No new dependencies or frameworks required.

**Checkpoint**: Existing code reviewed; ready to modify `ApiClient` and `LoginPage`.

---

## Phase 3: User Story 1 — Automatic Redirect on Session Expiry (Priority: P1) 🎯 MVP

**Goal**: Detect 401 responses from any API call, clear stored auth tokens, append current page as `redirect` query param, and navigate to `/auth/login?expired=true&redirect=/path`. Prevent duplicate redirects and infinite loops.

**Independent Test**: Simulate a 401 by setting an invalid token in localStorage and navigating to any page that triggers an API call. Verify redirect to `/auth/login?expired=true&redirect=/path` and that token is cleared.

### Implementation for User Story 1

- [X] T004 [US1] Add module-level `isRedirecting` flag at top of `src/api/client.ts`
- [X] T005 [US1] In `src/api/client.ts` `requestWithRetry()`, intercept 401 errors before throwing: set `isRedirecting = true`, call `clearAuthToken()`, then redirect
- [X] T006 [US1] Build redirect URL in `src/api/client.ts` with `expired=true` and current pathname as `redirect` param
- [X] T007 [US1] Add guard in `src/api/client.ts` to skip redirect if `isRedirecting` is already true or if current path is `/auth/login`

**Checkpoint**: User Story 1 is complete. Any API call returning 401 redirects to login with proper query params.

---

## Phase 4: User Story 2 — Informative Message on Login Page (Priority: P2)

**Goal**: Display an Arabic session-expired message on `LoginPage` when `?expired=true` is present. After successful login, navigate to the `redirect` param value instead of hardcoded `/dashboard`.

**Independent Test**: Navigate directly to `/auth/login?expired=true` and verify the Arabic message banner is visible. Navigate to `/auth/login?redirect=/sales` and verify post-login redirect goes to `/sales`.

### Implementation for User Story 2

- [X] T008 [US1] Import `useSearchParams` from `react-router` in `src/app/components/LoginPage.tsx`
- [X] T009 [US2] Add Arabic session-expired banner/message display in `src/app/components/LoginPage.tsx` when `?expired=true`
- [X] T010 [US2] Replace hardcoded `navigate('/dashboard')` with dynamic redirect from `?redirect` param in `src/app/components/LoginPage.tsx`
- [X] T011 [US2] Add validation in `src/app/components/LoginPage.tsx` to ensure `redirect` param is a relative path starting with `/` before navigating

**Checkpoint**: User Stories 1 AND 2 are complete. Login page shows Arabic message and redirects back to original page after re-login.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate edge cases and ensure no regressions

- [X] T012 [P] Run TypeScript compiler (`npm run build` or `tsc --noEmit`) to verify no type errors
- [X] T013 [P] Manual validation: test concurrent 401s (open Network tab, block token, trigger multiple API calls) — confirm only one redirect
- [X] T014 [P] Manual validation: test already-on-login-page 401 — confirm no redirect loop
- [X] T015 [P] Manual validation: test form submission during 401 — confirm graceful completion before redirect
- [X] T016 Update `specs/027-handle-401-session-expired/quickstart.md` if any validation steps differ from expected behavior

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Minimal; project already has all required infrastructure
- **User Story 1 (Phase 3)**: Depends on Setup/Foundational — can start after code review
- **User Story 2 (Phase 4)**: Depends on User Story 1 (ApiClient redirect must exist before LoginPage can display message) — OR can be done in parallel if both files are worked on independently
- **Polish (Phase 5)**: Depends on both user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on US2. Can be tested independently by manually navigating to `/auth/login?expired=true&redirect=/dashboard`.
- **User Story 2 (P2)**: Technically can be implemented in parallel with US1 since it only touches `LoginPage.tsx`, but the full end-to-end flow requires US1 to be working.

### Parallel Opportunities

- T001, T002, T003 (code review) can all run in parallel
- T004–T007 (ApiClient changes) and T008–T011 (LoginPage changes) can be worked on in parallel by different developers
- T012–T016 (validation) can run in parallel after implementation is complete

---

## Parallel Example: Full Implementation

```bash
# Developer A: ApiClient (User Story 1)
Task: "T004 Add module-level isRedirecting flag at top of src/api/client.ts"
Task: "T005 In src/api/client.ts requestWithRetry(), intercept 401 errors"
Task: "T006 Build redirect URL in src/api/client.ts"
Task: "T007 Add guard in src/api/client.ts to skip redirect"

# Developer B: LoginPage (User Story 2) — in parallel
Task: "T008 Import useSearchParams in src/app/components/LoginPage.tsx"
Task: "T009 Add Arabic session-expired banner in src/app/components/LoginPage.tsx"
Task: "T010 Replace hardcoded navigate with dynamic redirect"
Task: "T011 Add redirect param validation in src/app/components/LoginPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (code review)
2. Complete Phase 3: User Story 1 (ApiClient 401 intercept)
3. **STOP and VALIDATE**: Simulate 401 and verify redirect to `/auth/login?expired=true&redirect=/path`
4. Then proceed to Phase 4: User Story 2 (LoginPage enhancements)

### Incremental Delivery

1. Setup + US1 → ApiClient redirects on 401 (core feature)
2. Add US2 → LoginPage displays Arabic message and returns user to original page
3. Add Polish → Edge cases validated, no regressions

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Manual testing via browser DevTools is the primary validation method (no existing test framework)
- Commit after each logical group of tasks
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
