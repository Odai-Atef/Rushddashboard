# Implementation Plan: Organization Profile API Integration

**Branch**: `main` | **Date**: Mon Jun 15 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/031-org-profile-api-integration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Wire the organization profile screen (step 2) of the charity onboarding flow to the existing backend APIs so that profile data is persisted when the user clicks Next. Replace hardcoded areas of work with the dynamic list fetched from the system-managed funding areas API. No new services, hooks, or backend endpoints are required — the work is entirely UI-to-hook wiring in `CharityOnboardingFlow.tsx`.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3
**Primary Dependencies**: Vite 6.3.5, TailwindCSS 4.1.12, MUI, react-hook-form, recharts, react-router 7.13
**Storage**: N/A (state managed in hook; backend persistence via REST APIs)
**Testing**: No formal test framework detected in this repo; rely on manual/integration testing via browser devtools
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend SPA)
**Performance Goals**: Form submission latency under 2 seconds end-to-end
**Constraints**: Must work within existing hook patterns (no new state library); must preserve Arabic UX and error messages
**Scale/Scope**: Single form screen; affects one component file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is currently a template (not ratified). No active gates to enforce. Proceeding under standard frontend best practices:
- Reuse existing abstractions (service, hook) rather than creating new ones.
- Keep changes minimal and localized.
- Maintain existing error handling and Arabic UX patterns.

## Project Structure

### Documentation (this feature)

```text
specs/031-org-profile-api-integration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command output)
├── data-model.md        # Phase 1 output (/speckit.plan command output)
├── quickstart.md        # Phase 1 output (/speckit.plan command output)
├── contracts/           # Phase 1 output (/speckit.plan command output)
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/frontend/
src/
├── api/
│   ├── client.ts
│   ├── services/
│   │   └── onboarding-service.ts   # Already has endpoints
│   └── types.ts
├── app/
│   ├── components/
│   │   └── CharityOnboardingFlow.tsx # PRIMARY FILE TO CHANGE
│   ├── hooks/
│   │   └── useOnboardingRegistration.ts # Already exposes createProfile, saveFundingAreas, loadFundingAreas
│   └── ...
└── ...
```

**Structure Decision**: The repository is a Vite-based React SPA. The onboarding flow lives under `src/app/components/CharityOnboardingFlow.tsx` and uses `src/app/hooks/useOnboardingRegistration.ts` for all API interactions. All changes for this feature are localized to the component file.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations or justifications needed. The feature reuses existing service and hook layers without introducing new abstractions.
