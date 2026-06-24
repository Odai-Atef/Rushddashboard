# Quickstart: Collaboration Hub Backend Integration

## What this feature does

Replaces the hardcoded mock data in the Project Collaboration Module's Hub view with live data from the backend for:

- Project chat conversations
- Recent project discussions
- Recent project attachments

## Files you will touch

### New files

| File | Purpose |
|------|---------|
| `src/api/services/collaboration-service.ts` | Service class with three list methods |
| `src/api/hooks/useProjectConversations.ts` | Hook for conversation state |
| `src/api/hooks/useProjectDiscussions.ts` | Hook for discussion state |
| `src/api/hooks/useProjectAttachments.ts` | Hook for attachment state |

### Modified files

| File | Change |
|------|--------|
| `src/app/routes.tsx` | Add `projectId` parameter to collaboration routes |
| `src/app/components/ProjectCollaborationModule.tsx` | Wire hooks, remove mock arrays, add loading/error/empty/pagination states |

## Runbook

### 1. Add route parameter

Change the collaboration route block in `src/app/routes.tsx` from:

```tsx
{
  path: 'collaboration',
  children: [
    { index: true, element: <Navigate to="/dashboard/collaboration/hub" replace /> },
    { path: ':view', Component: ProjectCollaborationModule },
  ],
}
```

To:

```tsx
{
  path: 'collaboration',
  children: [
    { index: true, element: <Navigate to="/dashboard/project-management/list" replace /> },
    {
      path: ':projectId',
      children: [
        { index: true, element: <Navigate to="hub" replace /> },
        { path: ':view', Component: ProjectCollaborationModule },
      ],
    },
  ],
}
```

Then update any existing hardcoded links (e.g., `to="/dashboard/collaboration/hub"`) to include a project ID.

### 2. Create the service

Implement `src/api/services/collaboration-service.ts` with three methods:

- `getProjectConversations(projectId, filters, config?)`
- `getProjectDiscussions(projectId, filters, config?)`
- `getProjectAttachments(projectId, filters, config?)`

Each method calls `apiClient.get` and returns `ApiResponse<PaginatedResponse<T>>`.

### 3. Create the hooks

Model each hook on `useProjects` / `useProjectDetails`:

- Track `items`, `pagination`, `isLoading`, `error`, and `filters`.
- Use `AbortController` for cancellation and race-condition prevention.
- Provide `setPage`, `setFilters`, `applyFilters`, `refetch`.
- Map errors to Arabic strings by HTTP status.

### 4. Refactor the Hub component

In `ProjectCollaborationModule.tsx`:

- Read `projectId` from `useParams`.
- Call the three hooks.
- Remove the local mock arrays for conversations, discussions, and attachments.
- Render `LoadingCard`, `ErrorCard`, and `EmptyState` components (inline or shared) for each panel.
- Replace hardcoded KPI stats with computed values from live conversation data where applicable.
- Add a "Load more" button per panel.

### 5. Verify

1. Start the dev server: `pnpm dev`
2. Navigate to a project collaboration URL: `/dashboard/collaboration/:projectId/hub`
3. Confirm each panel loads live data.
4. Confirm pagination and filters work.
5. Simulate a backend error (e.g., via browser dev-tools network blocking) and confirm per-panel retry.

## Testing hints

- Write unit tests for the service methods using a mocked `apiClient`.
- Write hook tests with `renderHook` and mocked service responses.
- Write a component test verifying that mock data is not rendered after loading finishes.

## Common pitfalls

- Forgetting to abort previous requests when `projectId` or filters change.
- Sending empty-string query params that the backend rejects.
- Leaving old mock arrays in the component.
- Sharing a single loading/error state across all three panels (must be independent).
