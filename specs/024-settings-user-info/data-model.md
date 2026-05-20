# Data Model: Settings Page User Info

**Feature**: Settings Page User Info  
**Date**: 2026-05-20

## Entities

### UserProfile

The authenticated user's identity as stored in auth state and `localStorage`.

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| id | string (UUID) | Yes | Backend auth response | Primary identifier |
| email | string | Yes | Backend auth response | Used for display and fallback |
| firstName | string | No | Backend auth response | Optional; may be absent |
| lastName | string | No | Backend auth response | Optional; may be absent |
| companyName | string | No | Backend auth response | Optional; may be absent |

### AuthResponse

The payload returned by `POST /auth/login` and `POST /auth/register`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| accessToken | string | Yes | JWT access token |
| refreshToken | string | No | JWT refresh token |
| user | UserProfile | Yes | Embedded user object |

### AuthState (Context)

React Context value shape consumed by components.

| Field | Type | Notes |
|-------|------|-------|
| user | UserProfile \| null | Current authenticated user |
| isAuthenticated | boolean | Derived from presence of tokens/user |
| isLoading | boolean | True while restoring from localStorage |

## Relationships

- `AuthProvider` stores `UserProfile` in `localStorage` under key `rushd_user`.
- `SettingsPage` reads `user` from `AuthContext` via `useAuth()`.
- Optional fields (`firstName`, `lastName`, `companyName`) are surfaced if present; otherwise inputs remain empty.

## Validation Rules

- `email` must be a valid email format (enforced by Zod in login/register schemas).
- `firstName` and `lastName` have no local constraints beyond being optional strings.
- `companyName` has no local constraints beyond being an optional string.

## State Transitions

1. **Logged Out** → `user` is `null`.
2. **Login/Register Success** → Backend returns `AuthResponse`; frontend extends `UserProfile` with all present fields and persists to `localStorage`.
3. **Page Refresh** → `AuthProvider` reads `rushd_user` from `localStorage`; if present, populates context.
4. **Settings Page Render** → Reads `user` from context; falls back to empty strings for optional missing fields.
