# Feature Specification: Onboarding API Integration

**Feature Branch**: `046-onboarding-api-integration`  
**Created**: 2026-06-14  
**Status**: Draft  
**Input**: User description: "Wire CharityOnboardingFlow registration and profile screens to existing backend onboarding APIs. Create onboarding-service.ts and useOnboardingRegistration.ts hook. Update CharityOnboardingFlow to call backend endpoints for organization registration, profile creation, and funding areas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register Organization Details (Priority: P1)

A charity representative filling out the onboarding flow enters their organization's registration details (name, license number, registration date, type, city, contact person, email, mobile). The system saves these details to the backend so the data persists if they refresh the page or return later.

**Why this priority**: This is the foundational step of the onboarding journey — without persisted registration data, users cannot proceed to subsequent screens and would lose all progress on refresh.

**Independent Test**: Can be fully tested by entering registration details, refreshing the page, and verifying the data is restored from the backend.

**Acceptance Scenarios**:

1. **Given** the user is on the organization registration screen with no prior saved data, **When** they fill in all required fields and proceed, **Then** the system creates the organization record in the backend and stores the returned identifier for future updates.
2. **Given** the user has previously saved registration data and returns to the screen, **When** the screen loads, **Then** the system retrieves the existing organization data from the backend and pre-fills the form fields.
3. **Given** the user is editing their registration details, **When** they make changes and wait briefly without clicking Next, **Then** the system automatically saves the updated details to the backend periodically.

---

### User Story 2 - Create Organization Profile (Priority: P2)

After completing registration, the user proceeds to the organization profile screen where they provide an overview, target beneficiaries, geographic coverage, staff counts, active projects, and select areas of work. The system saves this profile information and associates it with the organization.

**Why this priority**: The profile completes the organization's onboarding information and enables the platform to understand the charity's mission, reach, and focus areas for matching with appropriate opportunities.

**Independent Test**: Can be fully tested by completing the profile screen, submitting the data, and verifying it is persisted and retrievable.

**Acceptance Scenarios**:

1. **Given** the user has completed registration and is on the profile screen, **When** they fill in the profile details including areas of work and submit, **Then** the system saves the profile to the backend and associates the selected funding areas with the organization.
2. **Given** the user returns to the profile screen after previously saving, **When** the screen loads, **Then** the system retrieves the existing profile data from the backend and pre-fills all fields and selections.

---

### User Story 3 - Resume Onboarding After Interruption (Priority: P3)

A user who started but did not complete the onboarding flow returns to the platform. The system recognizes their incomplete onboarding and restores them to the correct step with all previously entered data intact.

**Why this priority**: This improves user experience by reducing friction for users who cannot complete onboarding in a single session, decreasing abandonment rates.

**Independent Test**: Can be tested by partially completing onboarding, closing the browser, reopening it, and verifying the user is returned to the last completed step with data restored.

**Acceptance Scenarios**:

1. **Given** a user has created an organization registration but not completed the profile, **When** they return to the onboarding flow, **Then** the system detects the incomplete record and directs them to the profile screen with the registration data already loaded.
2. **Given** a user has completed both registration and profile, **When** they return to the onboarding flow, **Then** the system recognizes completion and does not force them to repeat the process.

---

### Edge Cases

- What happens when the user submits a license number that already exists in the system?
- How does the system handle network failures during form submission or auto-save?
- What happens if the user's session expires (unauthorized) while they are filling out the form?
- How does the system handle validation errors (missing required fields, invalid formats) on submission?
- What happens if the organization record is deleted or becomes inaccessible between sessions?
- How does the system behave when a user rapidly clicks the submit or next button multiple times?
- What happens when a user selects custom funding areas that are not in the standard list?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to enter and save organization registration details including name, license number, registration date, organization type, city, website, contact person name, email, and mobile number.
- **FR-002**: The system MUST persist organization registration data to the backend and retain a reference identifier so the record can be updated later.
- **FR-003**: On returning to the registration screen, the system MUST retrieve any previously saved organization data from the backend and restore it into the form.
- **FR-004**: The system MUST automatically save registration changes to the backend periodically while the user is actively editing, without requiring explicit submission.
- **FR-005**: Users MUST be able to enter and save organization profile information including overview, target beneficiaries, geographic coverage, employee count, volunteer count, active projects count, and areas of work.
- **FR-006**: The system MUST allow users to select funding areas from a predefined list and optionally specify custom areas not in the list.
- **FR-007**: On returning to the profile screen, the system MUST retrieve any previously saved profile data from the backend and restore it into the form.
- **FR-008**: If a user has partially completed onboarding (registration only), the system MUST resume them at the profile step on their next visit.
- **FR-009**: The system MUST validate all required fields and formats before submission and display clear, user-friendly error messages in the interface language.
- **FR-010**: The system MUST handle duplicate license numbers gracefully by informing the user with an inline message in the interface language.

### Key Entities *(include if feature involves data)*

- **Organization Registration**: Represents the legal and contact details of a charity organization. Attributes: name, license number, registration date, type (charity/foundation/NGO/coop), city, website, contact person, email, mobile, status (draft), current step.
- **Organization Profile**: Represents the mission and operational details of a charity. Attributes: overview, target beneficiaries, geographic coverage, employee count, volunteer count, active projects, areas of work.
- **Funding Area**: Represents a domain of charitable work (e.g., education, health, environment). Attributes: identifier, name, localized name. Organizations can select multiple funding areas.
- **Onboarding Session**: Tracks the user's progress through the onboarding flow. Attributes: current step, associated organization identifier, completion status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users who complete the registration screen have their data persisted to the backend and recoverable on return.
- **SC-002**: Users returning to an incomplete onboarding session are restored to the correct step with all data intact within 2 seconds of screen load.
- **SC-003**: Zero data loss occurs due to page refreshes or browser closures during the onboarding flow.
- **SC-004**: Users receive clear, actionable error messages in the interface language for all validation and conflict scenarios within 1 second of submission.
- **SC-005**: Onboarding abandonment rate decreases by 30% after implementing persistent state and resume capability.
- **SC-006**: 100% of profile submissions successfully associate the selected funding areas with the organization record.

## Assumptions

- Users have stable internet connectivity during the onboarding flow.
- The backend onboarding APIs are operational and return responses within standard timeframes.
- An existing authentication system handles user sessions and provides valid credentials for API requests.
- The organization type field uses a predefined set of categories (charity, foundation, NGO, cooperative).
- Geographic coverage options are predefined (local, regional, national, international).
- Mobile support for the onboarding flow is out of scope for this feature and will be addressed separately if needed.
- Users are authenticated before accessing the onboarding flow; unauthenticated access is handled by existing platform behavior.
