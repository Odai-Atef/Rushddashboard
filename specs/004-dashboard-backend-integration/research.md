# Research: Dashboard Backend Integration

**Date**: 2026-05-18
**Feature**: Dashboard Backend Integration
**Status**: Complete

## Decisions

### 1. Widget Type Support

**Decision**: Start with 5 core widget types: stat cards, line charts, bar charts, pie charts, area charts, and tables.

**Rationale**: The existing codebase already supports line, bar, pie, and area charts via `ChartWidget.tsx`. Stat cards exist as `KPICard.tsx`. Adding a table widget completes the core set. This covers ~90% of typical dashboard use cases without over-engineering.

**Alternatives considered**:
- Minimal (2 types): Too restrictive for a dashboard product
- Extensive (8+ types): Would delay MVP; maps/gauges can be added in v2
- Fully dynamic/generic: Too complex; widget types need frontend rendering logic

### 2. State Management Pattern

**Decision**: Use React Context + hooks (existing pattern) rather than introducing Zustand.

**Rationale**: The dashboard state is primarily server-fetched data with minimal client-side state (filter values). React Context is sufficient and avoids adding a new dependency. If cross-dashboard state grows complex, Zustand can be introduced later.

**Alternatives considered**:
- Zustand: Excellent but unnecessary for current scope
- Redux: Overkill for this feature
- React Query/TanStack Query: Would add dependency; native fetch + hooks pattern already established

### 3. API Response Structure Assumption

**Decision**: Assume RESTful JSON API with three primary endpoints:
- `GET /dashboards` - list dashboards
- `GET /dashboards/:id` - dashboard details with widget definitions
- `GET /dashboards/:id/widgets/:widgetId/data` - widget data payload

**Rationale**: Follows existing analysis API pattern (`/analysis/categories`, `/analysis/categories/:id/summary`). Clear separation between dashboard metadata and widget data allows independent loading/caching.

**Alternatives considered**:
- GraphQL: Would require new dependency and backend support
- Single endpoint returning everything: Simpler but less flexible for partial updates

### 4. Widget Rendering Strategy

**Decision**: Create a `WidgetRenderer` component that maps widget types to specific components, passing configuration and data as props.

**Rationale**: Maintains component-first architecture. Each widget type has its own component file. The renderer acts as a switch/case dispatcher. New widget types can be added by creating a component and adding a case.

**Alternatives considered**:
- Single mega-component with conditional rendering: Violates 300-line limit principle
- Dynamic imports per widget type: Adds complexity; all widget types are lightweight

### 5. Filter State Management

**Decision**: Store filter state in URL query parameters for shareability, with fallback to React state.

**Rationale**: URL-based filters allow users to share filtered dashboard views. Aligns with spec requirement for filter persistence. React Router 7.x supports query parameter synchronization.

**Alternatives considered**:
- LocalStorage: Less shareable, harder to sync across tabs
- Backend persistence: Overkill for transient filter state

### 6. Error Handling Pattern

**Decision**: Reuse existing `ErrorState` and `EmptyState` components from analysis feature.

**Rationale**: Consistent UX across the application. Components already support Arabic text and retry functionality.

**Alternatives considered**:
- Dashboard-specific error components: Unnecessary duplication

## Unknowns Resolved

- **Widget type scope**: Core 5 types sufficient for MVP
- **State management**: Existing Context + hooks pattern adequate
- **API structure**: RESTful JSON following existing conventions
- **Rendering approach**: Component dispatcher pattern
- **Filter persistence**: URL query parameters

## Outstanding Risks

1. **Backend endpoint availability**: Spec notes create/update endpoints "may or may not exist". Frontend must gracefully handle 404s.
2. **Widget type extensibility**: If backend introduces new widget types not in frontend, need fallback UI.
3. **Performance with many widgets**: Dashboards with 10+ widgets may require virtualization or lazy widget loading.
