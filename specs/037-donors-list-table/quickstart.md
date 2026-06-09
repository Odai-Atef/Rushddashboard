# Quick Start: Donors List Table

**Feature**: Donors List Table  
**Date**: 2026-06-08

## Prerequisites

- Node.js 18+ and pnpm/npm
- Backend API running (provides `GET /api/v1/api/v1/donors`)
- Valid `.env` file with `VITE_API_BASE_URL` configured

## Installation

No additional dependencies required. All required packages are already in `package.json`:

- `lucide-react` — Icons
- `date-fns` — Date formatting
- `react-router` — Routing (already used)
- Existing shadcn/ui components (Badge, Drawer, Table, Skeleton, etc.)

## Development Setup

1. **Install dependencies** (if not already installed):
   ```bash
   pnpm install
   ```

2. **Ensure environment variables are set** in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Start the dev server**:
   ```bash
   pnpm dev
   ```

4. **Navigate to the feature**:
   - Log in to the dashboard
   - Click "قاعدة الجهات المانحة" (Donors) in the sidebar
   - Or directly visit: `http://localhost:5173/dashboard/donors`

## Project Structure

```
src/
├── api/
│   ├── services/
│   │   └── donor-service.ts    # Donor API service (new)
│   └── hooks/
│       └── useDonors.ts        # React Query hook (new)
├── app/
│   ├── components/
│   │   └── donors/             # All donor feature components
│   │       ├── DonorsPage.tsx
│   │       ├── DonorsTable.tsx
│   │       ├── DonorsPagination.tsx
│   │       ├── DonorsFilters.tsx
│   │       ├── DonorRow.tsx
│   │       ├── DonorDetailDrawer.tsx
│   │       ├── FundingAreaBadge.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingState.tsx
│   │       └── ErrorState.tsx
│   └── hooks/
│       └── useDebounce.ts      # Debounce utility hook
├── types/
│   └── donors.ts               # Donor TypeScript types
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |

## Testing the Feature

### Manual Testing Checklist

1. [ ] Page loads and displays donor data from API
2. [ ] Pagination works (Previous/Next, page numbers, per-page selector)
3. [ ] Search by name filters the current page
4. [ ] Type filter dropdown filters by donor type
5. [ ] Funding area filter dropdown filters by funding area
6. [ ] Clicking a row opens the side drawer with full donor details
7. [ ] Drawer preserves list state when closed
8. [ ] Loading state shown while fetching data
9. [ ] Empty state shown when no donors match filters
10. [ ] Error state shown with retry button on API failure
11. [ ] Arabic names render correctly (RTL)
12. [ ] Source URL opens in new tab with external link icon
13. [ ] Funding areas display as colored tags
14. [ ] Mobile responsive (stacked cards or horizontal scroll)

### API Testing

Test the API endpoint directly:
```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/v1/api/v1/donors?page=1&limit=10"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 401 | Check auth token is valid and not expired |
| API returns 500 | Check backend logs; ensure donor data exists in database |
| Table shows empty | Verify `VITE_API_BASE_URL` points to correct backend |
| Drawer doesn't open | Check browser console for React errors |
| Arabic text looks wrong | Ensure `dir="rtl"` is set on Arabic content elements |

## Next Steps

After the feature is implemented:
1. Run `/speckit.tasks` to generate implementation tasks
2. Implement components following the plan in `plan.md`
3. Run `/speckit.checklist` to verify acceptance criteria
