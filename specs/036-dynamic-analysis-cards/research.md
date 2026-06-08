# Research: Dynamic Analysis Cards

**Date**: 2026-06-08
**Feature**: Dynamic Analysis Cards in Modal

---

## Decisions

### D1 — Icon Mapping Strategy
- **Decision**: Create a static `icon-map.ts` utility that maps API string names (e.g. `"Users"`, `"DollarSign"`) to `lucide-react` component references.
- **Rationale**: The project uses `lucide-react` exclusively. A lightweight record lookup is the simplest, most type-safe way to resolve string icons to React components. Dynamic `import()` would add unnecessary async complexity for a bounded icon set.
- **Alternatives considered**:
  - Dynamic `import('lucide-react')` per icon — rejected: adds async complexity and waterfall rendering; icon set is bounded.
  - Switch to `react-icons` — rejected: would require changing existing codebase conventions and adding a new dependency.

### D2 — "All" Filter Backend Aggregation
- **Decision**: The `useAnalysisLibraryItems` hook will accept a special sentinel (`'all'`) and attempt `GET /api/v1/analysis/library-items`. If the backend returns 404, it will fall back to parallel per-category fetching and client-side merge.
- **Rationale**: The backend may or may not expose an un-scoped endpoint. This approach follows the spec's "backend-supported" wording while remaining robust.
- **Alternatives considered**:
  - Always parallel-fetch all categories — rejected: creates N+1 requests on modal open.
  - Only support per-category — rejected: violates the existing "All" filter UX.

### D3 — Hook Design Pattern
- **Decision**: Follow the existing `useAnalysisCategories` pattern (`useState`/`useEffect`/`useCallback` with manual loading/error states). Do not introduce React Query.
- **Rationale**: The codebase has no React Query dependency and the existing pattern is functional. A refactor to React Query is out of scope.
- **Alternatives considered**:
  - Introduce `@tanstack/react-query` — rejected: out of scope, would require dependency changes and broader refactors.

### D4 — Modal Extraction Strategy
- **Decision**: Extract the inline modal from `AIAnalysisPage.tsx` into a new `AnalysisLibraryModal` component that lives in `src/app/components/analysis/`.
- **Rationale**: Satisfies Constitution Principle I (Component Reusability) and significantly reduces the monolithic 1203-line page component. The modal accepts props for visibility, category list, and `onSelectAnalysis` callback.
- **Alternatives considered**:
  - Keep modal inline and pass data down as props — rejected: keeps the file oversized and violates reusability.

### D5 — Arabic Field Fallback
- **Decision**: For `title` / `description` display, use `titleAr || title` and `descriptionAr || description`.
- **Rationale**: Matches the existing project convention used for categories (`nameAr || name`). The UI is hardcoded RTL Arabic; these fields are the primary display text.
- **Alternatives considered**:
  - Build a full i18n framework — rejected: no i18n library exists; switching mechanism is a UI mock in SettingsPage.

---

## Residual Unknowns

- **U1**: Does the backend support `GET /api/v1/analysis/library-items` (un-scoped)? Hook will handle 404 gracefully.
- **U2**: Exact list of icon names returned by the backend. `icon-map.ts` will include all icons already imported in `AIAnalysisPage.tsx` plus common lucide icons; unknown icons fall back to a default (`BarChart3`).
