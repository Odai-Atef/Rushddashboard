# Data Model: AI Analysis Streaming

**Feature**: AI Analysis Real-Time Streaming  
**Date**: 2026-06-10

## Entities

### StreamMessage
Represents a single message in the analysis conversation thread.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique message identifier (client-generated) |
| role | 'user' | 'assistant' | 'system' | Yes | Sender of the message |
| content | string | Yes | Message body text (Arabic or English) |
| isStreaming | boolean | No | Whether the message is still receiving tokens |
| timestamp | Date | Yes | When the message was created |
| sql | string | No | SQL query returned in a follow-up response |
| data | any[] | No | Structured data returned in a follow-up response |
| fallback | boolean | No | Whether the answer is a fallback when the backend cannot answer |

### AnalysisSession
Represents the lifecycle state of a single streaming analysis.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sessionId | string | Yes | Unique session identifier returned by the backend |
| analysisRunId | string | Yes | Identifier for the specific analysis run |
| status | StreamingStatus | Yes | Current lifecycle state |
| messages | StreamMessage[] | Yes | Conversation history |
| error | string \| null | No | Arabic error message if the stream fails |

### StreamingStatus (enum)
- `idle`: No active session
- `connecting`: POST streaming-run sent, waiting for SSE connection
- `streaming`: SSE connection open, tokens arriving
- `complete`: Stream finished successfully
- `error`: Stream or connection failed

## State Transitions

```text
idle --[startAnalysis()]--> connecting --[SSE open]--> streaming --[complete event]--> complete
                                                          |
                                                          |--[stopStreaming()]--> complete
                                                          |--[error event]--> error
                                                          |--[navigate away / abort]--> idle

complete --[sendFollowUp()]--> complete  (appends new messages)
complete --[regenerate / reset]--> idle --[startAnalysis()]--> connecting
error --[reset()]--> idle
```

## Relationships

- An **AnalysisSession** contains zero or more **StreamMessage** entries.
- The first `assistant` message in a session represents the initial analysis text.
- Subsequent `user` + `assistant` pairs represent follow-up question/answer exchanges.
- A **stopped stream** results in a `complete` status with the partially rendered message retained as a persistent `assistant` message.

## External Data (from backend)

### Filter
Passed to `streaming-run` endpoint.

| Field | Type | Description |
|-------|------|-------------|
| date_from | string (ISO date) | Start of analysis date range |
| date_to | string (ISO date) | End of analysis date range |
| limit | number | Maximum rows to analyze |

### StreamingRun Response
Returned by POST `/api/v1/analysis/streaming-run`.

| Field | Type | Description |
|-------|------|-------------|
| analysisRunId | string | Run identifier |
| sessionId | string | Session identifier for SSE connection |
| status | string | Initial status |
| isNew | boolean | Whether this is a new run |

### SSE Event Payloads

**Token event**:
```json
{
  "type": "token",
  "content": "..."
}
```

**Complete event**:
```json
{
  "type": "complete"
}
```

**Error event**:
```json
{
  "type": "error",
  "message": "..."
}
```

### FollowUp Response
Returned by POST `/api/v1/analysis/follow-up`.

| Field | Type | Description |
|-------|------|-------------|
| answer | string | Textual answer |
| sql | string | Optional SQL query |
| data | any[] | Optional structured data |
| fallback | boolean | Whether this is a fallback response |
