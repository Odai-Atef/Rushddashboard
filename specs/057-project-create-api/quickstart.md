# Quick Start: Project Create API Integration

**Feature**: specs/057-project-create-api
**Date**: 2026-06-21

## Prerequisites

- Node.js and pnpm/npm installed.
- Backend API running and reachable via `ENV.API_BASE_URL` in `.env`.
- Valid authentication token stored in `localStorage` after logging in.

## Run the Application

```bash
pnpm dev
# or
npm run dev
```

Open the app in the browser, log in, then navigate to:

```text
/dashboard/project-management/create
```

## Test the Integration

1. Fill in the project creation form.
2. Click **إنشاء المشروع**.
3. Verify the browser makes a `POST /api/v1/projects` request.
4. On success, verify navigation to `/dashboard/project-management/details/:id`.
5. On validation error, verify inline error messages appear without clearing the form.
6. Simulate a 500 response and verify an Arabic error message is shown.
7. Simulate network disconnection and verify a connectivity error message is shown.
8. Click the submit button repeatedly and verify no duplicate `POST` requests are sent while one is in flight.

## Local Mock Mode (if backend unavailable)

If the backend is not yet ready, you can temporarily mock the service in `src/api/services/project-service.ts`:

```ts
async createProject(data: CreateProjectDto): Promise<ApiResponse<CreatedProjectResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      success: true,
      data: { id: 'mock-123', ...data, status: 'draft', createdAt: new Date().toISOString() },
      message: 'Project created (mock)',
    }), 500);
  });
}
```

Remove or guard the mock before merging.

## Common Issues

- **401 on submit**: Ensure the access token is valid and not expired. The existing client will redirect to login on 401.
- **CORS errors**: Confirm `ENV.API_BASE_URL` matches the running backend origin.
- **Missing `id` in response**: The UI will fall back to the project list with a warning.
