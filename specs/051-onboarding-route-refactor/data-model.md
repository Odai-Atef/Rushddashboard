# Data Model: Onboarding Route Refactor

## OnboardingStep

| Field | Type | Description |
|-------|------|-------------|
| id | string | Step identifier: `landing`, `registration`, `profile`, `assessment`, `documents`, `processing`, `results`, `analysis`, `roadmap`, `decision`. |
| labelAr | string | Arabic label for display in breadcrumbs or navigation. |
| requires | OnboardingStep[] | Earlier steps that must be reachable before this step. |

## OnboardingContextState

| Field | Type | Description |
|-------|------|-------------|
| organizationId | string \| null | ID of the current user's organization. |
| organization | Organization \| null | Organization data loaded from `useOnboardingRegistration`. |
| profileData | ProfileData | Organization profile form data. |
| fundingAreas | FundingArea[] | Selected funding areas. |
| assessmentCategories | AssessmentCategory[] | Assessment categories loaded from API. |
| assessmentAnswers | AssessmentAnswer[] | User's saved assessment answers. |
| currentAssessmentStep | number | Current category index in the assessment. |
| assessmentStatus | AssessmentStatus \| null | Server-side assessment status. |
| assessmentResult | IsivAssessmentResult \| null | Evaluation results. |
| uploadedFiles | UploadedFile[] | Documents uploaded for each slot. |
| documentsLoadError | string \| null | Error from loading existing documents. |
| isLoadingDocuments | boolean | Loading state for documents. |
| isSubmittingAssessment | boolean | Whether submission is in progress. |
| processingProgress | number | Progress percentage for processing screen. |
| resultsError | string \| null | Error from fetching results. |
| isLoadingResults | boolean | Loading state for results. |

## StepGuardResult

| Field | Type | Description |
|-------|------|-------------|
| allowed | boolean | Whether the requested step can be accessed. |
| redirectTo | OnboardingStep \| null | The step to redirect to if not allowed. |
| reason | string \| null | Human-readable reason for the guard decision. |
