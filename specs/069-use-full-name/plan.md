# Implementation Plan: Use Full Name Across Frontend

**Branch**: `069-use-full-name` | **Date**: 2026-06-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/069-use-full-name/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The backend no longer stores or returns `first_name` and `last_name`; user identity is represented by a single required `full_name` field. The frontend must be updated so that all views and requests use `full_name` consistently. The most visible touchpoints are the top-bar profile menu/avatar, the user settings page, and the two existing registration pages.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3.1, Vite 6.3.5  
**Primary Dependencies**: react-router 7.13.0, @radix-ui/react-avatar, tailwindcss 4.1.12, shadcn/ui-style class utilities  
**Storage**: Browser state/cookies only (auth token); no local DB. Backend persists data.  
**Testing**: No automated test framework currently installed in the project. Validation is manual via `pnpm dev` / `vite build`.  
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (single frontend SPA under `apps/frontend`)  
**Performance Goals**: Profile menu and registration page render without perceptible delay; build succeeds with no TypeScript errors.  
**Constraints**: Must preserve Arabic/RTL UI text and existing avatar fallback behavior. Must not introduce new dependencies.  
**Scale/Scope**: Single-tenant frontend codebase (~200 TS/TSX files); change is localized to auth/profile surfaces.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution file is still a placeholder template, so no project-specific gates apply beyond the generic guidance in the template. The plan respects the YAGNI principle: only existing surfaces using `fullName` are touched, no new libraries are added, and no backend migration work is proposed.

## Project Structure

### Documentation (this feature)

```text
specs/069-use-full-name/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── services/
│   │   └── auth-service.ts      # UserProfile and RegisterData types + API calls
│   └── types.ts                 # Shared API response types
├── app/
│   ├── components/
│   │   ├── TopBar.tsx           # Avatar fallback + profile menu name display
│   │   ├── SettingsPage.tsx     # Profile settings full name field + avatar
│   │   └── RegistrationPage.tsx # Standalone registration form
│   ├── pages/
│   │   └── onboarding/
│   │       └── RegistrationPage.tsx # Onboarding organization registration (not user registration)
│   └── layouts/
│       └── RootLayout.tsx       # Auth context / user provider
├── lib/
│   └── env.ts                   # Environment config
└── main.tsx
```

**Structure Decision**: Single frontend SPA in `apps/frontend`. The only files that reference user `fullName` are `auth-service.ts`, `TopBar.tsx`, `SettingsPage.tsx`, and `RegistrationPage.tsx`. No `first_name`/`last_name` references remain in `src/` (verified by search), so the work is a small, targeted consistency update rather than a broad refactor.

## Complexity Tracking

No constitution violations requiring justification.

---

## Phase 0: Outline & Research

### Unknowns / Decisions

1. Should `UserProfile.fullName` remain nullable (`string | null`) or be required (`string`) now that the backend treats it as required?
2. What is the minimum and maximum length for `full_name` validation on the frontend?
3. How should the avatar initials behave for a single-word full name (current code already handles this, but worth confirming)?

### Research Findings

**Decision 1**: Make `UserProfile.fullName` required (`string`) in the frontend type, matching the backend contract.

- **Rationale**: The user clarified that `full_name` is required. Keeping the type nullable would force unnecessary defensive fallbacks and contradict the spec.
- **Alternatives considered**: Leave it nullable and add runtime assertions; rejected because it complicates consumers and hides contract intent.

**Decision 2**: Frontend validation should require at least 2 characters and allow up to 100 characters for `full_name`.

- **Rationale**: 2 characters covers meaningful Arabic/English initials while blocking empty input; 100 characters is a common upper bound for display names.
- **Alternatives considered**: 1 character minimum (too permissive), 50 character maximum (may truncate longer Arabic names).

**Decision 3**: Keep the existing `getInitials` helper behavior: single-word names show first two characters; multi-word names show first initial of first and last words.

- **Rationale**: The current behavior already works correctly for `full_name` regardless of word count.
- **Alternatives considered**: Extract initials from a new helper; rejected because the current helper is sufficient and avoids duplication.

## Phase 1: Design & Contracts

### Data Model

See `data-model.md` for the updated `UserProfile` and `RegisterData` shapes.

### Interface Contracts

See `contracts/auth-contract.md` for the updated authentication API contract.

### Quickstart

See `quickstart.md` for the verification steps after implementation.

### Agent Context Update

`AGENTS.md` has been updated to point to this plan.

## Phase 2: Task Generation

Run `/speckit.tasks` to generate the implementation tasks.
