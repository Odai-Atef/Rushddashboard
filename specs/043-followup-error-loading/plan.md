# Implementation Plan: Follow-up Chat Error Handling

**Branch**: `[043-followup-error-loading]` | **Date**: 2025-06-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/043-followup-error-loading/spec.md`

## Summary

Fix the follow-up chat input so that `sendFollowUp()` sets `status = 'streaming'` while the request is in flight, preventing double submission. On error, reset `status` to `'error'`, populate the assistant placeholder with an Arabic-localized error message, and render a distinct visual error banner with a retry button in `AIAnalysisPage.tsx`. The existing SSE streaming flow (`startAnalysis`) must remain untouched.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x  
**Primary Dependencies**: React hooks, Tailwind CSS, shadcn/ui primitives, lucide-react, react-markdown, recharts  
**Storage**: N/A (client-side React state via `useState`)  
**Testing**: Vitest (or Jest) with React Testing Library (project convention)  
**Target Platform**: Modern web browsers (desktop + mobile)  
**Project Type**: Web application (frontend SPA)  
**Performance Goals**: UI state updates within 100 ms; no perceptible jank during status transitions  
**Constraints**: Changes scoped to exactly two files: `useAnalysisStreaming.ts` and `AIAnalysisPage.tsx`; must not break SSE streaming (`startAnalysis`)  
**Scale/Scope**: Single-user session scope; follow-up requests are infrequent and lightweight

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Reusability | ⚠️ Flagged | The error banner will be kept inline in `AIAnalysisPage.tsx` due to the spec's explicit two-file scope constraint. A follow-up refactor can extract it into a reusable `<ErrorBanner />` component. |
| II. Clean Code & OOP | ✅ Pass | Hook logic remains centralized; no new global state introduced. |
| III. Environment-Driven Configuration | ✅ Pass | No new hardcoded URLs or secrets. |
| IV. API Abstraction Layer | ✅ Pass | Follow-up call already uses `analysisService.askFollowUp()`; error handling reuses existing interceptor patterns. |
| V. Comprehensive Documentation | ✅ Pass | Inline JSDoc and comments are sufficient for this scoped fix. README update not required. |

**Decision**: Proceed. The inline banner is acceptable given the minimal scope and the fact that an error banner already exists in the same component (history sidebar). A reusable extraction is deferred to a future UI-polish task.

## Project Structure

### Documentation (this feature)

```text
specs/043-followup-error-loading/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── hooks/
│   │   └── useAnalysisStreaming.ts   # Status machine + sendFollowUp fix
│   └── components/
│       └── AIAnalysisPage.tsx        # Error banner + retry + disabled input
```

**Structure Decision**: Single frontend SPA. The fix is localized to two existing files; no new directories or modules are introduced.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Inline error banner (not a standalone component) | Spec explicitly scopes changes to two files | Extracting a component would require touching additional files, violating the accepted spec constraint. The existing component already contains inline banners (history sidebar), so this is consistent with the current codebase. |

