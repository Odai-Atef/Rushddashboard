# Quick Start: Dashboard Backend Integration

**Date**: 2026-05-18
**Feature**: Dashboard Backend Integration

## Prerequisites

- Node.js 20+ with pnpm
- Backend API running (see API contracts for endpoints)
- `.env` file with `VITE_API_BASE_URL` set

## Environment Setup

```bash
# Ensure API base URL is configured
echo "VITE_API_BASE_URL=http://localhost:3000/api/v1" >> .env

# Install dependencies (if not already installed)
pnpm install
```

## Development Workflow

### 1. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` (or Vite's default port).

### 2. Verify Backend Connectivity

Ensure the backend exposes these endpoints:
- `GET /api/v1/dashboards` — List dashboards
- `GET /api/v1/dashboards/:id` — Dashboard details with widgets
- `GET /api/v1/dashboards/:id/widgets/:widgetId/data` — Widget data
- `POST /api/v1/dashboards` — Create dashboard (optional)
- `PATCH /api/v1/dashboards/:id` — Update dashboard (optional)

### 3. Test the Feature

1. **Login** to the application
2. **Navigate to Dashboard** — You should see the dashboard list loaded from backend
3. **Select a Dashboard** — Widgets should render dynamically based on backend configuration
4. **Apply Filters** — Widget data should refresh with new filter parameters

## Key Files

| File | Purpose |
|------|---------|
| `src/app/services/dashboard.ts` | API service for dashboard endpoints |
| `src/app/types/dashboard.ts` | Zod schemas and TypeScript types |
| `src/app/hooks/useDashboards.ts` | Hook for fetching dashboard list |
| `src/app/hooks/useDashboard.ts` | Hook for fetching dashboard details |
| `src/app/hooks/useWidgetData.ts` | Hook for fetching widget data |
| `src/app/components/dashboard/DashboardList.tsx` | Dashboard list page |
| `src/app/components/dashboard/DashboardPage.tsx` | Single dashboard view |
| `src/app/components/dashboard/WidgetRenderer.tsx` | Dynamic widget dispatcher |

## Testing

### Unit Tests

```bash
# Run unit tests for dashboard hooks and services
pnpm test src/app/hooks/useDashboards.test.ts
pnpm test src/app/hooks/useDashboard.test.ts
pnpm test src/app/services/dashboard.test.ts
```

### Component Tests

```bash
# Run component tests for dashboard UI
pnpm test src/app/components/dashboard/DashboardList.test.tsx
pnpm test src/app/components/dashboard/WidgetRenderer.test.tsx
```

### E2E Tests

```bash
# Run Playwright E2E tests
pnpm test:e2e
```

## Common Issues

### Dashboard list shows empty

- Verify `VITE_API_BASE_URL` is correct
- Check browser Network tab for 401/403 errors
- Ensure backend `/dashboards` endpoint returns data

### Widgets not rendering

- Verify widget `type` in backend response matches supported types: `stat`, `line`, `bar`, `pie`, `area`, `table`
- Check browser console for Zod validation errors
- Ensure `dataSource.endpoint` is a valid relative path

### Filter changes not reflecting

- Verify filter parameters are being serialized correctly in URL
- Check Network tab for widget data refetch requests
- Ensure backend accepts the filter query parameters

## Architecture Notes

### Widget Rendering Flow

```
DashboardPage
  ├── useDashboard(dashboardId) → fetch dashboard metadata + widget definitions
  ├── DashboardFilters → render filters from dashboard config
  └── WidgetGrid
      └── widgets.map(widget =>
          └── WidgetRenderer
              ├── useWidgetData(widget.id, filters) → fetch data
              └── [StatCardWidget | ChartWidget | TableWidget]
```

### State Flow

1. **Dashboard List**: `useDashboards()` → `dashboardService.getDashboards()` → render list
2. **Dashboard Detail**: `useDashboard(id)` → `dashboardService.getDashboard(id)` → render layout + filters
3. **Widget Data**: `useWidgetData(widgetId, filters)` → `dashboardService.getWidgetData()` → render widget
4. **Filter Changes**: Update URL params → trigger `useWidgetData` refetch → widgets re-render

## Next Steps

1. Implement dashboard service layer (`src/app/services/dashboard.ts`)
2. Create Zod schemas (`src/app/types/dashboard.ts`)
3. Build dashboard hooks (`src/app/hooks/useDashboards.ts`, etc.)
4. Create generic widget components (`src/app/components/dashboard/`)
5. Update routing to support dynamic dashboard pages
6. Remove hardcoded data from existing dashboard components
7. Write tests for all new code

## Rollback Plan

If issues arise, the existing hardcoded dashboard components remain in source control on previous branches. To rollback:

1. Restore previous dashboard component files from git history
2. Revert routing changes
3. Remove new dashboard service/types/hooks

## References

- [Specification](spec.md)
- [Data Model](data-model.md)
- [API Contracts](contracts/dashboard-api.md)
- [Constitution](../../.specify/memory/constitution.md)
