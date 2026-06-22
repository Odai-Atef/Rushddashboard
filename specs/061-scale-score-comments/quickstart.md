# Quickstart: Scale Score Descriptions

**Feature**: Scale Score Descriptions (`specs/061-scale-score-comments`)  
**Date**: 2026-06-22

## Running the Project

```bash
npm install
npm run dev
```

The dev server starts on the default Vite port (`http://localhost:5173` unless configured otherwise).

## Viewing the Feature

1. Log in to the application.
2. Navigate to `/dashboard/onboarding/assessment?organizationId={your-org-id}`.
3. Locate any `SCALE` question.
4. Hover over or click/select a score value (1-5).
5. The description below/near the scale should update to the localized comment from the backend.

## Verifying the API Contract

Use curl or any HTTP client with a valid bearer token:

```bash
curl -H "Authorization: Bearer <token>" \
  "https://{API_BASE_URL}/api/v1/onboarding/evaluation-comments?organizationId={orgId}"
```

Expected response shape:

```json
{
  "success": true,
  "data": {
    "{questionId}": [
      { "tier": "CRITICAL", "commentAr": "...", "commentEn": "..." },
      { "tier": "EMERGING", "commentAr": "...", "commentEn": "..." },
      { "tier": "MEDIUM", "commentAr": "...", "commentEn": "..." },
      { "tier": "ADVANCED", "commentAr": "...", "commentEn": "..." },
      { "tier": "PIONEER", "commentAr": "...", "commentEn": "..." }
    ]
  }
}
```

## Testing Checklist

- [ ] Assessment page loads without errors when comments are available.
- [ ] Hovering/selecting a score shows the matching `commentAr` text for that question.
- [ ] Selecting scores on different questions shows the correct per-question comment.
- [ ] When comments are missing for a question, no error is shown and the scale remains usable.
- [ ] When the API fails, the assessment page still renders questions and allows answering.
- [ ] Rapidly hovering across scores does not cause UI flicker or stale text.

## Common Issues

- **No descriptions appear**: Verify the `organizationId` query parameter is present and the API returns data for the visible questions.
- **Wrong description shown**: Confirm the score-to-tier mapping (1 → CRITICAL ... 5 → PIONEER) matches the backend intent.
- **Session redirect on page load**: The API client handles 401 by redirecting to `/auth/login?expired=true`; re-authenticate and return to the assessment URL.
