# API Contract: Authentication Validation Errors

**Feature**: Registration Field-Level Error Mapping
**Date**: 2026-05-19
**Base URL**: `${VITE_API_BASE_URL}/auth`

## Endpoints

### POST /auth/register

Register a new user account.

**Request Body**:
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "password": "string",
  "role": "string"
}
```

**Response (201 Created)**:
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string"
  }
}
```

**Error Responses (Extended)**:
- `400 Bad Request`: Validation errors
  - **Shape A (Single message)**:
    ```json
    {
      "statusCode": 400,
      "message": "Email already exists",
      "error": "Bad Request"
    }
    ```
  - **Shape B (Field-level array)**:
    ```json
    {
      "statusCode": 400,
      "message": [
        "firstName should not be empty",
        "lastName should not be empty",
        "password must contain at least one uppercase letter",
        "companyId must be a UUID",
        "roleId must be a UUID"
      ],
      "error": "Bad Request"
    }
    ```

## Field-Level Error Mapping

Define the `FIELD_ERROR_MAP` used by the frontend to route backend field names to frontend RHF form fields:

| Backend Field | Frontend Field | Notes |
|---------------|----------------|-------|
| `firstName` | `fullName` | First name is included in the fullName field |
| `lastName` | `fullName` | Last name is included in the fullName field |
| `password` | `password` | Direct mapping |
| `companyId` | `company` | Backend expects a UUID; frontend sends company name or selection |
| `roleId` | `role` | Backend expects a UUID; frontend sends role string value |

**Unmapped Fields** (displayed in generic error banner):
- Any backend field not listed above (e.g., `email` if it has a server-only constraint)
- Any message that does not match the "{fieldName} {message}" pattern

**400 Response Parsing Strategy**:
1. Check if `message` is an array.
2. For each string in the array, extract the leading word (backend field name) before the first space.
3. Look up `FIELD_ERROR_MAP[backendField]` → frontend field.
4. If found, append to `fieldErrors[frontendField]`.
5. If not found, append to `generalErrors[]`.
6. Throw `AuthError` with both `fieldErrors` and banner message (generalErrors joined).

## Common Headers

All authenticated requests must include:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Notes

- The frontend must NOT assume a fixed order of messages in the array.
- If the backend returns `message` as a plain string (not array), treat it as a general error (banner).
- The `firstName` / `lastName` → `fullName` mapping means both name errors may appear under the same field.
