# Research Notes: AI Analysis Router Pages

## Date

2026-06-23

## Unknowns Resolved

All technical unknowns were resolved by inspecting the existing codebase. No external research was required.

## Findings

### Routing Framework

- **Decision**: Use React Router 7 nested route configuration (`createBrowserRouter`).
- **Rationale**: The application already uses React Router 7 with nested `children` for `charity-assessment`, `project-management`, and `onboarding`. Adding nested routes under `/dashboard/ai-analysis` follows the established pattern.
- **Alternatives considered**: None. Using the existing router is the only sensible option.

### Active Navigation Highlighting

- **Decision**: Update `DashboardLayout.tsx` path-to-view mapping to treat any path starting with `/dashboard/ai-analysis` as `activeView === 'ai-analysis'`.
- **Rationale**: The layout already uses prefix matching for `/dashboard/project-management`, `/dashboard/charity-assessment`, and `/dashboard/onboarding`. Extending this pattern to AI analysis keeps sidebar/mobile nav highlighting consistent.
- **Alternatives considered**: Passing `activeView` through Outlet context; rejected because it requires broader changes and the existing prefix match is simpler.

### AI Analysis Component Split

- **Decision**: Split `AIAnalysisPage.tsx` into route-aligned sub-components/pages.
- **Rationale**: The current page combines start cards, chat workspace, and history sidebar driven by local state. Nested routes require the chat workspace to render independently at `/dashboard/ai-analysis/chat` and the history list at `/dashboard/ai-analysis/history`.
- **Alternatives considered**: Keep a single `AIAnalysisPage` and switch internal view based on `useParams`; rejected because it defeats the purpose of URL-based routing and would not support direct links.

### History Navigation State

- **Decision**: Preserve `continueAnalysisId` and `rerunAnalysisId` location state but navigate to `/dashboard/ai-analysis/chat` instead of `/dashboard/ai-analysis`.
- **Rationale**: Existing behavior passes these identifiers through `navigate(..., { state })`. Changing only the target path keeps the contract intact while benefiting from routable chat.
- **Alternatives considered**: Moving state to query parameters; rejected because it changes the existing contract and is unnecessary.

### Backend/Storage Impact

- **Decision**: No backend or storage changes.
- **Rationale**: The refactor only affects frontend routing and component organization. Existing analysis hooks and API services continue to provide data.
- **Alternatives considered**: None.
