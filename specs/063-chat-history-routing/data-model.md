# Data Model: Chat History Routing

## Entities

### Chat / Analysis Session

Represents a single AI analysis conversation that can be resumed or reviewed.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique run identifier used in the URL (`:chatId`). |
| `sessionId` | string \| null | Backend session identifier used to fetch messages. May be null for older runs. |
| `title` | string | Display title shown in the history list and workspace header. |
| `summary` | string \| null | Short preview text used in the history list. |
| `status` | `'COMPLETED' \| 'RUNNING' \| 'FAILED' \| 'PENDING'` | Lifecycle state of the analysis. |
| `durationMs` | number \| null | Total execution duration in milliseconds. |
| `startedAt` | string \| null | ISO timestamp when the analysis started. |
| `completedAt` | string \| null | ISO timestamp when the analysis finished. |
| `createdAt` | string \| null | ISO timestamp when the record was created. |
| `insightsCount` | number \| null | Number of generated insights. |
| `recommendationsCount` | number \| null | Number of generated recommendations. |

### Chat Message

A single turn in a chat/analysis session.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique message identifier. |
| `sessionId` | string | Parent session identifier. |
| `role` | `'user' \| 'assistant' \| 'system'` | Message author. |
| `content` | string | Message text/markdown content. |
| `messageType` | string \| undefined | Optional backend classification. |
| `sequenceNo` | number | Order within the session. |
| `isStreaming` | boolean \| undefined | Whether the message is still streaming. |
| `data` | any \| undefined | Optional structured data payload. |
| `createdAt` | string | ISO timestamp. |

### History Entry (View Model)

Derived from `AnalysisHistoryEntry`; displayed in the left sidebar.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Same as Chat id; used for routing and active state. |
| `title` | string | Display title. |
| `date` | string | Localized date portion of `startedAt`/`createdAt`. |
| `time` | string | Localized time portion. |
| `preview` | string | Truncated summary text. |
| `status` | `'COMPLETED' \| 'RUNNING' \| 'FAILED' \| 'PENDING'` | Status badge value. |

## Relationships

- A **History Entry** corresponds to exactly one **Chat / Analysis Session** (one-to-one by `id`).
- A **Chat / Analysis Session** contains zero or more **Chat Messages** (one-to-many by `sessionId` when available; otherwise loaded from run detail fallback).

## State Transitions

| From State | Trigger | To State |
|------------|---------|----------|
| URL has no `chatId` | User clicks history item | URL has `chatId`; workspace loads messages; item active |
| URL has `chatId` (direct load) | History list finishes loading | Workspace loads messages; item active |
| URL has `chatId` (active chat) | User starts new analysis | URL reverts to base route; new analysis stream starts; no active item |
| URL has invalid `chatId` | Page loads | URL unchanged; workspace shows "chat not found" inline state; no active item |

## Validation Rules

- `chatId` must match an existing history entry id to load successfully.
- If `chatId` does not match any loaded history entry, the system shows the inline not-found state.
- The active highlight must only apply when the loaded chat's id equals the URL `chatId`.
