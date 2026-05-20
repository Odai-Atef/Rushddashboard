# API Contract: Auth Response (Extended User Fields)

**Feature**: Settings Page User Info  
**Date**: 2026-05-20

## Endpoint: POST /auth/login

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Response: Success (200 OK)
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "companyName": "string"
  }
}
```

### Response Field Notes
- `firstName`, `lastName`, `companyName` are optional and may be omitted by the backend.
- The frontend MUST accept absent optional fields without error.

## Endpoint: POST /auth/register

### Request Body
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string"
}
```

### Response: Success (201 Created)
Same shape as login response above.

## Endpoint: POST /auth/refresh

### Request Body
```json
{
  "refreshToken": "string"
}
```

### Response: Success (200 OK)
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "companyName": "string"
  }
}
```

## Error Response Format

Same as existing `BackendValidationErrorResponse`:
```json
{
  "statusCode": 400,
  "message": "string | string[]",
  "error": "string"
}
```

## Compatibility Notes

- Older backend versions may return only `id` and `email`. The frontend treats all other fields as optional.
- The frontend `UserProfile` type reflects optional fields so TypeScript enforces safe access.
