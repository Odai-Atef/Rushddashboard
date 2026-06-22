# Research: ISIV Charity Assessment Results API

## Decisions

### Frontend state management pattern for API-driven page
- **Decision**: Use a dedicated `useIsivAssessmentResults` hook that mirrors the existing `useProjectDashboard` pattern.
- **Rationale**: The codebase already uses per-feature React hooks in `src/api/hooks/` to encapsulate fetch state, error mapping, loading state, and cancellation. Reusing this pattern keeps the feature consistent and minimizes boilerplate.
- **Alternatives considered**: Inline fetch inside the page component (rejected because it bloats the page and duplicates error/loading logic), global store (rejected because the project uses local component/hook state for page data).

### Service location and reuse
- **Decision**: Reuse the existing `onboardingService.getIsivAssessmentResults` method in `src/api/services/onboarding-service.ts`.
- **Rationale**: The service method and `IsivAssessmentResult` type already exist in the codebase; no backend contract research or new service class is required.
- **Alternatives considered**: Creating a new `assessment-service.ts` (rejected because it duplicates existing onboarding assessment logic already colocated in `onboarding-service.ts`).

### Chart rendering approach
- **Decision**: Keep Recharts for the radar chart, benchmark bar chart, and optional progress line chart.
- **Rationale**: The existing page already imports Recharts components and the project dependency is present. The API contract aligns with the existing Recharts data shape.
- **Alternatives considered**: Replacing with a different chart library (rejected due to unnecessary migration risk and no UX requirement for change).

### Progress tracking section
- **Decision**: Hide the progress tracking line chart when the API response does not include trend data.
- **Rationale**: The user input explicitly states that monthly progress data is hardcoded because there is no trend data in the API. The cleanest path is conditional rendering based on data presence.
- **Alternatives considered**: Keep hardcoded sample months (rejected because it contradicts the goal of removing hardcoded values), show an empty placeholder (rejected because the user direction is to hide the section when no data exists).

### Readiness badge computation
- **Decision**: Compute the Arabic badge client-side from `overallScore` using the thresholds provided in the user input.
- **Rationale**: The API returns the numeric score and the page must display a localized readiness label; computation is simple and deterministic.
- **Alternatives considered**: Request the backend to send the label (rejected because the input specifies client-side thresholds and no `readinessLabel` field exists in `IsivAssessmentResult`).

### Weakness severity mapping
- **Decision**: Map severity values `critical` → red, `high` → orange, and `medium`/`low` → yellow, matching the existing color scheme.
- **Rationale**: The existing page already uses this mapping for gaps and the user input confirms it should be preserved.
- **Alternatives considered**: Introduce additional severity tiers or backend-provided colors (rejected because the input explicitly limits the mapping to three CSS treatments).
