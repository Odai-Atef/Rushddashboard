# Data Model: Scale Score Descriptions

**Feature**: Scale Score Descriptions (`specs/061-scale-score-comments`)  
**Date**: 2026-06-22

## Entities

### `EvaluationComment`

A single descriptive comment for an assessment question at a specific maturity tier.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier of the comment record. |
| `dimensionSymbol` | `string` | Dimension code the comment belongs to (e.g., `I2`). |
| `subDimension` | `string` | Sub-dimension key the comment belongs to (e.g., `data`). |
| `tier` | `EvaluationTier` | Maturity tier: `CRITICAL`, `EMERGING`, `MEDIUM`, `ADVANCED`, `PIONEER`. |
| `questionId` | `string` | Identifier of the assessment question this comment describes. |
| `commentAr` | `string` | Arabic description text. |
| `commentEn` | `string` | English description text. |
| `createdAt` | `string (ISO 8601)` | Record creation timestamp. |

### `EvaluationCommentsMap`

A lookup structure returned by the API where each key is a `questionId` and the value is the ordered list of five tier comments.

| Field | Type | Description |
|-------|------|-------------|
| `[questionId: string]` | `EvaluationComment[]` | Array of exactly five comments mapping scores 1-5 to tiers. |

### `EvaluationTier` (enumeration)

- `CRITICAL` → score 1
- `EMERGING` → score 2
- `MEDIUM` → score 3
- `ADVANCED` → score 4
- `PIONEER` → score 5

## Validation Rules

- Every `questionId` in the map must have a non-empty array of comments.
- Each array must contain exactly one comment for each of the five tiers.
- A missing tier for a question means that score description cannot be rendered and the UI must fall back to a safe empty state.

## Relationships

- **AssessmentQuestion** (existing entity, `id`) is referenced by `EvaluationComment.questionId`.
- **EvaluationComment** has no ownership of the question; it is a read-only annotation produced by the backend.

## State Transitions

No mutable state transitions. The comment data is read-only for the frontend:

1. **Loading**: Comments are fetched on page mount.
2. **Ready**: Comments map is held in hook state and used for hover/select lookups.
3. **Error / Missing**: Map may be partial or empty; UI uses fallback rendering.

## Notes

- The backend already defines `EvaluationComments` and `EvaluationTier` types used by the results/evaluation endpoint. We introduce separate `EvaluationComment` types specific to the new `evaluation-comments` endpoint because the response shape differs (per-question record vs. nested `overall`/`perDimension` structure).
