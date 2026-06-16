# Quickstart: Onboarding Route Refactor

This guide explains how to run and validate the onboarding route refactor once implemented.

## Prerequisites

- Node.js and npm installed.
- Backend services running and accessible via `ENV.API_BASE_URL`.
- Authenticated test user with access to the charity onboarding flow.

## Run the Development Server

```bash
npm run dev
```

Open the app at the printed local URL (usually `http://localhost:5174`).

## Validate Routes

### 1. Direct navigation

Paste each URL directly into the browser address bar and confirm the correct step renders:

- `/dashboard/onboarding/landing`
- `/dashboard/onboarding/registration`
- `/dashboard/onboarding/profile`
- `/dashboard/onboarding/assessment`
- `/dashboard/onboarding/documents`
- `/dashboard/onboarding/processing`
- `/dashboard/onboarding/results`
- `/dashboard/onboarding/analysis`
- `/dashboard/onboarding/roadmap`
- `/dashboard/onboarding/decision`

### 2. Refresh behavior

On each step, press `Cmd/Ctrl + R` and confirm:

- The same step is restored.
- Required data is reloaded (e.g. documents on `/dashboard/onboarding/documents`, results on `/dashboard/onboarding/results`).
- No "لم يبدأ التقييم بعد" or other incorrect fallback appears when valid state exists.

### 3. Browser history

Click through the flow using the in-app next/back buttons, then use the browser back/forward buttons. Confirm each step transition updates the URL and content correctly.

### 4. Route guards

- Open `/dashboard/onboarding/results` **before** submitting an assessment.
  - Expected: redirect to `/dashboard/onboarding/documents` or `/dashboard/onboarding/assessment`.
- Open `/dashboard/onboarding/documents` **before** completing the organization profile.
  - Expected: redirect to `/dashboard/onboarding/profile`.

### 5. Submission flow

1. Complete registration, profile, assessment, and documents.
2. Click "إرسال التقييم".
3. Confirm the URL changes to `/dashboard/onboarding/processing`.
4. After evaluation, confirm the URL changes to `/dashboard/onboarding/results`.
5. Click "عرض التحليل التفصيلي" and confirm `/dashboard/onboarding/analysis`.
6. Click "عرض خطة التطوير" and confirm `/dashboard/onboarding/roadmap`.

## Build Verification

```bash
npm run build
```

The build must complete without errors or new warnings.

## Common Issues

- **Blank page after refresh**: A guarded page may be redirecting because state was not hydrated. Check that the relevant context load action is called on mount.
- **URL does not change on button click**: A button may still be calling the old `setCurrentView` function. Search for remaining `setCurrentView` usages.
- **Upload progress lost on route change**: Document upload state must live in `OnboardingContext` instead of local component state.
