# Contract: Evaluation Comments API

**Feature**: Scale Score Descriptions (`specs/061-scale-score-comments`)  
**Date**: 2026-06-22  
**Endpoint**: `GET /api/v1/onboarding/evaluation-comments`

## Request

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | `string (UUID)` | Yes | Organization identifier whose assessment comments should be returned. |

### Headers

- `Authorization: Bearer <token>` (provided by the API client)
- `Accept: application/json`
- `Content-Type: application/json`

## Response

### Success — `200 OK`

```json
{
  "success": true,
  "data": {
    "058d1919-166c-419e-be1d-59dc81c747bc": [
      {
        "id": "cmqmujvjt003sh5i6ko43m0qu",
        "dimensionSymbol": "I2",
        "subDimension": "data",
        "tier": "CRITICAL",
        "questionId": "058d1919-166c-419e-be1d-59dc81c747bc",
        "commentAr": "البيانات غير منظمة",
        "commentEn": "Data is unorganized",
        "createdAt": "2026-06-20T21:05:22.554Z"
      },
      {
        "id": "cmqmujvju003uh5i6is7rivfe",
        "dimensionSymbol": "I2",
        "subDimension": "data",
        "tier": "EMERGING",
        "questionId": "058d1919-166c-419e-be1d-59dc81c747bc",
        "commentAr": "بيانات أولية منظمة",
        "commentEn": "Data is emerging and somewhat organized",
        "createdAt": "2026-06-20T21:05:22.555Z"
      },
      {
        "id": "cmqmujvjv003wh5i6cr4mdvhx",
        "dimensionSymbol": "I2",
        "subDimension": "data",
        "tier": "MEDIUM",
        "questionId": "058d1919-166c-419e-be1d-59dc81c747bc",
        "commentAr": "بيانات متوسطة",
        "commentEn": "Data is moderately organized",
        "createdAt": "2026-06-20T21:05:22.555Z"
      }
    ]
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Indicates whether the request succeeded. |
| `data` | `object` | Map of `questionId` → array of `EvaluationComment` objects. |
| `data[questionId]` | `EvaluationComment[]` | Five comments mapping scores 1-5 to tiers. |

### Error Responses

- `401 Unauthorized` — Session expired; the API client will redirect to login.
- `403 Forbidden` — User does not have access to the organization.
- `404 Not Found` — Organization or comments not found.
- `500/502/503/504` — Server error; UI must fall back to empty descriptions.

## Frontend Consumer Contract

- The frontend will call this endpoint once per assessment page mount for a given `organizationId`.
- The frontend will map the visible score (1-5) to a tier as follows:
  - `1` → `CRITICAL`
  - `2` → `EMERGING`
  - `3` → `MEDIUM`
  - `4` → `ADVANCED`
  - `5` → `PIONEER`
- The frontend will prefer `commentAr`; if unavailable it may fall back to `commentEn`.
- The frontend must not block the assessment UI if the endpoint fails or returns partial data.
