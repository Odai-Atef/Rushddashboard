# Implementation Plan: AI Analysis Router Pages

**Branch**: `main` | **Date**: 2026-06-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/062-ai-analysis-inline-routing/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Convert the AI Analysis module from a single inline-routed page (`/dashboard/ai-analysis`) into a set of nested routable sub-pages under `/dashboard/ai-analysis/*`. The start screen, chat workspace, and history view will become independent route targets that users can reach directly via URL, while preserving all existing functionality (recommended analysis cards, streaming chat, follow-up questions, history sidebar, and history page actions).

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, React Router 7
**Primary Dependencies**: React Router 7 (`createBrowserRouter`, nested `children`, `useNavigate`, `useLocation`, `Outlet`, `NavLink`), React 19, Tailwind CSS, shadcn/ui components, Lucide icons
**Storage**: N/A (continues using existing analysis hooks and API services)
**Testing**: Vitest + React Testing Library (project-standard), manual regression for routing behavior
**Target Platform**: Modern evergreen browsers, responsive desktop and mobile
**Project Type**: Single-page web application (frontend)
**Performance Goals**: Route navigation renders the target view within 2 seconds; lazy loading of chat workspace optional but not required
**Constraints**: Preserve existing `/dashboard/ai-analysis` path as the start view; sidebar/mobile nav links continue to point to `/dashboard/ai-analysis`; no backend changes
**Scale/Scope**: Single frontend module refactor; impacts routes, layout path mapping, and AI analysis component split

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is currently a placeholder with no active principles defined. No gates to evaluate. Assuming no violations.

## Project Structure

### Documentation (this feature)

```text
specs/062-ai-analysis-inline-routing/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── checklists/          # Specification quality checklist
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── routes.tsx                  # router config: add nested /dashboard/ai-analysis routes
│   ├── layouts/
│   │   └── DashboardLayout.tsx     # path-to-view mapping for active nav highlighting
│   ├── components/
│   │   ├── AIAnalysisPage.tsx      # existing combined page (to be split/refactored)
│   │   ├── Sidebar.tsx             # nav link to /dashboard/ai-analysis
│   │   ├── MobileNav.tsx           # nav link to /dashboard/ai-analysis
│   │   ├── AnalysisHistoryPage.tsx # existing standalone history page (navigate targets updated)
│   │   └── ai-analysis/            # NEW nested page components (optional but recommended)
│   │       ├── AIAnalysisStartPage.tsx
│   │       ├── AIAnalysisChatPage.tsx
│   │       └── AIAnalysisHistoryPage.tsx
│   └── hooks/                      # existing analysis hooks reused
└── ...
```

**Structure Decision**: This is a frontend-only refactor within the existing single-page application. The AI Analysis module will be split into three route-aligned components under a new `src/app/components/ai-analysis/` directory, while the router config in `src/app/routes.tsx` is updated to register nested children under `dashboard/ai-analysis`. `DashboardLayout.tsx` path-to-view mapping is updated so nested AI analysis routes keep the "ai-analysis" nav item active. No backend, no new libraries, no new storage.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations to justify.

## Phase 0: Research

All technical unknowns were resolved by inspecting the existing codebase:

- **Routing framework**: React Router 7 is already used; `createBrowserRouter` with nested `children` is the established pattern (evident in `charity-assessment`, `project-management`, and `onboarding` routes).
- **Active nav highlighting**: `DashboardLayout.tsx` maps `location.pathname` to `activeView`. It already handles prefix matching for nested modules (e.g., `/dashboard/project-management` and `/dashboard/charity-assessment`).
- **Existing AI analysis functionality**: `AIAnalysisPage.tsx` currently combines start cards, chat workspace, and history sidebar in a single component driven by `activeAnalysis` and `isHistoricalSessionLoaded` state.
- **History navigation**: `AnalysisHistoryPage.tsx` currently navigates to `/dashboard/ai-analysis` with `location.state` (`continueAnalysisId`, `rerunAnalysisId`). These need to target `/dashboard/ai-analysis/chat` after refactor.

**No external research required**.

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](data-model.md).

### Contracts

This feature is a UI-only routing refactor. No new external API or library contracts are introduced. The existing contracts are:

- **Router URL contract**: `/dashboard/ai-analysis`, `/dashboard/ai-analysis/start`, `/dashboard/ai-analysis/chat`, `/dashboard/ai-analysis/history`
- **Location state contract**: `continueAnalysisId?: string`, `rerunAnalysisId?: string` passed to `/dashboard/ai-analysis/chat`

See `contracts/` for the lightweight routing contract document.

### Quickstart

See [quickstart.md](quickstart.md).

### Implementation Approach

1. **Create nested AI analysis page components** (or inline sections):
   - `AIAnalysisStartPage`: renders the existing header, recommended cards, and start empty-state.
   - `AIAnalysisChatPage`: renders the chat workspace with history sidebar.
   - `AIAnalysisHistoryPage`: renders the analysis history list view currently in `AnalysisHistoryPage.tsx`.

2. **Update `src/app/routes.tsx`**:
   - Replace the flat `{ path: 'ai-analysis', Component: AIAnalysisPage }` route with a nested `children` array:
     - `index: true` and `path: 'start'` → `AIAnalysisStartPage`
     - `path: 'chat'` → `AIAnalysisChatPage`
     - `path: 'history'` → `AIAnalysisHistoryPage`
     - `path: '*'` → redirect to `/dashboard/ai-analysis`

3. **Update `src/app/layouts/DashboardLayout.tsx`**:
   - Ensure any path starting with `/dashboard/ai-analysis` maps `activeView` to `'ai-analysis'`.

4. **Update navigation sources**:
   - `Sidebar.tsx` and `MobileNav.tsx` already link to `/dashboard/ai-analysis`; no change required.
   - `AnalysisHistoryPage.tsx` buttons that navigate to `/dashboard/ai-analysis` with state must navigate to `/dashboard/ai-analysis/chat` instead.
   - `AIAnalysisPage.tsx` internal close/reset actions should navigate back to `/dashboard/ai-analysis/start`.

5. **Preserve state and behavior**:
   - Existing hooks (`useAnalysisStreaming`, `useAnalysisHistory`, `useAnalysisCategories`) are reused.
   - The `continueAnalysisId`/`rerunAnalysisId` location state is read in `AIAnalysisChatPage` (or the refactored chat component) to trigger loading/rerunning a session on mount.

### Testing Strategy

- **Unit tests** (optional, if project has tests for these components): verify each new page component renders without crashing.
- **Integration/manual regression**:
  - Direct URL access for `/dashboard/ai-analysis`, `/dashboard/ai-analysis/start`, `/dashboard/ai-analysis/chat`, `/dashboard/ai-analysis/history`.
  - Back/forward/refresh in each sub-page.
  - Start a new analysis and verify navigation to chat.
  - Close chat and verify return to start.
  - From history page, continue/rerun an analysis and verify chat loads the session.
  - Verify sidebar/mobile nav highlight remains on "المحلل التنفيذي الذكي" for all nested routes.
  - Verify unknown paths redirect to start.
- **Build check**: run production build and ensure no compile errors.

### Constitution Check (Post-Design)

No constitution gates defined. No violations.
