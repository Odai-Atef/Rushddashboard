# Data Model: Project Create API Integration

**Feature**: Project Create API Integration  
**Date**: 2026-06-21

## Overview

This feature introduces a new API service contract for creating projects and aligns the existing local form model with the backend `POST /api/v1/projects` payload. No new backend entities are created; the frontend gains a typed DTO and response shape for project creation.

## Entities

### CreateProjectDto

Payload sent to `POST /api/v1/projects`.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Project name. |
| type | string | Yes | Project type (e.g., تنموي, خيري, تدريبي, إغاثي, صحي). |
| category | string | Yes | Project category such as the funding area or domain. |
| description | string | Yes | Detailed project description. |
| budget | number | Yes | Estimated budget amount. |
| currencyCode | string | Yes | ISO currency code; defaults to `"SAR"`. |
| startDate | string (ISO date) | Yes | Project start date in `YYYY-MM-DD`. |
| endDate | string (ISO date) | Yes | Project end date in `YYYY-MM-DD`. |
| beneficiaries | string | Yes | Description of who benefits from the project. |
| geographicScope | string | Yes | Geographic coverage of the project. |
| managerId | string | Yes | Identifier of the assigned project manager. |
| organizationId | string | Yes | Identifier of the owning organization. |

### ProjectResponse

Response returned after a successful project creation.

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | Unique identifier for the created project (assumed from common pattern; not in provided contract). |
| name | string | Project name. |
| type | string | Project type. |
| category | string | Project category. |
| description | string | Project description. |
| budget | number | Project budget. |
| currencyCode | string | Currency code. |
| startDate | string (ISO date) | Start date. |
| endDate | string (ISO date) | End date. |
| beneficiaries | string | Beneficiaries description. |
| geographicScope | string | Geographic coverage. |
| managerId | string | Assigned manager identifier. |
| organizationId | string | Owning organization identifier. |

### ProjectFormState

Local UI state used by `ProjectCreatePage.tsx` before submission.

| Attribute | Type | Description |
|-----------|------|-------------|
| name | string | Project name input. |
| type | string | Selected project type. |
| category | string | Selected project category. |
| description | string | Description input. |
| budget | string | Budget input captured as a string; converted to number on submit. |
| startDate | string | Start date input (`YYYY-MM-DD`). |
| endDate | string | End date input (`YYYY-MM-DD`). |
| beneficiaries | string | Beneficiaries input. |
| geographicScope | string | Geographic scope input. |
| managerId | string | Selected manager identifier. |
| organizationId | string | Selected organization identifier. |

### ApiError

Error shape reused from `src/api/types.ts`.

| Attribute | Type | Description |
|-----------|------|-------------|
| code | string | Machine-readable error code. |
| message | string | Human-readable error message. |
| details | Record<string, string[]> | Optional detailed error map. |
| errors | Array or Record | Optional field-level errors. |
| statusCode | number | HTTP status code. |

## Relationships

- A **ProjectFormState** is transformed into a **CreateProjectDto** when the user submits the form.
- A **CreateProjectDto** is sent to the API and returns a **ProjectResponse** on success.
- **ApiError** is returned or raised on validation/server/network failure.

## Validation Rules

- `name`, `type`, `category`, `description`, `beneficiaries`, `geographicScope`, `managerId`, `organizationId` must be non-empty strings.
- `budget` must be a positive number.
- `currencyCode` must be `"SAR"` by default.
- `startDate` and `endDate` must be valid `YYYY-MM-DD` dates, and `endDate` must not be before `startDate`.
- Field-level API validation errors map back to their corresponding form fields.
