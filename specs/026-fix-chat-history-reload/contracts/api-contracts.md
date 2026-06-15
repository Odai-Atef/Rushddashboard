# API Contracts: Fix Chat History Reload

**Date**: 2026-06-13

## New Endpoint: Get Session Messages

### Request

```
GET /api/v1/analysis/sessions/{sessionId}/messages
Authorization: Bearer <token>
```

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sessionId | `string` (UUID) | Yes | The analysis session ID |

### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "msg-001",
      "sessionId": "session-123",
      "role": "user",
      "content": "تحليل انخفاض الإيرادات",
      "sequenceNo": 0,
      "createdAt": "2025-06-13T10:00:00Z"
    },
    {
      "id": "msg-002",
      "sessionId": "session-123",
      "role": "assistant",
      "content": "بناءً على تحليل بيانات المبيعات...",
      "sequenceNo": 1,
      "createdAt": "2025-06-13T10:00:15Z"
    },
    {
      "id": "msg-003",
      "sessionId": "session-123",
      "role": "user",
      "content": "ما هي الأسباب الرئيسية؟",
      "sequenceNo": 2,
      "createdAt": "2025-06-13T10:05:00Z"
    },
    {
      "id": "msg-004",
      "sessionId": "session-123",
      "role": "assistant",
      "content": "الأسباب الرئيسية لانخفاض الإيرادات هي...",
      "sequenceNo": 3,
      "createdAt": "2025-06-13T10:05:20Z"
    }
  ]
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Unique message identifier |
| sessionId | `string` | Parent analysis session ID |
| role | `string` | One of: `user`, `assistant`, `system` |
| content | `string` | Message text content |
| sequenceNo | `number` | Zero-based ordering index within session |
| createdAt | `string` (ISO 8601) | Message creation timestamp |

### Error Responses

| Status | Code | Condition |
|--------|------|-----------|
| 404 | `SESSION_NOT_FOUND` | Session ID does not exist |
| 401 | `UNAUTHORIZED` | Missing or invalid auth token |

## Existing Endpoint: Get Run Detail (Fallback)

No contract changes. The frontend will continue calling:

```
GET /api/v1/analysis/history/{runId}
```

But the frontend `AnalysisSessionDetail` interface must map `insight.content` to `insight.description` to match the actual backend DTO.

**Corrected Frontend DTO (was `content`, now `description`)**:

```typescript
interface InsightResponse {
  id: string;
  title: string;
  description: string;  // ← was content
  type: string | null;
}
```

## Frontend Service Contract

### `analysisService.getSessionMessages(sessionId: string)`

**Returns**: `Promise<ApiResponse<AnalysisMessage[]>>`

**Behavior**:
- Calls `GET /api/v1/analysis/sessions/{sessionId}/messages`
- Returns typed array of `AnalysisMessage`
- Propagates HTTP errors (404, 401) as typed `ApiError`

### `useAnalysisHistory.loadSession(runId: string)`

**Behavior (updated)**:
1. Call `analysisService.getSessionMessages(sessionId)` where `sessionId` is derived from history entry (TBD: may need to store sessionId on history entries).
2. If successful (200): map `AnalysisMessage[]` → `StreamMessage[]` via `messagesToStreamMessages()`.
3. If 404 or endpoint unavailable: fall back to `analysisService.getRunDetail(runId)`, map using corrected `description` field.
4. Return `StreamMessage[]`.

### `useAnalysisStreaming.loadMessages(messages: StreamMessage[], sessionId: string)`

**Unchanged contract**. Must continue accepting `StreamMessage[]` and `sessionId: string`, setting internal state to:
- `messages` = provided array
- `status` = `'complete'`
- `sessionId` = provided value
- `error` = `null`
