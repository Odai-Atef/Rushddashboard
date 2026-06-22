# Research: Scale Score Descriptions

**Feature**: Scale Score Descriptions (`specs/061-scale-score-comments`)  
**Date**: 2026-06-22

## Unknowns Resolved

### 1. API shape and tier mapping

- **Decision**: Add a `getEvaluationComments` method to `OnboardingService` that performs `GET /api/v1/onboarding/evaluation-comments?organizationId={id}` and returns a record keyed by `questionId`.
- **Rationale**: The backend response maps each `questionId` to an array of five objects with `tier` values `CRITICAL`, `EMERGING`, `MEDIUM`, `ADVANCED`, `PIONEER`. The UI must translate the visible score (1-5) to the matching tier. The existing `getScaleDescription` placeholder implies score values 1-5, so the mapping can be: 1 → CRITICAL, 2 → EMERGING, 3 → MEDIUM, 4 → ADVANCED, 5 → PIONEER.
- **Alternatives considered**: Fetching comments per question on hover was rejected because it would create many small requests and the response already returns all comments for all questions.

### 2. Localization handling

- **Decision**: Display `commentAr` by default and fall back to `commentEn` when Arabic is unavailable. Store both fields in the typed interface.
- **Rationale**: The application currently hard-codes RTL Arabic (`dir="rtl"`, `lang="ar"`) with no runtime language switcher. The spec still requires both languages to be supported when available, so the implementation must read both fields and prefer Arabic in the current UI.
- **Alternatives considered**: Adding a language context/provider was rejected as out of scope; the existing codebase does not have one and this feature must remain minimal.

### 3. When and how to fetch comments

- **Decision**: Fetch comments once when the assessment page loads for a given `organizationId`, alongside the existing assessment-state load.
- **Rationale**: The comments are static per organization/question and small in size. Loading them eagerly avoids per-hover latency and satisfies the success criterion of showing descriptions within 1 second.
- **Alternatives considered**: Lazy loading comments only on first hover was rejected because it would violate the 1-second target on slow connections and adds unnecessary complexity.

### 4. Replacement of placeholder

- **Decision**: Remove the hard-coded `getScaleDescription` function and replace its usage with a lookup into the fetched comments map.
- **Rationale**: The TODO comment in `AssessmentPage.tsx` explicitly states this should be replaced when backend comments are available.

## References

- `src/app/pages/onboarding/AssessmentPage.tsx` lines 30-42 (placeholder `getScaleDescription`)
- `src/api/services/onboarding-service.ts` (service pattern and existing `EvaluationComments` types)
- `src/api/hooks/useIsivAssessmentResults.ts` (hook pattern with `AbortController` and Arabic error messages)
