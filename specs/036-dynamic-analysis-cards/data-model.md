# Data Model: Dynamic Analysis Cards

**Feature**: Dynamic Analysis Cards in Modal
**Date**: 2026-06-08

---

## AnalysisLibraryItem

Represents a single analysis type available in the library, returned by the backend per category or in aggregate.

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| **id** | `string` (UUID) | Required, unique | Backend-assigned identifier |
| **categoryId** | `string` (UUID) | Required | References the parent `Category` |
| **key** | `string` | Required, unique | Machine-readable slug (e.g. `customer-churn`) |
| **title** | `string` | Required | English display title |
| **titleAr** | `string \| null` | Optional | Arabic display title |
| **description** | `string \| null` | Optional | English description |
| **descriptionAr** | `string \| null` | Optional | Arabic description |
| **complexity** | `string` | Required | Complexity label (e.g. `بسيط`, `متوسط`, `متقدم`) |
| **impact** | `string` | Required | Impact label (e.g. `منخفض`, `متوسط`, `عالي`, `حرج`) |
| **duration** | `string` | Required | Human-readable estimated duration |
| **badges** | `string[]` | Required | Arbitrary badge labels (e.g. `موصى به`, `رائج`, `AI`) |
| **sortOrder** | `number` | Required | Display order ascending |
| **isActive** | `boolean` | Required | If `false`, item must not be rendered |
| **icon** | `string` | Required | Icon name to resolve via `icon-map.ts` |
| **iconBackground** | `string` | Required | Tailwind gradient classes (e.g. `from-red-500 to-pink-600`) |

### Validation Rules
- `isActive === false` ⇒ excluded from UI entirely.
- Rendered list MUST be sorted by `sortOrder` ascending.
- `icon` MUST resolve to a known `LucideIcon`; otherwise a fallback icon is rendered.

---

## Category (Existing — referenced for relationships)

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| **id** | `string` (UUID) | Required | Backend-assigned identifier |
| **key** | `string` | Required | Machine-readable slug |
| **name** | `string` | Required | English name |
| **nameAr** | `string \| null` | Optional | Arabic name |
| **sortOrder** | `number` | Required | Filter button order |

### Relationships
- `Category` 1 → N `AnalysisLibraryItem` (via `categoryId`)
- UI filter selection passes `Category.id` to the library-items endpoint.

---

## UI View Model Transformation

The modal card component consumes a slightly shaped object derived from `AnalysisLibraryItem`:

| View Field | Source |
|------------|--------|
| `displayTitle` | `titleAr \|\| title` |
| `displayDescription` | `descriptionAr \|\| description \|\| ''` |
| `iconComponent` | `resolveIcon(icon)` from `icon-map.ts` |
| `gradientClasses` | `iconBackground` (applied as `className`) |
| `badgeList` | `badges` array mapped to badge chips |

No persistent state transformation is needed beyond runtime filtering/sorting.
