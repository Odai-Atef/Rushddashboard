# Implementation Plan: Scale Score Descriptions

**Branch**: `061-scale-score-comments` | **Date**: 2026-06-22 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/061-scale-score-comments/spec.md`

## Summary

Replace the static, hard-coded scale score descriptions on the onboarding assessment page with dynamic descriptions fetched from the `/api/v1/onboarding/evaluation-comments` endpoint. The endpoint returns, per `questionId`, a list of five comments mapped to maturity tiers (`CRITICAL`, `EMERGING`, `MEDIUM`, `ADVANCED`, `PIONEER`). The UI will display the matching localized comment (`commentAr` or `commentEn`) when the user hovers over or selects a score.

## Technical Context

**Language/Version**: TypeScript / React 18.3.1 / Vite 6.3.5  
**Primary Dependencies**: React Router 7.13.0, Tailwind CSS 4.1.12, Radix UI primitives, `lucide-react`, `sonner`, custom API client  
**Storage**: N/A (no persistent state beyond existing React state)  
**Testing**: Existing project has no configured test runner; verification is manual via `npm run dev` and browser inspection  
**Target Platform**: Modern web browsers (Chrome, Firefox, Edge, Safari) — desktop and tablet  
**Project Type**: Web application frontend (single Vite app under `apps/frontend`)  
**Performance Goals**: Score description appears within 1 second of hover/select; API call does not block rendering of questions  
**Constraints**: Application is hard-coded to RTL Arabic (`dir="rtl"`, `lang="ar"`) with no runtime language switcher today, but comments must still be stored with both languages for future localization  
**Scale/Scope**: Single page (`/dashboard/onboarding/assessment?organizationId`), supporting the existing assessment categories and questions  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution template is currently unratified (contains only placeholder text). No active gates can be enforced, so the plan proceeds with the project conventions already visible in the codebase.

Observed conventions we will follow:
- Service layer lives in `src/api/services/onboarding-service.ts` and exposes typed methods.
- Data-fetching hooks live in `src/api/hooks/` and manage loading/error state with `AbortController` cleanup.
- UI pages live in `src/app/pages/onboarding/`.
- Existing `getScaleDescription` helper in `AssessmentPage.tsx` is the exact placeholder to replace.

## Project Structure

### Documentation (this feature)

```text
specs/061-scale-score-comments/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── hooks/
│   │   └── useEvaluationComments.ts   # NEW: fetch + cache comments per org
│   └── services/
│       └── onboarding-service.ts      # UPDATED: add types + getEvaluationComments
├── app/
│   └── pages/
│       └── onboarding/
│           └── AssessmentPage.tsx     # UPDATED: replace getScaleDescription with dynamic lookup
```

**Structure Decision**: Single-project Vite React app. We add one API hook, extend the onboarding service with a new typed method and interfaces, and update the existing `AssessmentPage` scale rendering to consume dynamic comments. No new routes or global context changes are needed.

## Complexity Tracking

No complexity violations required. The feature stays within the existing frontend architecture and adds a single API integration point.
