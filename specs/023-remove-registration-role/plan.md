# Implementation Plan: Remove Role Selection from Registration Flow

**Branch**: `023-rushd-frontend-backend` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/023-remove-registration-role/spec.md`

## Summary

Remove the role selector from the frontend registration form, stop sending `roleId` in the registration payload, and rely on the backend to assign a default role automatically during self-registration. This aligns the frontend and backend registration contracts and eliminates the "property roleId should not exist" validation error.

## Technical Context

**Language/Version**: React 18.3+ with TypeScript, backend uses NestJS (inferred from DTO errors)  
**Primary Dependencies**: React Router 7.x, React Hook Form, Zod (frontend validation), Vite 6.x, Tailwind CSS 4.x, shadcn/ui, Native fetch with typed service layer  
**Storage**: N/A for frontend changes; backend uses a relational database (PostgreSQL assumed)  
**Testing**: Vitest (unit), React Testing Library (component), Playwright (e2e)  
**Target Platform**: Modern web browsers (frontend) + REST API (backend)  
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: No regression in registration form load or submission time  
**Constraints**: Maintain existing Arabic-friendly RTL layout; preserve all existing client-side and server-side validations for remaining fields  
**Scale/Scope**: Single-page registration form update; limited to removing one field and one API property

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | Registration form is already a component; changes are localized. |
| II. Clean Code & Quality Standards | ✅ PASS | Removing a field reduces complexity; no size limits breached. |
| III. API Integration & Resilience | ✅ PASS | Service layer update is minimal and fits existing patterns. |
| IV. Performance & Responsive Design | ✅ PASS | No new assets or routes; layout simplifies slightly. |
| V. Containerization | N/A | No Docker changes required. |

## Project Structure

### Documentation (this feature)

```text
specs/023-remove-registration-role/
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
├── components/
│   └── (registration form components)
├── pages/
│   └── (registration page)
├── services/
│   └── (auth service with register method)
├── hooks/
│   └── (form hooks)
├── utils/
│   └── (validation utilities)
├── types/
│   └── (TypeScript interfaces and Zod schemas)
├── stores/
│   └── (auth state if applicable)
└── lib/
    └── (config, fetch wrapper)
```

**Structure Decision**: Single frontend web application per the existing Rushd project structure. Backend changes are assumed to be in a separate repository or monorepo package; this plan focuses on the frontend registration form alignment.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Complexity is reduced by removing a field and its associated data fetching.
