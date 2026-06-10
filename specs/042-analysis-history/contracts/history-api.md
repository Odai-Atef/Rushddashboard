# History API Contract

**Feature**: AI Analysis History Replay  
**Base Path**: `/api/v1/analysis`

## Endpoints

### 1. List Analysis History

**Request**:
```
GET /api/v1/analysis/history?page=1&limit=20
Authorization: Bearer {jwt}
```

**Query Parameters**:
- `page` (number, optional): Page number (default 1)
- `limit` (number, optional): Items per page (default 20, max 100)

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "...",
      "summary": "...",
      "status": "COMPLETED",
      "durationMs": 45000,
      "startedAt": "2026-06-10T10:30:00Z",
      "completedAt": "2026-06-10T10:30:45Z",
      "insightsCount": 3,
      "recommendationsCount": 2
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Generic server error

### 2. Get Session Detail

**Request**:
```
GET /api/v1/analysis/history/:runId
Authorization: Bearer {jwt}
```

**Path Parameters**:
- `runId` (string, required): Unique run identifier

**Response** (200 OK):
```json
{
  "id": "uuid",
  "title": "...",
  "status": "COMPLETED",
  "insights": [
    {
      "id": "insight-1",
      "title": "...",
      "content": "...",
      "type": "..."
    }
  ],
  "results": [
    {
      "id": "result-1",
      "insightText": "...",
      "dimensionData": { ... },
      "recommendationText": "..."
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Generic server error

### 3. Follow-Up Question

**Request**:
```
POST /api/v1/analysis/follow-up
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "question": "...",
  "sessionId": "uuid"
}
```

**Response** (200 OK):
```json
{
  "answer": "...",
  "sql": "...",
  "data": [...],
  "fallback": false
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Generic server error

## Status Values

| Status | Meaning | Badge Color |
|--------|---------|-------------|
| COMPLETED | Analysis finished successfully | Green |
| RUNNING | Analysis is still in progress | Blue |
| FAILED | Analysis encountered an error | Red |
| PENDING | Analysis has not started yet | Gray |

## Preview Derivation

The preview text for a history list item is derived from the first result's `insightText`, truncated to the first 100 characters. If no results exist, the `summary` field is used as fallback.
