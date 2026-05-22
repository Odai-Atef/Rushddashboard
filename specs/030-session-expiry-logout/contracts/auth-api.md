# API Contract: Session Status Check

**Feature**: Global Session Expiry Check and Auto Logout (030-session-expiry-logout)
**Date**: 2026-05-22
**Base URL**: `${VITE_API_BASE_URL}/auth`
**Protocol**: REST

## Endpoints

### GET /auth/me

Verifies that the current session (cookie- or token-based) is still valid and active.

**Request**:
- Method: `GET`
- Path: `/auth/me`
- Headers:
  - `Authorization: Bearer <access_token>` (if token-based) or
  - Session cookie (if cookie-based)

**Response 200 OK** — Session is valid:
```json
{
  "id": "string",
  "email": "string",
  "fullName": "string",
  "role": "string"
}
```

**Response 401 Unauthorized** — Session expired or invalid:
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Response 403 Forbidden** — Session revoked:
```json
{
  "statusCode": 403,
  "message": "Session has been revoked",
  "error": "Forbidden"
}
```

**Client-side behavior**:
- On `401` or `403`, treat as explicit session expiry and trigger logout, redirect, and localized toast.
- On a network error (e.g., `ECONNRESET`, DNS failure, timeout), silently skip this tick and retry on the next 15-second interval.

## Error Response Format

```json
{
  "statusCode": number,
  "message": "string",
  "error": "string"
}
```

## Notes

- This endpoint is used by a lightweight, recurring frontend poller every 15 seconds while the user is on a protected page.
- It should be idempotent and lightweight — no side effects, no token rotation.
- The existing `POST /auth/refresh` endpoint should remain the primary mechanism for refreshing tokens after receiving 401 on data requests, not for periodic session checks.

