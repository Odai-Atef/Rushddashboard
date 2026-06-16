# Quickstart: Assessment Results Display

**Feature**: Assessment Results Display  
**Date**: 2026-06-16

## What This Feature Does

After a charity user completes the documents step and clicks **إرسال التقييم**, the frontend:

1. Submits the assessment to the backend.
2. Fetches the ISIV-based evaluation result.
3. Displays a results view with:
   - Overall score out of 120
   - Qualification status (Arabic label)
   - Static radar chart showing the four ISIV dimensions
   - Tier badges per dimension
   - Arabic diagnosis
   - Strengths and weaknesses lists

Returning users can reopen the results view and see their persisted result without resubmitting.

## Key Files

- `src/app/components/CharityOnboardingFlow.tsx` — main onboarding flow component
- `src/api/services/onboarding-service.ts` — API service layer
- `src/api/client.ts` — HTTP client

## Running the App Locally

```bash
pnpm install
pnpm dev
```

Open the browser at the Vite dev URL (usually `http://localhost:5173`) and navigate to `/dashboard/onboarding`.

## Testing the Feature Manually

1. Complete the onboarding steps up to **المستندات المطلوبة**.
2. Upload the four required documents.
3. Click **إرسال التقييم**.
4. Observe:
   - Loading indicator appears while evaluation runs.
   - Results view opens with the ISIV radar chart, score, status, badges, diagnosis, strengths, and weaknesses.
5. To test failure handling, block the `/assessments/{id}/results` network request and retry.
6. To test returning-user behavior, refresh the page while on `/dashboard/onboarding` and navigate back to the results view.

## Running Type Checks

```bash
pnpm exec tsc --noEmit
```

## Implementation Notes

- Do not hard-code ISIV dimension names, symbols, tier labels, or status labels. Render values supplied by the backend.
- The radar chart is static; no hover tooltips or clickable interactions are required.
- Retry after failure retries only the results fetch; the assessment remains submitted.
- Do not add silent auto-retry on slow responses.

## Common Pitfalls

- Replacing `AssessmentResult` in the service file may break other views that consume it. Verify that `analysis` and `decision` views only need the new ISIV shape or update them accordingly.
- The submit endpoint may return `409` if the assessment was already submitted; handle this gracefully by proceeding to fetch results.
