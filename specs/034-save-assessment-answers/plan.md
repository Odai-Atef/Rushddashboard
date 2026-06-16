# Implementation Plan: Save Assessment Answers

**Branch**: `[034-save-assessment-answers]` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/034-save-assessment-answers/spec.md`

## Summary

Extend the onboarding flow so that assessment answers are persisted to the backend when the user clicks Next or Submit, and automatically restored when the user returns. This requires adding two API methods to the existing onboarding service, mapping frontend answer state to the backend payload shape, validating required questions before progression, and handling load/save errors gracefully while preserving user input.

## Technical Context

**Language/Version**: TypeScript 5.x (project uses `typescript@^6.0.3` which is likely a misprint; assume TypeScript 5.x compatible with Vite 6)  
**Primary Dependencies**: React 18.3.1, React Router 7.13.0, Vite 6.3.5, Tailwind CSS 4.1.12, Radix UI primitives, sonner for toasts  
**Storage**: N/A (backend persistence via REST API)  
**Testing**: No test harness currently present in the project; verification will be manual through the UI and TypeScript compilation  
**Target Platform**: Web (Vite + React SPA)  
**Project Type**: web-application (frontend SPA)  
**Performance Goals**: Save and load operations should complete within 2 seconds under normal network conditions  
**Constraints**: Must preserve answers in local state even when API calls fail; must support partial category-level saves  
**Scale/Scope**: Single-organization onboarding flow; assessment categories and questions are loaded dynamically from `/api/v1/onboarding/assessment/categories`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is a placeholder template with no active principles defined. No gates are enforced. The planned change is localized to a single service file and a single onboarding component, which keeps complexity minimal and aligned with the existing architecture.

## Project Structure

### Documentation (this feature)

```text
specs/034-save-assessment-answers/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts        # Axios/fetch-style client with JWT interceptors
│   ├── services/
│   │   └── onboarding-service.ts   # Add save/load assessment answer methods here
│   └── types.ts
└── app/
    └── components/
        └── CharityOnboardingFlow.tsx # Integrate load, validation, save, error handling
```

**Structure Decision**: Use the existing onboarding service and the existing onboarding flow component. No new directories are needed. The change is additive and fits the current frontend structure.

## Complexity Tracking

No constitution violations or unjustified complexity.

## Design Decisions

- **API layer**: Add `getAssessmentState` and `saveAssessmentAnswers` to `OnboardingService` in `src/api/services/onboarding-service.ts`.
- **State management**: Continue using local component state keyed by `questionId`. Merge loaded answers on mount, preserving any local edits made during the current session.
- **Validation**: Validate only the questions in the current submission scope (current category or entire assessment on Submit). Scroll to the first unanswered required question on failure.
- **Error handling**: Show user-friendly messages via the existing toast/alert mechanism; keep the user on the assessment screen and preserve all answers.
- **Answer mapping**: Map `questionType` to the correct payload field (`answerNumeric`, `answerValue`, or `selectedOptions`) deterministically.

## API Endpoints

### Load State

- `GET /api/v1/onboarding/assessment/state?organizationId={id}`
- Returns categories, questions, saved answers, and progress.

### Save Answers

- `PUT /api/v1/onboarding/assessment/answers`
- Request body: `{ answers: [...] }`
- Response: `200 OK` with saved answers.

## Next Steps

The `/speckit.plan` phase is complete. The next command is `/speckit.tasks` to generate the implementation task list.
