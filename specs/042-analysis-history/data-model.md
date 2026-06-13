# Data Model: AI Analysis History Replay

**Feature**: AI Analysis History Replay  
**Date**: 2026-06-10

## Entities

### AnalysisHistoryEntry
Represents a summary of a past analysis session returned by the history list endpoint.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique run identifier |
| title | string | Yes | Human-readable session title |
| summary | string | No | Brief description of the analysis |
| status | 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING' | Yes | Lifecycle state |
| durationMs | number | No | Total duration in milliseconds |
| startedAt | string (ISO date) | Yes | Timestamp when the session began |
| completedAt | string (ISO date) | No | Timestamp when the session finished |
| insightsCount | number | No | Number of insights generated |
| recommendationsCount | number | No | Number of recommendations generated |

### AnalysisSessionDetail
Represents full session data including results, returned by the detail endpoint.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Run identifier |
| title | string | Yes | Session title |
| status | string | Yes | Session state |
| insights | AnalysisInsight[] | No | Array of insight objects |
| results | AnalysisResult[] | No | Array of result objects |

### AnalysisInsight
A single insight from a historical session.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique insight identifier |
| title | string | Yes | Insight title |
| content | string | Yes | Full insight text |
| type | string | No | Insight category/type |

### AnalysisResult
A single result from a historical session.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique result identifier |
| insightText | string | Yes | Full textual insight |
| dimensionData | Record<string, any> | No | Structured data for chart rendering |
| recommendationText | string | No | Textual recommendation |

### HistoryPaginationState
Tracks pagination state for the history sidebar.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| page | number | Yes | Current page number |
| limit | number | Yes | Items per page (default 20) |
| total | number | No | Total number of history entries |
| hasMore | boolean | Yes | Whether more pages are available |
| isLoading | boolean | Yes | Whether a page fetch is in progress |

### HistoryListState
Represents the complete state of the history sidebar.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entries | AnalysisHistoryEntry[] | Yes | List of loaded history entries |
| pagination | HistoryPaginationState | Yes | Pagination state |
| error | string | No | Error message if fetch failed |
| selectedId | string | No | ID of the currently selected history item |

## State Transitions

```text
idle --[page mounts]--> loading --[success]--> loaded
                          |
                          |--[empty]--> empty
                          |
                          |--[error]--> error --[retry]--> loading

loaded --[scroll to bottom + hasMore]--> loadingMore --[success]--> loaded
                                                    |
                                                    |--[error]--> loaded (error shown inline)

loaded --[click item]--> loadingDetail --[success]--> sessionLoaded
                              |
                              |--[error]--> loaded (error shown inline)

sessionLoaded --[send follow-up]--> loaded (with new message appended)
sessionLoaded --[start new analysis]--> idle (new live stream)
```

## Relationships

- A **HistoryListState** contains zero or more **AnalysisHistoryEntry** items.
- An **AnalysisSessionDetail** contains zero or more **AnalysisInsight** and **AnalysisResult** entries.
- Each **AnalysisResult** can be converted to one or more **StreamMessage** objects for display in the chat area.
- **AnalysisHistoryEntry** is a summary; **AnalysisSessionDetail** is the full record.
- Follow-up questions are sent using the `sessionId` from the **AnalysisSessionDetail**.

## External Data (from backend)

### History List Response
Returned by GET `/api/v1/analysis/history?page={page}&limit={limit}`.

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "تحليل انخفاض الإيرادات",
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

### Session Detail Response
Returned by GET `/api/v1/analysis/history/:runId`.

```json
{
  "id": "uuid",
  "title": "تحليل انخفاض الإيرادات",
  "status": "COMPLETED",
  "insights": [
    {
      "id": "insight-1",
      "title": "انخفاض الإيرادات",
      "content": "...",
      "type": "revenue"
    }
  ],
  "results": [
    {
      "id": "result-1",
      "insightText": "بناءً على تحليل البيانات الشامل...",
      "dimensionData": { "months": [...], "revenue": [...] },
      "recommendationText": "نوصي بتحسين معدل التحويل..."
    }
  ]
}
```

### Message Conversion
Historical results are converted to `StreamMessage` objects:

- Each `insightText` → `assistant` message with full content
- Each `recommendationText` → `assistant` message with full content
- All messages have `isStreaming: false` (no token replay)
- `timestamp` is set to the session's `completedAt` or `startedAt`
