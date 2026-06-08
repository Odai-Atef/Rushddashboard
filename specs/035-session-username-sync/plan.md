# Implementation Plan: Session Username Sync

**Branch**: `035-session-username-sync` | **Date**: 2026-06-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/035-session-username-sync/spec.md`

## Summary

Replace hardcoded user name, email, and avatar placeholders in the top bar (`TopBar.tsx`) and settings profile page (`SettingsPage.tsx`) with live data from the authenticated session. The `RootLayout` auth context is extended to expose `UserProfile` fetched from `GET /auth/profile`, and all static values are replaced with dynamic `user` references. Existing fallback logic ensures the UI remains usable if the profile endpoint is unavailable.

## Technical Context

- **Language/Version**: TypeScript 5.x (React 18.x)
- **Primary Dependencies**: React, Tailwind CSS, shadcn/ui primitives, Radix UI (Avatar, DropdownMenu)
- **Storage**: N/A (transient frontend state via React Context)
- **Testing**: Vitest + React Testing Library
- **Target Platform**: Web browser
- **Project Type**: web-application (frontend)
- **Performance Goals**: Profile data rendered within 1 second of mount/login under normal network conditions
- **Constraints**: Must pass Constitution Check (reusability, OOP services, env-driven config, API abstraction)
- **Scale/Scope**: Single feature within existing layout and settings components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Component Reusability | Pass | `getInitials` extracted as a pure utility function; UI rendering uses existing primitives |
| II. Clean Code / OOP | Pass | No new service needed; reuses existing `AuthService` and `apiClient` singletons |
| III. Environment-Driven Config | Pass | API base URL already read from `src/api/config.ts`; no new hardcoded URLs introduced |
| IV. API Abstraction Layer | Pass | Profile fetch routes through existing centralized `apiClient`; no raw `fetch` or standalone Axios instances |
| V. Comprehensive Documentation | Pass | `UserProfile` already typed in `auth-service.ts`; context extension documented inline |

## Project Structure

### Documentation (this feature)

```text
specs/035-session-username-sync/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (completed below)
├── data-model.md        # Phase 1 output (completed below)
├── quickstart.md        # Phase 1 output (completed below)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts              # Existing Axios wrapper
│   └── services/
│       ├── auth-service.ts    # Already defines UserProfile
│       └── index.ts           # Barrel export
├── app/
│   ├── components/
│   │   ├── TopBar.tsx          # UPDATED: consume user from context
│   │   └── SettingsPage.tsx    # UPDATED: consume user from context
│   └── layouts/
│       └── RootLayout.tsx      # UPDATED: expose user via AuthContext
└── lib/
    └── env.ts                  # Environment config
```

**Structure Decision**: Single frontend project. Changes scoped to updating the existing auth context and wiring it into two existing components. No new directories or services required.

## Complexity Tracking

Not applicable. No constitution violations identified; all principles naturally satisfied by the chosen architecture.

## Phase 0: Research (Completed)

### Research Findings

Key decisions:
1. **Auth context extension**: Add `user: UserProfile | null` to the existing `AuthContextType` in `RootLayout.tsx`. This is the minimal, idiomatic React pattern for propagating authenticated identity.
2. **Client reuse**: Profile fetch uses the existing `apiClient.get` through `authService.getProfile()`; no new HTTP client or endpoint constants introduced.
3. **Fetch timing**: Profile is fetched (a) on mount if already authenticated, and (b) immediately after successful login. This covers both page refresh and fresh login flows.
4. **Graceful degradation**: If `getProfile()` fails or returns no data, the UI falls back to generic placeholders (`؟` / `المستخدم`) without crashing.
5. **Name splitting**: For the settings form, `fullName` is split on whitespace into first/last name fields. This matches the existing static placeholder structure and requires no backend changes.

### `research.md`

*(Consolidated above; no separate file needed because all decisions are straightforward and documented inline.)*

## Phase 1: Design & Contracts (Completed)

### Data Model

No new entities introduced. The existing `UserProfile` interface (defined in `auth-service.ts`) is consumed by the auth context:

- `id`: `string` — unique identifier.
- `fullName`: `string` — display name; split into first/last name for the settings form.
- `email`: `string` — contact email.
- `role`: `'admin' | 'manager' | 'analyst' | 'viewer'` — organizational role.
- `avatar`: `string | undefined` — optional image URL (not yet used; initials fallback remains primary).
- `createdAt`: `string` — ISO date.
- `lastLoginAt`: `string | undefined` — ISO date.

### Contracts

- **AuthContextType** (updated in `RootLayout.tsx`):
  - `isAuthenticated: boolean`
  - `user: UserProfile | null`
  - `login: () => void`
  - `logout: () => void`

- **Consumption contract** (`TopBar.tsx`, `SettingsPage.tsx`):
  - Import `useAuth` from `RootLayout`.
  - Read `user` from context.
  - Use `user?.fullName`, `user?.email` for display.
  - Use `getInitials(user?.fullName)` for avatar fallback.

### Quickstart

See [quickstart.md](quickstart.md) for local verification steps.

## Post-Design Constitution Re-check

All gates remain **Pass**. No new violations introduced during design.

## Next Step

Run `/speckit.tasks` to generate the implementation tasks.
