# Feature Specification: Onboarding Route Refactor

**Feature Branch**: `051-onboarding-route-refactor`  
**Created**: 2026-06-16  
**Status**: Draft  
**Input**: User description: "Convert the charity onboarding wizard from internal view-state switching to proper React Router routes so each step is addressable via URL (e.g. /dashboard/onboarding/registration, /dashboard/onboarding/documents, /dashboard/onboarding/results)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Direct Navigation to Onboarding Steps (Priority: P1)

A charity user receives a link to a specific onboarding step (e.g. documents upload) or refreshes the browser while filling the assessment. The app restores the correct step from the URL instead of resetting to the landing page.

**Why this priority**: URL-addressable steps are the primary value of the refactor. Without them, users lose their place on refresh and support cannot share direct links.

**Independent Test**: A user can paste `/dashboard/onboarding/assessment` into the address bar and land directly on the assessment step after authentication and data hydration.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they navigate to `/dashboard/onboarding/:step`, **Then** the app renders the matching onboarding step.
2. **Given** the user refreshes the page on `/dashboard/onboarding/documents`, **When** the page reloads, **Then** they remain on the documents step and previously uploaded documents are reloaded.
3. **Given** the user visits an unknown onboarding sub-route, **When** the route does not exist, **Then** they are redirected to `/dashboard/onboarding` (landing) or the closest valid step based on their state.

---

### User Story 2 - Step Guards and State Hydration (Priority: P1)

The system protects onboarding steps that depend on earlier data. A user cannot reach the results step without a submitted assessment, and the system hydrates required state automatically when a deep link is opened.

**Why this priority**: Deep links are only useful if the underlying data is available. Guards prevent broken screens and data errors.

**Independent Test**: A user can open `/dashboard/onboarding/results` directly and, if they have a completed assessment, see real results without clicking through prior steps.

**Acceptance Scenarios**:

1. **Given** the user has a submitted/completed assessment, **When** they navigate to `/dashboard/onboarding/results`, **Then** the results view loads with their evaluation data.
2. **Given** the user has not submitted an assessment, **When** they navigate to `/dashboard/onboarding/results`, **Then** they are redirected to the appropriate earlier step (documents or assessment).
3. **Given** the user's organization profile is incomplete, **When** they navigate to `/dashboard/onboarding/documents`, **Then** they are redirected to `/dashboard/onboarding/profile` to complete required fields first.

---

### User Story 3 - Navigation Buttons Use Routes (Priority: P2)

All next/back buttons inside the onboarding flow update the browser URL using React Router navigation instead of mutating local component state. The browser back/forward buttons move between steps correctly.

**Why this priority**: Route-based navigation makes the flow feel like a normal web app and enables standard browser history behavior.

**Independent Test**: Clicking the back button in the browser returns the user to the previous onboarding step.

**Acceptance Scenarios**:

1. **Given** the user is on `/dashboard/onboarding/profile`, **When** they click the next button, **Then** the URL changes to `/dashboard/onboarding/assessment`.
2. **Given** the user navigates from registration to profile to assessment, **When** they click the browser back button, **Then** they return to profile, then registration.
3. **Given** the user clicks an in-flow link such as "عرض خطة التطوير", **When** the action completes, **Then** the URL updates to `/dashboard/onboarding/roadmap`.

---

### User Story 4 - Shared State and Persistence (Priority: P2)

Onboarding state (organization, profile, assessment answers, uploaded documents, results) is lifted out of a single component and shared across route pages so that each page can render independently on direct access.

**Why this priority**: Splitting the wizard into pages is only viable if they share a common state layer.

**Independent Test**: Opening `/dashboard/onboarding/results` in a new tab after submission still shows the correct score and qualification status.

**Acceptance Scenarios**:

1. **Given** the user submits the assessment, **When** they open `/dashboard/onboarding/results` in a new tab, **Then** the score, status, dimensions, and diagnosis are displayed.
2. **Given** the user uploaded documents, **When** they navigate to `/dashboard/onboarding/documents` after refresh, **Then** the uploaded documents are listed.
3. **Given** the user is mid-assessment, **When** they return to `/dashboard/onboarding/assessment`, **Then** their previous answers are restored.

---

## Edge Cases

