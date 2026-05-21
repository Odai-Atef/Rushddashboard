# Research: AI Analysis Categories

**Date**: 2026-05-21
**Feature**: specs/029-ai-analysis-categories
**Context**: Replacing hardcoded categories on `/dashboard/ai-analysis` with API-driven categories from `GET /api/v1/analysis/categories`.

## Decision: Use Existing Custom Hook Pattern (No React Query)

**Decision**: Continue using the existing `useState + useEffect + useCallback` custom hook pattern (already codified in `useCategories.ts`) rather than introducing TanStack Query or SWR.

**Rationale**:
- The Rushd frontend codebase does not use TanStack Query/SWR anywhere; it uses homemade custom hooks (`useCategories`, `useDashboards`, `useAuth`).
- The existing `useCategories.ts` already fetches, sorts by `sortOrder`, and manages loading/error states.
- Introducing a new data-fetching library would add a dependency and break existing conventions, increasing review friction and inconsistency.

**Alternatives considered**:
- TanStack Query (`@tanstack/react-query`): Would provide built-in caching, retries, and background refetching, but is overkill for a single endpoint read and inconsistent with the rest of the codebase.
- SWR: Same reasoning as above.

## Decision: Wire Existing `CategorySelector` into AIAnalysisPage

**Decision**: Reuse the existing `CategorySelector` component (already typed for `AnalysisCategory[]`, already handles loading/empty/error UI).

**Rationale**:
- `CategorySelector.tsx` already exists under `src/app/components/analysis/` and implements a chip grid with loading skeletons.
- Using it instead of inline chips reduces the `AIAnalysisPage.tsx` file size and avoids duplicating layout logic, which aligns with Constitution Principle I (Component-First Architecture).
- The component already handles `nameAr || name` fallback display.

## Decision: Keep `count: 0` Categories Visible

**Decision**: Categories with `count: 0` should still be rendered in the filter UI, showing `0`.

**Rationale**:
- This is most consistent with the spirit of the "الكل" aggregate — the UI is a category *catalog*, not a results *filter*.
- Removing zero-count categories would cause layout shifts if counts change dynamically.
- The `CategorySelector` component's existing rendering is count-agnostic.

## Decision: No Additional Client-Side Caching Beyond React State

**Decision**: Rely on the existing `hasFetched` flag in `useCategories.ts` (fetch-on-mount); do not add localStorage/sessionStorage caching.

**Rationale**:
- Category list is small (< 20 items) and inexpensive to fetch.
- The backend may change category names/order/count in real time; stale cached data would violate SC-001.
- React state + fetch-on-mount is the existing pattern used for all API calls in the project.

## Assumptions Confirmed by Codebase

- **Authentication**: `apiFetch` already injects `Authorization: Bearer <token>` from `localStorage`.
- **Error handling**: `apiFetch` already throws `ApiError` on non-OK responses.
- **Base URL**: `VITE_API_BASE_URL` defaults to `http://localhost:3000/api/v1`.
- **Zod schemas**: `AnalysisCategory` and `CategoriesResponse` schemas already exist in `src/app/types/analysis.ts`.
- **`getCategories` service**: `src/app/services/analysis.ts` already exports a `getCategories` function that hits `/analysis/categories`.
- **No i18n library**: Arabic labels are rendered directly from API fields (`nameAr` fallback to `name`).

## Pre-Existing Constitution Violations

- `AIAnalysisPage.tsx` is **1,181 lines**, well above the 300-line limit. Replacing hardcoded categories with the existing `CategorySelector` component will modestly reduce its size, but a full refactor is out of scope. This feature does not *introduce* the violation.
- `useCategories.ts` and `CategorySelector.tsx` are each well under 300 lines.
