# Research: Frontend JWT Authentication Integration

**Feature**: Frontend JWT Authentication Integration
**Date**: 2026-05-17
**Branch**: 001-rushd-frontend-auth

## Unknowns Resolved

### 1. Backend API Contract (from Swagger)

**Decision**: Use the backend Swagger docs at `http://localhost:3000/api/v1/docs#/Auth` as the source of truth for request/response schemas.

**Rationale**: The user explicitly referenced the Swagger documentation. The frontend must conform to the backend's DTOs.

**Expected Endpoints** (based on standard JWT auth patterns and user requirements):
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh (if refresh token supported)

### 2. Token Storage Strategy

**Decision**: Store JWT access token and optional refresh token in `localStorage`.

**Rationale**: The spec explicitly requires `localStorage` persistence for cross-session auth state. This is appropriate for a SPA dashboard application.

**Security considerations**:
- XSS risk: All tokens are accessible via JavaScript. Mitigation: Ensure CSP headers and sanitize all user-generated content.
- No sensitive user data stored in tokens (only user ID and email per spec).

### 3. HTTP Client Strategy

**Decision**: Use native `fetch` with a centralized service layer, consistent with the constitution.

**Rationale**: The constitution specifies "Native fetch with a typed service abstraction layer". No need to add axios or other HTTP libraries.

### 4. State Management Approach

**Decision**: Enhance existing React Context in RootLayout with JWT token management.

**Rationale**: The project already uses React Context for auth state. The constitution allows "React Context + hooks (or Zustand if global state complexity grows)". Auth state is localized enough for Context.

### 5. Form Validation Library

**Decision**: Use React Hook Form with Zod schemas (already in dependencies).

**Rationale**: Both `react-hook-form` and Zod validation are listed in the constitution as the project's form handling approach.

## Best Practices Applied

1. **Token Refresh Pattern**: Implement silent token refresh using refresh tokens when access tokens expire.
2. **401 Handling**: Centralized interceptor/wrapper to catch 401s, clear tokens, and redirect.
3. **Auto-login on Register**: Immediately call login after successful registration to obtain tokens.
4. **Minimal Profile Storage**: Only persist user ID and email from auth response.

## Alternatives Considered

| Approach | Why Rejected |
|----------|-------------|
| Zustand for auth state | React Context is sufficient; avoids adding new dependency |
| httpOnly cookies | Requires backend changes; spec mandates localStorage |
| Axios instead of fetch | Constitution specifies native fetch; no added value for simple auth flows |

## Open Questions for Implementation

1. Exact field names for registration payload (need to inspect Swagger or backend DTOs)
2. Whether backend returns refresh token or uses sliding sessions
3. Token expiration time (needed for refresh logic timing)

These will be resolved during `/speckit.implement` when the actual API integration occurs.
