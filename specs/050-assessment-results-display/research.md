# Research: Assessment Results Display

**Feature**: Assessment Results Display  
**Date**: 2026-06-16

## Decisions

### 1. Backend API Response Shape

**Decision**: Introduce a new `IsivAssessmentResult` interface matching the user-provided ISIV 4-layer contract and update `AssessmentResult` to be a union/alias or replace it where used. The legacy `AssessmentResult` shape (with `categoryScores`, `radarData`, `strengths[].insight`, etc.) is not aligned with the new ISIV model and would require too much frontend transformation.

**Rationale**:
- The user explicitly provided the new contract (`overallScore`, `qualificationStatus`, `dimensions[]`, `diagnosis`, `strengths[]`, `weaknesses[]`).
- Keeping the legacy shape would force us to synthesize `dimensions`, `diagnosis`, and tier badges from unrelated fields, which is error-prone and untestable.
- The results view only renders the new ISIV shape; no other component consumes the legacy result.

**Alternatives considered**:
- Reuse existing `AssessmentResult` and transform backend response into it — rejected because fields do not map cleanly (no tier, no Arabic diagnosis, no weaknesses).
- Extend existing `AssessmentResult` with optional ISIV fields — rejected because it creates a confusing hybrid type and the spec requires a clean ISIV display.

### 2. Submit Assessment Endpoint

**Decision**: Add `onboardingService.submitAssessment(organizationId: string)` that calls `POST /api/v1/onboarding/assessment/submit?organizationId={id}`.

**Rationale**:
- The user description states this endpoint already works and is the trigger point.
- The current `onboarding-service.ts` only has `getAssessmentResults` and `getAssessmentStatus`; the submit action is currently simulated by the `ProcessingView` timer.
- Adding the method centralizes the contract in one service file.

**Alternatives considered**:
- Inline `fetch` in `CharityOnboardingFlow.tsx` — rejected to keep API logic in the service layer consistent with the rest of the codebase.
- Use an existing save-answers endpoint as submit — rejected because the user explicitly named the submit endpoint and it has different semantics (finalizes the assessment).

### 3. Result Persistence for Returning Users

**Decision**: Rely on backend persistence and refetch on results-view mount. No client-side storage (localStorage, sessionStorage) is required.

**Rationale**:
- The existing `useEffect` already fetches status and results when `currentView === 'results' || 'analysis'`.
- If the backend persists submitted assessments and evaluation results, a returning user can simply re-enter the results view and the effect will reload the data.
- Adding client-side storage adds complexity and stale-data risk without improving availability.

**Alternatives considered**:
- Cache last result in `localStorage` for offline resilience — rejected because the spec does not require offline support and the backend is the source of truth.
- Add a dedicated "load saved result" action — rejected because mounting the results view already triggers the fetch.

### 4. Radar Chart Library

**Decision**: Continue using `recharts` (`RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar`, `ResponsiveContainer`) which is already imported in `CharityOnboardingFlow.tsx`.

**Rationale**:
- Dependency already present and used elsewhere in the same component.
- No new library reduces bundle size and review risk.
- Static radar chart requirement is satisfied by `recharts` without interactivity plugins.

**Alternatives considered**:
- Introduce a specialized radar chart library — rejected; no functional benefit for a static chart.

### 5. TypeScript Version Note

`package.json` lists `typescript: ^6.0.3`, which is not a valid stable release. The project uses Vite + React and likely has TypeScript 5.x installed via lockfile. Planning will avoid changing TypeScript versions.
