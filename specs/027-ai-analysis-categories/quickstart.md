# Quick Start: AI Analysis Categories

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Running Rushd backend locally or accessible staging endpoint

## Environment

Make sure `VITE_API_BASE_URL` points to your target backend:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Steps

1. **Start the dev server**
   ```bash
   pnpm dev
   ```

2. **Navigate to the AI Analysis page**
   Open `http://localhost:5173/dashboard/ai-analysis`

3. **Verify API-driven categories**
   - The category chip filter row should load from `GET /api/v1/analysis/categories`.
   - Categories display in order by `sortOrder`.
   - Each chip shows the Arabic name (`nameAr`) and the item `count`.

4. **Test interactions**
   - Click a chip: the analysis list filters to the selected category.
   - Click `"الكل"`: the filter resets to show all analyses.
   - Verify counts, labels, and selection highlight match expected behavior.

## Common Issues

- **401 Unauthorized**: ensure a valid access token is in `localStorage` after logging in.
- **Empty category list**: confirm the backend has seeded categories for the current user/company.
- **CORS errors**: verify the backend allows requests from `localhost:5173`.
