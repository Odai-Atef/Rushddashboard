# Quick Start: AI Analysis Categories

**Feature**: specs/029-ai-analysis-categories
**Date**: 2026-05-21

## Context

The `/dashboard/ai-analysis` page currently uses a hardcoded string array for category filter chips and the "تحليل جديد" modal. This feature replaces that with dynamic data from the backend:

```typescript
// BEFORE (hardcoded)
const categories = ['الكل', 'المبيعات', 'العملاء', ...];

// AFTER (API-driven)
const { categories, isLoading, error } = useCategories();
```

## What Already Exists

1. **Zod schemas**: `AnalysisCategorySchema`, `CategoriesResponseSchema` in `src/app/types/analysis.ts`
2. **API service**: `getCategories()` in `src/app/services/analysis.ts` hitting `GET /analysis/categories`
3. **Data hook**: `useCategories()` in `src/app/hooks/useCategories.ts` (sorts by `sortOrder`, manages loading/error)
4. **UI components**:
   - `CategorySelector.tsx` — renders chip grid, handles loading skeletons, empty/error states
   - `EmptyState.tsx` — generic empty state
   - `ErrorState.tsx` — generic error state with retry

## Changes Required

### 1. Wire `useCategories` into `AIAnalysisPage.tsx`

- Remove the hardcoded `categories` string array (~line 111).
- Import and call `useCategories` at the top of the component.
- Replace inline chip rendering with `<CategorySelector>`.
- Update `selectedCategory` from a `string` to the category `key` (or `AnalysisCategory | null`).
- Keep `"الكل"` as a manually added UI aggregate not backed by the API.

### 2. Update Count Logic

- Remove inline `analysisCards.filter(...).length` computation.
- Use `category.count` directly from the API response.

### 3. Loading / Empty / Error States

- Pass `isLoading` and `error` from `useCategories` to `CategorySelector`.
- `CategorySelector` already supports `loadingCategories`, `errorMessage`, and `onRetry` props.

## Running & Testing

```bash
# Start dev server
npm run dev

# Run unit tests
npm test

# Lint & typecheck
npm run lint && npx tsc --noEmit
```

### Manual Verification Checklist

1. Open `/dashboard/ai-analysis` — category chips load dynamically from the API.
2. Click **تحليل جديد** — the modal shows categories with correct Arabic labels and counts.
3. Verify `"الكل"` is still present and pinned first.
4. Verify `sortOrder` dictates display order.
5. Verify `count: 0` categories still render (showing `0`).
6. Test error state: temporarily break the API URL and confirm the error UI with retry.
7. Test empty state: mock `categories: []` and confirm empty UI.

## Gotchas

- `AIAnalysisPage.tsx` is currently **1,181 lines** (exceeds the 300-line constitution limit). **Do NOT refactor the whole file** — only replace the category-related inline code (chips + filtering) to minimize scope.
- `CategorySelector` expects `AnalysisCategory[]`, not plain strings. Update `selectedCategory` to work with category objects or their `key` field.
- The existing `useCategories` hook already has deduplication (`hasFetched`). If you need to force-refetch (e.g., after retry), call `fetchCategories()` directly.
- No i18n library is used. Arabic labels come from `nameAr` with a `name` fallback.
