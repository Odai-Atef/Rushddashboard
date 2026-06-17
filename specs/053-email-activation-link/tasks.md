# Tasks: Email Activation Link Handling

**Input**: Design documents from `specs/053-email-activation-link/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/activation-contract.md, quickstart.md  
**Tests**: Not explicitly requested; no automated test tasks generated.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm project environment and ensure required tools are available.

- [X] T001 Verify the dev server starts and the `/auth/activate` route resolves in `src/app/routes.tsx`
- [X] T002 Confirm `src/api/services/auth-service.ts` exposes `activateAccount(token)` and points to `/api/v1/auth/activate`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core behavior of the API client and route are already in place. Verify no existing auth redirect breaks the public activation call.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Verify `src/api/client.ts` does not redirect on `401` for unauthenticated public calls, or that `AuthService.activateAccount` can pass `skipAuthRedirect: true`
- [X] T004 [P] Confirm `src/api/types.ts` `ApiResponse` shape supports `{ success: boolean, data: T, message?: string }` for the activation response

**Checkpoint**: Foundation ready — the activation service can call a public endpoint and the response shape is supported.

---

## Phase 3: User Story 1 - Activate account via email link (Priority: P1) 🎯 MVP

**Goal**: A user clicks a valid activation link, the backend activates the account, and the user is redirected to `/auth/login` with a success message.

**Independent Test**: Visit `/auth/activate?token=VALID` and verify the page shows a loading state, then a success state, then redirects to `/auth/login?activated=success&message=...` with a green banner.

### Implementation for User Story 1

- [X] T005 [US1] Update `ActivateAccountPage.tsx` to ensure `setTimeout` cleanup is centralized so navigation always occurs exactly once
- [X] T006 [US1] In `ActivateAccountPage.tsx`, use the backend `message` from `authService.activateAccount` response when redirecting to `/auth/login?activated=success`
- [X] T007 [US1] In `LoginPage.tsx`, ensure `activationMessage` is URL-decoded and safely rendered in the success banner

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Handle invalid or expired activation link (Priority: P2)

**Goal**: A user who opens an invalid, expired, or missing-token link sees a clear failure message on the login page.

**Independent Test**: Visit `/auth/activate?token=INVALID`, `/auth/activate` (no token), and an offline-throttled `/auth/activate?token=VALID`; each should redirect to `/auth/login?activated=error&message=...` with a red banner.

### Implementation for User Story 2

- [X] T008 [US2] In `ActivateAccountPage.tsx`, handle missing token by immediately setting error state and redirecting with a localized failure message
- [X] T009 [US2] In `ActivateAccountPage.tsx`, handle backend `success: false` by redirecting to `/auth/login?activated=error&message=<backend-message>`
- [X] T010 [US2] In `ActivateAccountPage.tsx`, handle network errors (`Failed to fetch`) and unexpected exceptions by redirecting with a connectivity/error message
- [X] T011 [US2] In `LoginPage.tsx`, ensure the error banner renders the decoded `activationMessage` or a sensible fallback

**Checkpoint**: User Story 2 works independently; both US1 and US2 now behave correctly.

---

## Phase 5: User Story 3 - Communicate activation status clearly (Priority: P3)

**Goal**: The activation status is visible, accessible, and easy to understand on the login page.

**Independent Test**: Inspect the login page after activation redirect and confirm the banner is visually distinct and its text is announced to assistive technology.

### Implementation for User Story 3

- [X] T012 [P] [US3] Add `role="alert"` and `aria-live="polite"` to the activation status banners in `LoginPage.tsx`
- [X] T013 [US3] In `LoginPage.tsx`, keep the existing green/red banner styling but ensure it uses the same alert component pattern as other page messages for consistency

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across all stories.

- [X] T014 [P] Run `npm run build` and verify no TypeScript or lint errors related to `ActivateAccountPage.tsx` or `LoginPage.tsx`
- [X] T015 Validate the scenarios in `quickstart.md` (valid token, invalid token, missing token, offline)
- [X] T016 Update `AGENTS.md` if any new plan references were added (already done during planning)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel if staffed.
  - Or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — builds on the same `ActivateAccountPage` component but is independently testable via different URL inputs.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — only touches the login page banner markup.

### Within Each User Story

- Core component behavior before integration with login page messaging.
- Error handling added after happy-path flow is stable.
- Login page rendering improvements after redirect contract is finalized.

### Parallel Opportunities

- T003 and T004 in Phase 2 can run in parallel.
- T012 (US3 accessibility markup) can run in parallel with US1/US2 once the redirect contract is known.
- T014 (build check) and T015 (manual quickstart validation) can run in parallel after implementation.

---

## Parallel Example: User Story 1

```bash
# Launch independent UI tasks for User Story 1 together:
Task: "Update ActivateAccountPage.tsx cleanup logic"
Task: "Use backend message in ActivateAccountPage success redirect"
Task: "Ensure LoginPage.tsx renders decoded success message"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test `/auth/activate?token=VALID` end-to-end.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. User Story 1 → valid-token flow works → deploy/demo (MVP!).
3. User Story 2 → invalid/missing/offline flows work → deploy/demo.
4. User Story 3 → accessibility and styling polish → deploy/demo.

---

## Notes

- No new directories, dependencies, or backend entities are required.
- The activation service method and route already exist; tasks focus on correctness, cleanup, and messaging.
- All file paths refer to `src/` relative to the repository root.
