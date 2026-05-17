# API Contract: Authentication Endpoints

**Feature**: Frontend JWT Authentication Integration
**Date**: 2026-05-17
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

**Error Responses**:
- `400 Bad Request`: Validation errors
- `409 Conflict`: Email already exists
- `500 Internal Server Error`: Server error

### POST /auth/login

Authenticate an existing user.

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK)**:
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

**Error Responses**:
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### POST /auth/refresh

Refresh an expired access token using a refresh token.

**Request Body**:
```json
{
  "refreshToken": "string"
}
```

**Response (200 OK)**:
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired refresh token
- `500 Internal Server Error`: Server error

## Common Headers

All authenticated requests must include:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Error Response Format

```json
{
  "statusCode": number,
  "message": "string",
  "error": "string"
}
```

## Notes

- The frontend should use the exact field names and types as defined in the backend Swagger docs.
- Token expiration handling: When a 401 is received on an authenticated request, attempt to refresh the token. If refresh fails, clear all tokens and redirect to login.
- The `refreshToken` field is optional in responses; the frontend should handle both cases gracefully.
