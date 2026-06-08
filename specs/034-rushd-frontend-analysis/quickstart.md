# Quickstart: AI Analysis API-Driven Category Filters

**Date**: 2026-06-08
**Feature**: AI Analysis API-Driven Category Filters

## Prerequisites

- Existing Rushd frontend repo checked out on branch `034-rushd-frontend-analysis`.
- Node.js toolchain installed (project uses Vite + React).
- Backend endpoint `GET /api/v1/analysis/categories` is running and accessible.
- Environment config in `src/api/config.ts` points to the correct API base URL.

## Local Development Steps

1. Ensure dependencies are installed:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. Navigate to `/dashboard/ai-analysis`.

4. Open browser DevTools → Network tab.

5. Click **"New Analytics"** (or **"تحليل جديد"**) to open the modal.

6. Verify:
   - A `GET` request to `/api/v1/analysis/categories` is issued.
   - Filter buttons render from the response, sorted by `sortOrder` ascending.
   - The "All" button is always present.
   - Clicking a category filters the card grid.
   - Clicking "All" resets the filter.

## Testing Checklist

- [ ] Modal opens without console errors.
- [ ] Category buttons appear only after the network request returns.
- [ ] Buttons are ordered by `sortOrder` ascending.
- [ ] "All" button remains visible regardless of API state.
- [ ] If the request fails (simulate with DevTools Network → Offline), the modal still shows "All" + search.
- [ ] Empty backend response results in only the "All" button.
- [ ] Search + category filter applied together narrows results correctly.

## Rollback

If issues arise, revert the single commit for this feature branch. The diff is scoped to:
- `src/api/services/analysis-service.ts` (new)
- `src/app/hooks/useAnalysisCategories.ts` (new)
- `src/app/components/AIAnalysisPage.tsx` (targeted edit)

No other files are affected.
