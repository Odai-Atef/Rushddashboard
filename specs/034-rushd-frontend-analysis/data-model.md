# Data Model: AI Analysis API-Driven Category Filters

**Date**: 2026-06-08
**Feature**: AI Analysis API-Driven Category Filters

## Entity: Category (API Response)

Represents a single analysis category returned by the backend.

| Field           | Type                     | Required | Description                                      |
|-----------------|--------------------------|----------|--------------------------------------------------|
| id              | string                   | Yes      | Unique identifier                                |
| key             | string                   | Yes      | Stable machine-friendly identifier               |
| name            | string                   | Yes      | Human-readable display name                      |
| nameAr          | object / null            | No       | Localized name (Arabic) if applicable            |
| description     | object / null            | No       | Human-readable description                       |
| descriptionAr   | object / null            | No       | Localized description (Arabic) if applicable     |
| icon            | object / null            | No       | Icon metadata (structure TBD if used later)      |
| sortOrder       | number                   | Yes      | Numeric display order (ascending)                |
| count           | number                   | No       | Number of analyses in this category              |

## Entity: AnalysisCard (Existing)

Adapted from `AIAnalysisPage.tsx` to reflect the category relationship.

| Field           | Type                          | Required | Description                                      |
|-----------------|-------------------------------|----------|--------------------------------------------------|
| id              | string                        | Yes      | Unique identifier                                |
| title           | string                        | Yes      | Card title                                       |
| description     | string                        | Yes      | Description text                                 |
| category        | string                        | Yes      | Category name (must align with Category.key)     |
| estimatedTime   | string                        | Yes      | Text describing time commitment                  |
| complexity      | string enum                   | Yes      | Complexity badge value                           |
| impact          | string enum                   | Yes      | Impact badge value                               |
| icon            | any (Lucide icon component)   | Yes      | Icon used in the card                            |
| color           | string (Tailwind gradient)    | Yes      | Gradient class for card icon background          |
| recommended     | boolean                       | No       | Whether this card is recommended                 |
| trending        | boolean                       | No       | Whether this card is trending                    |
| aiGenerated     | boolean                       | No       | Whether this card is AI-generated                |

## State Shape: useAnalysisCategories Hook

| Field           | Type                                | Description                                      |
|-----------------|-------------------------------------|--------------------------------------------------|
| categories      | `Category[]`                        | Sorted list of categories from the backend       |
| isLoading       | boolean                             | Whether the fetch is in progress                 |
| error           | `Error \| null`                     | Error object if fetch failed                     |
| retry           | `() => void`                        | Function to retry the fetch                      |
| selectedCategory| string                              | Currently selected category key or "all"         |
| setSelectedCategory | `(key: string) => void`         | Setter to change selected category               |

## Validation Rules

- `sortOrder` must be a finite number. Invalid or missing values default to `Number.MAX_SAFE_INTEGER` (push to end).
- `key` must be non-empty. Duplicate keys in the backend response are treated as-is (rare edge case; frontend does not deduplicate).
- `name` must be non-empty. Empty names are filtered out before rendering.
- Filtering intersection: a card matches when `category === selectedCategory`.

## Relationships

- **Category → AnalysisCard**: One-to-many. A Category.key maps to zero or more AnalysisCard.category values.
- **"All" is a pseudo-category**: Not represented in the API. It is a UI construct meaning `selectedCategory === 'all'` and disables category filtering.
