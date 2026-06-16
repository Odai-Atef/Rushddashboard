# Implementation Plan: Dynamic Assessment Categories

**Branch**: `main` | **Date**: Mon Jun 15 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/033-dynamic-assessment-categories/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace hardcoded assessment categories and questions in the onboarding assessment step with dynamically API-fetched content. Add a new endpoint and types to the onboarding service, fetch categories with embedded questions on assessment mount, render tabs dynamically, and render questions based on `questionType` (SCALE, YES_NO, MULTIPLE_CHOICE, FILE_UPLOAD). Preserve existing progress indicators, tab navigation, and answer state keyed by question ID.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3
**Primary Dependencies**: Vite 6.3.5, TailwindCSS 4.1.12, MUI, react-hook-form, recharts, react-router 7.13, lucide-react
**Storage**: N/A (state managed locally; backend persistence via REST APIs)
**Testing**: No formal test framework; manual/integration testing via browser devtools
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend SPA)
**Performance Goals**: Categories loaded within 2 seconds of entering assessment step
**Constraints**: Must not crash on unrecognized question types; must support any number of categories from API; icon names from API must map to lucide-react components
**Scale/Scope**: Affects onboarding assessment view; introduces new service types + endpoint + dynamic rendering

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is currently a template (not ratified). No active gates to enforce. Proceeding under standard frontend best practices:
- Reuse existing abstractions (service layer, API client) rather than creating new ones.
- Keep changes minimal and localized.
- Maintain existing error handling and Arabic UX patterns.

## Project Structure

### Documentation (this feature)

```text
specs/033-dynamic-assessment-categories/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command output)
├── data-model.md        # Phase 1 output (/speckit.plan command output)
├── quickstart.md        # Phase 1 output (/speckit.plan command output)
├── contracts/           # Phase 1 output (/speckit.plan command output)
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
src/
├── api/
│   ├── client.ts
│   ├── services/
│   │   └── onboarding-service.ts   # Add getAssessmentCategories() + types
│   └── types.ts
├── app/
│   ├── components/
│   │   └── CharityOnboardingFlow.tsx # PRIMARY FILE TO CHANGE
│   ├── hooks/
│   │   └── useOnboardingRegistration.ts # No changes needed
│   └── ...
└── ...
```

**Structure Decision**: The repository is a Vite-based React SPA. The onboarding flow lives under `src/app/components/CharityOnboardingFlow.tsx` and uses `src/api/services/onboarding-service.ts` for API interactions. All changes for this feature are localized to the service file (new endpoint + types) and the component file (dynamic rendering).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations or justifications needed. The feature adds one endpoint and swaps a hardcoded array for a state-driven render loop, staying within existing patterns.
