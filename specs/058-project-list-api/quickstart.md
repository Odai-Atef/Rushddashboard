# Quick Start: Project List API Integration

**Feature**: specs/058-project-list-api
**Date**: 2026-06-21

## Prerequisites

- Node.js and npm installed.
- Backend API running and reachable via `ENV.API_BASE_URL` in `.env`.
- Valid authentication token stored in `localStorage` after logging in.

## Run the Application

```bash
npm run dev
```

Open the app in the browser, log in, then navigate to:

```text
/dashboard/project-management/list
```

## Test the Integration

1. Open `/dashboard/project-management/list`.
2. Verify a `GET /api/v1/projects?page=1&limit=10` request is made.
3. Verify the page fetches details for each project ID returned.
4. Confirm project rows/cards render with name, organization, status, budget, manager, and progress.
5. Use the pagination controls to move to page 2 and confirm the request uses `page=2`.
6. Change the page size and confirm the request resets to `page=1` with the new `limit`.
7. Select a status filter, click Apply, and confirm the request includes `status` and resets to `page=1`.
8. Enter a keyword in the search field, click Search, and confirm the request includes `search`.
9. Clear filters and confirm the request reverts to defaults.
10. Simulate a 500 response and verify an Arabic error message and retry option appear.
11. Simulate a response with `total=0` and verify the empty state is shown.

## Local Mock Mode (if backend unavailable)

If the backend is not ready, you can temporarily mock the service in `src/api/services/project-service.ts`:

```ts
async getProjects(): Promise<ApiResponse<ProjectListResponse>> {
  return new Promise((resolve) => setTimeout(() => resolve({
    success: true,
    data: { data: ['mock-1'], total: 1, page: 1, limit: 10, totalPages: 1 },
    message: 'OK',
  }), 300));
}

async getProjectById(id: string): Promise<ApiResponse<Project>> {
  return new Promise((resolve) => setTimeout(() => resolve({
    success: true,
    data: { id, name: 'Mock Project', status: 'execution', health: 'good', /* ... */ } as Project,
    message: 'OK',
  }), 300));
}
```

Remove or guard the mock before merging.

## Common Issues

- **401 on load**: Ensure the access token is valid and not expired.
- **CORS errors**: Confirm `ENV.API_BASE_URL` matches the running backend origin.
- **Details calls failing**: Verify `GET /api/v1/projects/:id` is implemented and accessible.
- **Filters not applied**: Confirm the user clicked the Apply/Search action; filters are not applied immediately per the clarified behavior.
