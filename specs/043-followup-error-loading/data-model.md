# Data Model: Follow-up Chat Error Handling

**Date**: 2025-06-13

## Entities

### StreamingStatus (existing enum)
```
'type StreamingStatus = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error';`
```
- Used by `sendFollowUp()` to communicate loading and error states.
- **New usage**: `sendFollowUp()` sets `'streaming'` at start and `'complete'` or `'error'` at end.

### StreamMessage (existing interface)
```
interface StreamMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
  sql?: string;
  data?: any[];
  fallback?: boolean;
}
```
- **New usage**: On error, the last assistant message's `content` is updated with the error text and `isStreaming` is set to `false`.

### AIAnalysisPage Component State (new local state)
```
pendingRetryQuestion: string | null
```
- Holds the last failed follow-up question text so the retry button can re-send it without user retyping.

## State Transitions

```
[User clicks submit]
  → sendFollowUp() begins
    → status = 'streaming'
    → isLoading = true
    → input + button disabled

[Response succeeds]
  → status = 'complete'
  → isLoading = false
  → assistant message updated with answer

[Response fails]
  → status = 'error'
  → isLoading = false
  → error state populated
  → assistant message updated with error text, isStreaming = false
  → pendingRetryQuestion set to failed question

[User clicks retry]
  → pendingRetryQuestion sent via sendFollowUp()
  → pendingRetryQuestion cleared
  → banner hidden
```
