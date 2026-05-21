# Research: AI Analysis Dynamic Categories

## Date
2026-05-21

## Findings

### 1. Existing Category Service
The frontend already has `src/app/services/analysis.ts` with a `getCategories()` function that calls:
```
GET /analysis/categories?limit=20&offset=0
```
It returns `CategoriesResponse` and validates it via Zod. The endpoint path is prefixed with `ANALYSIS_BASE_URL = '/analysis'`, which maps via `api.ts` to `VITE_API_BASE_URL` + `/analysis`.

**Decision**: Reuse the existing service; add a direct `getCategoriesFlat()` function if the hook wants a flat array without the wrapper object.

### 2. Existing `CategorySelector`
`src/app/components/analysis/CategorySelector.tsx` already accepts:
- `categories: AnalysisCategory[]`
- `selectedCategory: AnalysisCategory | null`
- `onSelectCategory: (category: AnalysisCategory) => void`
- `isLoading?: boolean`

It renders loading skeletons, but does **not** yet render a `count` badge or the `"الكل"` aggregate chip.

**Decision**: Extend `CategorySelector` to accept an aggregate chip shape (e.g., `allOption`) and render count badges. Alternatively, compose the aggregate outside the component. Given the constitution limit of 300 lines, it is cleaner to let the parent (`AIAnalysisPage`) build the array of category objects to pass in, including `"الكل"`.

### 3. Existing Types: `AnalysisCategory`
`src/app/types/analysis.ts` defines:
```typescript
export const AnalysisCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  nameAr: z.string().max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
});
```

The spec requires additional fields: `key`, `count`, `descriptionAr`.

**Decision**: Update the Zod schema and TypeScript type to include `key`, `count`, and `descriptionAr`.

### 4. Icon Mapping Strategy
The spec lists `icon` as an optional string. The existing UI uses Lucide React icons imported directly. The `icon` from the API could be a Lucide icon name (e.g., "TrendingUp") rather than a URL/SVG source.

**Decision**: Implement a safe icon mapping utility that dynamically imports Lucide icons by name, with a fallback if the name is absent or unrecognized.

### 5. Localization Strategy
The API provides `nameAr` for Arabic display. The current UI appears to be Arabic-first (RTL context). `CategorySelector.tsx` already uses `category.nameAr || category.name`.

**Decision**: Continue using `nameAr || name` in the Arabic UI, with no new i18n framework needed for this scope.

### 6. Error/Loading Handling
The existing service (`analysis.ts`) uses `apiFetch` + Zod schema parsing. If the backend response does not match the schema, `parse` throws a `ZodError`, which will appear as an unhandled error in the UI unless caught.

**Decision**: The new `useCategories` hook must wrap the service call in `try/catch`, surface a user-friendly error, and provide a retry function.

### 7. `sortOrder` Handling
Categories MUST be ordered by `sortOrder` ascending.

**Decision**: Sort categories inside the `useCategories` hook with `.sort((a, b) => a.sortOrder - b.sortOrder)` to guarantee order even if the backend returns them in a different order.

### 8. Potential Issue: Page Size
`AIAnalysisPage.tsx` is currently ~1,180 lines. The constitution requires no file exceeding 300 lines without justification.

**Decision**: Extract category-related logic into the new `useCategories` hook and reuse `CategorySelector`. The page itself should shrink significantly when the hardcoded array and all category-related local state is moved to the hook.

## Open Decisions

| Decision | Recommendation | Notes |
|----------|---------------|-------|
| Aggregate `"الكل"` count | Compute from `categories.reduce((sum, c) => sum + (c.count || 0), 0)` in the parent and pass it to the chip | Keeps count semantics aligned with API data |
| `key` vs `id` for filtering | Continue using the category `key` string | Matches spec requirement; API contract gives both `id` and `key` |
| Icon rendering | Safe dynamic icon lookup utility | Prevents crashes if API sends unknown icon names |
