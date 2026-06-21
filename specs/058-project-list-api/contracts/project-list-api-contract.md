# Contract: Project List API

**Endpoint**: `/api/v1/projects`
**Method**: `GET`
**Feature**: specs/058-project-list-api

## Request

### Headers

- `Accept: application/json`
- `Authorization: Bearer <access_token>`
- `X-App-Version: <app_version>`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-based) |
| `limit` | number | No | 10 | Items per page |
| `status` | string | No | — | One of `DRAFT`, `CHARITY_REVIEW`, `INCUBATOR_MODIFICATIONS`, `CHARITY_APPROVAL`, `PM_APPROVAL`, `FINANCIAL_APPROVAL`, `APPROVED`, `DESIGN_TEAM`, `READY_DONOR`, `SUBMITTED_DONOR`, `FUNDED`, `EXECUTION`, `COMPLETED`, `CLOSED` |
| `organizationId` | string | No | — | Filter by owning organization |
| `managerId` | string | No | — | Filter by assigned manager |
| `health` | string | No | — | One of `EXCELLENT`, `GOOD`, `AT_RISK`, `CRITICAL` |
| `type` | string | No | — | Filter by project type |
| `category` | string | No | — | Filter by project category |
| `search` | string | No | — | Keyword search |

### Notes

- Empty or unset optional parameters MUST NOT be sent in the request.
- The frontend resets `page=1` when any filter, search term, or page size changes.

## Success Response

### Status

- `200 OK`

### Body

```json
{
  "data": ["string"],
  "total": 0,
  "page": 0,
  "limit": 0,
  "totalPages": 0
}
```

### Frontend Behavior

- The `data` array contains project identifiers.
- For each identifier, the frontend calls `GET /api/v1/projects/:id` to fetch full project details.
- Pagination controls are built from `page`, `limit`, `total`, and `totalPages`.
- If `total` is `0`, the frontend shows an empty state.

## Error Responses

### Validation Error

- **Status**: `400 Bad Request`
- **Frontend behavior**: Show a user-friendly Arabic message describing the invalid parameter.

### Unauthorized

- **Status**: `401 Unauthorized`
- **Frontend behavior**: The existing `ApiClient` redirects to `/auth/login?expired=true`.

### Server Error

- **Status**: `500` range
- **Frontend behavior**: Show an Arabic error message and a retry action.

### Timeout / Network Error

- **Frontend behavior**: Show an Arabic connectivity error and a retry action.

## Project Details Enrichment

**Endpoint**: `/api/v1/projects/:id`
**Method**: `GET`

### Success Response

Returns a full project object that the frontend can render in table, kanban, and timeline views.

### Error Responses

Handled per-item: if a single project details call fails, the frontend may skip the item, show a placeholder, or log the error without blocking the entire list.

## Notes

- The frontend relies on the existing `ApiClient` for auth, timeout, retry, and error parsing.
- Details calls for the current page are made in parallel.
