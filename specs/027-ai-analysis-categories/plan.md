# Implementation Plan: AI Analysis Dynamic Categories

**Branch**: `[027-ai-analysis-categories]` | **Date**: 2026-05-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/027-ai-analysis-categories/spec.md`

## Summary

Replace the hardcoded string-based `categories` array in `AIAnalysisPage` with API-driven category data from `GET /api/v1/analysis/categories`. Ensure the existing `CategorySelector.tsx` component (already built to accept typed categories) is integrated into `AIAnalysisPage`. Preserve UX: chips/buttons layout, `"الكل"` aggregate, count badges, selection styling, and filtering logic. Add loading, empty, and error states.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x + React 18.3
**Primary Dependencies**: Vite 6.x, React Router 7.x, Tailwind CSS 4.x, shadcn/ui, Lucide React, Recharts, Zod, Vitest
**Storage**: N/A (no local persistence required for this feature)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (modern browsers), Arabic-first UI (RTL context via Tailwind)
**Project Type**: Web application (frontend SPA within Rushd dashboard)
**Performance Goals**: Categories section renders within 1 second of API response under normal network conditions; minimal re-renders on selection changes.
**Constraints**: Category chips must remain within existing horizontal scroll container; no layout breaking if icons/counts are absent; must follow Constitution file size limits (no single file exceeding 300 lines without justification).
**Scale/Scope**: Single API call per page load (no pagination for v1); up to ~20 categories expected.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| PRINCIPLE_1: Component-First Architecture | Pass | `CategorySelector.tsx` already exists as a separated, typed component; new fetch logic should go into a dedicated `useCategories` hook to keep `AIAnalysisPage` under 300 lines. |
| PRINCIPLE_2: Clean Code & Quality Standards | Pass | No dead code; existing types use Zod schemas; naming conventions aligned. |
| PRINCIPLE_3: API Integration & Resilience | Pass | `analysis.ts` service exists with typed `apiFetch`; must add retry-friendly error handling and loading state. |
| PRINCIPLE_4: Performance & Responsive Design | Pass | Chips already use overflow-x-auto; no heavy external libraries needed. |
| PRINCIPLE_5: Containerization & Environment Consistency | Pass | Uses existing Vite + Docker setup; no new env vars required. |

## Project Structure

### Documentation (this feature)

```text
specs/027-ai-analysis-categories/
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
│   ├── components/
│   │   ├── AIAnalysisPage.tsx          # Remove hardcoded categories; integrate CategorySelector & new hook
│   │   └── analysis/
│   │       ├── CategorySelector.tsx    # Already exists; may need minor UI tweaks for count badge
│   │       ├── EmptyState.tsx          # Reusable empty state
│   │       └── ErrorState.tsx          # Reusable error state
│   ├── hooks/
│   │   └── useCategories.ts           # NEW: fetch + state management for categories
│   ├── services/
│   │   ├── analysis.ts                # Already has getCategories; verify path alignment
│   │   └── api.ts                     # Already has apiFetch + auth token handling
│   ├── types/
│   │   └── analysis.ts                # Already has AnalysisCategory schema + types
│   └── utils/
│       └── analysis.ts                # May need helpers for count formatting / icon mapping
└── tests/
    ├── unit/
    │   └── useCategories.test.ts      # NEW: unit test for hook
    └── integration/
        └── AIAnalysisPage.test.tsx    # NEW: integration test for page loading + rendering
```

**Structure Decision**: Option 1 (Single project) applies, but within the existing modular structure dictated by the constitution (`components/`, `hooks/`, `services/`, `types/`, `utils/`). The `AIAnalysisPage` is a route-level page component under `components/`. No new top-level directories are required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations detected.

## Research

See [research.md](./research.md) for Phase 0 findings.

## Design

See [data-model.md](./data-model.md) for entity definitions.
See [contracts/analysis-api.md](./contracts/analysis-api.md) for API contract.
See [quickstart.md](./quickstart.md) for local setup instructions.

## Plan Phases

### Phase 0: Research
- Verified existing `CategorySelector` component supports typed categories and loading prop.
- Verified `analysis.ts` service already exposes `getCategories()`.
- Verified `api.ts` already injects Bearer tokens and handles JSON responses.
- Confirmed `AIAnalysisPage` currently embeds a hardcoded `categories` string array and counts derived from `analysisCards.filter(...)`.

### Phase 1: Design
- Aligned `AnalysisCategory` schema to user-provided API contract: added `key` field, `count` field, `descriptionAr` field.
- Decision: use existing Zod schema to parse response for type safety.
- Decision: keep `CategorySelector` as the primary category chips UI component.
- Decision: add a `useCategories` hook to isolate fetch logic and keep `AIAnalysisPage` size-compliant.
- Decision: `"الكل"` remains a UI-only aggregate chip; its count is not computed from API data.

## Agent Context

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure, shell commands, and other important information, read the current plan:

**Current Plan**: [specs/027-ai-analysis-categories/plan.md](specs/027-ai-analysis-categories/plan.md)

## Current Feature Context

- **Spec**: specs/027-ai-analysis-categories/spec.md
- **Plan**: specs/027-ai-analysis-categories/plan.md
- **Data Model**: specs/027-ai-analysis-categories/data-model.md
- **API Contracts**: specs/027-ai-analysis-categories/contracts/analysis-api.md
- **Quick Start**: specs/027-ai-analysis-categories/quickstart.md
- **Feature Branch**: 027-rushd-frontend-analysis

<!-- SPECKIT END -->
