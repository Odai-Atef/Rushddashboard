# Contract: Project Create API

**Endpoint**: `/api/v1/projects`
**Method**: `POST`
**Feature**: specs/057-project-create-api

## Request

### Headers

- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer <access_token>`
- `X-App-Version: <app_version>`

### Body

```json
{
  "name": "string",
  "type": "string",
  "category": "string",
  "description": "string",
  "budget": 0,
  "currencyCode": "SAR",
  "startDate": "string",
  "endDate": "string",
  "beneficiaries": "string",
  "geographicScope": "string",
  "managerId": "string",
  "organizationId": "string"
}
```

### Field Notes

- `currencyCode` defaults to `"SAR"` unless the user selects otherwise.
- `budget` is a number; the frontend converts from the text input before sending.
- `startDate` and `endDate` are date strings in the format accepted by the backend (frontend sends ISO-8601 / backend-compatible format).
- Field validation is primarily performed by the backend; the frontend surfaces returned field errors.

## Success Response

### Status

- `201 Created` (or `200 OK` if backend uses that convention)

### Body

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "string",
    "category": "string",
    "description": "string",
    "budget": 0,
    "currencyCode": "SAR",
    "startDate": "string",
    "endDate": "string",
    "beneficiaries": "string",
    "geographicScope": "string",
    "managerId": "string",
    "organizationId": "string"
  },
  "message": "Project created successfully"
}
```

### Frontend Behavior

- If `data.id` is present, navigate to `/dashboard/project-management/details/:id`.
- If `data.id` is absent, navigate to `/dashboard/project-management/list` and show a warning.

## Error Responses

### Validation Error

- **Status**: `400 Bad Request`
- **Body shape**:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

- **Frontend behavior**: Display each returned error next to its field. Preserve all user-entered data.

### Server Error

- **Status**: `500` range
- **Frontend behavior**: Show a user-friendly Arabic error message and allow retry without clearing the form.

### Unauthorized

- **Status**: `401 Unauthorized`
- **Frontend behavior**: The existing `ApiClient` redirects to `/auth/login?expired=true`. Per the clarification, the form is cleared when the session is expired.

### Timeout / Network Error

- **Frontend behavior**: Show an Arabic connectivity error and allow retry.

## Notes

- The frontend relies on the existing `ApiClient` for auth, timeout, retry, and error parsing.
- Duplicate submissions are prevented by disabling the submit action while the request is in flight.
