# Implementation Plan: Onboarding Route Refactor

## Overview

Convert the charity onboarding wizard (`CharityOnboardingFlow.tsx`) from a single component that switches internal views to a set of React Router routes under `/dashboard/onboarding/:step`. Each step becomes an addressable page, making the flow debuggable, shareable, and robust against refreshes.

## Phases

### Phase 1 - Foundation (1–2 days)

1. **Create new page directory**
   - Add `src/app/pages/onboarding/` with one page file per step.
   - Page files:
     - `OnboardingLandingPage.tsx`
     - `OnboardingRegistrationPage.tsx`
     - `OnboardingProfilePage.tsx`
     - `OnboardingAssessmentPage.tsx`
     - `OnboardingDocumentsPage.tsx`
     - `OnboardingProcessingPage.tsx`
     - `OnboardingResultsPage.tsx`
     - `OnboardingAnalysisPage.tsx`
     - `OnboardingRoadmapPage.tsx`
     - `OnboardingDecisionPage.tsx`
     - `index.ts` barrel export

2. **Create shared OnboardingContext**
   - Move state that currently lives in `CharityOnboardingFlow` into a context:
     - `currentView` will be replaced by the URL.
     - `assessmentResult`, `assessmentStatus`, `assessmentAnswers`, `currentAssessmentStep`
     - `uploadedFiles`, document upload progress
     - `processingProgress`, `isSubmittingAssessment`
     - ephemeral UI state that must persist across route changes
   - Expose actions to load, save, submit, and reset onboarding data.

3. **Create step guard hook**
   - `useOnboardingGuard(step: OnboardingStep)`
   - Returns whether the user is allowed to access the step and the redirect target if not.
   - Guards are based on:
     - organization existence (registration)
     - profile completeness (profile → documents)
     - assessment completion (documents → processing)
     - assessment submission status (processing → results)
     - results availability (results, analysis, roadmap, decision)

### Phase 2 - Extract Views into Pages (2–3 days)

1. **Extract each view function from `CharityOnboardingFlow.tsx` into its own page component.**
   - Keep JSX and local handler functions intact.
   - Replace `setCurrentView(...)` with `navigate(...)` or `<Link>`.
   - Replace local state reads/writes with context values/actions.

2. **Refactor shared hooks**
   - Ensure `useOnboardingRegistration` continues to load organization/funding areas.
   - Move assessment submission, status polling, and results fetching into context actions so they can be invoked from processing/results pages.

3. **Update navigation buttons**
   - Next/back buttons use `navigate('/dashboard/onboarding/' + nextStep)`.
   - Inline links such as "عرض خطة التطوير" and "عرض التحليل التفصيلي" use `navigate`.

### Phase 3 - Router Integration (1 day)

1. **Update `src/app/routes.tsx`**
   - Replace the single `path: 'onboarding'` route with a nested route:
     ```tsx
     {
       path: 'onboarding',
       children: [
         { index: true, element: <Navigate to="landing" replace /> },
         { path: 'landing', Component: OnboardingLandingPage },
         { path: 'registration', Component: OnboardingRegistrationPage },
         { path: 'profile', Component: OnboardingProfilePage },
         { path: 'assessment', Component: OnboardingAssessmentPage },
         { path: 'documents', Component: OnboardingDocumentsPage },
         { path: 'processing', Component: OnboardingProcessingPage },
         { path: 'results', Component: OnboardingResultsPage },
         { path: 'analysis', Component: OnboardingAnalysisPage },
         { path: 'roadmap', Component: OnboardingRoadmapPage },
         { path: 'decision', Component: OnboardingDecisionPage },
         { path: '*', element: <Navigate to="landing" replace /> },
       ],
     }
     ```

2. **Add route-aware guards**
   - Each guarded page checks `useOnboardingGuard` on mount and redirects if needed.
   - Alternatively, create a wrapper component `OnboardingStepGuard` that handles redirections declaratively.

### Phase 4 - State Hydration and Edge Cases (1–2 days)

1. **Hydrate state on deep link**
   - On each page mount, call the appropriate load action if data is missing.
   - Example: `OnboardingResultsPage` fetches assessment status and results if `assessmentResult` is null.

2. **Processing step behavior**
   - If `/dashboard/onboarding/processing` is opened and evaluation is already complete, redirect to `/dashboard/onboarding/results`.
   - If still pending, show the processing screen and poll for completion.

3. **Unknown routes and index route**
   - `/dashboard/onboarding` → redirect to landing.
   - Unknown step → redirect to landing or the furthest reachable valid step.

### Phase 5 - Testing and Cleanup (1–2 days)

1. **Manual QA checklist**
   - Each route loads directly via URL.
   - Refresh preserves step and data.
   - Back/forward buttons work.
   - Guards redirect correctly.
   - Submission flow still works end-to-end.

2. **Build and lint**
   - Run `npm run build` and resolve any TypeScript errors.
   - Remove unused imports and the old `CharityOnboardingFlow.tsx` file once all pages are verified.

3. **Update AGENTS.md or relevant docs**
   - Document the new route structure for future developers.

## Files to Create/Modify

### New Files

- `src/app/pages/onboarding/OnboardingLandingPage.tsx`
- `src/app/pages/onboarding/OnboardingRegistrationPage.tsx`
- `src/app/pages/onboarding/OnboardingProfilePage.tsx`
- `src/app/pages/onboarding/OnboardingAssessmentPage.tsx`
- `src/app/pages/onboarding/OnboardingDocumentsPage.tsx`
- `src/app/pages/onboarding/OnboardingProcessingPage.tsx`
- `src/app/pages/onboarding/OnboardingResultsPage.tsx`
- `src/app/pages/onboarding/OnboardingAnalysisPage.tsx`
- `src/app/pages/onboarding/OnboardingRoadmapPage.tsx`
- `src/app/pages/onboarding/OnboardingDecisionPage.tsx`
- `src/app/pages/onboarding/index.ts`
- `src/app/contexts/OnboardingContext.tsx` (or extend existing context)
- `src/app/hooks/useOnboardingGuard.ts`

### Modified Files

- `src/app/routes.tsx` — replace single onboarding route with nested routes.
- `src/app/components/CharityOnboardingFlow.tsx` — extract all views; eventually delete.
- `src/app/hooks/useOnboardingRegistration.ts` — ensure data loading works across pages.
- `AGENTS.md` — update current plan reference if needed.

## Estimated Effort

- **Total**: 5–9 days for one developer.
- **Risk areas**:
  - Splitting the large `CharityOnboardingFlow.tsx` file without breaking state synchronization.
  - Document upload progress state across route changes.
  - Guard logic interacting with server-side status.

## Dependencies

- React Router v7 (already installed).
- Existing onboarding API service and `useOnboardingRegistration` hook.

## Rollback Plan

- Keep the original `CharityOnboardingFlow.tsx` until the new route pages are fully tested.
- If critical issues arise, revert `routes.tsx` to use `CharityOnboardingFlow` again.
