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
- Paths shown below assume single project

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare constants, types, and utility stubs needed by all subsequent phases.

- [ ] T001 [P] Create `src/types/session-expiry.ts` with `SessionCheckResult`, `LogoutSignal`, `SessionExpiryState` types
- [ ] T002 [P] Create `src/config/auth.ts` and export `SESSION_POLL_INTERVAL_MS = 15000` constant
- [ ] T003 [P] Add localized session-expired translation keys to i18n file: `"sessionExpired"` in `src/locales/en.json` and `src/locales/ar.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and auth-service method that MUST exist before any user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Update `src/services/authService.ts` (or create) to add `getAuthMe()` function calling `GET /auth/me`
- [ ] T005 [P] Create `src/utils/sessionStorage.ts` with helpers `setLogoutSignal`, `getLogoutSignal`, `clearLogoutSignal` using `localStorage`
- [ ] T006 [P] Create `src/utils/sessionStorage.ts` with helper `isRecentSignal(timestamp: number, windowMs = 3000): boolean` for stale-flag guard

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Protected Page Session Expiry Alert (Priority: P1) 🎯 MVP

**Goal**: While the user is authenticated and on a protected page, run a centralized `setInterval` to call `GET /auth/me` every 15 seconds. On explicit expiry (401/403), log out, clear state, redirect to login, and emit a `SESSION_EXPIRED` event. Manage the timer lifecycle so duplicates do not occur.

**Independent Test**: Log in, navigate to a protected page, wait 15 seconds for a successful `GET /auth/me` call, then simulate a 401 response on the next tick and observe automatic logout + redirect.

### Implementation for User Story 1

- [ ] T007 [US1] Create `src/hooks/useAuthSessionPoller.ts` hook skeleton with `useRef` interval handle and `useEffect` cleanup
- [ ] T008 [US1] Implement polling start/stop logic inside `useAuthSessionPoller.ts`: start interval only when `isAuthenticated && isProtectedRoute`
- [ ] T009 [US1] Add `checkSessionValid` timer callback in `useAuthSessionPoller.ts` that calls `getAuthMe()` and handles `valid` vs `expired`/`invalid` results
- [ ] T010 [US1] Integrate `useAuthSessionPoller` call into the existing `AuthProvider` (or equivalent) in `src/stores/` or `src/lib/`
- [ ] T011 [US1] On explicit expiry response (401/403), trigger centralized logout, clear auth state, and redirect to `/login` via `navigate` or `window.location`
- [ ] T012 [US1] Add guard in logout handler to prevent duplicate logout loops: read/clear `logoutSignal` before acting, and set a processing flag

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Language-Specific Toast on Expiry (Priority: P2)

**Goal**: Ensure that when `SESSION_EXPIRED` is emitted, a single localized toast is shown using the current language preference (EN or AR). The toast must appear exactly once per expiry event, even across multiple tabs.

**Independent Test**: With locale set to `ar`, trigger session expiry on a protected page and verify that the Arabic toast appears once. Switch to `en` and repeat to verify the English toast.

### Implementation for User Story 2

- [ ] T013 [US2] In `AuthProvider`, update the expiry path to emit a typed `SESSION_EXPIRED` event carrying the current `locale` value instead of calling toast directly
- [ ] T014 [US2] Create `src/components/toast/SessionExpiredToastListener.tsx` that listens for `SESSION_EXPIRED`, reads `locale`, and renders a localized toast via the app’s preferred toast library
- [ ] T015 [US2] In `SessionExpiredToastListener.tsx`, add `hasNotifiedSessionExpired` ref guard: set `true` on first trigger, reset to `false` only on explicit login success
- [ ] T016 [US2] Integrate `SessionExpiredToastListener` into `src/App.tsx` (or root layout) so it is mounted globally

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Public Pages Unaffected (Priority: P3)

**Goal**: Ensure that no polling, logout, redirect, or toast logic runs while the user is on public/unauthenticated pages or backgrounded tabs.

**Independent Test**: Navigate to a public page while authenticated. Confirm via the Network tab that `GET /auth/me` is NOT called every 15 seconds. Switch to a protected page and confirm polling resumes.

### Implementation for User Story 3

- [ ] T017 [US3] In `useAuthSessionPoller.ts`, add route-awareness: pause the interval when `location.pathname` matches any public-page whitelist (`/login`, `/register`, etc.)
- [ ] T018 [US3] In `useAuthSessionPoller.ts`, add `document.visibilitychange` listener to pause the interval while `document.hidden === true` and resume when the tab becomes visible again
- [ ] T019 [US3] Add early return in `SessionExpiredToastListener` so no toast is rendered if `!isAuthenticated`; ensure listener does not show a toast on public pages after logout

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-tab coordination, code quality, and final validation.

- [ ] T020 [P] In `AuthProvider` expiry path, write `setLogoutSignal` with a timestamp before performing logout; add `storage` event listener in `useAuthSessionPoller` to react to cross-tab expiry signals
- [ ] T021 [P] In `SessionExpiredToastListener`, gate toast display with `document.visibilityState === 'visible'` so only the active tab shows the toast
- [ ] T022 Verify no function exceeds 50 lines; extract helpers if needed
- [ ] T023 [P] Run quickstart.md validation steps: simulate expiry on protected page and confirm behavior
- [ ] T024 [P] Remove any debug `console.log` or commented-out code added during development

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Depends on US1 for the event-emitting path, but can be built in parallel once T010 is defined.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Depends on US1 polling hook, but route/visibility pausing can be added in parallel.

### Parallel Opportunities

- All Setup tasks (T001–T003) can run in parallel.
- All Foundational tasks (T004–T006) can run in parallel once Setup is done.
- Once Foundational is complete:
  - US1 (T007–T012) and US3 route-awareness (T017–T019) can progress in parallel.
- T020 (cross-tab signal) and T021 (active-tab toast gate) can run in parallel.
- T023 (quickstart validation) and T024 (cleanup) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch foundational model + service together after Setup:
Task: "T004 Update src/services/authService.ts with getAuthMe()"
Task: "T005 Create src/utils/sessionStorage.ts helpers"

# Launch hook + integration together after Foundational:
Task: "T007 Create src/hooks/useAuthSessionPoller.ts skeleton"
Task: "T008 Implement polling start/stop in useAuthSessionPoller.ts"
Task: "T009 Add checkSessionValid callback in useAuthSessionPoller.ts"
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
