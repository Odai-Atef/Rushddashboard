# Tasks: Session Username Sync

**Input**: Design documents from `/specs/035-session-username-sync/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup needed — the project is already initialized. The backend profile endpoint (`GET /auth/profile`) and `AuthService` already exist.

- [X] T001 Verify `UserProfile` interface exists in `src/api/services/auth-service.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the auth context to expose the current user profile.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Extend `AuthContextType` in `src/app/layouts/RootLayout.tsx` to include `user: UserProfile | null`
- [X] T003 Add profile fetch on mount in `src/app/layouts/RootLayout.tsx` (if already authenticated)
- [X] T004 Add profile fetch after successful login in `src/app/layouts/RootLayout.tsx`
- [X] T005 Clear `user` state on logout in `src/app/layouts/RootLayout.tsx`

**Checkpoint**: Foundation ready — `useAuth()` now exposes `user` to all child components

---

## Phase 3: User Story 1 — Top Menu Displays Authenticated User (Priority: P1) 🎯 MVP

**Goal**: The top bar user menu shows the authenticated user's name, email, and avatar initials instead of hardcoded placeholders.

**Independent Test**: Log in with different accounts and verify the top bar shows the correct `fullName`, `email`, and avatar initials.

### Implementation for User Story 1

- [X] T006 [US1] Read `user` from `useAuth()` in `src/app/components/TopBar.tsx`
- [X] T007 [US1] Replace hardcoded avatar fallback "أح" with `getInitials(user?.fullName)` in `src/app/components/TopBar.tsx`
- [X] T008 [US1] Replace hardcoded name "أحمد محمد" with `user?.fullName ?? 'المستخدم'` in `src/app/components/TopBar.tsx`
- [X] T009 [US1] Replace hardcoded email "ahmed@rushd.ai" with `user?.email ?? ''` in `src/app/components/TopBar.tsx`
- [X] T010 [US1] Add `getInitials` utility in `src/app/components/TopBar.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 — Settings Profile Page Reflects Session Data (Priority: P1)

**Goal**: The Settings > Profile page pre-fills name and email from the authenticated session.

**Independent Test**: Open Settings > Profile and verify the name and email fields match the authenticated session.

### Implementation for User Story 2

- [X] T011 [US2] Read `user` from `useAuth()` in `src/app/components/SettingsPage.tsx`
- [X] T012 [US2] Replace hardcoded avatar "أح" with `getInitials(user?.fullName)` in `src/app/components/SettingsPage.tsx`
- [X] T013 [US2] Replace hardcoded first name "أحمد" with split from `user?.fullName` in `src/app/components/SettingsPage.tsx`
- [X] T014 [US2] Replace hardcoded last name "محمد" with split from `user?.fullName` in `src/app/components/SettingsPage.tsx`
- [X] T015 [US2] Replace hardcoded email "ahmed@rushd.ai" with `user?.email ?? ''` in `src/app/components/SettingsPage.tsx`
- [X] T016 [US2] Add `getInitials` utility in `src/app/components/SettingsPage.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 — Handle Missing or Failed Profile Fetch (Priority: P2)

**Goal**: If the profile endpoint fails, the UI shows sensible fallbacks without crashing.

**Independent Test**: Block the `/auth/profile` endpoint and verify the top bar and settings page still render correctly with generic fallbacks.

### Implementation for User Story 3

- [X] T017 [US3] Add `.catch()` handler for profile fetch on mount in `src/app/layouts/RootLayout.tsx`
- [X] T018 [US3] Add `.catch()` handler for profile fetch on login in `src/app/layouts/RootLayout.tsx`
- [X] T019 [US3] Verify `getInitials(undefined)` returns `؟` in `src/app/components/TopBar.tsx`
- [X] T020 [US3] Verify `getInitials(undefined)` returns `؟` in `src/app/components/SettingsPage.tsx`
- [X] T021 [US3] Verify logout clears `user` to `null` in `src/app/layouts/RootLayout.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation updates

- [X] T022 [P] Update `AGENTS.md` to reference current plan and spec paths
- [X] T023 Verify TypeScript compilation succeeds for modified files
- [X] T024 Commit all changes on feature branch `035-session-username-sync`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - US1 (Top Bar) and US2 (Settings) can be implemented in parallel once Phase 2 is done
  - US3 (Resilience) depends on US1 and US2 being in place
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 3 (P2)**: Depends on US1 and US2 being implemented (needs the UI components to exist)

### Within Each User Story

- Core implementation before edge-case handling
- UI components updated before fallback logic verified

### Parallel Opportunities

- T006–T010 (TopBar changes) can run in parallel with T011–T016 (SettingsPage changes) after Phase 2 completes
- T022–T024 (Polish) can run in parallel once all user stories are done

---

## Parallel Example: User Story 1 & 2

```bash
# After Phase 2 (Foundational) is complete:
# Developer A works on TopBar:
Task: "Read user from useAuth() in src/app/components/TopBar.tsx"
Task: "Replace hardcoded values with user data in src/app/components/TopBar.tsx"

# Developer B works on SettingsPage:
Task: "Read user from useAuth() in src/app/components/SettingsPage.tsx"
Task: "Replace hardcoded values with user data in src/app/components/SettingsPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (extend auth context)
2. Complete Phase 3: User Story 1 (Top Bar)
3. **STOP and VALIDATE**: Log in and verify top bar shows real user data
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 (Top Bar) → Test independently
3. Add User Story 2 (Settings) → Test independently
4. Add User Story 3 (Resilience) → Verify fallbacks
5. Polish and commit

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No new services, endpoints, or dependencies introduced
- All changes are within existing component and layout files
