# Research: Onboarding Pre-fill on Reload

**Feature**: Onboarding Pre-fill on Reload
**Date**: Mon Jun 15 2026

## Context

When a user reloads the onboarding page after having already saved their organization and/or profile, all forms appear empty and the user is placed at the landing step. The backend `GET /api/v1/onboarding/organizations/me` already returns the full organization object with embedded `profile` and `fundingAreas`. The frontend simply does not use this data to pre-fill local form state or navigate to the correct step.

## Existing Infrastructure

### API Client
- Custom `fetch` wrapper at `src/api/client.ts`
- Bearer JWT from `localStorage` automatically attached
- 401 handler redirects to `/auth/login?expired=true`

### Service Layer
- `src/api/services/onboarding-service.ts`:
  - `getMyOrganization()` → `GET /api/v1/onboarding/organizations/me`
  - Returns `Organization` with optional `profile?: OrganizationProfileResponse` and `fundingAreas?: FundingAreaAssignment[]`

### Hook Layer
- `src/app/hooks/useOnboardingRegistration.ts`:
  - `loadOrganization()` — calls `getMyOrganization()`, stores in `organization` state
  - `organization: Organization | null` — includes `profile` and `fundingAreas`
  - `profile: OrganizationProfileResponse | null` — separate state updated by `createProfile`
  - `fundingAreas: FundingArea[]` — system-managed list (from `GET /api/v1/donors/funding-areas`)
  - `isLoading`, `error`, `clearError` — standard states

### UI Component
- `src/app/components/CharityOnboardingFlow.tsx`:
  - `currentView` state defaults to `'landing'`
  - `registrationData` and `profileData` local states — never pre-filled from `organization`
  - Already calls `loadOrganization()` when `currentView === 'registration'`
  - Already has `useEffect` to pre-fill registration from `organization` when org arrives — but only after user manually navigates to registration step

## Root Cause

1. `loadOrganization()` is only triggered when `currentView === 'registration'`. On first mount (landing), no fetch happens.
2. Even after `organization` arrives, there is no logic to pre-fill `profileData` from `organization.profile`.
3. `currentView` always starts as `'landing'`, ignoring `organization.currentStep`.
4. Funding area checkboxes compare `profileData.areasOfWork` (IDs) against `fundingAreas[].id`. If `profileData.areasOfWork` is empty (default), no boxes are ticked even if `organization.profile.fundingAreas` has saved selections.

## Decisions

- **No new API endpoints needed**: `getMyOrganization()` already returns all required data.
- **No hook changes needed**: `useOnboardingRegistration` already exposes `organization`, `profile`, `loadOrganization`. Minor additions may be needed to extract `fundingAreaId`s from saved profile.
- **Single file change**: `CharityOnboardingFlow.tsx` — add mount-time `loadOrganization()`, pre-fill both `registrationData` and `profileData` from `organization`, and navigate using `organization.currentStep`.

## Open Questions Resolved

- **Step mapping**: `currentStep` values from backend (`REGISTRATION`, `PROFILE`, `ASSESSMENT`, etc.) map directly to `ViewType` values (`'registration'`, `'profile'`, `'assessment'`). A simple lowercase conversion is sufficient.
- **Funding area pre-fill**: The saved profile contains `fundingAreas: FundingAreaAssignment[]` with `fundingAreaId`. The form state `profileData.areasOfWork` stores IDs. Pre-fill by mapping `organization.profile.fundingAreas.map(fa => fa.fundingAreaId)`.
- **No localStorage orgId**: The spec explicitly prohibits storing orgId client-side. The JWT-based `/me` endpoint already satisfies this — no changes needed.
