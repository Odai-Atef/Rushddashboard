# Implementation Plan: Dynamic Analysis Cards in Modal

**Branch**: `036-rushd-frontend-analysis` | **Date**: 2026-06-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/036-dynamic-analysis-cards/spec.md`

## Summary

Replace the 19 hardcoded analysis cards inside the "New Analytics" modal (`AIAnalysisPage.tsx`) with dynamically fetched API data. When a category filter is clicked, call `GET /api/v1/analysis/categories/:categoryId/library-items`, render the returned active items as cards, and preserve existing modal UX and click flow. The "All" filter must also use dynamic data rather than hardcoded cards. Extract the inline modal into a reusable component to satisfy the project's constitution principles.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x  
**Primary Dependencies**: React, Tailwind CSS v4, shadcn/ui primitives, lucide-react, recharts (existing)  
**Storage**: N/A (all data fetched from backend API)  
**Testing**: Vitest (existing project test runner)  
**Target Platform**: Modern browsers (Chrome, Firefox, Edge, Safari)  
**Project Type**: Web application frontend (React SPA built with Vite)  
**Performance Goals**: Cards visible within 2 seconds of filter selection; minimal re-renders on category switch  
**Constraints**: Must preserve existing Arabic RTL UI; must not introduce new state-management libraries  
**Scale/Scope**: Single page (`/dashboard/ai-analysis`) and its modal; bounded icon set from `lucide-react`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status | Notes |
|-----------|-------|--------|-------|
| **I. Component Reusability** | Modal is currently inline in `AIAnalysisPage.tsx` (1203 lines). No component reusability. | **VIOLATION — MUST FIX** | Extract modal to `AnalysisLibraryModal.tsx` component. |
| **II. Clean Code & OOP** | Hook `useAnalysisCategories` and service `analysisService` follow clean patterns. No violations. | **PASS** | — |
| **III. Environment-Driven Configuration** | API endpoint uses `baseEndpoint` constant; no hardcoded secrets. | **PASS** | — |
| **IV. API Abstraction Layer** | `AnalysisService` properly composes `apiClient`. | **PASS** | — |
| **V. Comprehensive Documentation** | No README update needed for this scoped change; inline JSDoc for new service method and hook. | **PASS** | — |

**Re-check after design**: The modal extraction (Principle I) is the only action item.

## Project Structure

### Documentation (this feature)

```text
specs/036-dynamic-analysis-cards/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── library-items.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── services/
│   │   └── analysis-service.ts        # Add getLibraryItems(), getAllLibraryItems()
│   └── types.ts                      # (no changes expected)
├── app/
│   ├── components/
│   │   ├── AIAnalysisPage.tsx         # Refactor: remove inline modal, use new modal component
│   │   └── analysis/
│   │       └── AnalysisLibraryModal.tsx  # NEW: reusable modal component
│   ├── hooks/
│   │   ├── useAnalysisCategories.ts   # (no changes)
│   │   └── useAnalysisLibraryItems.ts # NEW: data fetching hook for library items
│   └── utils/
│       └── icon-map.ts                # NEW: map API icon strings → LucideIcon components
└── styles/                             # (no changes expected)
```

**Structure Decision**: Single-project SPA structure already in place. New files added under existing directories (`src/api/services`, `src/app/hooks`, `src/app/components/analysis`, `src/app/utils`).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Inline modal (~180 lines) kept inside page component | Current page component is single 1203-line file. | Extracting the modal into its own component (`AnalysisLibraryModal`) is the fix; no alternative needed because the violation is being resolved, not justified. |

## Research Artifacts

- [research.md](research.md) — Icon mapping strategy, "All" filter backend approach, hook design pattern, modal extraction rationale.

## Design Artifacts

- [data-model.md](data-model.md) — `AnalysisLibraryItem` entity, `Category` relationship, view-model transformation rules.
- [contracts/library-items.md](contracts/library-items.md) — API contract for per-category and optional all-items endpoints, error handling rules.
