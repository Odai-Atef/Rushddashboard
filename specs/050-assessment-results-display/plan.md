# Implementation Plan: Assessment Results Display

**Branch**: `051-charity-onboarding-assessment-results` | **Date**: 2026-06-16 | **Spec**: [specs/050-assessment-results-display/spec.md](spec.md)
**Input**: Feature specification from `/specs/050-assessment-results-display/spec.md`

## Summary

Wire the charity onboarding flow so that clicking **إرسال التقييم** on the documents step submits the assessment, fetches the ISIV 4-layer evaluation result, and renders a results view with the overall score, qualification status, static radar chart, tier badges, Arabic diagnosis, strengths, and weaknesses. Persisted backend results support returning users without resubmission.

## Technical Context

**Language/Version**: TypeScript 5.x (package.json lists `^6.0.3`, but the toolchain uses a 5.x-compatible release)  
**Primary Dependencies**: React 18.3.1, Vite 6.3.5, Tailwind CSS 4.1.12, Radix UI primitives, MUI icons, `recharts`, `sonner`  
**Storage**: N/A (frontend relies on backend persistence via onboarding API)  
**Testing**: TypeScript type checks (`tsc --noEmit`) and manual/runtime validation via `vite dev`/`build`; no test framework currently installed  
**Target Platform**: Modern web browsers (client-side React SPA)  
**Project Type**: Web frontend SPA (`/dashboard/onboarding` route)  
**Performance Goals**: Results view visible within 5 seconds of submission under normal network conditions  
**Constraints**: Manual retry only (no silent auto-retry), static radar chart, Arabic RTL UI  
**Scale/Scope**: Single organization assessment at a time; evaluation result fetched per organization  

## Constitution Check

The project constitution file is a placeholder and does not enforce active gates. The only applicable gate for this planning command is that no `[NEEDS CLARIFICATION]` markers remain in the Technical Context. All technical unknowns were resolved in [research.md](research.md).

## Project Structure

### Documentation (this feature)

```text
specs/050-assessment-results-display/
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
│   ├── client.ts              # HTTP client
│   └── services/
│       └── onboarding-service.ts # Assessment service layer
├── app/
│   ├── components/
│   │   └── CharityOnboardingFlow.tsx  # Onboarding flow + results view
│   └── hooks/
│       └── useOnboardingRegistration.ts  # Organization/profile state
```

**Structure Decision**: This is a frontend-only feature. All changes live in the existing React SPA under `src/`. No new top-level projects or backend code are required.

## Complexity Tracking

No constitution violations. No additional complexity justification needed.

## Research Summary

See [research.md](research.md) for full details. Key decisions:

1. **Backend response shape**: Introduce a new `IsivAssessmentResult` interface matching the provided 4-layer contract; do not reuse the legacy `AssessmentResult` shape.
2. **Submit endpoint**: Add `onboardingService.submitAssessment(organizationId)` calling `POST /api/v1/onboarding/assessment/submit?organizationId={id}`.
3. **Persistence**: Rely on backend persistence; refetch results when the results view mounts.
4. **Radar chart**: Continue using the already-installed `recharts` library for a static radar chart.

## Deliverables

- [research.md](research.md)
- [data-model.md](data-model.md)
- [contracts/api-contracts.md](contracts/api-contracts.md)
- [quickstart.md](quickstart.md)
- Updated `AGENTS.md` pointing to this feature's plan

## Next Step

Run `/speckit.tasks` to generate implementation tasks.
