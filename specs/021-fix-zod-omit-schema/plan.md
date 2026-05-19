# Implementation Plan: Fix Zod Omit Schema Blank Page

**Branch**: `[021-rushd-frontend-auth]` | **Date**: 2026-05-19 | **Spec**: [specs/021-fix-zod-omit-schema/spec.md](specs/021-fix-zod-omit-schema/spec.md)
**Input**: Feature specification from `specs/021-fix-zod-omit-schema/spec.md`

## Summary

Refactor the auth validation layer in `src/app/types/auth.ts` so `registerFormSchema` no longer relies on `.omit()` applied after `.refine()`. Zod forbids `.omit()` on refined object schemas, causing a runtime crash (blank white page). The fix splits registration fields into a shared base `registerBaseSchema`, defines `registerDtoSchema` directly from that base, and derives `registerFormSchema` via `.merge()` + `.refine()`. This preserves all validation behavior, field shapes, and exported types while eliminating the forbidden `.omit()` path.

## Technical Context

**Language/Version**: TypeScript 5.x (aligned with Vite 6.x project)  
**Primary Dependencies**: Zod (latest compatible project version)  
**Storage**: N/A (frontend state/forms only)  
**Testing**: Vitest + React Testing Library for unit/component tests  
**Target Platform**: Browser (React SPA)  
**Project Type**: Web application (React frontend)  
**Performance Goals**: Registration form loads in under 1 second  
**Constraints**: No `.omit()` after `.refine()`; no Zod upgrade unless minimal  
**Scale/Scope**: Single auth module schema refactor (`src/app/types/auth.ts`)  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

- **Component-First Architecture**: PASS. Fix is scoped to a single file (`types/auth.ts`) and does not introduce new monolithic components or modules.
- **Clean Code & Quality Standards**: PASS. The refactor keeps the file under 300 lines and preserves naming conventions (`PascalCase` types, `camelCase` variables).
- **API Integration & Resilience**: PASS. No external API changes; validation remains dual-sided (client schema + server DTO). No silent failures introduced.
- **Performance & Responsive Design**: PASS. No new heavy dependencies or route chunks are added; the change is compile-time only with no runtime overhead.
- **Containerization & Environment Consistency**: PASS. No environment or Docker changes.

## Project Structure

### Documentation (this feature)

```text
specs/021-fix-zod-omit-schema/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── types/
│   │   └── auth.ts       # Refactored schema definitions (primary change)
│   ├── services/
│   │   └── auth.ts       # Consumes RegisterDto / LoginFormData (no changes needed)
│   ├── components/
│   │   └── RegistrationPage.tsx  # Consumes registerFormSchema / RegisterFormData (no changes needed)
│   └── utils/
│       └── auth.ts       # Auth utilities (no changes needed)
```

**Structure Decision**: Single frontend project. Only `src/app/types/auth.ts` is modified for the schema fix.

## Phase 0: Research

**Completed**: `research.md`

### Key Finding: Zod `.omit()` Behavior

Zod's `.omit()` method throws at runtime when invoked on object schemas that contain `.refine()` or `.superRefine()`. This is by design in Zod (tracked in multiple issues) and cannot be bypassed without upgrading past the project's current Zod version.

### Decision: Base + Merge Pattern

Instead of relying on `.omit()` after `.refine()`, the chosen pattern is:
1. Define a shared base schema with all fields needed by the DTO.
2. Merge the base with extra UI-only fields into the form schema.
3. Apply cross-field refinements (e.g., confirm-password matching) only on the final form schema.

This keeps the base schema safe for `.pick()`, `.omit()`, or reuse in any downstream schema.

## Phase 1: Design

### Root Cause

In `src/app/types/auth.ts`, `registerFormSchema` is created as a Zod object schema with `.refine()` for confirm-password matching. Then `registerDtoSchema` calls `.omit({ confirmPassword, agreeToTerms })` on `registerFormSchema`.

At runtime, this triggers:

```text
Uncaught Error: .omit() cannot be used on object schemas containing refinements
```

### Solution

Split the schema into a **shared base** and **derived forms**:

1. `const registerBaseSchema`: core registration fields (used for both form and DTO).
2. `export const registerDtoSchema = registerBaseSchema`.
3. `const registerExtraFieldsSchema`: `confirmPassword` + `agreeToTerms`.
4. `export const registerFormSchema = registerBaseSchema.merge(registerExtraFieldsSchema).refine(...)`.

This removes the `.omit()` call entirely and avoids all runtime schema composition restrictions.

### Type Safety

- `export type RegisterFormData = z.infer<typeof registerFormSchema>`
- `export type RegisterDto = z.infer<typeof registerDtoSchema>`

These remain valid and are consumed across:
- `src/app/services/auth.ts` (API payload typing)
- `src/app/components/RegistrationPage.tsx` (form resolver and typing)
- `src/app/utils/auth.ts` (utility typing)

### Edge Cases Handled

- **Downstream `.pick()` / `.partial()`**: Safe because `registerDtoSchema` has no refinements.
- **Future additions**: Adding extra fields to `registerBaseSchema` applies to both schemas automatically.
- **Future `.omit()`**: If a later requirement needs `.omit()` on the base, it can safely do so since `registerBaseSchema` has no refinements.

## Post-Design Constitution Check

*Re-checked after Phase 1 completion*

- **Component-First Architecture**: PASS (single file change)
- **Clean Code & Quality Standards**: PASS (file remains under 300 lines)
- **API Integration & Resilience**: PASS (no runtime risk introduced)
- **Performance & Responsive Design**: PASS (no new dependencies)
- **Containerization & Environment Consistency**: PASS (no env changes)

All gates pass. Plan is ready for task generation.
