# Implementation Plan: Fix Registration Error Rendering and Field Highlighting from Backend Validation

**Branch**: `022-rushd-frontend-fix` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/022-fix-registration-validation-errors/spec.md`

## Summary

Fix the registration page so that backend validation 400 responses are parsed reliably, mapped to frontend fields, and rendered both as a top-of-form summary and as per-field error messages with visual highlighting. Eliminate the generic "Fetch error" fallback for validation failures.

## Technical Context

**Language/Version**: TypeScript 5.6+, React 19.0, Node.js 20+
**Primary Dependencies**: React Hook Form 7.x, Zod 3.x, Tailwind CSS 4.x, shadcn/ui
**Storage**: N/A (state held in React Hook Form + local error state)
**Testing**: Vitest, React Testing Library, Playwright
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
**Project Type**: SPA web application
**Performance Goals**: Form error display latency <100ms after response; re-render budget <16ms
**Constraints**: No new npm dependencies; existing `fieldErrorMap.ts` and `RegistrationPage.tsx` must be evolved in place; Arabic RTL layout must be preserved
**Scale/Scope**: Single registration page; ~6 form fields; validation error arrays typically 1–5 messages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ Pass | Changes confined to `fieldErrorMap.ts` utility and `RegistrationPage.tsx`; no new large components |
| II. Clean Code & Quality Standards | ✅ Pass | `fieldErrorMap.ts` (67 lines) and `RegistrationPage.tsx` (266 lines) under limits; no dead code introduced |
| III. API Integration & Resilience | ✅ Pass | Uses existing typed service layer; improves error handling rather than bypassing it |
| IV. Performance & Responsive Design | ✅ Pass | No new heavy dependencies; CSS-only visual states |
| V. Containerization & Environment Consistency | ✅ Pass | No Docker or env changes required |

**Re-check after Phase 1**: Phase 1 introduces no new dependencies and modifies only existing files; constitution check remains passing.

## Project Structure

### Documentation (this feature)

```text
specs/022-fix-registration-validation-errors/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   └── RegistrationPage.tsx      # Modified: field errors + summary + highlights
│   ├── services/
│   │   └── auth.ts                   # Modified: summary message includes ALL errors
│   ├── types/
│   │   └── auth.ts                   # Existing: types used
│   └── utils/
│       └── fieldErrorMap.ts          # Modified: handle "property" prefix
├── tests/
│   ├── unit/
│   │   └── fieldErrorMap.test.ts     # New: regression tests for parsing edge cases
│   └── component/
│       └── RegistrationPage.test.tsx # New/modified: assert summary + per-field rendering
```

**Structure Decision**: Single SPA frontend. All changes are additive/refinements to existing files in place. No new directories needed beyond test files under `tests/`.

## Complexity Tracking

> No constitution violations. All work fits within existing file size limits and architectural patterns.

