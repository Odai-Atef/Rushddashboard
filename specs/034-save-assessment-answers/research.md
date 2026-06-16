# Research Notes: Save Assessment Answers

**Feature**: Save Assessment Answers  
**Date**: 2026-06-15

## Decisions

### API Layer
- **Decision**: Extend the existing `OnboardingService` class in `src/api/services/onboarding-service.ts` to add `saveAssessmentAnswers` and `getAssessmentAnswers` methods.
- **Rationale**: The project already uses a centralized service layer for onboarding APIs, JWT-based auth via `apiClient`, and consistent `ApiResponse<T>` typing. Adding new methods keeps the change localized and consistent with existing patterns (`getAssessmentCategories`, `saveMyOrganization`, etc.).
- **Alternatives considered**: Creating a separate `assessment-service.ts` file. Rejected because all onboarding operations already live in `onboarding-service.ts` and splitting now adds unnecessary indirection for a two-endpoint feature.

### Answer State
- **Decision**: Keep assessment answers in the existing component state inside `CharityOnboardingFlow.tsx` (or its assessment sub-component), keyed by `questionId`.
- **Rationale**: The feature requires collecting answers already held in state; no global store is evident in the project, and the existing flow manages onboarding step state locally. We will add helper functions to map state values to the backend answer payload based on question type.
- **Alternatives considered**: Introducing a global context or state management library. Rejected because the scope is limited to the assessment step and the current local-state pattern is sufficient.

### Validation UX
- **Decision**: Validate only the questions in the current submission scope (current category or all categories on Submit), show an inline or banner error, and scroll the first unanswered required question into view.
- **Rationale**: Matches the spec requirement to validate required questions before saving while supporting partial saves.
- **Alternatives considered**: Validating all assessment questions every time. Rejected because the spec explicitly supports partial/category-level saves.

### Error Handling
- **Decision**: On save failure, display a user-friendly error message via the existing toast/alert mechanism and preserve all answers in state so the user can retry.
- **Rationale**: Spec requires preserving answers and staying on the assessment screen. The project already uses `sonner` for toast notifications.
- **Alternatives considered**: Auto-retry with exponential backoff. Rejected to keep the implementation simple; manual retry is acceptable for onboarding.

### Loading Saved Answers
- **Decision**: On assessment mount, call `GET /api/v1/onboarding/assessment/state?organizationId={id}` and merge results into component state. If a question already has a locally modified value, the local value wins until the next explicit save (per Clarification 2026-06-15).
- **Rationale**: The backend only exposes a single state endpoint that returns categories, questions, saved answers, and progress together. This reduces round trips and keeps the frontend in sync with the backend view of progress.
- **Alternatives considered**: Calling `GET /api/v1/onboarding/assessment/answers` separately. Rejected because that endpoint does not exist in the backend.

### Saving Answers
- **Decision**: Use `PUT /api/v1/onboarding/assessment/answers` with the request body wrapped as `{ answers: [...] }`.
- **Rationale**: The backend expects a batch upsert via PUT and a wrapped payload shape.
- **Alternatives considered**: Using `POST` with a flat array. Rejected because the backend returns `404 Not Found` for POST.

### Mapping Answer Values
- **Decision**: Implement a deterministic mapper from `questionType` to answer payload fields:
  - `SCALE` → `answerNumeric` (number 1–5)
  - `YES_NO` → `answerValue` (string `"yes"` or `"no"`)
  - `MULTIPLE_CHOICE` → `selectedOptions` (string[] of selected labels)
  - `FILE_UPLOAD` → `answerValue` (string file URL)
- **Rationale**: Matches the API contract provided in the feature description.
- **Alternatives considered**: Storing all values in a single generic field. Rejected because the backend expects the specific shape.

## Open Questions / Risks

- The project currently has no dedicated tests directory. Manual verification via the UI will be the primary validation method unless a test harness is added later.
- `questionType` casing must match the backend exactly; assume uppercase strings based on the provided mapping table.
