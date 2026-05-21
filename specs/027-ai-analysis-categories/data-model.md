# Data Model: AI Analysis Dynamic Categories

## AnalysisCategory

Represents a single analysis filter domain returned by the backend.

| Field         | Type      | Required | Description                                      |
|---------------|-----------|----------|--------------------------------------------------|
| id            | string    | Yes      | UUID stable identifier                           |
| key           | string    | Yes      | Internal category key (e.g., "sales", "customers") |
| name          | string    | Yes      | Category name in English                         |
| nameAr        | string    | Yes      | Category name in Arabic                          |
| description   | string    | No       | Optional category description in English         |
| descriptionAr | string    | No       | Optional category description in Arabic          |
| icon          | string    | No       | Lucide icon name (e.g., "TrendingUp")            |
| sortOrder     | integer   | Yes      | Display order (ascending)                        |
| count         | integer   | No       | Number of analysis items in this category        |

## Frontend DTOs

### AnalysisCategory

```typescript
interface AnalysisCategory {
  id: string;
  key: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  sortOrder: number;
  count?: number;
}
```

### CategoryFilterSelection

```typescript
interface CategoryFilterSelection {
  key: 'all' | string;  // 'all' for aggregate, category key otherwise
  label: string;
  count?: number;
}
```

## Data Flow

1. On mount, `AIAnalysisPage` calls `analysisService.getCategories()`.
2. Service returns `{ categories: AnalysisCategory[], total: number }`.
3. Page stores `categories` in local component state via `useState`.
4. Page derives `filterCategories` by prepending the aggregate `"الكل"` option to the API list.
5. Each category chip maps:
   - `key: category.key`
   - label: `nameAr` (Arabic UI) or `name`
   - badge: `count`
   - order: `sortOrder`
6. When a chip is clicked, `selectedCategory` is set to the `key`.
7. `activeAnalysis` / `analysisCards` filtering logic uses the same `key` mapping.

## Validation

- `sortOrder` MUST be non-negative integers.
- `key` MUST be non-empty and URL-safe.
- `name` and `nameAr` MUST be non-empty strings.
- `count` defaults to `0` when absent.
