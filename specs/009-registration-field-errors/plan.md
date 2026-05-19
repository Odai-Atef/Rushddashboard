# Implementation Plan: Registration Field-Level Error Mapping

**Branch**: `018-rushd-frontend-show` | **Date**: 2026-05-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/009-registration-field-errors/spec.md`

## Summary

Update the frontend registration form to parse backend 400 validation error arrays and display each message beneath its related input field instead of dumping all errors into a generic API banner. Add a backend-to-frontend field error mapper, integrate it with the existing React Hook Form setup, and preserve the Arabic-friendly RTL layout.

**Technical Approach**:
- Introduce a field-level error parser in the auth service layer that detects array-style validation messages
- Maintain a declarative `fieldErrorMap` (backend field name → frontend form field path) to handle mismatches like `companyId` → `company`, `roleId` → `role`, and `firstName`/`lastName` → `fullName`
- Extend `AuthError` with a `fieldErrors` payload and consume it in `RegistrationPage.tsx` via `setError`
- Keep unmapped or non-validation errors in the existing generic error banner

## Technical Context

**Language/Version**: TypeScript 5.x with React 18.3+
**Primary Dependencies**: React, React Router 7.x, Tailwind CSS 4.x, Zod, React Hook Form, native fetch
**Storage**: N/A (stateless frontend)
**Testing**: Vitest, React Testing Library, Playwright
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend SPA)
**Performance Goals**: Form submit feedback <300ms, no additional network overhead
**Constraints**: No file >300 lines, preserve RTL layout, reuse existing components
**Scale/Scope**: Single registration form, 5–7 field mappings

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | Logic extracted into service-layer parser and reusable field-mapper utility; registration page stays focused |
| II. Clean Code & Quality Standards | PASS | New files stay under 300 lines; pure utility functions for error parsing |
| III. API Integration & Resilience | PASS | Centralizes validation-response handling in the auth service; preserves existing non-validation error flow |
| IV. Performance & Responsive Design | PASS | No bundle-size impact; layout changes are CSS-only and RTL-safe |
| V. Containerization | N/A | Frontend-only change; Docker config unchanged |

**Re-check after Phase 1**: All principles still pass. No architectural violations.

## Project Structure

### Documentation (this feature)

```text
specs/009-registration-field-errors/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── auth-api-errors.md
├── spec.md              # Feature specification
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   └── RegistrationPage.tsx        # Consume field errors via setError
│   ├── services/
│   │   ├── auth.ts                    # Extend error handling for 400 arrays
│   │   └── api.ts                     # (optional) shared response helpers
│   ├── types/
│   │   └── auth.ts                    # Add validation-error types
│   └── utils/
│       └── fieldErrorMap.ts           # Backend → frontend field mapping
```

**Structure Decision**: Single frontend SPA. Changes are scoped to existing auth service, types, and the registration page. A new lightweight utility module (`fieldErrorMap.ts`) isolates the mapping table.

## Complexity Tracking

> No constitution violations requiring justification.

## Design Decisions (from Research)

See [research.md](research.md) for detailed rationale.

1. **Backend Error Format**: NestJS ValidationPipe returns `{ statusCode: 400, message: string[], error: "Bad Request" }`; field names are embedded in each message string.
2. **Field Name Mapping**: Declarative `fieldErrorMap` object routes `companyId` → `company`, `roleId` → `role`, `firstName`/`lastName` → `fullName`, etc.
3. **Error Propagation**: Extend `AuthError` with an optional `fieldErrors` record so the UI layer receives both banner-level and field-level data in a single throw.
4. **Clear-on-Change**: React Hook Form automatically clears field errors when inputs change; no extra wiring needed beyond `setError`.
5. **Banner Fallback**: Unmapped messages and non-400 errors continue to flow into the existing `apiError` banner unchanged.

## Data Model

See [data-model.md](data-model.md) for full entity definitions.

**Key Entities**:
- **BackendValidationError**: HTTP 400 payload with `message` as `string | string[]`
- **FieldErrorMap**: Bidirectional lookup table mapping backend field identifiers to frontend RHF field paths
- **AuthError (enhanced)**: Standard error augmented with `fieldErrors: Record<string, string[]>`

## API Contracts

See [contracts/auth-api-errors.md](contracts/auth-api-errors.md) for the updated endpoint documentation including validation error shapes.

**Primary Endpoints**:
- `POST /auth/register` — 400 validation response now documented with field-level `message[]` array

## Implementation Phases

### Phase 0: Research (Complete)
✓ [research.md](research.md) — Backend error format, mapping strategy, RHF integration pattern

### Phase 1: Design & Contracts (Complete)
✓ [data-model.md](data-model.md) — Error types, field map schema, state transitions  
✓ [contracts/auth-api-errors.md](contracts/auth-api-errors.md) — 400 validation response contract  
✓ [quickstart.md](quickstart.md) — Setup, testing, architecture, common issues  
✓ Agent context updated in [AGENTS.md](../../AGENTS.md)

### Phase 2: Tasks (Next Step)
Run `/speckit.tasks` to generate detailed implementation tasks.

## Quick Start

See [quickstart.md](quickstart.md) for development setup, testing commands, and troubleshooting.

## References

- [Specification](spec.md)
- [Research](research.md)
- [Data Model](data-model.md)
- [API Contracts](contracts/auth-api-errors.md)
- [Constitution](../../.specify/memory/constitution.md)
- [AGENTS.md](../../AGENTS.md)
