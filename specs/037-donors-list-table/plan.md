# Implementation Plan: Donors List Table

**Branch**: `038-donors-list-table` | **Date**: 2026-06-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/037-donors-list-table/spec.md`

## Summary

Build a paginated, searchable donors list table at `/dashboard/donors` that fetches real donor data from the backend API (`GET /api/v1/donors`), replacing the current mock-data `DonorDatabaseModule`. The table will support pagination, client-side search/filtering, RTL Arabic content, mobile responsiveness, and a side drawer for donor detail views.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3.1  
**Primary Dependencies**: React Router v7, Tailwind CSS 4.x, shadcn/ui (Radix primitives), TanStack Table v8, React Query (TanStack Query) v5, date-fns, lucide-react  
**Storage**: N/A (frontend only; backend API provides data)  
**Testing**: Vitest (if present) or manual testing via dev server  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), responsive down to 320px  
**Project Type**: React web application (single-page dashboard app)  
**Performance Goals**: Page changes under 1s, search/filter updates under 1s, first contentful paint under 2s  
**Constraints**: Must follow Constitution Check (reusable components, OO service layer, no hardcoded secrets, RTL support)  
**Scale/Scope**: Support up to 10,000 donors via pagination; max 100 items per page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Reusability | ✅ Pass | Table, pagination, filters, drawer, badges will be reusable components |
| II. Clean Code & OOP | ✅ Pass | DonorService will encapsulate API logic; typed interfaces for all data |
| III. Environment-Driven Config | ✅ Pass | API base URL comes from `ENV.API_BASE_URL`; no hardcoded endpoints |
| IV. API Abstraction Layer | ✅ Pass | Will use existing `ApiClient` class via new `DonorService` |
| V. Comprehensive Documentation | ✅ Pass | JSDoc for service methods and reusable components |

## Project Structure

### Documentation (this feature)

```text
specs/037-donors-list-table/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── donor-api.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts              # Existing ApiClient (reused)
│   ├── types.ts               # Existing shared types (reused)
│   ├── services/
│   │   ├── index.ts           # Service registry (add DonorService export)
│   │   └── donor-service.ts   # NEW: Donor API service
│   └── hooks/                 # NEW: React Query hooks
│       └── useDonors.ts
├── app/
│   ├── routes.tsx             # Route exists (update component import)
│   ├── components/
│   │   ├── donors/            # NEW: All donor-related components
│   │   │   ├── DonorsPage.tsx           # Main page container
│   │   │   ├── DonorsTable.tsx          # TanStack Table wrapper
│   │   │   ├── DonorsPagination.tsx     # Pagination controls
│   │   │   ├── DonorsFilters.tsx        # Search + filter bar
│   │   │   ├── DonorRow.tsx             # Table row component
│   │   │   ├── DonorDetailDrawer.tsx    # Side drawer for details
│   │   │   ├── FundingAreaBadge.tsx     # Colored tag/badge
│   │   │   ├── EmptyState.tsx           # Empty state illustration
│   │   │   ├── LoadingState.tsx         # Loading skeleton
│   │   │   └── ErrorState.tsx           # Error message with retry
│   │   └── ui/                # Reusable UI primitives (if not in shadcn)
│   ├── layouts/
│   │   └── DashboardLayout.tsx # Existing (add activeView mapping if needed)
│   └── hooks/
│       └── useDebounce.ts     # NEW: Debounce hook for search
└── types/
    └── donors.ts              # NEW: Donor-specific TypeScript types
```

**Structure Decision**: Single-project structure. All donor feature code lives in `src/app/components/donors/` with API logic in `src/api/services/donor-service.ts`. The existing `DonorDatabaseModule.tsx` will be replaced by `DonorsPage.tsx`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are satisfied with the proposed design.
