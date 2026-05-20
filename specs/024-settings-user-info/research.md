# Research: Settings Page User Info

**Date**: 2026-05-20  
**Feature**: Settings Page User Info

## Unknowns Resolved

### 1. What fields are available from the backend auth response?

**Decision**: The `AuthResponse` contract in the frontend (`src/app/types/auth.ts`) already defines `user` with `id` and `email`. The backend registration response (`specs/020-align-registration-dto/contracts/auth-api.md`) returns additional user fields (`firstName`, `lastName`, `companyId`, `roleId`). However, the frontend `AuthResponse` contract and `UserProfile` interface currently only capture `id` and `email`.

**Rationale**: To show real user name and bind company fields, the frontend must extend `UserProfile` to include optional `firstName`, `lastName`, and `companyName`. This avoids requiring a new backend endpoint for the current scope while enabling immediate data binding.

**Alternatives considered**:
- Create a new `GET /me` endpoint — rejected because the spec scope is to use the existing auth/session source, not introduce new backend work.
- Refactor SettingsPage into smaller components first — rejected because the task is specifically data binding, not structural redesign.

### 2. How is the user persisted between refreshes?

**Decision**: `localStorage` via `rushd_user` key (JSON string).

**Rationale**: The `AuthProvider` restores `user` from `localStorage` on mount. Extending `UserProfile` means the serialized shape in `localStorage` will grow, but existing `id` and `email` remain backward compatible.

### 3. What happens if `firstName`/`lastName` are missing?

**Decision**: Display email-only gracefully in the avatar initials and name fields. Show empty inputs for optional fields rather than hardcoded Arabic demo text.

**Rationale**: The spec requires handling partial/missing data safely. Email is guaranteed by `UserProfile`; name fields are optional.

### 4. Are there existing tests for SettingsPage?

**Decision**: There is no existing `SettingsPage.test.tsx`. A new test should validate that `useAuth` user data is rendered.

**Rationale**: The codebase uses Vitest and React Testing Library (per constitution). Adding a component test for SettingsPage is straightforward and aligned with testing discipline.
