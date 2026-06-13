# Implementation Plan: Forgot Password API Integration

**Branch**: `040-rushd-frontend-auth` | **Date**: 2026-06-10 | **Spec**: [specs/039-forgot-password-api/spec.md](specs/039-forgot-password-api/spec.md)
**Input**: Feature specification from `/specs/039-forgot-password-api/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Connect the existing frontend forgot-password form (`ForgetPasswordPage`) to the backend `POST /api/v1/auth/forgot-password` endpoint. The page already contains an email input, loading state, and success/error UI. The goal is to replace the current placeholder/draft wiring with a real, validated form submission that:

1. Uses `react-hook-form` for client-side validation (consistent with UI primitives in `src/app/components/ui/form.tsx`).
2. Integrates with the existing `AuthService` class (`src/api/services/auth-service.ts`) which already exposes `forgotPassword(email)`.
3. Handles the contract described in the backend auth swagger docs (`ForgotPasswordDto` with a single `email` field).
4. Shows loading, success, and error states securely without leaking account existence.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x  
**Primary Dependencies**: React Router v7, react-hook-form 7.55.0, Tailwind CSS, shadcn/ui, Lucide React  
**Storage**: N/A (stateless form submission)  
**Testing**: Vitest (inferred from Vite-based tooling; no explicit test runner in package.json but standard for this stack)  
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (SPA)  
**Performance Goals**: Form submission completes within 5 seconds under normal network conditions (per SC-001)  
**Constraints**: Must follow existing API abstraction layer (no direct `fetch` calls outside `ApiClient`); must use reusable UI components; must not hardcode API endpoints or secrets.  
**Scale/Scope**: Single form page; integrates with existing auth service. No new routes required.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| **I. Component Reusability** | PASS | Page will use existing `Input`, `Button`, `Label`, `Form*` primitives from `src/app/components/ui/`. No new hardcoded UI elements. |
| **II. Clean Code & OOP** | PASS | Logic will be encapsulated in `AuthService.forgotPassword` (already exists). Form state will use `react-hook-form` (declarative, reusable). No new god-components. |
| **III. Environment-Driven Configuration** | PASS | API endpoint comes from `env.get('API_BASE_URL')` via `ApiClient` and `AuthService`; no hardcoded URLs. |
| **IV. API Abstraction Layer** | PASS | The `AuthService` already wraps `ApiClient.post` for `forgotPassword`. No direct `fetch` in components. |
| **V. Comprehensive Documentation** | PASS | `AuthService` already has JSDoc. Form hook and validation rules will be self-documenting. README update not required for this scoped change. |

**Post-design re-check**: PASS — all gates remain satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/039-forgot-password-api/
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
│   ├── client.ts              # ApiClient (already exists)
│   ├── types.ts               # ApiResponse, ApiError, etc.
│   ├── services/
│   │   ├── auth-service.ts    # AuthService with forgotPassword method (already exists)
│   │   └── index.ts           # Service barrel exports
│   └── hooks/
│       └── useAuth.ts         # (if auth-specific hook needed)
├── app/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── form.tsx       # shadcn/ui Form primitives (react-hook-form)
│   │   │   ├── input.tsx      # shadcn/ui Input
│   │   │   ├── button.tsx     # shadcn/ui Button
│   │   │   └── label.tsx      # shadcn/ui Label
│   │   ├── ForgetPasswordPage.tsx   # TARGET: refactor to use react-hook-form + proper validation
│   │   ├── ResetPasswordPage.tsx    # (adjacent page for reference)
│   │   └── LoginPage.tsx            # (adjacent page for reference)
│   ├── layouts/
│   │   └── AuthLayout.tsx     # (already exists)
│   └── routes.tsx             # (already has /auth/forgot-password route)
├── lib/
│   ├── env.ts                 # Environment variable access
│   └── password-rules.ts      # (used by ResetPasswordPage)
└── main.tsx                   # Entry point
```

**Structure Decision**: The project follows a single-project SPA layout with a flat `src/` tree. This feature touches only `ForgetPasswordPage.tsx` and optionally refines `AuthService` error handling, consistent with existing patterns.

## Complexity Tracking

No violations. The change is constrained to a single page component and its validation wiring.

---

## Phase 0: Outline & Research

### Research Questions

1. **Backend DTO contract**: What is the exact shape of `ForgotPasswordDto` and the response?  
   *Resolution*: `POST /api/v1/auth/forgot-password` accepts `{ email: string }`. The backend returns a uniform response regardless of account existence to prevent enumeration.

2. **Validation library choice**: Does the project use `zod` for schema validation with `react-hook-form`?  
   *Resolution*: `react-hook-form` is installed, but `zod` is **not** in `package.json`. Since this is a single-field form, built-in HTML5 validation + `react-hook-form` `register` options (e.g., `required`, `pattern`) are sufficient. No new dependency needed.

3. **Error handling contract**: How does `ApiClient` surface network vs. validation errors?  
   *Resolution*: `ApiClient.parseError` extracts `{ code, message, details?, statusCode }`. Network errors (`Failed to fetch`) are caught in the component and mapped to user-friendly Arabic messages. Backend 4xx errors are not retried; 5xx errors are retried with exponential backoff.

### Research Findings (research.md)

See `specs/039-forgot-password-api/research.md`.

**Key decisions from Phase 0**:
- Use `react-hook-form` with built-in HTML validation rules (no `zod` — avoids adding a dependency for one field).
- Reuse existing `AuthService.forgotPassword` method; no new service needed.
- Error mapping strategy: network errors → generic Arabic retry message; backend errors → generic Arabic message without exposing existence.

---

## Phase 1: Design & Contracts

### Data Model (data-model.md)

See `specs/039-forgot-password-api/data-model.md`.

**Key entities**:
- `ForgotPasswordRequest`: `{ email: string }` — sent to backend.
- `ForgotPasswordResponse`: `ApiResponse<void>` — uniform success/failure envelope.

### Interface Contracts (contracts/)

See `specs/039-forgot-password-api/contracts/`.

**Key contracts**:
- **API Contract**: `POST /api/v1/auth/forgot-password` accepts `ForgotPasswordDto` (`{ email: string }`). Response is `ApiResponse<void>` with uniform messaging.
- **UI Contract**: `ForgetPasswordPage` exposes no props (routed page). Internally uses `react-hook-form` for validation state and `AuthService` for submission.

### Quick Start (quickstart.md)

See `specs/039-forgot-password-api/quickstart.md`.

---

## Generated Artifacts

| Artifact | Path | Description |
|----------|------|-------------|
| Plan | `specs/039-forgot-password-api/plan.md` | This document |
| Research | `specs/039-forgot-password-api/research.md` | Phase 0 research findings |
| Data Model | `specs/039-forgot-password-api/data-model.md` | Phase 1 entity definitions |
| Contracts | `specs/039-forgot-password-api/contracts/` | API & UI contracts |
| Quick Start | `specs/039-forgot-password-api/quickstart.md` | Developer onboarding notes |
| Tasks | `specs/039-forgot-password-api/tasks.md` | Generated by `/speckit.tasks` |
