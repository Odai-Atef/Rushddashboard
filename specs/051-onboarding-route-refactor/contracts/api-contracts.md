# API Contracts: Onboarding Route Refactor

This feature does not introduce new API endpoints. It reuses the existing onboarding API contracts already defined in `src/api/services/onboarding-service.ts`.

## Existing Endpoints Used

- `GET /api/v1/onboarding/organizations/me`
- `PUT /api/v1/onboarding/organizations/me`
- `POST /api/v1/onboarding/organizations/:id/profile`
- `GET /api/v1/onboarding/organizations/:id/profile`
- `GET /api/v1/onboarding/assessment/categories`
- `GET /api/v1/onboarding/assessment/state`
- `PUT /api/v1/onboarding/assessment/answers`
- `POST /api/v1/onboarding/assessment/submit?organizationId=...`
- `GET /api/v1/onboarding/assessments/:organizationId/status`
- `GET /api/v1/onboarding/assessments/:organizationId/results`
- `GET /api/v1/onboarding/documents?organizationId=...`
- `POST /api/v1/onboarding/documents/upload?organizationId=...`
- `DELETE /api/v1/onboarding/documents/:id`

## Data Shape Notes

- The `/results` endpoint returns data wrapped in the standard `ApiResponse` envelope: `{ success, data, message }`. Some backend responses also nest the payload under `data.data`, so the frontend unwraps both shapes for compatibility.
- The `/status` endpoint returns `{ status, overallScore, completedAt }`.
- Document types are mapped between frontend slot IDs and backend document types via `DOCUMENT_SLOT_MAPPING` and `BACKEND_DOCUMENT_TYPE_TO_SLOT`.
