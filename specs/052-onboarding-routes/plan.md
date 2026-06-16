# Implementation Plan: Onboarding Route Refactor

**Branch**: `052-onboarding-routes` | **Date**: 2026-06-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/052-onboarding-routes/spec.md`

## Summary

Refactor the existing charity onboarding wizard from internal view-state switching to React Router v7 routes so each step is addressable via URL (e.g. `/dashboard/onboarding/registration`, `/dashboard/onboarding/profile`, `/dashboard/onboarding/documents`). State is shared through an `OnboardingProvider` context, and required parameters such as `organizationId` are passed via query parameters. Each route hydrates the latest progress from the server so direct links and refreshes work correctly.

## Technical Context

**Language/Version**: TypeScript 6.x / React 18.3.1  
**Primary Dependencies**: React Router v7 (`react-router@7.13.0`), Vite 6.x, Tailwind CSS 4.x, Radix UI, Sonner  
**Storage**: N/A (state persisted via existing onboarding APIs)  
**Testing**: Manual verification via `npm run build` and dev server navigation; no formal test framework configured in this repo  
**Target Platform**: Modern web browsers  
**Project Type**: Single-page web application (Vite + React)  
**Performance Goals**: Initial dashboard bundle should not measurably increase; onboarding pages lazy-loaded  
**Constraints**: Reuse existing UI components and styles; no new backend APIs  
**Scale/Scope**: One charity user organization flow, ~10 wizard steps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is a placeholder template (`[PROJECT_NAME] Constitution` with placeholder principles). No enforceable gates are defined. Treating as pass with the note that standard good practices (minimal scope, reuse existing code, no unnecessary complexity) are already reflected in the plan.

## Project Structure

### Documentation (this feature)

```text
specs/052-onboarding-routes/
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
├── app/
│   ├── routes.tsx                        # Updated with onboarding nested routes
│   ├── layouts/
│   │   └── DashboardLayout.tsx           # Existing; unchanged except route wiring
│   ├── components/
│   │   └── CharityOnboardingFlow.tsx     # Refactored into pages; keep as thin shell or remove
│   ├── context/
│   │   └── OnboardingContext.tsx           # NEW: provider + useOnboardingContext hook
│   ├── hooks/
│   │   ├── useOnboardingRegistration.ts    # Existing; reused as data source
│   │   └── useOnboardingContext.ts         # NEW: re-export of context hook (optional)
│   ├── pages/
│   │   └── onboarding/
│   │       ├── OnboardingLayout.tsx        # NEW: route layout with guards + hydration
│   │       ├── LandingPage.tsx             # NEW
│   │       ├── RegistrationPage.tsx        # NEW
│   │       ├── ProfilePage.tsx             # NEW
│   │       ├── AssessmentPage.tsx          # NEW
│   │       ├── DocumentsPage.tsx           # NEW
│   │       ├── ProcessingPage.tsx          # NEW
│   │       ├── ResultsPage.tsx             # NEW
│   │       ├── AnalysisPage.tsx            # NEW
│   │       ├── RoadmapPage.tsx             # NEW
│   │       └── DecisionPage.tsx            # NEW
│   └── utils/
│       └── onboarding-guards.ts            # NEW: step-order and guard helpers
├── api/
│   └── services/
│       └── onboarding-service.ts           # Existing; reused
```

**Structure Decision**: Single-page web app structure. Add a new `src/app/pages/onboarding/` directory with one file per route step, a shared `OnboardingContext`, and an `OnboardingLayout` for guards/hydration. Route definitions in `src/app/routes.tsx` are updated to point to the lazy-loaded page components under the `dashboard/onboarding` nested route.

## Phase 0: Research

Completed in `research.md`. Key decisions recorded:

- React Router v7 nested routes with lazy-loaded page components.
- `OnboardingProvider` context for shared state.
- Query parameter `organizationId` with context fallback for identifier passing.
- Standard browser history behavior (actual transitions, not canonical wizard order).
- Completed steps are freely navigable; future steps are guarded.
- No new backend APIs needed.

## Phase 1: Design & Contracts

Generated artifacts:

- `data-model.md` — context entities, route params, provider state, guard result.
- `contracts/routing-contract.md` — route table, query parameters, navigation behavior, provider contract, guard contract.
- `quickstart.md` — run instructions, route list, key files, verification steps.

## Next Step

Run `/speckit.tasks` to generate implementation tasks.
