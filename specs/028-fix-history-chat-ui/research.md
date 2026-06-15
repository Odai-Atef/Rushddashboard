# Research: Fix History Chat UI

**Feature**: Fix History Chat UI
**Date**: 2026-06-14

## Decision: Only `AIAnalysisPage.tsx` needs changes

- **Rationale**: After code review, `useAnalysisStreaming.ts` already correctly implements fixes #2 and #3 from the spec:
  - `loadMessages()` already sets `status` to `'complete'` and stores `sessionId`.
  - `sendFollowUp()` already uses the stored `sessionId`.
- **Alternatives considered**: None — the backend and streaming hook are already correct.

## Decision: Use `isHistoricalSessionLoaded` flag for workspace conditional

- **Rationale**: The variable `isHistoricalSessionLoaded` already exists and correctly identifies when a historical session is active. Reusing it avoids introducing new state flags.
- **Alternatives considered**:
  - Add new `isHistorySessionActive` state flag — rejected as redundant.
  - Modify `loadHistorySession` to construct an `AnalysisCard` — rejected because `AnalysisCard` requires many fields that history entries don't provide (description, complexity, impact, color, icon).

## Decision: Handle `activeAnalysis === null` inside chat UI with safe fallbacks

- **Rationale**: The chat UI header dereferences `activeAnalysis.title`, `activeAnalysis.icon`, etc. When showing a historical session, `activeAnalysis` is `null`. Null-safe fallbacks prevent runtime errors.
- **Alternatives considered**: Construct a synthetic `AnalysisCard` from history entry — rejected because the history entry may not have all required `AnalysisCard` fields (color, icon, category, estimatedTime, complexity, impact).

## Decision: Hide the right sidebar (Insights & Recommendations) when viewing historical sessions

- **Rationale**: The right sidebar currently displays hard-coded mock recommendations. Showing these for historical sessions would be confusing. We should only show the right sidebar for completed *new* analyses (when `activeAnalysis` is truthy).
- **Alternatives considered**: Show the sidebar with a different message — deferred as out of scope for this bug fix.
