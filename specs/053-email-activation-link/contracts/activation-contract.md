# Contract: Account Activation Flow

**Feature**: Email Activation Link Handling  
**Date**: 2026-06-17

## Overview

This contract defines the interaction between the user, the frontend activation page, the backend activation endpoint, and the login page. The goal is to verify an account email via a one-time token delivered in an email and to communicate the result on the login page.

## Participants

- **User**: Clicks the activation link in the welcome/verification email.
- **ActivateAccountPage** (`/auth/activate`): Reads the token, triggers backend verification, and redirects.
- **AuthService**: Frontend service that issues the HTTP call.
- **Backend endpoint** (`GET /api/v1/auth/activate`): Verifies the token and returns a status message.
- **LoginPage** (`/auth/login`): Renders the activation result banner.

## Flow

```text
User clicks email link
        |
        v
ActivateAccountPage reads ?token=...
        |
        v
AuthService.activateAccount(token)
        |
        v
GET /api/v1/auth/activate?token=<token>
        |
        +-- success --> navigate to /auth/login?activated=success&message=<msg>
        |
        +-- failure --> navigate to /auth/login?activated=error&message=<msg>
        |
        +-- no token  --> navigate to /auth/login?activated=error&message=<msg>
```

## API Contract

### Request

- **Method**: `GET`
- **Endpoint**: `/api/v1/auth/activate`
- **Query parameter**: `token` (required, string)

### Success Response

HTTP `200 OK` with body:

```json
{
  "success": true,
  "message": "Account activated successfully. You can now log in."
}
```

### Failure Responses

HTTP `4xx` with a body containing a user-facing message:

```json
{
  "success": false,
  "message": "Activation link is invalid or has expired."
}
```

Specific status codes are backend-defined (e.g., `400`, `401`, `404`, `410`).

## Frontend Page Contract

### Input to ActivateAccountPage

| Source | Parameter | Required | Description |
|--------|-----------|----------|-------------|
| URL query | `token` | Yes | Activation token. If missing, the page treats the request as invalid. |

### Output from ActivateAccountPage

Browser navigation to:

```
/auth/login?activated=success&message=<url-encoded-message>
```

or

```
/auth/login?activated=error&message=<url-encoded-message>
```

### Input to LoginPage

| Source | Parameter | Values | Description |
|--------|-----------|--------|-------------|
| URL query | `activated` | `success` / `error` | Banner color/status category. |
| URL query | `message` | string | URL-encoded text to render inside the banner. |

### Rendering rules

- If `activated=success`, render a green banner with the decoded `message`.
- If `activated=error`, render a red banner with the decoded `message`.
- If `activated` is present but `message` is missing, render a default localized message.

## Error handling

- **Missing token**: No backend call; redirect immediately with `activated=error`.
- **Network failure**: Redirect with `activated=error` and a connectivity message.
- **Unexpected response shape**: Treat as failure; redirect with `activated=error` and a generic failure message.
- **Global 401 interceptor**: The activation call is unauthenticated; the API client must not trigger the global 401 login redirect for this request.

## Security considerations

- The token is treated as opaque and is not parsed or validated client-side.
- The token is transmitted only to the configured backend base URL.
- The token is not persisted to storage or logged.
