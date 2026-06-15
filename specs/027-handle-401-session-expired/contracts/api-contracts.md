# API Contracts: Handle 401 Session Expired

**Date**: 2026-06-14
**Feature**: Handle 401 Session Expired

## Overview

This feature does not introduce new external API endpoints. It is a frontend-only behavioral change: intercepting existing 401 responses and reacting to them. This document describes the contract between the frontend `ApiClient` and the login page.

## Internal Contracts

### 1. ApiClient → LoginPage Redirect Contract

When `ApiClient` detects an HTTP 401 from any API call, it redirects to the login page with the following query parameters:

```
GET /auth/login?expired=true&redirect=/original-path
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `expired` | string (`"true"`) | Yes | Signals that the redirect was caused by session/token expiry |
| `redirect` | string | No | The relative path the user should be sent to after successful re-login |

#### Constraints

- `redirect` must be a relative path starting with `/` (e.g., `/dashboard`, `/dashboard/sales`).
- External URLs in `redirect` must be rejected to prevent open-redirect vulnerabilities.
- If `redirect` is absent, `LoginPage` defaults post-login navigation to `/dashboard`.

### 2. LoginPage → AuthContext Re-login Contract

After successful login (`authService.login`), `LoginPage` reads the `redirect` query parameter and calls `navigate(redirectValue)` instead of the hardcoded `/dashboard`.

### 3. ApiClient → AuthContext Token Clearing Contract

`ApiClient` calls `apiClient.clearAuthToken()` before redirecting. This removes:
- `AUTH_CONFIG.TOKEN_KEY` from `localStorage`
- `AUTH_CONFIG.REFRESH_TOKEN_KEY` from `localStorage`

This is an imperative side-effect; `AuthContext` will detect the unauthenticated state on next render.

## Error Response Contract (Existing)

The backend already returns 401 with this shape (handled by `ApiClient.parseError`):

```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

The frontend does not need to inspect the body; any HTTP status `401` triggers the redirect.

## Sequence Diagram

```
User --action--> Frontend Component
Frontend Component --API call--> ApiClient
ApiClient --request--> Backend API
Backend API --401 Unauthorized--> ApiClient
ApiClient --parseError()--> ApiClient
ApiClient --clearAuthToken()--> localStorage
ApiClient --navigate("/auth/login?expired=true&redirect=/current")--> Browser
Browser --load--> LoginPage
LoginPage --read ?expired=true--> LoginPage
LoginPage --show Arabic message--> User
User --login--> LoginPage
LoginPage --authService.login()--> Backend API
Backend API --200 OK + token--> LoginPage
LoginPage --login()--> AuthContext
LoginPage --navigate(redirect)--> Browser
Browser --load--> Original Page
```
