# Data Model: Project Create API Integration

**Feature**: specs/057-project-create-api
**Date**: 2026-06-21

## Project (Frontend View)

Existing entity in `src/app/pages/project-management/project-types.ts`. Extended with the create-specific DTO below.

- `id`: `string` — server-generated unique identifier.
- `name`: `string` — project name.
- `organization`: `string` — display label of the owning organization (frontend view).
- `type`: `string` — project type.
- `category`: `string` — project category.
- `status`: `ProjectStatus` — lifecycle status, assigned by backend on creation.
- `budget`: `number` — budget amount.
- `duration`: `string` — human-readable duration label (legacy display field).
- `startDate`: `string` — ISO-8601 date string.
- `endDate`: `string` — ISO-8601 date string.
- `progress`: `number` — completion percentage.
- `manager`: `string` — display name of assigned manager.
- `description`: `string` — project description.
- `beneficiaries`: `string` — target beneficiaries.
- `geographicScope`: `string` — geographic coverage.
- `lastUpdated`: `string` — timestamp of last modification.
- `version`: `number` — project version.
- `health`: `ProjectHealth` — project health indicator.

## CreateProjectDto

Payload sent to `POST /api/v1/projects`.

- `name`: `string`
- `type`: `string`
- `category`: `string`
- `description`: `string`
- `budget`: `number`
- `currencyCode`: `string` — defaults to `"SAR"`.
- `startDate`: `string`
- `endDate`: `string`
- `beneficiaries`: `string`
- `geographicScope`: `string`
- `managerId`: `string`
- `organizationId`: `string`

## CreatedProjectResponse

Expected successful response from `POST /api/v1/projects`.

- Includes all fields from `CreateProjectDto`.
- `id`: `string` — required for post-creation navigation to the details page. May be omitted in edge cases; see spec clarification.
- Timestamps and server-assigned fields such as `status`, `progress`, `version`, `health` may also be present but are not required by the frontend to process a successful creation.

## Manager

- `id`: `string` — `managerId` used in the create payload.
- `name`: `string` — display label shown in the form selector.

## Organization

- `id`: `string` — `organizationId` used in the create payload.
- `name`: `string` — display label shown in the form selector.

## Relationships

- A **Project** is owned by exactly one **Organization**.
- A **Project** is managed by exactly one **Manager**.
- A **Manager** belongs to zero or more **Organizations** (out of scope for this feature).
