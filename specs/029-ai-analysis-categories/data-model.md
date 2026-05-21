# Data Model: AI Analysis Categories

**Feature**: specs/029-ai-analysis-categories
**Date**: 2026-05-21

## Entity: AnalysisCategory

Represents a category of analysis available to the user.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string (UUID) | Yes | Unique per record | **Stable frontend key** for React list rendering and identity checks. |
| `key` | string | Yes | Max 100 chars, unique | **Internal identifier** for selection/filtering (e.g., `\"sales\"`, `\"executive\"`). |
| `name` | string | Yes | Max 100 chars | Default display label (e.g., English). |
| `nameAr` | string | Yes | Max 100 chars | Arabic display label. Prioritized when UI is in Arabic. |
| `description` | string | No | Max 500 chars | Default explanation of the category. |
| `descriptionAr` | string | No | Max 500 chars | Arabic explanation of the category. |
| `icon` | string | No | Max 100 chars | Icon identifier (e.g., Lucide icon name). Gracefully ignored if null/unsupported. |
| `sortOrder` | integer | Yes | Non-negative | **Display order** — lower numbers appear first. |
| `count` | integer | Yes | Non-negative | Number of analysis items available in this category. Displayed on the chip. |
| `isActive` | boolean | No | — | Whether the category is active in the system. |

## Entity: CategoriesResponse

Wrapper returned by the backend endpoint.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `categories` | AnalysisCategory[] | Yes | List of categories, already sorted by `sortOrder` on the server (but re-sorted client-side as a safeguard). |
| `total` | integer | Yes | Total number of categories (for pagination consistency). |

## Relationships

- **AnalysisCategory** → **Analyses**: Each category can contain zero or more analyses (reflected by `count`).
- **AnalysisCategory** → **AnalysisOutput**: Category summaries and insights are scoped to a `categoryId`.

## Frontend State Mapping

### Selected Category

| Usage | Type | Description |
|-------|------|-------------|
| Filter selection | `string` (category `key`) | Used to filter analysis results. `"all"` or `undefined` represents "الكل". |
| Modal selection | `AnalysisCategory \| null` | Full object passed to `CategorySelector` and modal. |

### Display Order

Client-side sort (defensive, in case server ordering drifts):
```typescript
const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
```

### Null Handling Rules

| Field | Null Behavior |
|-------|---------------|
| `icon` | Displayed without icon; layout does not collapse. |
| `description` / `descriptionAr` | No tooltip shown; details panel omits section. |
| `count` | Treated as `0` and badge shows `0`. Category still visible. |
| `nameAr` | Falls back to `name`. |
