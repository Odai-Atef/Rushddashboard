# Implementation Plan: AI Analysis Categories

**Branch**: `029-ai-analysis-categories` | **Date**: 2026-05-21 | **Spec**: specs/029-ai-analysis-categories/spec.md
**Input**: Feature specification from `specs/029-ai-analysis-categories/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace hardcoded category strings on the `/dashboard/ai-analysis` page with dynamically loaded categories from the backend API (`GET /api/v1/analysis/categories`). The existing `useCategories` hook, `getCategories` service, and `CategorySelector` UI component already support the contract and loading/error states. The primary work is wiring these pieces together in the `AIAnalysisPage` component and removing the hardcoded `categories` array and inline filtering logic.

## Technical Context

**Language/Version**: TypeScript 5.4+, React 18.3+ with Vite 6.x  
**Primary Dependencies**: Tailwind CSS 4.x, shadcn/ui primitives, Framer Motion (motion), Zod 3.x  
**Storage**: N/A (backend persistence only)  
**Testing**: Vitest, React Testing Library  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge – last 2 versions)  
**Project Type**: Web SPA (frontend only integration)  
**Performance Goals**: Category list < 10 items; request + render < 500 ms on typical network  
**Constraints**: No new dependencies; reuse existing service/hook/component patterns. Keep `AIAnalysisPage.tsx` changes minimal to avoid scope creep (file is already 1,181 lines).  
**Scale/Scope**: Single page component update; ~10 categories expected.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | `CategorySelector`, `EmptyState`, `ErrorState` already exist as reusable components. |
| II. Clean Code & Quality Standards | ⚠️ PRE-EXISTING | `AIAnalysisPage.tsx` is 1,181 lines. This feature does not increase it; it removes code. A page-level refactor is ticketed separately and out of scope here. |
| III. API Integration & Resilience | ✅ PASS | `getCategories` uses centralized `apiFetch`, Zod parsing, and error toasts. |
| IV. Performance & Responsive Design | ✅ PASS | No heavy assets; `CategorySelector` is lightweight. No lazy-load needed for this change. |
| V. Containerization & Environment Consistency | ✅ PASS | No Docker or env changes required. |

**Re-check after Phase 1**: All principles remain satisfied. No new violations introduced.

## Project Structure

### Documentation (this feature)

```text
specs/029-ai-analysis-categories/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── analysis-api.md  # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   ├── AIAnalysisPage.tsx          ← primary modification target
│   │   └── analysis/
│   │       ├── CategorySelector.tsx    ← already built, may need minor wiring tweaks
│   │       ├── EmptyState.tsx          ← reusable
│   │       └── ErrorState.tsx          ← reusable
│   ├── hooks/
│   │   └── useCategories.ts           ← already built, verify output contract
│   ├── services/
│   │   └── analysis.ts                ← verify endpoint path and Zod parsing
│   └── types/
│       └── analysis.ts                ← already contains AnalysisCategorySchema
└── specs/
    └── ...
```

**Structure Decision**: Single SPA project. The existing `src/app/` structure is sufficient. All required services, hooks, types, and components already exist. No new scaffolding needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `AIAnalysisPage.tsx` exceeds 300 lines (pre-existing) | This file was inherited before constitution ratification. Current feature removes hardcoded arrays (reduces lines), but a full refactor is out of scope per the spec notes. | Extracting the entire page into sub-pages is too large for this ticket and tracked separately. |
