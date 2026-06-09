# Implementation Plan: Reset Password Page and Token Flow

**Branch**: `039-rushd-frontend-auth` | **Date**: 2026-06-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/038-reset-password-flow/spec.md`

## Summary

Build a new `/auth/reset-password` page that consumes a `token` query parameter, presents a password reset form (new password + confirmation), validates inputs client-side, submits to the backend `POST /api/v1/auth/reset-password` endpoint, and handles success, error, and invalid/expired token states. The page will reuse existing auth layout patterns, service layer conventions, and RTL Arabic UI styling.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3.1  
**Primary Dependencies**: React Router v7, Tailwind CSS 4.x, shadcn/ui (Radix primitives), lucide-react  
**Storage**: N/A (frontend only; backend persists password reset tokens)  
**Testing**: Vitest (if present) or manual testing via dev server  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), responsive down to 320px  
**Project Type**: React web application (single-page dashboard app)  
**Performance Goals**: Form validation feedback under 100ms, backend submission under 2s, redirect to sign-in under 3s  
**Constraints**: Must follow Constitution Check (reusable components, OO service layer, no hardcoded secrets, RTL support); backend `ResetPasswordDto` only accepts `token` and `newPassword` — no confirmation field in the API payload  
**Scale/Scope**: Single-page addition to existing auth flow; supports any number of concurrent reset attempts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Reusability | ✅ Pass | Reuse `AuthLayout`, existing form input patterns, and `authService`; extract reusable password-strength rules utility if not already present |
| II. Clean Code & OOP | ✅ Pass | `AuthService.resetPassword()` already encapsulates endpoint; typed `ResetPasswordDto` contract from backend |
| III. Environment-Driven Config | ✅ Pass | API base URL from `ENV.API_BASE_URL`; no hardcoded endpoints |
| IV. API Abstraction Layer | ✅ Pass | Will use existing `ApiClient` via existing `authService.resetPassword()` method |
| V. Comprehensive Documentation | ✅ Pass | JSDoc for new component and any extracted validation utilities |

## Project Structure

### Documentation (this feature)

```text
specs/038-reset-password-flow/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts              # Existing ApiClient (reused)
│   ├── types.ts               # Existing shared types (reused)
│   ├── services/
│   │   ├── auth-service.ts    # Existing AuthService; ResetPasswordDto payload: { token: string, newPassword: string }
│   │   └── index.ts           # Service registry (no change)
│   └── config.ts              # Auth/token config (reused)
├── app/
│   ├── routes.tsx             # Add /auth/reset-password route under AuthLayout children
│   ├── components/
│   │   ├── ResetPasswordPage.tsx   # NEW: Reset password form, validation, states
│   │   ├── ForgetPasswordPage.tsx  # Existing (add navigation link from error state)
│   │   ├── LoginPage.tsx           # Existing (redirect target after success)
│   │   └── ui/                     # Reusable form primitives (reused)
│   ├── layouts/
│   │   └── AuthLayout.tsx     # Existing (already redirects authenticated users to /dashboard)
│   └── hooks/
│       └── useAuth.ts         # Existing useAuth (not strictly needed for this feature)
└── lib/
    └── utils.ts             # Tailwind/shadcn helpers (reused)
```

**Structure Decision**: Single-project structure. The new `ResetPasswordPage.tsx` lives alongside existing auth pages in `src/app/components/`. The existing `authService.resetPassword(token, newPassword)` method, `AuthLayout`, and `routes.tsx` are extended rather than duplicated. No new service or layout is required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are satisfied with the proposed design.
