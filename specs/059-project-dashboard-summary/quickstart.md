# Quickstart: Project Dashboard Summary

## Goal

Verify that the project dashboard loads live data from `GET /api/v1/projects/dashboard/summary` and no longer relies on the hardcoded `project-data.ts` file.

## Prerequisites

- Frontend dev server running (`npm run dev` or equivalent).
- Backend dev server running and the dashboard summary endpoint available.
- Valid JWT session in the frontend (logged-in user).

## Steps

1. **Open the dashboard**
   - Navigate to `/dashboard/project-management`.
   - Confirm the page shows a loading spinner briefly, then renders content.

2. **Verify stats cards**
   - Check that the numbers match the `stats` object returned by the API (`total`, `active`, `draft`, `awaitingApproval`, `approved`, `funded`, `completed`).
   - Confirm none of the values match the old hardcoded sample data.

3. **Verify status distribution pie chart**
   - Confirm the pie chart renders with slices matching `statusDistribution` from the API.
   - Hover over slices and confirm labels and counts are correct.

4. **Verify budget trend line chart**
   - Confirm the line chart plots months and budget values from `budgetTrend`.

5. **Verify recent activity feed**
   - Confirm entries show `userName`, `action`, `projectName`, and an Arabic relative time such as "منذ ساعتين".

6. **Verify upcoming deadlines**
   - Confirm deadlines show `projectName`, `deadline`, `daysLeft`, and a colored priority badge.

7. **Test error state**
   - Block or fail the API request (e.g., stop backend or use browser dev tools to throttle to offline).
   - Confirm an Arabic error message appears instead of hardcoded data.

8. **Test empty-state resilience**
   - If possible, mock the API to return empty arrays.
   - Confirm the page does not crash and shows empty-state placeholders or zero values.

9. **Verify build passes**
   - Run `npm run build`.
   - Confirm no TypeScript errors related to `ProjectDashboardPage.tsx` or `useProjectDashboard.ts`.

10. **Clean up**
    - Search the codebase to confirm no file still imports `project-data.ts`.
    - Delete `src/app/pages/project-management/project-data.ts`.
    - Run `npm run build` again to confirm deletion is safe.

## Cleanup Checklist

- [ ] Dashboard renders live API data.
- [ ] Hardcoded `project-data.ts` import removed from `ProjectDashboardPage.tsx`.
- [ ] No other file imports `project-data.ts`.
- [ ] `project-data.ts` file deleted.
- [ ] `npm run build` passes after deletion.
