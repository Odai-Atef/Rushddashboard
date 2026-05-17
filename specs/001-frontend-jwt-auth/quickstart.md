# Quick Start: Frontend JWT Authentication

**Feature**: Frontend JWT Authentication Integration
**Date**: 2026-05-17

## Development Setup

No additional dependencies needed. The project already includes:
- React Hook Form (form handling)
- React Router (routing)
- Tailwind CSS (styling)

## API Base URL Configuration

Ensure the API base URL is configured in your environment:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Running the Application

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

## Testing Authentication Flows

1. **Registration**: Navigate to `/auth/register`, fill in the form, submit. You should be automatically logged in and redirected to `/dashboard`.

2. **Login**: Navigate to `/auth/login`, enter credentials, submit. You should be redirected to `/dashboard`.

3. **Session Persistence**: After logging in, refresh the page. You should remain on `/dashboard` without needing to log in again.

4. **Logout**: Click the logout button. You should be redirected to `/auth/login`. Attempting to access `/dashboard` should redirect you back to login.

5. **Token Expiration**: If the backend supports token expiration, wait for the token to expire (or modify it manually). The app should attempt silent refresh; if refresh fails, redirect to login.

## Backend Integration Checklist

Before testing, ensure:
- [ ] Backend is running at `http://localhost:3000`
- [ ] Swagger docs are accessible at `http://localhost:3000/api/v1/docs`
- [ ] CORS is configured to allow the frontend origin (`http://localhost:5173`)
- [ ] Auth endpoints are functional:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh` (if refresh tokens are used)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure backend allows `http://localhost:5173` in CORS config |
| 401 after login | Check that JWT token is being sent in `Authorization: Bearer` header |
| Session lost on refresh | Verify tokens are being stored in localStorage |
| Registration succeeds but not logged in | Check that registration response includes tokens and auto-login logic is triggered |
