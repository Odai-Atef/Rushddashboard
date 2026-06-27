# Research Notes: Merge User and Organization Registration

**Feature**: Merge User and Organization Registration  
**Date**: 2026-06-27

## Decisions

### DEC-001: New page route and component location

- **Decision**: Route `/auth/register/org`, component `src/app/pages/auth/OrgRegistrationPage.tsx`.
- **Rationale**: Matches the requested URL, groups auth pages together, and separates the new page from the existing onboarding registration page.
- **Alternatives considered**: `src/app/components/OrgRegistrationPage.tsx`; rejected because auth pages are moving toward `pages/` organization.

### DEC-002: Merged and deduplicated field set

- **Decision**: Combine fields and remove duplicates.
  - Shared fields shown once: `email`, `phone`, `companyName`/`orgName`.
  - User-only fields: `fullName`, `password`, `confirmPassword`.
  - Organization-only fields: `licenseNumber`, `registrationDate`, `orgType`, `city`, `activity`/`overview`, `fundingAreas`.
- **Rationale**: Eliminates confusion and reduces form length while preserving all data needed for both entities.
- **Alternatives considered**: Keep duplicate fields with different names; rejected because it contradicts the core requirement.

### DEC-003: Atomic API endpoint ownership

- **Decision**: The frontend will call a new `POST /api/v1/auth/register/org` endpoint (or equivalent name) in the auth service namespace.
- **Rationale**: User registration is the primary entry point; onboarding is a secondary concern handled atomically by the backend.
- **Alternatives considered**: Place endpoint under onboarding service; rejected because user creation drives the flow.

### DEC-004: Visual layout

- **Decision**: Reuse the `/auth/register` two-column layout with a scrollable form area on the left.
- **Rationale**: Consistent auth branding; the form will be longer, so a scrollable left panel is acceptable.
- **Alternatives considered**: Use the onboarding stepper layout; rejected because the route is under `/auth/`.

### DEC-005: Existing pages remain unchanged

- **Decision**: Do not modify `src/app/components/RegistrationPage.tsx` or `src/app/pages/onboarding/RegistrationPage.tsx`.
- **Rationale**: Reduces regression risk and allows the new page to be rolled out gradually.
- **Alternatives considered**: Refactor shared parts into reusable components; deferred to avoid scope creep.

## Open Risks

- The exact backend endpoint name and payload shape are assumptions. The implementation should define a frontend interface and coordinate with backend.
- The combined form will be long; mobile UX may need testing.
- Password confirmation and terms acceptance may already exist on `/auth/register`; preserving them on the new page is straightforward.
- The existing onboarding registration page uses `onboardingService.saveMyOrganization` + `createProfile` + `setFundingAreas`; the new atomic endpoint must cover all of these.
