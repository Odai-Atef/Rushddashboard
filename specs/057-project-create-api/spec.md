# Feature Specification: Project Create API Integration

**Feature Branch**: `058-057-project-create`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "for this page /dashboard/project-management/create integrate it with the /api/v1/projects response { \"name\": \"string\", \"type\": \"string\", \"category\": \"string\", \"description\": \"string\", \"budget\": 0, \"currencyCode\": \"SAR\", \"startDate\": \"string\", \"endDate\": \"string\", \"beneficiaries\": \"string\", \"geographicScope\": \"string\", \"managerId\": \"string\", \"organizationId\": \"string\" }"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit a new project through the create page (Priority: P1)

As a platform user with permission to create projects, I want to fill out the project creation form at `/dashboard/project-management/create` and submit it so that the project is persisted through the `/api/v1/projects` endpoint.

**Why this priority**: This is the core requested capability. Without API integration, the create page only simulates project creation and cannot persist real project records.

**Independent Test**: This story can be fully tested by entering valid data in every field on the create page, clicking the submit action, and verifying that a project record is created via the API.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and navigates to `/dashboard/project-management/create`, **When** they complete all required fields with valid values, **Then** the form can be submitted to `/api/v1/projects`.
2. **Given** the user submits the project creation form, **When** the API accepts the request, **Then** the user is informed of success and is taken to the newly created project's details page.
3. **Given** the user submits the project creation form, **When** the API returns a success response, **Then** the created project contains the same `name`, `type`, `category`, `description`, `budget`, `currencyCode`, `startDate`, `endDate`, `beneficiaries`, `geographicScope`, `managerId`, and `organizationId` values that were entered.

---

### User Story 2 - Receive clear feedback when project creation fails (Priority: P1)

As a platform user, I want to understand why a project could not be created so that I can correct errors and try again without losing my entered information.

**Why this priority**: API calls can fail due to validation, network, or server issues. Clear feedback protects the user from data loss and reduces support burden.

**Independent Test**: This story can be fully tested by triggering API failure responses and confirming the user sees helpful, actionable messages without the form being cleared unexpectedly.

**Acceptance Scenarios**:

1. **Given** the user submits the project creation form, **When** the API responds with validation errors, **Then** the form highlights the affected fields and displays the corresponding error messages.
2. **Given** the user submits the project creation form, **When** the API responds with a server error, **Then** a user-friendly message is shown and the user can retry submission without re-entering all data.
3. **Given** the user submits the project creation form, **When** the network request fails, **Then** the user is notified of the connectivity issue and can retry once the connection is restored.

---

### User Story 3 - Maintain existing form behavior while adding persistence (Priority: P2)

As a platform user, I want the project create page to retain its current layout, field labels, and navigation behavior while gaining the ability to save projects through the API.

**Why this priority**: The page already exists and matches the rest of the module. The change should extend functionality without redesigning the user experience.

**Independent Test**: This story can be fully tested by comparing the create page before and after integration and confirming that navigation, field presence, and styling remain consistent.

**Acceptance Scenarios**:

1. **Given** the user opens `/dashboard/project-management/create`, **When** the page loads, **Then** the existing project fields and layout remain visible and usable.
2. **Given** the user is on the create page, **When** they click the back or cancel action, **Then** they return to `/dashboard/project-management/list` as before.
3. **Given** the user is filling out the form, **When** they choose to save a draft, **Then** the draft action remains available and does not attempt to submit to the create API.

---

## Clarifications

### Session 2026-06-21

- **Q**: Which screen should the user land on after successfully creating a project? → **A**: Project details of the newly created project.
- **Q**: What should happen if the API succeeds but does not return an `id` for the new project? → **A**: Navigate to the project list with a warning.
- **Q**: Which fields are required in the project creation form? → **A**: Use required rules returned by the API only.
- **Q**: How should the system handle an expired session during project creation submission? → **A**: Show a session expired error and clear the form.

### Edge Cases

- What happens when the user submits the form while another submission is already in progress?
- How does the system behave if the API returns a success response without including the newly created project identifier?
  - **Answered**: The system navigates the user to the project list and shows a warning that the project was created but could not be opened directly.
- What happens if the user's session expires between loading the page and submitting the form?
  - **Answered**: The system shows a session expired error and clears the form so the user logs in fresh and re-enters data intentionally.
- How are partially completed forms handled when the user navigates away and returns?
- What happens when the manager or organization selection lists are empty?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project creation form at `/dashboard/project-management/create` MUST collect values for `name`, `type`, `category`, `description`, `budget`, `currencyCode`, `startDate`, `endDate`, `beneficiaries`, `geographicScope`, `managerId`, and `organizationId`.
- **FR-002**: The form MUST send a request to create a project through `/api/v1/projects` with a body matching the API contract when the user confirms project creation.
- **FR-003**: The request body MUST set `currencyCode` to `"SAR"` by default unless the user explicitly changes it.
- **FR-004**: The form MUST validate fields before submission based on required rules returned by the API and prevent sending incomplete or malformed data to the API.
- **FR-005**: The form MUST display inline validation errors returned by the API next to the corresponding fields.
- **FR-006**: The form MUST display a clear success message and navigate the user to the newly created project's details page after a successful API response.
- **FR-007**: The form MUST preserve user-entered data when the API returns a validation or server error so the user can correct and resubmit.
- **FR-008**: The form MUST disable the submit action while a submission is in progress to prevent duplicate project creation.
- **FR-009**: The form MUST handle network and unexpected server errors gracefully with a user-friendly message and a retry option.
- **FR-010**: The existing draft save and cancel navigation behavior MUST remain functional and independent of the API submission flow.

### Key Entities

- **Project**: A new initiative captured through the project creation form. Key attributes include `name`, `type`, `category`, `description`, `budget`, `currencyCode`, `startDate`, `endDate`, `beneficiaries`, `geographicScope`, `managerId`, and `organizationId`.
- **Manager**: A user who can be assigned as the project manager, identified by `managerId`.
- **Organization**: A legal entity that owns the project, identified by `organizationId`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a project through `/dashboard/project-management/create` and have it persisted via `/api/v1/projects` within 3 seconds under normal network conditions.
- **SC-002**: 95% of valid project creation attempts succeed on the first submission attempt.
- **SC-003**: Users receive actionable error feedback for invalid submissions within 1 second of receiving the API error response.
- **SC-004**: No duplicate projects are created when a user clicks the submit action multiple times during a single submission.
- **SC-005**: Existing navigation and draft behavior on the create page continue to work without regression after API integration.

## Assumptions

- The existing `/dashboard/project-management/create` page uses local state and currently navigates away on submit without persisting data.
- The `/api/v1/projects` endpoint accepts project creation requests and returns the created project object, possibly including an `id` field not specified in the provided contract.
- `currencyCode` defaults to `"SAR"` because the existing UI references Saudi Riyals.
- `budget` is submitted as a number; the UI may collect it as a string input but converts it before calling the API.
- Manager and organization selections are populated from existing data sources; this feature focuses on wiring the submission, not building new selection APIs.
- The user is already authenticated and authorized to create projects when they reach the create page.
- Validation rules, including required fields, will be driven by the API response and can be enhanced in future iterations.
