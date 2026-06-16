# Implementation Plan: Onboarding Pre-fill on Reload

**Branch**: `main` | **Date**: Mon Jun 15 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/032-onboarding-pre-fill-reload/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

When a user reloads the onboarding page, the system must fetch their saved organization (with embedded profile and funding areas) via the existing `GET /api/v1/onboarding/organizations/me` endpoint, pre-fill both the registration form and the profile form, tick the correct funding area checkboxes, and navigate to the step matching their saved progress. All changes are localized to `CharityOnboardingFlow.tsx`.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3
**Primary Dependencies**: Vite 6.3.5, TailwindCSS 4.1.12, MUI, react-hook-form, recharts, react-router 7.13
**Storage**: N/A (state managed in hook; backend persistence via REST APIs)
**Testing**: No formal test framework detected; rely on manual/integration testing via browser devtools
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend SPA)
**Performance Goals**: Form pre-fill visible within 2 seconds of page load
**Constraints**: Must NOT store orgId in sessionStorage or localStorage; must use JWT from existing apiClient
**Scale/Scope**: Single component file; affects one onboarding screen

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is currently a template (not ratified). No active gates to enforce. Proceeding under standard frontend best practices:
- Reuse existing abstractions (hook, service) rather than creating new ones.
- Keep changes minimal and localized.
- Maintain existing error handling and Arabic UX patterns.

## Project Structure

### Documentation (this feature)

```text
specs/032-onboarding-pre-fill-reload/
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
│   │   └── onboarding-service.ts   # Already has getMyOrganization()
│   └── types.ts
├── app/
│   ├── components/
│   │   └── CharityOnboardingFlow.tsx # PRIMARY FILE TO CHANGE
│   ├── hooks/
│   │   └── useOnboardingRegistration.ts # Already exposes organization, loadOrganization
│   └── ...
└── ...
```

**Structure Decision**: The repository is a Vite-based React SPA. The onboarding flow lives under `src/app/components/CharityOnboardingFlow.tsx` and uses `src/app/hooks/useOnboardingRegistration.ts` for all API interactions. All changes for this feature are localized to the component file.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations or justifications needed. The feature reuses existing service and hook layers without introducing new abstractions.
