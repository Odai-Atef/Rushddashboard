# SSE Event Contract

**Feature**: AI Analysis Real-Time Streaming  
**Endpoint**: `GET /api/v1/analysis/stream/{sessionId}?token={jwt}`  
**Protocol**: Server-Sent Events (SSE)

## Connection

The client opens an `EventSource` to the endpoint above. The JWT token is passed as a query parameter because `EventSource` does not support custom HTTP headers.

## Event Types

### 1. Token Event
Sent repeatedly as the backend generates each token of the analysis text.

```json
{
  "type": "token",
  "content": "...token text..."
}
```

**Fields**:
- `type`: Always `"token"`
- `content`: The token string to append to the current assistant message

### 2. Complete Event
Sent once when the backend has finished generating the full analysis.

```json
{
  "type": "complete"
}
```

**Behavior**: The client transitions the session status to `complete` and marks the current assistant message as no longer streaming.

### 3. Error Event
Sent if the backend encounters an error during streaming.

```json
{
  "type": "error",
  "message": "...error description..."
}
```

**Behavior**: The client transitions the session status to `error`, closes the `EventSource`, and displays the error message to the user in Arabic.

## Connection Lifecycle

| Phase | Client State | UI Indicator |
|-------|-------------|--------------|
| Request sent | `connecting` | Loading skeleton |
| SSE open | `streaming` | Progress steps active |
| Token received | `streaming` | Text appended live |
| Complete received | `complete` | Progress done, chat enabled |
| Error received | `error` | Arabic error banner |
| Connection lost | `error` | Arabic error banner |
| Stop clicked | `complete` | Text retained, chat disabled |

## Error Handling

- If the `EventSource` fires `onerror` without a preceding `error` event, the client should treat it as a connection failure.
- The client must always close the `EventSource` when the component unmounts, the user stops the stream, or an error/complete event is received.
- No automatic reconnection is implemented; the user must trigger a new analysis or regenerate.
