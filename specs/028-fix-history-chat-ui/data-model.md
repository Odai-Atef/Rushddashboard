# Data Model: Fix History Chat UI

**Feature**: Fix History Chat UI
**Date**: 2026-06-14

## Existing Entities

No new entities are introduced. The fix operates on existing React component state.

### AnalysisHistoryEntry

Already defined in `useAnalysisHistory.ts`:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the history entry (runId) |
| sessionId | string \| null | Session ID for fetching messages |
| title | string | Display title in the sidebar |
| summary | string \| null | Short preview text |
| status | AnalysisHistoryStatus | 'COMPLETED' \| 'RUNNING' \| 'FAILED' \| 'PENDING' |
| durationMs | number \| null | Execution duration |
| startedAt | string | ISO timestamp |
| completedAt | string \| null | ISO timestamp |
| insightsCount | number \| null | Number of insights |
| recommendationsCount | number \| null | Number of recommendations |

### StreamMessage

Already defined in `useAnalysisStreaming.ts`:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique message ID |
| role | 'user' \| 'assistant' \| 'system' | Message sender |
| content | string | Message body |
| isStreaming | boolean \| undefined | Whether the message is still streaming |
| timestamp | Date | Message timestamp |
| sql | string \| undefined | Optional SQL query |
| data | any[] \| undefined | Optional data payload |
| fallback | boolean \| undefined | Whether this is a fallback response |

### AnalysisCard

Already defined in `AIAnalysisPage.tsx`:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| title | string | Display title |
| description | string | Description text |
| category | string | Category name |
| estimatedTime | string | Estimated duration |
| complexity | 'بسيط' \| 'متوسط' \| 'متقدم' | Complexity level |
| impact | 'منخفض' \| 'متوسط' \| 'عالي' \| 'حرج' | Impact level |
| icon | any | Lucide icon component |
| color | string | Tailwind gradient class |

## State Transitions

```
Initial State:
  activeAnalysis = null
  history.selectedId = null
  streaming.status = 'idle'

New Analysis Flow:
  handleStartAnalysis(card) → activeAnalysis = card, streaming.status = 'connecting' → 'streaming' → 'complete'

History Load Flow (CURRENT BUG):
  handleHistoryItemClick(itemId) → activeAnalysis = null (BUG: should not hide UI)
  streaming.loadMessages() → streaming.status = 'complete', streaming.sessionId = sessionId

History Load Flow (FIXED):
  handleHistoryItemClick(itemId) → activeAnalysis = null (acceptable)
  streaming.loadMessages() → streaming.status = 'complete', streaming.sessionId = sessionId
  Workspace shows chat UI because isHistoricalSessionLoaded = true
```
