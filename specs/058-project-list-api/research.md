# Research: Project List API Integration

**Date**: 2026-06-21
**Feature**: specs/058-project-list-api

## Decision: Extend ProjectService

- **Decision**: Add `getProjects(params)` and `getProjectById(id)` methods to the existing `src/api/services/project-service.ts`.
- **Rationale**: Keeps all project API calls in one service, consistent with the `OnboardingService` pattern and feature 057.
- **Alternatives considered**: Create a separate list service (rejected — would fragment project API logic).

## Decision: Single Hook for List + Details

- **Decision**: Create `useProjects` hook that fetches the paginated list, then fetches details for each returned project ID in parallel, and exposes `{ projects, pagination, filters, isLoading, error, setPage, setLimit, setFilters, applyFilters, clearFilters, refetch }`.
- **Rationale**: Centralizes list state and avoids prop-drilling across view modes.
- **Alternatives considered**: Separate hooks for list and details (rejected — would couple list page to multiple hooks and complicate loading/error coordination).

## Decision: Preserve Existing View Modes

- **Decision**: Keep table, kanban, and timeline views; feed them data from the hook instead of `projects` mock array.
- **Rationale**: The spec (US3) requires existing behavior to continue; the views already render correctly with `Project[]` objects.
- **Alternatives considered**: Replace views with a single list (rejected — would degrade UX and violate US3).

## Decision: Explicit Filter Application

- **Decision**: Filters and search are applied only when the user clicks an Apply/Search action, as clarified in `/speckit.clarify`.
- **Rationale**: Avoids accidental API calls while the user is still selecting filters.
- **Alternatives considered**: Immediate application with debounce (rejected during clarification).

## Decision: Loading State for Details Enrichment

- **Decision**: While list IDs and per-project details load, show a single loading spinner covering the list area.
- **Rationale**: Clarified during `/speckit.clarify`; simplest UX and matches the spec FR-013.
- **Alternatives considered**: Skeleton rows, inline loading (rejected during clarification).
