# Tasks: Global Session Expiry Check and Auto Logout

**Input**: Design documents from `/specs/030-session-expiry-logout/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/  

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root
- Paths shown below assume single project; adjust per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare constants, types, and translation keys needed by all subsequent phases.

- [X] T001 [P] Add `"sessionExpired"` locale strings to `src/locales/en.json` and `src/locales/ar.json`
- [X] T002 [P] Add `SessionCheckResult`, `SessionExpiryState` types to `src/types/auth.ts` (or `src/types/session.ts`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and auth-service method that MUST exist before any user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Add lightweight `getMe()` call (`GET /auth/me`) to `src/services/auth.ts` (returns `AuthResponse`)
- [X] T004 [P] Create `src/utils/sessionExpiry.ts` with helpers: `setLogoutSignal`, `getLogoutSignal`, `clearLogoutSignal`, `isRecentSignal`
- [X] T005 [P] Add `SESSION_POLL_INTERVAL_MS = 15000` constant to `src/utils/constants.ts` (or existing constants file)

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Protected Page Session Expiry Alert (Priority: P1) 🎯 MVP

**Goal**: Centralized session poller triggers logout + redirect on explicit expiry while on protected pages.

**Independent Test**: Log in, navigate to a protected page, simulate `401` on the next tick, verify automatic logout + redirect.

### Implementation for User Story 1

- [ ] T006 [US1] Create `src/hooks/useAuthSessionPoller.ts` skeleton with `useRef`, `useEffect`, `useCallback`
- [ ] T007 [US1] Implement 15-second `setInterval` in `useAuthSessionPoller.ts` with `startPolling()` / `stopPolling()` controls
- [ ] T008 [US1] Implement `checkSession()` callback in `useAuthSessionPoller.ts` that calls `getMe()` and handles success
- [ ] T009 [US1] Add network-error tolerance in `checkSession()`: skip tick on non-401/403 errors, do not logout
- [ ] T010 [US1] Implement `SESSION_EXPIRED` event emission on `401`/`403` responses inside `useAuthSessionPoller.ts` (via custom Event or callback)
- [ ] T011 [US1] Integrate `useAuthSessionPoller` into `src/app/providers/AuthProvider.tsx` (or existing auth provider): start/stop based on `isAuthenticated`
- [ ] T012 [US1] In `AuthProvider`, handle `SESSION_EXPIRED` event: clear all auth/session state (access token, refresh token, user profile) via existing `clearTokens()`
- [ ] T013 [US1] In `AuthProvider`, redirect to `/auth/login` with `?next=` preserving current protected route on `SESSION_EXPIRED`
- [ ] T014 [US1] Add duplicate-logout-loop guard in `AuthProvider` or `useAuthSessionPoller` using the `logoutSignal` localStorage flag and `isRecentSignal()` helper

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 — Language-Specific Toast on Expiry (Priority: P2)

**Goal**: Show a single, localized toast on session expiry using the current language preference (`en`/`ar`).

**Independent Test**: Switch locale to `ar`, trigger session expiry on a protected page, verify Arabic toast appears exactly once.

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create `src/components/SessionExpiredToastListener.tsx` that subscribes to the `SESSION_EXPIRED` event
- [ ] T016 [US2] In `SessionExpiredToastListener.tsx`, read current `locale` (from `useLanguage` hook or context) and render localized `sessionExpired` toast via `sonner`
- [ ] T017 [US2] Add `hasNotifiedSessionExpired` ref guard in `SessionExpiredToastListener.tsx`; prevent duplicate toasts per event
- [ ] T018 [US2] Integrate `SessionExpiredToastListener` into `src/app/App.tsx` (or `RootLayout.tsx`) so it is globally mounted
- [ ] T019 [US2] Ensure `hasNotifiedSessionExpired` resets to `false` **only** on successful login (not on navigation or re-render)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 — Public Pages Unaffected (Priority: P3)

**Goal**: No polling, logout, redirect, or toast logic runs on public/unauthenticated pages.

**Independent Test**: Navigate to a public page (e.g., `/auth/login`) while logged in, confirm no `GET /auth/me` polling occurs.

### Implementation for User Story 3

- [ ] T020 [US3] In `useAuthSessionPoller.ts`, add route-awareness: check if current `location.pathname` is in the public-page whitelist; if so, skip `checkSession()`
- [ ] T021 [US3] In `AuthProvider`, pause `useAuthSessionPoller` entirely when current route is public (e.g., `/auth/login`, `/auth/register`)
- [ ] T022 [US3] Add early return in `SessionExpiredToastListener` so no toast renders if `!isAuthenticated` or user is already on a public page

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-tab coordination, code quality, and final validation.

- [ ] T023 [P] In `AuthProvider`, write `setLogoutSignal()` to `localStorage` on `SESSION_EXPIRED`; add `storage` event listener to coordinate cross-tab logout
- [ ] T024 [P] In `SessionExpiredToastListener.tsx`, gate toast display with `document.visibilityState === 'visible'` so only the active tab shows the toast
- [ ] T025 [P] In `useAuthSessionPoller.ts`, add `document.visibilitychange` listener to pause interval when tab is backgrounded (`document.hidden === true`) and resume when visible
- [ ] T026 Verify no function exceeds 50 lines; extract helpers if needed
- [ ] T027 [P] Remove any debug `console.log` or commented-out code added during development
- [ ] T028 [P] Run quickstart.md validation steps: simulate expiry on a protected page and confirm toast + redirect behavior

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed).
  - Or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies
- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Depends on US1 being defined, but listener can be drafted in parallel.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Depends on US1 polling hook, but pausing logic can be added in parallel.

### Within Each User Story
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities
- All Setup tasks (T001–T002) can run in parallel.
- All Foundational tasks (T003–T005) can run in parallel once Setup is done.
- Once Foundational is complete:
  - US1 hook implementation (T006–T014) and US3 route-awareness (T020–T022) can progress in parallel.
- T023–T025 (cross-tab, active-tab, visibility) can run in parallel.
- T027 (cleanup) and T028 (quickstart validation) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch foundational model + service together after Setup:
Task: "T003 Add getMe() to src/services/auth.ts"
Task: "T004 Create src/utils/sessionExpiry.ts helpers"

# Launch hook + integration together after Foundational:
Task: "T006 Create useAuthSessionPoller.ts skeleton"
Task: "T007 Implement 15-second setInterval in useAuthSessionPoller.ts"
Task: "T008 Implement checkSession callback in useAuthSessionPoller.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Trigger token expiry and verify logout + redirect.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo.
4. Add User Story 3 → Test independently → Deploy/Demo.
5. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (core polling + logout + redirect)
   - Developer B: User Story 2 (localized toast listener)
   - Developer C: User Story 3 (public-page exclusion + visibility pause)
3. Stories complete and integrate independently in Polish phase.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.
