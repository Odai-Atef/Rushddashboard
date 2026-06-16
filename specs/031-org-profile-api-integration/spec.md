# Feature Specification: Organization Profile API Integration

**Feature Branch**: `[###-feature-name]`
**Created**: Mon Jun 15 2026
**Status**: Draft
**Input**: User description: "The profile screen (step 2) collects overview, areasOfWork, targetBeneficiaries, geographicCoverage, employeeCount, volunteerCount, activeProjects but does NOT call the backend API on Next. It only navigates to assessment with setCurrentView('assessment'). The data is lost on page reload."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save organization profile on onboarding step 2 (Priority: P1)

As a charity administrator completing the onboarding process, when I fill in my organization's profile information (overview, target beneficiaries, geographic coverage, team size, active projects, and areas of work) and click Next, the system should save this information to my account so that my progress is not lost if I refresh the page or return later.

**Why this priority**: Without persisting the profile data, users lose all entered information on a page reload, causing frustration and abandonment of the onboarding flow. This is the core value of the feature.

**Independent Test**: Can be fully tested by submitting a completed profile form and verifying the data is available after refreshing the page, demonstrating that the organization profile has been permanently saved.

**Acceptance Scenarios**:

1. **Given** a user on the organization profile step with all required fields filled in (overview, target beneficiaries, geographic coverage, areas of work), **When** they click Next, **Then** the system saves the profile to the backend and the user proceeds to the assessment step.
2. **Given** a user who has completed the profile step, **When** they refresh the browser while on the assessment step, **Then** their previously entered profile data remains available and does not need to be re-entered.

---

### User Story 2 - Select work areas from up-to-date system list (Priority: P2)

As a charity administrator, I want to select my organization's areas of work from a list that is managed centrally in the system, so that I am choosing from current, standardized categories rather than an outdated or hardcoded list.

**Why this priority**: Using a centrally managed list ensures consistency across all organizations and allows administrators to update available categories without code changes. This supports data quality and future scalability.

**Independent Test**: Can be tested by loading the profile screen and verifying that the areas of work options match those configured in the system, rather than a fixed, unchangeable set.

**Acceptance Scenarios**:

1. **Given** a user viewing the areas of work section on the profile step, **When** the list of options is displayed, **Then** the options reflect the current system-managed funding areas.
2. **Given** a system administrator who adds a new funding area to the system, **When** a user loads the profile step, **Then** the new funding area appears in the list of available options.

---

### User Story 3 - Link profile to the registered organization (Priority: P2)

As a charity administrator, when I save my organization profile, I want it to be correctly linked to the organization I just registered in the previous step, so that my profile data is associated with the right entity.

**Why this priority**: The profile step follows organization registration. Without correct association, the saved profile would be orphaned or misattributed, defeating the purpose of a structured onboarding flow.

**Independent Test**: Can be tested by completing registration, then profile, and verifying that the saved profile is retrievable under the correct organization identifier.

**Acceptance Scenarios**:

1. **Given** a user who has completed organization registration and reached the profile step, **When** they submit the profile form, **Then** the profile is stored under the organization created in the registration step.

---

### Edge Cases

- What happens when the user clicks Next without filling in a required field? The system must prevent submission and indicate which fields are missing.
- What happens if the backend is temporarily unavailable when the user submits the profile? The system must display an error message and keep the user on the form so they can retry without re-entering data.
- What happens if the user refreshes the page while the save request is in progress? The form should indicate that a save is in progress and prevent duplicate submissions.
- What happens if the areas of work API returns an empty list? The system should handle this gracefully, perhaps by showing a message or allowing the user to proceed with custom entries.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST persist the organization profile data to the backend when the user completes step 2 of the onboarding flow and clicks Next.
- **FR-002**: The system MUST validate that all required fields (overview, target beneficiaries, geographic coverage, areas of work) are provided before allowing submission.
- **FR-003**: The system MUST display clear, user-friendly error messages if the backend save fails, and keep the user on the profile form with their data intact.
- **FR-004**: The system MUST load the available areas of work from the system-managed funding areas API rather than using a hardcoded list.
- **FR-005**: The system MUST correctly associate the saved profile with the organization created in the preceding registration step.
- **FR-006**: The profile form MUST prevent duplicate submissions while a save request is in progress.

### Key Entities *(include if feature involves data)*

- **Organization Profile**: Represents the detailed information about an organization after registration. Key attributes include overview description, target beneficiaries, geographic coverage scope, employee count, volunteer count, active project count, and linked areas of work.
- **Area of Work (Funding Area)**: A system-managed category that describes a charitable focus area. Organizations can link multiple areas of work to their profile. Managed centrally to ensure consistency.
- **Onboarding Flow**: The multi-step process for registering a new organization. The profile step is dependent on the organization registration step and feeds into the assessment step.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the profile step and proceed to the assessment step without losing their data upon page refresh.
- **SC-002**: 100% of profile submissions with valid data result in the data being persistently stored and retrievable.
- **SC-003**: The areas of work options presented to users always match the current system-managed list within 1 minute of changes.
- **SC-004**: Users receive immediate, clear feedback when a required field is missing or the backend is unreachable, without navigating away from the form.

## Assumptions

- The organization registration step (step 1) has already been completed and the organization identifier is available to the profile step.
- The user has a stable internet connection for API calls; offline persistence is not required for this feature.
- The backend APIs for saving the profile and retrieving funding areas are already implemented and available.
- The profile data model includes optional fields (employee count, volunteer count, active projects) in addition to required fields.
