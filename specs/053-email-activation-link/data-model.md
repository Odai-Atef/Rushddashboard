# Data Model: Email Activation Link Handling

**Feature**: Email Activation Link Handling  
**Date**: 2026-06-17

This feature does not introduce new backend entities or persistent frontend state. It coordinates three existing concepts: an activation token from the URL, an API response envelope, and a login page query-parameter contract.

## Context entities

### `ActivationToken`

A single-use, opaque value delivered to the user in an activation email.

| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | UUID-like token parsed from the `?token=` query parameter. Treated as opaque by the client. |

### `ActivationResponse`

Backend result returned by `GET /api/v1/auth/activate?token=...`.

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | True when the account was activated; false otherwise. |
| `message` | `string` | User-facing status message to display on the login page. |

### `ActivationRedirectState`

Query parameters used to communicate activation status from `ActivateAccountPage` to `LoginPage`.

| Field | Type | Description |
|-------|------|-------------|
| `activated` | `"success" \| "error"` | Visual status category for the banner. |
| `message` | `string` | URL-encoded status text rendered in the banner. |

## Relationships

- `ActivateAccountPage` reads `ActivationToken` from the URL, calls `AuthService.activateAccount`, maps the `ActivationResponse` into `ActivationRedirectState`, and navigates to `/auth/login`.
- `LoginPage` reads `ActivationRedirectState` from `useSearchParams` and renders a colored banner.

## Validation rules

- `token` query parameter must be present and non-empty; otherwise the page immediately navigates to `/auth/login?activated=error&message=...`.
- `message` is URL-encoded when navigating and URL-decoded when rendered.
- No client-side validation of token format is required; the backend is the authority.

## No new backend schemas

All shapes are already defined in `src/api/types.ts`, `src/api/services/auth-service.ts`, and the existing route query-parameter usage.
