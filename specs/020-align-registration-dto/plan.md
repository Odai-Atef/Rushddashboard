# Implementation Plan: Align Registration Payload with Backend DTO

**Branch**: `020-align-registration-dto` | **Date**: 2026-05-19 | **Spec**: [specs/020-align-registration-dto/spec.md](specs/020-align-registration-dto/spec.md)
**Input**: Feature specification from `/specs/020-align-registration-dto/spec.md`

## Summary

Refactor the frontend registration flow to align its submitted payload with the backend `/auth/register` endpoint's RegisterDto. Replace unsupported fields (fullName, phone, company, role) with the expected fields (firstName, lastName, companyId, roleId). Keep confirmPassword client-side only. Update auth types, registration page component, and auth service.

## Technical Context

**Language/Version**: TypeScript 5.x with React 18.3+
**Primary Dependencies**: React Hook Form, Zod, Vite, Tailwind CSS, shadcn/ui, React Router 7.x
**Storage**: N/A (frontend only; state managed via React Context/hooks)
**Testing**: Vitest, React Testing Library, Playwright
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: web-application/frontend
**Performance Goals**: Form submission latency < 2s; bundle size for registration route < 250KB gzipped
**Constraints**: Must maintain responsive design across mobile/tablet/desktop; no new heavy dependencies; keep components under 300 lines
**Scale/Scope**: Single-page registration form refactoring; no new routes or backend changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | Refactoring existing RegistrationPage component and auth service; no new monoliths |
| II. Clean Code & Quality Standards | ✅ PASS | Standard type-safe refactoring; sizes remain under limits |
| III. API Integration & Resilience | ✅ PASS | Aligns with existing service layer pattern; improves error handling consistency |
| IV. Performance & Responsive Design | ✅ PASS | No new heavy dependencies; form is lightweight |
| V. Containerization & Environment Consistency | ✅ PASS | No Docker or environment changes needed |

**Gate Result**: All principles pass. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/020-align-registration-dto/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/frontend/src/
├── app/
│   ├── types/
│   │   └── auth.ts           # Auth types and interfaces
│   ├── components/
│   │   └── RegistrationPage.tsx  # Registration form component
│   └── services/
│       └── auth.ts           # Auth service layer
├── components/ui/           # shadcn/ui primitives
├── hooks/                   # Custom React hooks
└── lib/                     # Utilities and configs
```

**Structure Decision**: Single frontend project under `apps/frontend/`. Modifications scoped to `src/app/types/auth.ts`, `src/app/components/RegistrationPage.tsx`, and `src/app/services/auth.ts`.

## Complexity Tracking

> No constitution violations requiring justification.

## Phase 0: Research Summary

**Decision**: Direct refactoring with no new architectural patterns needed.
**Rationale**: The backend DTO contract is already well-defined. The frontend stack (React Hook Form + Zod + native fetch) is already in use. The change is a straightforward field mapping exercise.
**Alternatives considered**: None — the solution is a bounded type-system and component refactor.

**Key Findings**:
- Backend RegisterDto fields: email, password, firstName, lastName, companyId (UUID), roleId (UUID)
- Current frontend fields to remove: fullName, phone, company (string), role (string)
- Current frontend fields to keep (but not send): confirmPassword
- Current frontend fields to add/rename: firstName, lastName, companyId, roleId
- No new endpoints required; existing `/auth/register` POST endpoint used

## Phase 1: Design & Contracts Summary

**Phase 1 Artifacts Generated**:
- `data-model.md` — Entity definitions and field mapping
- `contracts/auth-api.md` — API contract for `/auth/register`
- `quickstart.md` — Developer quick-start guide

### Re-Evaluation of Constitution Check (Post-Design)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | Refactoring existing components; no new monoliths introduced |
| II. Clean Code & Quality Standards | ✅ PASS | Type-safe field mapping; no magic numbers or strings |
| III. API Integration & Resilience | ✅ PASS | Service layer pattern preserved; error handling improved with contract documentation |
| IV. Performance & Responsive Design | ✅ PASS | No new heavy dependencies; route remains lightweight |
| V. Containerization & Environment Consistency | ✅ PASS | No environment or Docker changes |

**Post-Design Gate Result**: All principles pass. Proceed to `/speckit.tasks`.
