# Data Model: AI Analysis Router Pages

## Overview

This feature is a frontend routing refactor. It does not introduce new backend entities or database tables. The data model consists of the existing conceptual entities already used by the AI Analysis module, mapped to the new route structure.

## Entities

### AI Analysis View

Represents the screen the user sees inside the AI Analysis module.

| Attribute | Type | Description |
|-----------|------|-------------|
| `routePath` | `string` | URL path under `/dashboard/ai-analysis/*` |
| `viewName` | `string` | Human-readable view name: start, chat, history |
| `default` | `boolean` | Whether this view is the module entry point |

**Values**:

- `/dashboard/ai-analysis` and `/dashboard/ai-analysis/start` → start view
- `/dashboard/ai-analysis/chat` → chat workspace view
- `/dashboard/ai-analysis/history` → history list view

### Analysis Session

A single AI analysis conversation.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique session identifier |
| `title` | `string` | Display title |
| `status` | `"RUNNING" \| "COMPLETED" \| "FAILED" \| "PENDING"` | Execution status |
| `messages` | `StreamMessage[]` | Chat messages (user + assistant) |
| `startedAt` | `string` (ISO date) | Start time |

### Analysis History Item

A summary of a past analysis session shown in the history sidebar or history page.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique history entry identifier |
| `sessionId` | `string` | Linked analysis session identifier |
| `title` | `string` | Display title |
| `status` | `"RUNNING" \| "COMPLETED" \| "FAILED" \| "PENDING"` | Execution status |
| `startedAt` | `string` (ISO date) | Start time |
| `preview` | `string` | Short preview text |

### Route Location State

Optional state passed when navigating to the chat view.

| Attribute | Type | Description |
|-----------|------|-------------|
| `continueAnalysisId` | `string?` | History entry id to load into the chat workspace |
| `rerunAnalysisId` | `string?` | History entry id to rerun as a new chat session |

## State Transitions

| From | Action | To |
|------|--------|-----|
| `/dashboard/ai-analysis` (start) | Click recommended card / "تحليل جديد" | `/dashboard/ai-analysis/chat` |
| `/dashboard/ai-analysis/chat` | Close active analysis | `/dashboard/ai-analysis/start` |
| `/dashboard/ai-analysis/history` | Click history item | `/dashboard/ai-analysis/chat` with `continueAnalysisId` state |
| `/dashboard/ai-analysis/history` | Click "تحليل جديد" | `/dashboard/ai-analysis/start` |
| `/dashboard/ai-analysis/history` | Click rerun | `/dashboard/ai-analysis/chat` with `rerunAnalysisId` state |
| `/dashboard/ai-analysis/*` | Unknown sub-path | `/dashboard/ai-analysis` (start) |

## Validation Rules

- `routePath` must be one of the registered nested routes or the module index.
- Unknown sub-paths redirect to the module index.
- `continueAnalysisId` and `rerunAnalysisId` must correspond to an existing history item; otherwise the chat workspace falls back to the empty/start state.
