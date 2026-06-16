# Research: Organization Profile API Integration

**Feature**: Organization Profile API Integration
**Date**: Mon Jun 15 2026

## Context

The profile screen (step 2) of the charity onboarding flow currently collects organization profile data (overview, areasOfWork, targetBeneficiaries, geographicCoverage, employeeCount, volunteerCount, activeProjects) but does **not** persist it to the backend. Clicking "Next" only navigates to the assessment step via `setCurrentView('assessment')`, causing all data to be lost on page reload.

## Existing Infrastructure

### API Client
- Custom `fetch` wrapper at `src/api/client.ts`
- Bearer JWT token automatically attached from `localStorage`
- Built-in retry logic, timeout via `AbortController`, and 401 redirect handling
- No `axios` or `tanstack/react-query` used

### Service Layer
- `src/api/services/onboarding-service.ts` already defines:
  - `createProfile(orgId, data)` → `POST /api/v1/onboarding/organizations/:id/profile`
  - `setFundingAreas(orgId, data)` → `POST /api/v1/onboarding/organizations/:id/funding-areas`
  - `getFundingAreas()` → `GET /api/v1/donors/funding-areas`
  - `getProfile(orgId)` → `GET /api/v1/onboarding/organizations/:id/profile`
  - All DTO/response types are already defined (`OrganizationProfile`, `FundingArea`, `SetFundingAreasRequest`, `OrganizationProfileResponse`, `FundingAreaAssignment`)

### Hook Layer
- `src/app/hooks/useOnboardingRegistration.ts` already exports:
  - `createProfile(data: OrganizationProfile)` — calls service, handles loading/error, updates local `profile` state
  - `saveFundingAreas(fundingAreaIds, customAreas)` — calls service, handles loading/error, updates local `profile` state
  - `loadFundingAreas()` — fetches funding areas list, updates local `fundingAreas` state
  - `fundingAreas: FundingArea[]` — populated from `GET /api/v1/donors/funding-areas`
  - `organization: Organization | null` — contains saved org from registration step
  - `isLoading`, `isSaving`, `error`, `fieldErrors`, `clearError` — standard loading/error states
  - Arabic error messages built-in

### UI Component
- `src/app/components/CharityOnboardingFlow.tsx`
  - Already imports `useOnboardingRegistration` but only destructures `organization`, `isLoading`, `error`, `fieldErrors`, `loadOrganization`, `saveOrganization`, `clearError`
  - `ProfileView` is a nested component using local `profileData` state
  - Areas of work are **hardcoded** as Arabic strings in a checkbox grid
  - Next button simply calls `setCurrentView('assessment')` with no API call

## Decisions

- **No new services needed**: The onboarding service already has all required endpoints.
- **No new hooks needed**: `useOnboardingRegistration` already exposes all needed actions.
- **No backend changes needed**: APIs are assumed available per spec assumptions.
- **Minimal frontend changes**: The work is primarily wiring existing hook methods into the existing UI component.

## Open Questions Resolved

- **Framework**: React 18 + Vite (not Next.js — the spec text "Next" refers to the button action, not the framework).
- **State management**: Local hook state; no global store (Redux/Zustand) needed.
- **Error handling**: Hook provides Arabic error messages + `toast` integration already wired via `useEffect` in component.
