# Implementation Plan: AI Analysis API-Driven Category Filters

**Branch**: `034-rushd-frontend-analysis` | **Date**: 2026-06-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/034-rushd-frontend-analysis/spec.md`

## Summary

Replace the hardcoded category filter buttons in the AI Analysis library modal (`AIAnalysisPage.tsx`) with data fetched dynamically from `GET /api/v1/analysis/categories`. The existing "All" button and its unfiltered behavior must remain intact. Categories from the backend are ordered by `sortOrder` ascending. The implementation follows the Rushd Constitution: reusable components, OOP service layer, clean separation of concerns, and environment-driven API configuration.

## Technical Context

- **Language/Version**: TypeScript 5.x (React 18.x)
- **Primary Dependencies**: React, Tailwind CSS, shadcn/ui, Axios (via existing `apiClient`), Lucide React
- **Storage**: N/A (transient frontend state)
- **Testing**: Vitest + React Testing Library
- **Target Platform**: Web browser
- **Project Type**: web-application (frontend)
- **Performance Goals**: Category buttons rendered within 2 seconds of modal open under normal network conditions
- **Constraints**: Must pass Constitution Check (reusability, OOP services, env-driven config, API abstraction)
- **Scale/Scope**: Single feature within existing `/dashboard/ai-analysis` page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Component Reusability | Pass | Filter button logic extracted into a reusable hook; UI rendering uses existing primitives |
| II. Clean Code / OOP | Pass | New `AnalysisService` follows existing service class pattern (`DashboardService`, `AuthService`) |
| III. Environment-Driven Config | Pass | Endpoint base URL already read from `src/api/config.ts`; no new hardcoded URLs introduced |
| IV. API Abstraction Layer | Pass | Reuses existing centralized `apiClient`; no raw `fetch` or standalone Axios instances |
| V. Comprehensive Documentation | Pass | Service and hook receive JSDoc; quickstart added to feature directory |

## Project Structure

### Documentation (this feature)

```text
specs/034-rushd-frontend-analysis/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (completed below)
├── data-model.md        # Phase 1 output (completed below)
├── quickstart.md        # Phase 1 output (completed below)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts              # Existing Axios wrapper
│   ├── config.ts              # Environment config
│   ├── types.ts               # Shared API types
│   └── services/
│       ├── index.ts           # Barrel export
│       ├── dashboard-service.ts
│       └── analysis-service.ts   # NEW
├── app/
│   ├── components/
│   │   ├── AIAnalysisPage.tsx    # UPDATED: wire in dynamic categories
│   │   └── ui/                   # shadcn/ui primitives
│   ├── hooks/
│   │   └── useAnalysisCategories.ts   # NEW: fetch + state hook
│   └── utils/
│       └── cn.ts
```

**Structure Decision**: Single frontend project. Additions scoped to a new domain service, a new custom hook, and a targeted update in the existing `AIAnalysisPage.tsx` modal category filter section.

## Complexity Tracking

Not applicable. No constitution violations identified; all principles naturally satisfied by the chosen architecture.

## Phase 0: Research (Completed)

See [research.md](research.md).

Key decisions:
1. **Service pattern**: Add `AnalysisService` to mirror `DashboardService`.
2. **Client reuse**: Route all requests through existing `apiClient`.
3. **State hook**: Encapsulate fetch lifecycle in `useAnalysisCategories`.
4. **Client-side sort**: Sort by `sortOrder` ascending before rendering.
5. **Graceful degradation**: Keep modal usable with only "All" if categories fail to load.

## Phase 1: Design & Contracts (Completed)

### Data Model

See [data-model.md](data-model.md).

Contracts:
- `Category` entity shape captured from the spec requirements.
- `useAnalysisCategories` hook state interface defined.
- Validation and sort rules documented.

### Agent Context Update

Updated `AGENTS.md` to reference the current plan and spec paths for local development agents.

See [quickstart.md](quickstart.md) for local verification steps.

## Post-Design Constitution Re-check

All gates remain **Pass**. No new violations introduced during design.

## Next Step

Run `/speckit.tasks` to generate the implementation tasks.
