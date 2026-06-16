# Feature Specification: Onboarding Pre-fill on Reload

**Feature Branch**: `[###-feature-name]`
**Created**: Mon Jun 15 2026
**Status**: Draft
**Input**: User description: "When a user reloads the onboarding page after having already saved their organization, the registration form (step 2) is empty. If the profile exists, the profile form (step 3) is also empty. The funding areas checkboxes are not ticked. The user must re-enter everything. The backend GET /organizations/me already returns the organization with embedded profile and funding areas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Resume onboarding from correct step after reload (Priority: P1)

As a charity administrator who has partially completed the onboarding process, when I reload the onboarding page, the system should restore my previously entered registration and profile information and place me at the correct step so that I do not have to re-enter any data.

**Why this priority**: Users naturally refresh pages, switch tabs, or return later. Without state restoration, they face a frustrating empty form and may abandon the onboarding flow entirely. This is the core value of the feature.

**Independent Test**: Can be fully tested by completing the registration step, refreshing the page, and verifying that all registration fields are pre-filled and the user is placed on the profile step (or whichever step matches their saved progress).

**Acceptance Scenarios**:

1. **Given** a user who has previously saved their organization registration, **When** they reload the onboarding page, **Then** the registration form is pre-filled with their saved data and the system places them at the step matching their saved progress.
2. **Given** a user who has previously saved both registration and profile data, **When** they reload the onboarding page, **Then** both the registration form and the profile form are pre-filled, including the correct funding areas being ticked, and the user is placed at the step matching their saved progress.
3. **Given** a user who has never started onboarding, **When** they load the onboarding page, **Then** they see empty forms and start from the first step without errors.

---

### User Story 2 - Restore saved funding area selections on reload (Priority: P2)

As a charity administrator, when I reload the onboarding page after having selected my organization's areas of work, I want those selections to be visibly ticked again so that I can confirm or modify them without starting over.

**Why this priority**: Funding areas are a critical part of the profile and represent multiple selections. Restoring them individually prevents re-work and ensures the user sees exactly what they previously chose.

**Independent Test**: Can be tested by selecting funding areas in the profile step, refreshing the page, and verifying that the same checkboxes are ticked based on the saved profile data.

**Acceptance Scenarios**:

1. **Given** a user who previously selected funding areas in their profile, **When** the profile form is restored after a reload, **Then** the funding area checkboxes that were previously selected remain ticked.
2. **Given** a user viewing the restored profile form, **When** they compare the ticked boxes to their previous selections, **Then** the selections exactly match the saved profile data.

---

### User Story 3 - Navigate to the correct onboarding step based on saved progress (Priority: P2)

As a charity administrator, when I return to the onboarding page, I want to resume exactly where I left off rather than always starting from the first step, so that I can efficiently continue my application.

**Why this priority**: A multi-step onboarding flow with four or more steps becomes tedious if the user must click through completed steps every time they return. Resuming at the correct step respects their time.

**Independent Test**: Can be tested by progressing to different steps in the onboarding flow, reloading the page each time, and verifying that the user lands on the step matching their current progress.

**Acceptance Scenarios**:

1. **Given** a user whose saved progress indicates they are on the registration step, **When** they reload the onboarding page, **Then** they see the registration step.
2. **Given** a user whose saved progress indicates they are on the profile step, **When** they reload the onboarding page, **Then** they see the profile step.
3. **Given** a user whose saved progress indicates they are on the assessment step, **When** they reload the onboarding page, **Then** they see the assessment step.

---

### Edge Cases

- What happens if the user refreshes while the data is still being fetched? The system must show a loading indicator and not display empty forms prematurely.
- What happens if the backend returns an authentication error (401)? The system must redirect the user to the login page.
- What happens if the backend returns no organization (404)? The system must show empty forms and start from the first step without alarming the user.
- What happens if numeric values such as employee count or volunteer count are missing from the saved data? The system must leave those fields blank rather than showing incorrect defaults.
- What happens if the funding areas list from the system does not include an area that was previously saved in the user's profile? The system should handle the discrepancy gracefully without throwing errors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST fetch the user's saved organization data on page load using their existing authentication credentials.
- **FR-002**: The system MUST pre-fill the registration form fields with the saved organization data when it exists.
- **FR-003**: The system MUST pre-fill the profile form fields with the saved profile data when it exists, converting stored values to the format required by the form inputs.
- **FR-004**: The system MUST tick the funding area checkboxes that match the areas previously saved in the user's profile.
- **FR-005**: The system MUST place the user at the onboarding step that corresponds to their saved progress state.
- **FR-006**: The system MUST display a loading indicator while fetching saved data and MUST not show empty forms during this time.
- **FR-007**: The system MUST redirect unauthenticated users to the login page instead of showing empty forms.
- **FR-008**: The system MUST show empty forms and start from the first step for new users who have no saved organization data.

### Key Entities *(include if feature involves data)*

- **Organization**: The registered entity containing basic identifying information (name, license, contact details). Serves as the parent record for the profile.
- **Organization Profile**: Extended information about the organization's activities, beneficiaries, coverage, and linked funding areas. Embedded within or linked to the Organization.
- **Funding Area Assignment**: A link between an organization and a system-managed funding area. Contains the funding area identifier used to match and tick checkboxes on the form.
- **Onboarding Step**: The current stage of the user's progress in the multi-step flow (e.g., registration, profile, assessment).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of returning users who have saved organization data see their registration form fully pre-filled after reloading the page.
- **SC-002**: 100% of returning users who have saved profile data see their profile form fully pre-filled and funding area checkboxes correctly ticked after reloading the page.
- **SC-003**: Users are placed at the correct onboarding step matching their saved progress in under 2 seconds after page load.
- **SC-004**: New users without saved data see empty forms and start from the first step with no errors or confusing messages.
- **SC-005**: Zero data loss incidents reported due to page reload during the onboarding flow after this feature is implemented.

## Assumptions

- The backend API that returns the current user's organization already includes the embedded profile and funding area assignments.
- Users are authenticated via the standard session mechanism before reaching the onboarding page.
- The onboarding flow consists of sequential steps, and the user's current step is stored server-side as part of their organization record.
- Form inputs expect string values, so any numeric fields from the saved profile must be converted to strings for display.
- The system-managed funding areas list is available to compare against the saved profile's funding area identifiers.
