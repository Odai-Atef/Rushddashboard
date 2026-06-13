# Research: Follow-up Chat Error Handling

**Date**: 2025-06-13
**Feature**: Follow-up Chat Error Handling

## Decisions

### 1. Loading Guard Implementation
- **Decision**: Reuse the existing `status` state machine (`idle | connecting | streaming | complete | error`) instead of introducing a new flag.
- **Rationale**: The hook already computes `isLoading` from `status === 'connecting' || status === 'streaming'`. Setting `status = 'streaming'` at the start of `sendFollowUp()` immediately disables the input and submit button via existing logic in `AIAnalysisPage.tsx`.
- **Alternatives considered**: Adding a `isFollowUpLoading` boolean — rejected because it would duplicate state and require changes to the return interface, expanding scope.

### 2. Error Handling Strategy
- **Decision**: On `askFollowUp()` throw, set `status = 'error'`, populate `error` with an Arabic-localized string, and update the last assistant message's `content` and `isStreaming: false`.
- **Rationale**: This is consistent with how `startAnalysis` handles errors in the same hook. The Arabic string `'فشل الاتصال بتحليل البث المباشر. تأكد من تسجيل الدخول.'` already exists in the codebase (SSE error handler).
- **Alternatives considered**: Keeping only the inline assistant bubble error — rejected because it is visually indistinguishable from normal content and leaves the streaming cursor active.

### 3. Retry Button State
- **Decision**: Track the last failed question in component-level state (`pendingRetryQuestion: string | null`) inside `AIAnalysisPage.tsx`.
- **Rationale**: The spec explicitly limits changes to two files. Moving retry state into the hook would be cleaner but exceeds scope. The component already manages `chatInput` locally.
- **Alternatives considered**: Adding `lastQuestion` to `UseAnalysisStreamingReturn` — rejected to respect the two-file constraint.

### 4. Visual Error Banner
- **Decision**: Render a Tailwind-styled banner above the chat input using existing red color tokens (`bg-red-50`, `border-red-200`, `text-red-700`) already used in the history sidebar error state.
- **Rationale**: Ensures visual consistency with the rest of the application without introducing new design tokens.
