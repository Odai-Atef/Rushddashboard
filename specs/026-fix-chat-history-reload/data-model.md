# Data Model: Fix Chat History Reload

**Date**: 2026-06-13

## Entities

### AnalysisMessage (Backend DTO → Frontend Interface)

Represents an individual chat message record stored by the backend for an analysis session.

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Unique message identifier |
| sessionId | `string` | Parent analysis session ID |
| role | `'user' \| 'assistant' \| 'system'` | Message sender role |
| content | `string` | Raw message text content |
| sequenceNo | `number` | Ordinal for chronological ordering |
| createdAt | `string` (ISO 8601) | Creation timestamp |

**Validation rules**:
- `role` must be one of `user`, `assistant`, `system`. Unknown values gracefully fall back to `assistant`.
- `sequenceNo` must be a non-negative integer. Missing values fall back to `createdAt` ordering.
- `content` may be empty string but not `null` or `undefined`.

### StreamMessage (Existing Frontend Interface — MUST NOT BREAK)

The frontend representation used by the chat UI components.

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Unique frontend-generated message ID |
| role | `'user' \| 'assistant' \| 'system'` | Message sender role |
| content | `string` | Display text content |
| isStreaming | `boolean` (optional) | Whether the message is still being streamed |
| timestamp | `Date` | Display timestamp |
| sql | `string` (optional) | Follow-up SQL query metadata |
| data | `any[]` (optional) | Follow-up data payload |
| fallback | `boolean` (optional) | Whether response used fallback mode |

### AnalysisSessionDetail (Existing Frontend Interface — UPDATED)

Returned by `getRunDetail()` endpoint. Used as fallback data source.

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Analysis run ID |
| title | `string` | Session title |
| status | `AnalysisHistoryStatus` | Session completion status |
| insights | `InsightResponse[]` | Structured insight results |
| results | `AnalysisResult[]` | Structured analysis results |

### InsightResponse (Updated Field Mapping)

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Insight ID |
| title | `string` | Insight heading |
| description | `string` | **(was `content`)** Insight body text |
| type | `string \| null` | Insight category type |

## State Transitions

```
Idle / New Session
    |
    v
User clicks history sidebar item
    |
    v
[Primary] Load AnalysisMessage[] via GET /api/v1/analysis/sessions/{sessionId}/messages
    |
    v
Map AnalysisMessage[] → StreamMessage[]
    |
    v
Pass StreamMessage[] to streaming.loadMessages(messages, sessionId)
    |
    v
Chat panel renders full transcript (isStreaming: false, status: 'complete')
    |
    v
User can send follow-up → uses existing sessionId

Fallback (endpoint unavailable):
    |
    v
[Fallback] Load AnalysisSessionDetail via GET /api/v1/analysis/history/{runId}
    |
    v
Map insights using `description` field (corrected from `content`)
    |
    v
Continue as above
```

## Relationships

```
AnalysisSession (1)
    ├── AnalysisMessage[] (N)  ← Primary source for transcript
    └── Insights[] (N)       ← Fallback source only
```
