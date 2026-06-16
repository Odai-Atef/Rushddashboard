# Research: Dynamic Assessment Categories

**Feature**: Dynamic Assessment Categories
**Date**: Mon Jun 15 2026

## Context

The assessment screen (step 4) in `CharityOnboardingFlow.tsx` uses a hardcoded `assessmentCategories` array (9 categories) and static JSX for questions. When the backend seed changes, the frontend must be redeployed to stay in sync. The task is to dynamically fetch categories and questions from the API, render tabs dynamically, and support multiple question types.

## Existing Infrastructure

### Onboarding Service
- `src/api/services/onboarding-service.ts` currently does NOT have assessment-related endpoints.
- Will need to add:
  - `GET /api/v1/onboarding/assessment/categories`
  - Types: `AssessmentCategory`, `AssessmentQuestion`, `QuestionOptions`

### API Client Pattern
- Same as previous features: custom `fetch` wrapper with JWT Bearer auth, 401 redirect, retry, timeout.

### UI Component
- `src/app/components/CharityOnboardingFlow.tsx`:
  - `assessmentCategories` is a hardcoded array with `{id, name, icon, color}`
  - `currentAssessmentStep` is an index into this array
  - Questions are static JSX: Yes/No, Scale (1-10), Multiple Choice (hardcoded options), File Upload
  - `assessmentAnswers` state stores answers; currently no clear mapping to question IDs
  - Icons are imported from `lucide-react` (e.g., Shield, DollarSign, Users, Heart, Briefcase, Zap, Target, BarChart3, TrendingUp)

### Current Answer State
```ts
interface AssessmentAnswer {
  categoryId: string;
  questionId: string;
  answer: number | string;
}
```
- This is already question-ID-based, but the `questionId` values come from hardcoded labels, not API IDs.

## Decisions

- **New endpoint needed**: `GET /api/v1/onboarding/assessment/categories` must be added to `onboarding-service.ts` with types.
- **Icon resolution**: The API returns category icons as string names (e.g., `"building"`). The frontend uses Lucide icons via React component references. We need a mapping from icon name strings to Lucide icon components.
- **Answer state shape**: Keep the existing `AssessmentAnswer[]` array, but update `categoryId` and `questionId` to use the actual API IDs.
- **Question type SCALE range**: The hardcoded UI uses 1-10 scale buttons. The spec says SCALE is 1-5. We'll adapt to 1-5 (API-driven) but the spec is the source of truth.
- **Scale rendering**: Render as 5 clickable buttons or radio buttons.
- **Yes/No rendering**: Two buttons (نعم / لا) storing `"yes"` or `"no"`.
- **Multiple Choice**: Render as checkboxes using `options.choices` from the API.
- **File Upload**: Use a simple hidden `<input type="file">` with a styled button trigger and drag-and-drop zone.
- **No hook changes needed**: Can use a local `useState` for categories/questions, or add to `useOnboardingRegistration` hook. Given previous patterns, keeping it local in the component is simplest.

## Open Questions Resolved

- **Icon mapping**: Use a lookup object mapping icon name strings to Lucide components. Unknown icons fall back to a generic icon (e.g., `Circle`).
- **AbortController**: Use `AbortController` for the categories fetch to handle navigation-away cancellation.
- **Unrecognized question types**: Render a placeholder div with a message, do not crash.
