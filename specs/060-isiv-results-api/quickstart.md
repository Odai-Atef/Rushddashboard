# Quickstart: ISIV Charity Assessment Results API

## Goal

Verify that the charity assessment results page loads live ISIV evaluation data from `GET /api/v1/onboarding/assessments/{organizationId}/isiv-results` and no longer relies on the hardcoded sample values imported from `charity-assessment-data.ts`.

## Prerequisites

- Frontend dev server running (`npm run dev` or equivalent).
- Backend dev server running and the ISIV results endpoint available.
- Valid JWT session in the frontend (logged-in user).
- An organization with completed assessment results in the backend.

## Steps

1. **Open the results page**
   - Navigate to `/dashboard/charity-assessment/results/{organizationId}` using a real organization ID.
   - Confirm the page shows a centered loading spinner briefly, then renders content.

2. **Verify overall score and readiness badge**
   - Check that the overall score matches `overallScore` from the API.
   - Confirm the badge label is computed correctly:
     - ≥85 → "متميز"
     - ≥70 → "جاهز"
     - ≥55 → "متوسط"
     - <55 → "يحتاج تحسين"

3. **Verify qualification status**
   - Confirm `qualificationStatus` and `qualificationMessage` are displayed as returned by the API.

4. **Verify radar chart**
   - Confirm the radar chart renders with categories and scores from `radarData`.
   - Confirm the reference ring uses `fullMark` (typically 100).

5. **Verify benchmark bar chart**
   - Confirm the bar chart shows three bars: "منظمتك", "متوسط القطاع", and "أفضل ممارسة".
   - Confirm the values match `benchmarks.yourScore`, `benchmarks.sectorAverage`, and `benchmarks.topPerformer`.

6. **Verify strengths section**
   - Confirm each strength card shows `area`, `insight`, and `score` from the `strengths` array.
   - Confirm the visual theme is green.

7. **Verify gaps/weaknesses section**
   - Confirm each weakness card shows `area`, `issue`, and `recommendation`.
   - Confirm severity colors:
     - `critical` → red
     - `high` → orange
     - `medium` / `low` → yellow

8. **Verify progress tracking section**
   - If the API returns `progressData`, confirm the line chart plots monthly scores.
   - If the API omits `progressData`, confirm the progress tracking section is hidden and no hardcoded months are shown.

9. **Verify hardcoded values removed**
   - Confirm the page no longer imports hardcoded values from `charity-assessment-data.ts` for rendering results.
   - Confirm `charity-assessment-data.ts` is still imported by the assessment wizard page.

10. **Test error state**
    - Block or fail the API request (e.g., stop backend, go offline, or use browser dev tools).
    - Confirm an Arabic error message appears instead of hardcoded data.

11. **Test missing organizationId**
    - Navigate to `/dashboard/charity-assessment/results/` without an ID.
    - Confirm an Arabic error message appears and no API call is made with an empty identifier.

12. **Verify build passes**
    - Run `npm run build`.
    - Confirm no TypeScript errors related to `CharityAssessmentResultsPage.tsx` or `useIsivAssessmentResults.ts`.

## Cleanup Checklist

- [ ] Results page renders live API data.
- [ ] Hardcoded data imports removed from `CharityAssessmentResultsPage.tsx`.
- [ ] `charity-assessment-data.ts` preserved for the wizard page.
- [ ] New hook `useIsivAssessmentResults.ts` created in `src/api/hooks/`.
- [ ] `npm run build` passes.
