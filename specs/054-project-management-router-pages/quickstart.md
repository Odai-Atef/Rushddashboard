# Quickstart: Project Management Router Pages

**Feature**: Project Management Router Pages  
**Date**: 2026-06-20

## How to run the application

The project uses Vite. From the repository root:

```bash
npm install   # if dependencies are not present
npm run dev
```

The dev server URL is printed in the terminal (usually `http://localhost:5173`).

## How to test the routable project management pages

### 1. Dashboard

Open:

```text
http://localhost:5173/dashboard/project-management
```

Expected behavior:
- The project management dashboard renders with KPI cards, charts, and quick actions.
- Clicking "مشروع جديد" navigates to `/dashboard/project-management/create`.
- Clicking "عرض جميع المشاريع" navigates to `/dashboard/project-management/list`.

### 2. Project list

Open:

```text
http://localhost:5173/dashboard/project-management/list
```

Expected behavior:
- The project list renders with search, filters, and project rows/cards.
- Clicking a project name navigates to `/dashboard/project-management/details/1` (or another project id).

### 3. Create project

Open directly:

```text
http://localhost:5173/dashboard/project-management/create
```

Expected behavior:
- The create-project form renders without requiring a prior visit to the dashboard.

### 4. Project details and sub-views

Open directly:

```text
http://localhost:5173/dashboard/project-management/details/1
http://localhost:5173/dashboard/project-management/lifecycle/1
http://localhost:5173/dashboard/project-management/versions/1
http://localhost:5173/dashboard/project-management/activity/1
```

Expected behavior:
- Each route renders the corresponding view for project id `1`.
- Refreshing the page preserves the same view and project.
- Invalid or missing `projectId` shows an error message or redirects to `/dashboard/project-management/list`.

### 5. Reporting

Open:

```text
http://localhost:5173/dashboard/project-management/reporting
```

Expected behavior:
- The reporting placeholder view renders with a back button to the dashboard.

### 6. Unknown nested route

Open:

```text
http://localhost:5173/dashboard/project-management/unknown
```

Expected behavior:
- The browser redirects to `/dashboard/project-management`.

## Build verification

To verify the production build still compiles:

```bash
npm run build
```

No new build configuration is required for this feature.

## Files to review

- `src/app/routes.tsx`
- `src/app/components/ProjectManagementModule.tsx`
- `src/app/pages/project-management/*` (new page components)
- `src/app/components/Sidebar.tsx`
- `src/app/layouts/DashboardLayout.tsx`
