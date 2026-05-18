# Implementation Plan: Executive Analysis Backend Integration

**Branch**: `005-rushd-frontend-executive` | **Date**: 2026-05-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-executive-analysis-backend/spec.md`

## Summary

Replace hardcoded data in the executive analysis dashboard with live backend data. The implementation introduces a modular analysis service layer, typed React hooks with Context-based state management, and dynamic rendering for categories, KPIs, charts, and AI insights. All dashboard pages (Sales, Operations, Marketing, etc.) will benefit from reusable analysis patterns.

## Technical Context

**Language/Version**: TypeScript 5.x with React 18.3+  
**Primary Dependencies**: React, Recharts (charts), Zod (validation), Tailwind CSS, shadcn/ui, React Router 7.x  
**Storage**: N/A (state managed via React Context)  
**Testing**: Vitest, React Testing Library, Playwright  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (React SPA)  
**Performance Goals**: Categories load < 2s, Analytics load < 3s, Route chunk < 250KB gzipped  
**Constraints**: Bundle size monitoring, no single file > 300 lines, no function > 50 lines  
**Scale/Scope**: Single-tenant dashboard for business executives; ~10 categories, ~20 KPIs per category  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ Pass | Analysis broken into reusable hooks, services, types. Dashboard components remain focused. |
| II. Clean Code & Quality | ✅ Pass | Service layer centralizes API calls; hooks extract shared logic. No expected file/function size violations. |
| III. API Integration & Resilience | ✅ Pass | Centralized service with typed responses, error handling per section, loading states throughout. |
| IV. Performance & Responsive | ✅ Pass | Parallel fetching, Context state (no external lib), Recharts already integrated. Lazy loading preserved. |
| V. Containerization | ✅ Pass | No changes to Docker or environment setup. Feature is frontend-only. |

**Re-check after Phase 1**: All principles still pass. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/003-executive-analysis-backend/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── analysis-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   ├── ExecutiveDashboard.tsx      # Refactored: uses live data
│   │   └── analysis/                   # NEW: Analysis sub-components
│   │       ├── KPICard.tsx
│   │       ├── KPICardSkeleton.tsx
│   │       ├── ChartWidget.tsx
│   │       ├── InsightCard.tsx
│   │       ├── CategorySelector.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorState.tsx
│   ├── hooks/
│   │   ├── useAnalysisContext.tsx      # NEW: Analysis state provider
│   │   ├── useCategories.ts            # NEW: Category fetching
│   │   ├── useAnalytics.ts             # NEW: Analytics + KPI fetching
│   │   └── useInsights.ts              # NEW: Insights fetching
│   ├── services/
│   │   └── analysis.ts                 # NEW: Analysis API service
│   ├── types/
│   │   └── analysis.ts                 # NEW: Analysis types + Zod schemas
│   └── utils/
│       └── analysis.ts                 # NEW: Analysis helpers (formatters)
```

**Structure Decision**: Single project structure. The analysis feature follows the established pattern (types → services → hooks → components) and is colocated within the existing `src/app` directory. Reusable analysis components live in `components/analysis/` to support other dashboard pages.

## Complexity Tracking

No constitution violations requiring justification.

## Design Decisions

### State Management
- **Decision**: Extend existing React Context + hooks pattern (no new state library)
- **Rationale**: Already used for chat/auth; sufficient for analysis state; avoids bundle bloat
- **Implementation**: `AnalysisContext` holds categories, selectedCategory, filters, and loading/error states

### Data Fetching Strategy
- **Decision**: Separate endpoints fetched in parallel
- **Rationale**: Aligns with REST conventions, allows independent error handling, matches entity model
- **Implementation**: `Promise.all` for analytics + insights after category selection

### Error Handling
- **Decision**: Per-section error boundaries with retry capability
- **Rationale**: Partial failures (e.g., categories load but analytics fail) must not break the entire page
- **Implementation**: Each data section (KPIs, charts, insights) has its own error state and retry button

### Reusability
- **Decision**: Generic analysis hooks/services usable by all dashboard pages
- **Rationale**: SalesDashboard, OperationsDashboard, etc. all need categories + KPIs + charts
- **Implementation**: `useAnalytics(categoryId)` accepts any category ID; services are category-agnostic

### Filter Support
- **Decision**: Query string parameters; filters stored in Context
- **Rationale**: RESTful, cacheable, supports future URL-based history
- **Implementation**: `FilterParameters` type; serialized to query string in service layer

## Next Steps

1. Generate implementation tasks via `/speckit.tasks`
2. Implement types and Zod schemas
3. Implement service layer with error handling
4. Implement Context provider and hooks
5. Refactor ExecutiveDashboard to use live data
6. Add loading, empty, and error states
7. Test integration end-to-end

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Backend API changes | Medium | High | Zod schemas catch mismatches at runtime; service layer isolates changes |
| Performance degradation | Low | Medium | Parallel fetching, loading states, and caching keep UX responsive |
| Scope creep (filters UI) | Medium | Low | Filters are data-layer only in this scope; UI deferred |
