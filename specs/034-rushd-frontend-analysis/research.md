# Research: AI Analysis API-Driven Category Filters

**Date**: 2026-06-08
**Feature**: AI Analysis API-Driven Category Filters
**Branch**: `034-rushd-frontend-analysis`

## Decisions

### 1. Service: Add `AnalysisService` domain class
- **Decision**: Create a new `AnalysisService` class under `src/api/services/analysis-service.ts`.
- **Rationale**: The existing codebase already uses an object-oriented service pattern (`DashboardService`, `AuthService`). Adding a dedicated service for analysis endpoints aligns with the constitution (Principle IV) and keeps domain logic encapsulated.
- **Alternatives considered**: Inline fetch inside the component — rejected because it violates API abstraction and makes mocking/testing harder.

### 2. Client: Reuse existing `apiClient` instance
- **Decision**: All HTTP requests go through the existing `src/api/client.ts` wrapper.
- **Rationale**: The constitution mandates a centralized API client. Reusing it preserves interceptor behavior (error handling, auth headers, logging) without change.
- **Alternatives considered**: Instantiating a new standalone Axios instance — rejected to avoid duplicating interceptor setup and base URL management.

### 3. State: Custom React hook (`useAnalysisCategories`)
- **Decision**: Encapsulate fetching + loading/error/empty states in a custom hook.
- **Rationale**: Aligns with the constitution’s clean code / SRP guidance and React best practices. Keeps UI components focused on rendering.
- **Alternatives considered**: Use a generic library (TanStack Query/SWR) — rejected to minimize new dependencies; existing project uses plain React hooks + Context for global state.

### 4. Sorting: Frontend sort by `sortOrder`
- **Decision**: Sort the category response client-side by `sortOrder` ascending before rendering.
- **Rationale**: The spec requires ascending display order. Backend ordering is not guaranteed, and client-side sorting is trivial with `Array.sort()`.
- **Alternatives considered**: Request backend to pre-sort — deferred to avoid backend scope creep; frontend sorting is sufficient and testable.

### 5. Error Handling: Graceful degradation with existing patterns
- **Decision**: On failure, show only the "All" button and keep the modal usable; log error via existing client interceptors.
- **Rationale**: Matches the spec’s resilience requirement (FR-007) and avoids blocking the user from analyzing data if categories are temporarily unavailable.
- **Alternatives considered**: Block modal opening on failure — rejected because that degrades the primary user workflow.

## Tag Research
- `React 18` + `TypeScript`: stable, already in use.
- `Tailwind CSS` + `shadcn/ui`: existing UI stack; new components follow same patterns.
- No new runtime dependencies required.
