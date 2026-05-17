# Data Model: Frontend JWT Authentication

**Feature**: Frontend JWT Authentication Integration
**Date**: 2026-05-17

## Entities

### AuthTokens

Represents the JWT tokens returned by the backend upon successful authentication.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| accessToken | string | Yes | JWT access token for authenticated requests |
| refreshToken | string | No | Optional refresh token for obtaining new access tokens |

### UserSession

Represents the authenticated user's session state.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | Unique identifier for the user |
| email | string | Yes | User's email address |
| isAuthenticated | boolean | Yes | Whether the user is currently authenticated |

### LoginRequest

Payload for sign-in requests.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Non-empty |

### RegisterRequest

Payload for registration requests.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| fullName | string | Yes | Non-empty |
| email | string | Yes | Valid email format |
| phone | string | Yes | Non-empty |
| company | string | Yes | Non-empty |
| password | string | Yes | Minimum length (backend-defined) |
| role | string | Yes | One of: investor, executive, analyst |

### AuthResponse

Response from backend after successful login or registration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| accessToken | string | Yes | JWT access token |
| refreshToken | string | No | Optional refresh token |
| user | UserProfile | Yes | User profile data |

### UserProfile

Minimal user data returned with auth response.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | User unique identifier |
| email | string | Yes | User email address |

## State Transitions

```
[Unauthenticated]
    |
    | Login/Register Success
    v
[Authenticated] --(Token Expired)--> [Refreshing]
    |                                   |
    | Logout                            | Refresh Success
    v                                   v
[Unauthenticated]              [Authenticated]
                                   |
                                   | Refresh Failed
                                   v
                              [Unauthenticated]
```

## Storage Schema (localStorage)

| Key | Value | TTL |
|-----|-------|-----|
| `rushd_access_token` | JWT access token | Until expiration or logout |
| `rushd_refresh_token` | JWT refresh token (if provided) | Until expiration or logout |
| `rushd_user` | JSON string of UserProfile | Until logout |

## Validation Rules

1. **Email**: Must be valid email format (RFC 5322 simplified)
2. **Password**: Minimum 8 characters, at least one letter and one number (client-side hint; backend enforces strict rules)
3. **Phone**: Non-empty string (format validation delegated to backend)
4. **Required Fields**: All registration fields are mandatory
