# Routing Contract: AI Analysis Module

## Scope

This document defines the URL contract for the AI Analysis module after the inline-routing to nested-routing refactor.

## Base Path

`/dashboard/ai-analysis`

## Routes

| Route | View | Description |
|-------|------|-------------|
| `/dashboard/ai-analysis` | Start | Default entry point; same content as `/dashboard/ai-analysis/start` |
| `/dashboard/ai-analysis/start` | Start | Recommended analysis cards and empty-state CTA |
| `/dashboard/ai-analysis/chat` | Chat | Streaming analysis workspace with history sidebar |
| `/dashboard/ai-analysis/history` | History | Full-page list of past analysis sessions |
| `/dashboard/ai-analysis/*` | Redirect | Any unknown sub-path redirects to `/dashboard/ai-analysis` |

## Location State Contract

When navigating to `/dashboard/ai-analysis/chat`, the following optional state may be provided via React Router's `location.state`:

```typescript
interface AIAnalysisChatState {
  /** History entry id whose session should be loaded into the chat workspace. */
  continueAnalysisId?: string;
  /** History entry id whose analysis should be restarted as a new session. */
  rerunAnalysisId?: string;
}
```

## Navigation Sources

- Sidebar: `المحلل التنفيذي الذكي` → `/dashboard/ai-analysis`
- Mobile nav: `المحلل التنفيذي الذكي` → `/dashboard/ai-analysis`
- Analysis History page:
  - Continue action → `/dashboard/ai-analysis/chat` with `{ continueAnalysisId }`
  - Rerun action → `/dashboard/ai-analysis/chat` with `{ rerunAnalysisId }`
  - New analysis action → `/dashboard/ai-analysis/start`
- Start page:
  - Recommended card click / New analysis CTA → `/dashboard/ai-analysis/chat`
- Chat page:
  - Close active analysis → `/dashboard/ai-analysis/start`

## Active Navigation

Any path starting with `/dashboard/ai-analysis` MUST highlight the `ai-analysis` item in the sidebar and mobile navigation.
