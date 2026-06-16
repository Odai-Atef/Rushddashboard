# Data Model: Assessment Results Display

**Feature**: Assessment Results Display  
**Date**: 2026-06-16

## Entities

### IsivAssessmentResult

The full evaluation result returned by the backend for an organization.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `overallScore` | `number` | Yes | Total score on a fixed 0-120 scale. |
| `qualificationStatus` | `string` | Yes | Backend qualification status value (e.g., `QUALIFIED`, `QUALIFIED_WITH_IMPROVEMENT`, `NOT_QUALIFIED`). |
| `dimensions` | `IsivDimension[]` | Yes | Breakdown of the four ISIV dimensions. |
| `diagnosis` | `string` | Yes | Arabic diagnostic summary text. |
| `strengths` | `string[]` | Yes | List of Arabic strength statements. |
| `weaknesses` | `string[]` | Yes | List of Arabic weakness statements. |

### IsivDimension

A single ISIV dimension inside the result.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dimension` | `string` | Yes | Machine identifier for the dimension (e.g., `institutional_building`). |
| `dimensionLabelAr` | `string` | Yes | Arabic label displayed to the user. |
| `symbol` | `string` | Yes | Single-letter symbol used on the radar chart (e.g., `I`, `S`, `V`). |
| `score` | `number` | Yes | Raw score for the dimension. |
| `percentage` | `number` | Yes | Normalized percentage (0-100) for the dimension. |
| `tier` | `string` | Yes | Tier classification value (e.g., `EMERGING`). |
| `tierLabelAr` | `string` | Yes | Arabic tier label displayed in the badge. |
| `color` | `string` | Yes | Hex color for the dimension (radar stroke/fill and badge). |

### AssessmentStatus

Lightweight status returned by the status endpoint.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `"COMPLETED" \| "IN_PROGRESS" \| "NOT_STARTED"` | Yes | Lifecycle status of the assessment. |
| `overallScore` | `number \| null` | No | Nullable overall score when available. |
| `completedAt` | `ISO 8601 string \| null` | No | Completion timestamp when available. |

## Relationships

- An **Organization** has exactly one latest **IsivAssessmentResult**.
- An **IsivAssessmentResult** contains exactly four **IsivDimension** records.
- The backend owns the mapping table for `dimension` → `symbol`, `dimensionLabelAr`, `tier` → `tierLabelAr`, and `qualificationStatus` → Arabic label.

## Validation Rules

- `overallScore` MUST be between 0 and 120 inclusive.
- `dimensions` MUST contain exactly four items.
- Each `percentage` SHOULD be between 0 and 100 inclusive.
- `strengths` and `weaknesses` MAY be empty arrays but MUST NOT be `null`.
- The frontend renders whatever values the backend returns; it does not validate taxonomy enum values.

## Frontend State Shape

```typescript
interface IsivDimension {
  dimension: string;
  dimensionLabelAr: string;
  symbol: string;
  score: number;
  percentage: number;
  tier: string;
  tierLabelAr: string;
  color: string;
}

interface IsivAssessmentResult {
  overallScore: number;
  qualificationStatus: string;
  dimensions: IsivDimension[];
  diagnosis: string;
  strengths: string[];
  weaknesses: string[];
}

interface AssessmentStatus {
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  overallScore: number | null;
  completedAt: string | null;
}
```

## State Transitions

1. **Not Started**: User has not submitted the assessment; status is `NOT_STARTED` and no result exists.
2. **In Progress**: User submits documents; frontend calls `submitAssessment`, then immediately calls `getAssessmentResults`. UI shows loading state.
3. **Completed**: Results endpoint returns `IsivAssessmentResult`; UI switches to `results` view and stores the result in component state.
4. **Returning User**: On mounting the results view, frontend calls `getAssessmentStatus`; if `COMPLETED`, it fetches and displays the persisted result.
5. **Evaluation Failure**: If `getAssessmentResults` fails after submit, UI shows an Arabic error message and a manual retry button that retries only the results fetch.
