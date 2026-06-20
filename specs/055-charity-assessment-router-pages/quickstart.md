# Quickstart: Charity Assessment Router Pages

**Feature**: Charity Assessment Router Pages  
**Date**: 2026-06-21

## Goal

Run the application locally and verify that the charity assessment module uses routable sub-pages under `/dashboard/charity-assessment/*`.

## Prerequisites

- Node.js and `pnpm` installed.
- Project dependencies installed (`pnpm install` or `npm install`).

## Run the dev server

```bash
pnpm dev
```

The dev server will start (typically on `http://localhost:5173`).

## Verify the routes

Open the following URLs directly in the browser. Each should render the expected view without requiring a prior visit to the start page.

| URL | Expected view |
|-----|---------------|
| `http://localhost:5173/dashboard/charity-assessment` | Start / intro screen |
| `http://localhost:5173/dashboard/charity-assessment/assessment` | Assessment wizard |
| `http://localhost:5173/dashboard/charity-assessment/results` | Results dashboard |
| `http://localhost:5173/dashboard/charity-assessment/roadmap` | Improvement roadmap |

## Verify navigation

From the start view:

- Click **بدء التقييم** → browser navigates to `/dashboard/charity-assessment/assessment`.
- Click **عرض نتائج سابقة** → browser navigates to `/dashboard/charity-assessment/results`.

From the results view:

- Click **عرض خارطة الطريق** → browser navigates to `/dashboard/charity-assessment/roadmap`.
- Click **إعادة التقييم** → browser navigates to `/dashboard/charity-assessment/assessment`.

From the roadmap view:

- Click **العودة للنتائج** → browser navigates to `/dashboard/charity-assessment/results`.

## Verify browser controls

- Use the browser back/forward buttons between charity assessment routes.
- Refresh each route; the same view should re-render.

## Verify sidebar / mobile navigation

- The sidebar (and mobile nav) item **تقييم الجاهزية** should link to `/dashboard/charity-assessment`.
- The item should remain visually active when viewing any nested charity assessment route.

## Verify unknown paths

Open `http://localhost:5173/dashboard/charity-assessment/unknown`. The application should redirect to `/dashboard/charity-assessment`.

## Build verification

```bash
pnpm build
```

The production build must complete without errors.

## Common issues

- **Route not matching**: Ensure nested routes are registered under `/dashboard/charity-assessment/*` with a wildcard fallback.
- **Menu not active on nested routes**: Update active-state detection to match `/dashboard/charity-assessment/*` instead of exact path matching.
- **Blank screen after split**: Verify each extracted page component is correctly exported and imported in `src/app/routes.tsx`.
