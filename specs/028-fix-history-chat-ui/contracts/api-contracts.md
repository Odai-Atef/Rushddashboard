# API Contracts: Fix History Chat UI

**Feature**: Fix History Chat UI
**Date**: 2026-06-14

## Overview

This bug fix does not introduce new API contracts. It relies on existing backend endpoints that are confirmed working. This document records the contracts the frontend depends on.

## Existing Endpoints (No Changes Required)

### GET /api/v1/analysis/history

**Purpose**: Retrieve paginated list of analysis history entries.

**Response**:
```json
{
  "data": [
    {
      "id": "run-uuid",
      "sessionId": "session-uuid",
      "title": "تحليل انخفاض الإيرادات",
      "summary": "Summary text...",
      "status": "COMPLETED",
      "durationMs": 125000,
      "startedAt": "2026-06-14T10:00:00Z",
      "completedAt": "2026-06-14T10:02:05Z",
      "insightsCount": 3,
      "recommendationsCount": 2
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "hasMore": true
  }
}
```

### GET /api/v1/analysis/sessions/{sessionId}/messages

**Purpose**: Retrieve chat message history for a specific session.

**Response**:
```json
[
  {
    "id": "msg-uuid-1",
    "role": "user",
    "content": "تحليل انخفاض الإيرادات",
    "createdAt": "2026-06-14T10:00:00Z",
    "sequenceNo": 1
  },
  {
    "id": "msg-uuid-2",
    "role": "assistant",
    "content": "Assistant response...",
    "createdAt": "2026-06-14T10:01:00Z",
    "sequenceNo": 2
  }
]
```

### POST /api/v1/analysis/streaming-run

**Purpose**: Start a new analysis streaming session.

**Request**:
```json
{
  "analysisItemId": "sales-1",
  "filters": {}
}
```

**Response**:
```json
{
  "sessionId": "session-uuid"
}
```

### POST /api/v1/analysis/follow-up

**Purpose**: Send a follow-up question in an existing session.

**Request**:
```json
{
  "question": "Follow-up question text",
  "sessionId": "session-uuid"
}
```

**Response**:
```json
{
  "answer": "Assistant answer text",
  "sql": "SELECT ...",
  "data": [],
  "fallback": false
}
```

## Frontend Hook Contracts

### useAnalysisStreaming.loadMessages(messages, sessionId)

**Input**:
- `messages`: `StreamMessage[]` — chronological array of chat messages
- `sessionId`: `string` — the session identifier

**Side Effects**:
- Sets `messages` state to the provided array
- Sets `status` to `'complete'`
- Sets `sessionId` to the provided value
- Closes any active EventSource

### useAnalysisHistory.loadSession(runId, sessionId?)

**Input**:
- `runId`: `string` — the history entry ID
- `sessionId`: `string` (optional) — the session ID for fetching messages

**Output**:
- Returns `Promise<StreamMessage[]>` — the loaded messages

**Side Effects**:
- Sets `selectedId` to `runId`
- Calls `getSessionMessages(sessionId)` if available
- Falls back to `getRunDetail(runId)` if messages endpoint fails
