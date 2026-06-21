# Data Model: Project List API Integration

**Feature**: specs/058-project-list-api
**Date**: 2026-06-21

## Project List Response

Response shape from `GET /api/v1/projects`.

- `data`: `string[]` — array of project identifiers.
- `total`: `number` — total number of projects matching the query.
- `page`: `number` — current page number (1-based).
- `limit`: `number` — number of items per page.
- `totalPages`: `number` — total number of pages available.

## ProjectFilters

Query parameters supported by the list endpoint.

- `page`: `number` — defaults to `1`.
- `limit`: `number` — defaults to `10`.
- `status`: `ProjectStatus` (optional) — backend enum value.
- `organizationId`: `string` (optional).
- `managerId`: `string` (optional).
- `health`: `ProjectHealth` (optional) — backend enum value.
- `type`: `string` (optional).
- `category`: `string` (optional).
- `search`: `string` (optional) — keyword search.

## Project (Frontend View)

Existing entity in `src/app/pages/project-management/project-types.ts`. The list renders full project objects enriched via `GET /api/v1/projects/:id`.

- `id`: `string`
- `name`: `string`
- `organization`: `string`
- `type`: `string`
- `category`: `string`
- `status`: `ProjectStatus`
- `budget`: `number`
- `duration`: `string`
- `startDate`: `string`
- `endDate`: `string`
- `progress`: `number`
- `manager`: `string`
- `description`: `string`
- `beneficiaries`: `string`
- `geographicScope`: `string`
- `lastUpdated`: `string`
- `version`: `number`
- `health`: `ProjectHealth`

## Pagination Metadata (UI)

Derived from `ProjectListResponse` and used by pagination controls.

- `currentPage`: `number`
- `pageSize`: `number`
- `totalItems`: `number`
- `totalPages`: `number`

## Relationships

- A `ProjectListResponse` contains references to zero or more `Project` entities.
- Each `Project` is owned by an `Organization` and managed by a `Manager`.
- Filters narrow the set of `Project` references returned by the list endpoint.
