# Contract: Project Create API Integration

**Feature**: Project Create API Integration  
**Date**: 2026-06-21

## Overview

This contract defines the interface between the frontend `/dashboard/project-management/create` page and the backend `POST /api/v1/projects` endpoint.

## Participants

- **User**: Fills out the project creation form and submits it.
- **Browser**: Captures form input and sends the HTTP request.
- **ProjectCreatePage** (`src/app/pages/project-management/ProjectCreatePage.tsx`): Renders the form, manages local state, validates input, and calls the project service.
- **ProjectService** (`src/api/services/project-service.ts`): Sends the authenticated `POST /api/v1/projects` request and returns the typed response or error.
- **Backend API**: Receives the request, persists the project, and returns the created project object.

## API Contract

### Endpoint

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/projects` | Create a new project. |

### Request Body

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Project name. |
| type | string | Yes | Project type. |
| category | string | Yes | Project category. |
| description | string | Yes | Project description. |
| budget | number | Yes | Estimated budget. |
| currencyCode | string | Yes | Defaults to `"SAR"`. |
| startDate | string | Yes | ISO date (`YYYY-MM-DD`). |
| endDate | string | Yes | ISO date (`YYYY-MM-DD`). |
| beneficiaries | string | Yes | Beneficiaries description. |
| geographicScope | string | Yes | Geographic coverage. |
| managerId | string | Yes | Project manager identifier. |
| organizationId | string | Yes | Owning organization identifier. |

### Success Response

- **HTTP Status**: `201 Created`
- **Body**: Created project object, minimally containing the fields listed in the request body. The backend may also return an `id` and timestamps.

### Error Responses

- **400 Bad Request**: Validation failure. May include field-level errors in `errors` or `details`.
- **401 Unauthorized**: Session expired or missing credentials; the existing `apiClient` redirects to login.
- **500 Internal Server Error**: Server-side failure; a generic retry message is shown.
- **Network failure**: No response; a connectivity retry message is shown.

## Frontend-to-Backend Mapping

| UI Field | DTO Field | Notes |
|----------|-----------|-------|
| اسم المشروع | `name` | Direct mapping. |
| نوع المشروع | `type` | Direct mapping. |
| الجهه | `organizationId` | UI shows name; API receives identifier. |
| (category selector) | `category` | Direct mapping. |
| وصف المشروع | `description` | Direct mapping. |
| الميزانية التقديرية | `budget` | Converted from string to number; `currencyCode` defaults to `"SAR"`. |
| (start date input) | `startDate` | New field to add; `YYYY-MM-DD`. |
| (end date input) | `endDate` | New field to add; `YYYY-MM-DD`. |
| (beneficiaries input) | `beneficiaries` | Direct mapping. |
| (geographic scope input) | `geographicScope` | Direct mapping. |
| (manager selector) | `managerId` | UI shows name; API receives identifier. |

## Rendering Rules

- The create page shows the form with all mapped fields.
- The submit button triggers client-side validation, then calls `projectService.createProject(dto)`.
- On success: show a brief success indicator and navigate to `/dashboard/project-management/list`.
- On validation error: map field errors to their inputs and display a general message if needed.
- On server/network error: preserve form values and display a retryable error message.

## Error Handling

- Client-side: block submission if required fields are missing or `endDate` is before `startDate`.
- API-side: surface `ApiError` fields into the form or as a page-level message.
- 401: handled globally by `apiClient`.
