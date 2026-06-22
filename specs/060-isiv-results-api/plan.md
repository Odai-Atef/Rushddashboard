# Implementation Plan: ISIV Charity Assessment Results API

**Branch**: `060-isiv-results-api` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/060-isiv-results-api/spec.md`

## Summary

Replace all hardcoded sample data on the charity assessment results page with live data from `GET /api/v1/onboarding/assessments/{organizationId}/isiv-results`. Introduce a reusable `useIsivAssessmentResults` hook in `src/api/hooks/`, update `CharityAssessmentResultsPage.tsx` to consume it, preserve `charity-assessment-data.ts` for the wizard page, and hide the progress tracking section when the API does not provide trend data.

## Technical Context

**Language/Version**: TypeScript 6.x, React 18.3.1, React Router 7.13.0
**Primary Dependencies**: Vite 6.3.5, Recharts 2.15.2, Tailwind CSS 4.1.12, lucide-react 0.487.0, date-fns 3.6.0
**Storage**: N/A (data fetched from backend API, no local persistence)
**Testing**: Project has no visible test runner configured; validation is via `npm run build` and manual quickstart steps.
**Target Platform**: Modern web browsers
**Project Type**: Web application (Vite + React SPA)
**Performance Goals**: Page primary sections render within 3 seconds under normal network conditions.
**Constraints**: Must reuse existing `onboardingService` and API client patterns; must preserve `charity-assessment-data.ts` for the wizard page.
**Scale/Scope**: Single page integration, single API endpoint, optional companion status endpoint.

## Constitution Check

The project constitution file is a placeholder with no ratified principles or gates. No constitution violations or complexity justifications are required for this feature.

## Project Structure

### Documentation (this feature)

```text
specs/060-isiv-results-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── project-dashboard-summary-contract.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── hooks/
│   │   ├── useIsivAssessmentResults.ts  # NEW
│   │   └── ...existing hooks
│   └── services/
│       └── onboarding-service.ts          # EXISTS, already exposes getIsivAssessmentResults
└── app/
    └── pages/
        └── charity-assessment/
            ├── CharityAssessmentResultsPage.tsx  # MODIFIED
            └── charity-assessment-data.ts        # PRESERVED
```

**Structure Decision**: The feature follows the established frontend pattern: add a thin hook in `src/api/hooks/` that wraps the existing `onboardingService.getIsivAssessmentResults` method, then update the page component to use the hook. No new service class or shared component is needed.

## Complexity Tracking

No constitution violations or complexity justifications required.
