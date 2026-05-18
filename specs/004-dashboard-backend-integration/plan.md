# Implementation Plan: Dashboard Backend Integration

**Branch**: `008-dashboard-backend-integration` | **Date**: 2026-05-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/004-dashboard-backend-integration/spec.md`

## Summary

Replace hardcoded dashboard data with live backend API integration. The frontend will fetch dashboard lists, dashboard details with widget definitions, and widget data dynamically. Widgets render based on backend-provided configuration (type, layout, data source). Filters are URL-persisted and trigger widget data refreshes. Loading, empty, and error states are handled consistently across all dashboard views.

**Technical Approach**: 
- Centralized dashboard service layer (`src/app/services/dashboard.ts`) with typed fetch wrappers
- React hooks (`useDashboards`, `useDashboard`, `useWidgetData`) for data fetching
- `WidgetRenderer` component dispatcher that maps widget types to specific components
- URL-based filter state management via React Router query parameters
- Zod schemas for runtime API response validation

## Technical Context

**Language/Version**: TypeScript 5.x with React 18.3+  
**Primary Dependencies**: React, React Router 7.x, Tailwind CSS 4.x, Recharts, Zod, React Hook Form  
**Storage**: N/A (stateless frontend, backend persists data)  
**Testing**: Vitest, React Testing Library, Playwright  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (frontend SPA)  
**Performance Goals**: Dashboard list <2s, dashboard details <3s, filter refresh <2s  
**Constraints**: Bundle <250KB gzipped per route, responsive (mobile/tablet/desktop), no file >300 lines  
**Scale/Scope**: 5-20 dashboards per company, 4-15 widgets per dashboard, 10-100 concurrent viewers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | Widgets are self-contained components; `WidgetRenderer` dispatcher maintains modularity |
| II. Clean Code & Quality Standards | PASS | All new files will follow size limits; hooks extract shared logic |
| III. API Integration & Resilience | PASS | Centralized service layer with typed errors; loading/error states for all async ops |
| IV. Performance & Responsive Design | PASS | Lazy loading for dashboard routes; responsive grid layouts; memoization where justified |
| V. Containerization | N/A | Frontend code changes; Docker config unchanged |

**Re-check after Phase 1**: All principles still pass. No architectural violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-dashboard-backend-integration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── dashboard-api.md
├── spec.md              # Feature specification
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   └── dashboard/
│   │       ├── DashboardList.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── WidgetGrid.tsx
│   │       ├── WidgetRenderer.tsx
│   │       ├── DashboardFilters.tsx
│   │       ├── widgets/
│   │       │   ├── StatWidget.tsx
│   │       │   ├── ChartWidget.tsx
│   │       │   ├── TableWidget.tsx
│   │       │   └── UnknownWidget.tsx
│   │       └── states/
│   │           ├── DashboardLoading.tsx
│   │           ├── DashboardError.tsx
│   │           └── DashboardEmpty.tsx
│   ├── hooks/
│   │   ├── useDashboards.ts
│   │   ├── useDashboard.ts
│   │   └── useWidgetData.ts
│   ├── services/
│   │   └── dashboard.ts
│   ├── types/
│   │   └── dashboard.ts
│   └── pages/
│       └── Dashboard/
│           ├── DashboardListPage.tsx
│           └── DashboardDetailPage.tsx
```

**Structure Decision**: Single frontend SPA structure. Dashboard feature lives under `src/app/components/dashboard/` with clear separation: hooks for data fetching, services for API calls, types for Zod schemas, components for UI. This aligns with the existing project structure from AGENTS.md.

## Complexity Tracking

> No constitution violations requiring justification.

## Design Decisions (from Research)

See [research.md](research.md) for detailed rationale.

1. **Widget Types**: 5 core types (stat, line, bar, pie, area, table) covering ~90% of use cases
2. **State Management**: React Context + hooks (existing pattern) sufficient for dashboard state
3. **API Structure**: RESTful JSON with 3 primary endpoints (list, details, widget data)
4. **Widget Rendering**: Component dispatcher pattern via `WidgetRenderer`
5. **Filter Persistence**: URL query parameters for shareability
6. **Error Handling**: Reuse existing `ErrorState`/`EmptyState` components from analysis feature

## Data Model

See [data-model.md](data-model.md) for full entity definitions.

**Key Entities**:
- **Dashboard**: Collection of widgets with layout config and filters
- **Widget**: Data visualization with type, config, layout position, and data source
- **WidgetData**: Runtime data payload (structure varies by widget type)
- **FilterDefinition/FilterValue**: Dashboard-level filter configuration and applied values

## API Contracts

See [contracts/dashboard-api.md](contracts/dashboard-api.md) for full endpoint documentation.

**Primary Endpoints**:
- `GET /dashboards` — List dashboards
- `GET /dashboards/:id` — Dashboard details with widget definitions
- `GET /dashboards/:id/widgets/:widgetId/data` — Widget data payload
- `POST /dashboards` — Create dashboard (optional)
- `PATCH /dashboards/:id` — Update dashboard (optional)

## Implementation Phases

### Phase 0: Research (Complete)
✓ [research.md](research.md) — Widget types, state management, API structure, rendering strategy, filter persistence, error handling

### Phase 1: Design & Contracts (Complete)
✓ [data-model.md](data-model.md) — Entities, types, validation rules, state transitions  
✓ [contracts/dashboard-api.md](contracts/dashboard-api.md) — All endpoints with request/response schemas  
✓ [quickstart.md](quickstart.md) — Setup, testing, architecture, common issues  
✓ Agent context updated in [AGENTS.md](../../AGENTS.md)

### Phase 2: Tasks (Next Step)
Run `/speckit.tasks` to generate detailed implementation tasks.

## Quick Start

See [quickstart.md](quickstart.md) for development setup, testing commands, and troubleshooting.

## References

- [Specification](spec.md)
- [Research](research.md)
- [Data Model](data-model.md)
- [API Contracts](contracts/dashboard-api.md)
- [Constitution](../../.specify/memory/constitution.md)
- [AGENTS.md](../../AGENTS.md)
