# Implementation Plan: Global Session Expiry Check and Auto Logout

**Branch**: `031-session-expiry-logout` | **Date**: Friday, May 22, 2026 | **Spec**: [specs/030-session-expiry-logout/spec.md](specs/030-session-expiry-logout/spec.md)
**Input**: Feature specification from `/specs/030-session-expiry-logout/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add centralized periodic session validity checks (every 15 seconds) while the user is on protected pages. When the session token is expired or invalid, automatically log the user out, clear auth/session state, redirect to the login screen, and display a localized toast message. Background tabs should use `document.visibilitychange` to pause/resume polling. Cross-tab logout is coordinated via `localStorage` events to ensure only one toast appears.

## Technical Context

**Language/Version**: TypeScript 5.x targeting ES2022 via Vite 6.x
**Primary Dependencies**: React 18.3+, React Router 7.x, React Context + hooks for state management
**Storage**: N/A (memory + `localStorage` for cross-tab coordination signal)
**Testing**: Vitest + React Testing Library for unit/component tests; Playwright for E2E
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (React SPA — frontend monolith)
**Performance Goals**: Timer interval MUST not degrade page performance or cause unnecessary reflows
**Constraints**: Timer logic must not exceed 50 lines per function; polling interval (15s) is a configurable constant
**Scale/Scope**: Single-tenant frontend; cross-tab behavior limited to same-origin tabs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

1. **Component-First Architecture** - `useAuthSessionPoller` hook extracted into `src/hooks/`; auth provider owns timer lifecycle; no per-page duplication. ✅
2. **Clean Code & Quality Standards** - Maximum 50 lines for `checkSessionValid` and `logout` helpers; magic number 15 extracted to `SESSION_POLL_INTERVAL_MS` in config. ✅
3. **API Integration & Resilience** - Network errors must not trigger false logouts; 401/403 treated as explicit expiry. ✅
4. **Performance & Responsive Design** - Visibility API used to pause polling in background tabs; no performance degradation expected. ✅
5. **Containerization & Environment Consistency** - No Docker changes needed; purely frontend logic. ✅

## Project Structure

### Documentation (this feature)

```text
specs/030-session-expiry-logout/
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
├── components/          # Reusable UI components (toast notification listener)
│   └── ui/             # shadcn/ui primitives
│   └── toast/          # Notification listener for SESSION_EXPIRED events
├── pages/              # Route-level page components (public vs protected)
├── services/           # API service layer (GET /auth/me)
├── hooks/              # Custom React hooks (useAuthSessionPoller)
├── utils/              # Helper functions and utilities
├── types/              # Shared TypeScript types and Zod schemas
├── stores/             # State management (auth provider, locale state)
└── lib/                # Third-party configurations (i18n)
```

**Structure Decision**: Single-project React application aligned with existing root structure. Timer logic lives in `src/hooks/useAuthSessionPoller.ts` and is consumed by the existing auth provider.

## Complexity Tracking

> **No violations identified.** All logic fits within component-first and clean-code limits. Timer logic is centralized, deduplicated, and functions stay under 50 lines.