- A user bookmarks `/dashboard/onboarding/processing` while evaluation is running. On revisit, if the evaluation is already complete, they are redirected to `/dashboard/onboarding/results`; if still pending, the processing screen polls or waits appropriately.
- A user manually types a step that is later than their actual progress (e.g. results before submission). The app redirects to the furthest reachable valid step instead of crashing or showing empty placeholders.
- The user is not authenticated. All onboarding routes redirect to `/auth/login` with a `redirect` parameter pointing back to the requested onboarding route.
- Network failure while hydrating state on a deep link. The page shows the existing error state and retry actions defined in the current onboarding flow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST register React Router routes for every onboarding step under `/dashboard/onboarding/:step`.
- **FR-002**: System MUST support the following routes: `landing`, `registration`, `profile`, `assessment`, `documents`, `processing`, `results`, `analysis`, `roadmap`, `decision`.
- **FR-003**: System MUST redirect `/dashboard/onboarding` (index) to `/dashboard/onboarding/landing` or render the landing step directly.
- **FR-004**: System MUST hydrate shared onboarding state on each route mount (organization, profile, assessment status, documents, results).
- **FR-005**: System MUST guard routes that require prior completion and redirect users to the correct earlier step when preconditions are not met.
- **FR-006**: System MUST replace internal `setCurrentView(...)` calls with React Router `navigate(...)` or `<Link>`.
- **FR-007**: System MUST preserve browser history so back/forward buttons move between onboarding steps.
- **FR-008**: System MUST keep the existing data loading, error handling, toast notifications, and loading states intact after the refactor.
- **FR-009**: System MUST continue to work without JavaScript route changes for users who refresh or use direct links.
- **FR-010**: System MUST pass required parameters such as `organizationId` between routes where needed, either via URL params, query params, or shared context.

### Non-Functional Requirements

- **NFR-001**: Each onboarding page SHOULD be lazy-loaded to keep initial bundle size reasonable.
- **NFR-002**: The refactor SHOULD reuse existing UI components and styles with minimal visual changes.
- **NFR-003**: Route guards SHOULD not block legitimate returning users who have valid persisted state.

### Key Entities *(include if feature involves data)*

- **OnboardingStep**: A named step in the charity onboarding wizard (landing, registration, profile, assessment, documents, processing, results, analysis, roadmap, decision).
- **OnboardingState**: Shared state including organization data, profile data, assessment answers/status/results, uploaded documents, and current progress.
- **StepGuard**: Logic that decides whether a user is allowed to access a given onboarding route based on their state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every onboarding step is reachable via a distinct URL matching `/dashboard/onboarding/:step`.
- **SC-002**: Refreshing the browser on any valid onboarding route restores the same step and hydrated data.
- **SC-003**: Browser back/forward buttons navigate through the onboarding steps correctly.
- **SC-004**: Direct navigation to `/dashboard/onboarding/results` for a user with a completed assessment displays real data without clicking through prior steps.
- **SC-005**: No regression in existing onboarding functionality (registration, profile, assessment, documents, results, analysis, roadmap, decision screens behave as before).
- **SC-006**: Build passes (`npm run build`) and no new console warnings or errors are introduced.

## Clarifications

### Session 2026-06-16

- **Q**: Should the refactor split every step into its own file/page, or keep multiple small views in a single file per logical group?  
  **A**: Split every step into its own page component under `src/app/pages/onboarding/` for clarity and maintainability.
- **Q**: How should shared state be managed after splitting?  
  **A**: Use a combination of the existing `useOnboardingRegistration` hook for server state and a new `OnboardingContext` for ephemeral wizard state (current answers, upload progress, results cache).
- **Q**: Should the processing step be a route, or should submission redirect straight to results?  
  **A**: Keep `/dashboard/onboarding/processing` as a route so the evaluation progress screen is bookmarkable and debuggable; redirect to results when complete.
- **Q**: What happens to unsupported old routes or the current `/dashboard/onboarding` route?  
  **A**: `/dashboard/onboarding` renders the landing step as the index route; unknown sub-routes redirect to landing.
- **Q**: Should lazy loading be required now, or can it be added later?  
  **A**: Lazy loading is recommended but not mandatory for the initial refactor; it can be added as a follow-up optimization.
- **Q**: How should required parameters such as `organizationId` be passed between routes?  
  **A**: Use shared context and route params where appropriate. The organization is loaded by `useOnboardingRegistration`, so pages read it from context. For direct links, each page hydrates the required state on mount.

## Assumptions

- The existing `useOnboardingRegistration` hook and onboarding API service remain the source of truth for server-side state.
- React Router v7 (already used in `routes.tsx`) is available and supports nested routes, route loaders, and `<Navigate>`.
- The current UI components (`LandingView`, `RegistrationView`, etc.) can be extracted into separate page components with minimal behavioral changes.
- Authentication and dashboard layout wrapping are already handled by the existing route configuration in `routes.tsx`.
- State that currently lives inside `CharityOnboardingFlow` (e.g. `currentView`, `assessmentResult`, `uploadedFiles`) can be moved to a shared context or URL query params where appropriate.
