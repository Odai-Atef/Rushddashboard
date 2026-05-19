# Feature Specification: Align Registration Payload with Backend DTO

**Feature Branch**: `020-align-registration-dto`  
**Created**: 2026-05-19  
**Status**: Draft  
**Input**: User description: "[Rushd][Frontend] Align registration payload with backend /auth/register DTO"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register with Correct DTO Fields (Priority: P1)

As a new user, I want to register for the Rushd application by filling in my personal and organizational details so that I can create an account and access the platform.

**Why this priority**: This is the core onboarding flow. Without successful registration, new users cannot access any application features. The current implementation is broken because it sends unsupported fields to the backend.

**Independent Test**: Can be fully tested by filling out the registration form with valid data and verifying the request body sent to `/auth/register` matches the backend RegisterDto exactly.

**Acceptance Scenarios**:

1. **Given** a new user visits the registration page, **When** they view the form, **Then** they see input fields for: email, password, confirm password, first name, last name, and selectors for company and role, plus a "Create Account" submit button.
2. **Given** a user fills in all fields correctly and passwords match, **When** they click "Create Account", **Then** the system sends a request containing only: email, password, firstName, lastName, companyId, and roleId.
3. **Given** a registration request is sent, **When** the backend receives it, **Then** no validation errors occur for unexpected properties.

---

### User Story 2 - Select Company and Role from Available Options (Priority: P1)

As a registering user, I want to select my company and role from pre-configured options so that my account is properly associated with the correct organization and permissions.

**Why this priority**: The backend requires UUID references for company and role rather than free-text strings. This ensures data integrity and proper access control.

**Independent Test**: Can be tested by verifying that company and role fields are dropdown/selectors populated from backend data, and that selected values are passed as UUIDs in the registration payload.

**Acceptance Scenarios**:

1. **Given** the registration page loads, **When** the user opens the company selector, **Then** it displays a list of available companies fetched from the backend.
2. **Given** the registration page loads, **When** the user opens the role selector, **Then** it displays a list of available roles fetched from the backend.
3. **Given** a user selects a company and role, **When** they submit the form, **Then** the payload includes the corresponding UUIDs, not the display names.

---

### User Story 3 - Client-Side Validation Before Submission (Priority: P2)

As a user filling out the registration form, I want immediate feedback when I enter invalid data so that I can correct errors before submitting.

**Why this priority**: Improves user experience by preventing unnecessary backend round-trips. However, the core registration flow works without it since the backend validates as well.

**Independent Test**: Can be tested by entering invalid data and observing inline error messages before any network request is made.

**Acceptance Scenarios**:

1. **Given** a user enters a password shorter than 6 characters, **When** they blur the password field, **Then** an inline error message states the minimum length requirement.
2. **Given** a user enters mismatched passwords, **When** they submit the form, **Then** the submission is blocked with a visible error and no request is sent.
3. **Given** a user leaves a required field empty, **When** they attempt to submit, **Then** the form displays a field-specific error and does not send the request.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a registration form accessible via a dedicated route (e.g., `/register`).
- **FR-002**: The registration form MUST display input fields for: email, password, confirm password, first name, and last name.
- **FR-003**: The registration form MUST display selector fields for: company (populated from backend) and role (populated from backend).
- **FR-004**: System MUST validate that password and confirm password fields match before allowing submission.
- **FR-005**: System MUST validate that the password meets minimum security requirements (length of at least 6 characters).
- **FR-006**: System MUST validate that the email is in a valid email format.
- **FR-007**: System MUST submit the registration data to the backend registration endpoint using the exact field names expected by the backend.
- **FR-008**: The request payload MUST include only the supported registration fields and MUST NOT include any unsupported properties.
- **FR-009**: The confirmPassword field MUST be used for client-side validation only and MUST NOT be included in the network request payload.
- **FR-010**: System MUST display a success message and redirect the user to the application dashboard upon successful registration.
- **FR-011**: System MUST display field-specific validation errors returned by the backend.
- **FR-012**: The company and role selections MUST reference valid system entities.

### Key Entities *(include if feature involves data)*

- **User Registration Data**: Represents the information collected and transmitted during registration. Key attributes include:
  - Email (unique identifier for login, valid email format)
  - Password (credential for authentication, minimum 6 characters)
  - First Name (personal identifier, string, non-empty, max 100 characters)
  - Last Name (personal identifier, string, non-empty, max 100 characters)
  - Company ID (UUID referencing the selected organization)
  - Role ID (UUID referencing the assigned role/permissions)
- **Client-Side Form Data**: Extended set of fields used for UI interaction:
  - Confirm Password (used only for client-side validation, not sent to backend)
  - Company Name (display label for the selected company)
  - Role Name (display label for the selected role)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All registration requests sent from the frontend include only the fields required by the backend registration endpoint.
- **SC-002**: No validation errors related to unexpected or unsupported fields occur during registration.
- **SC-003**: New users can complete the registration form in under 2 minutes.
- **SC-004**: 95% of registration attempts with valid data result in successful account creation on the first try.
- **SC-005**: Invalid submissions (e.g., mismatched passwords, invalid email format, empty required fields) are blocked client-side before any network request is sent.
- **SC-006**: Users can only select companies and roles that exist in the system.
- **SC-007**: Password confirmation data is never shared with the server.

## Assumptions

- **Assumption-001**: The frontend application already has a registration form UI and corresponding submission logic.
- **Assumption-002**: The backend provides endpoints to fetch lists of available companies and roles (or these will be hardcoded initially).
- **Assumption-003**: The backend validates company and role references and rejects requests with invalid values.
- **Assumption-004**: The full name field will be replaced by separate first name and last name fields. No auto-generation of full name from first/last is required.
- **Assumption-005**: The phone field will be removed from the registration form and is not required for account creation.
- **Assumption-006**: The confirmPassword field exists in the UI but is stripped from the payload before sending to the backend.
- **Assumption-007**: The company free-text field will be replaced by a company selector referencing backend data.
- **Assumption-008**: The role free-text field will be replaced by a role selector referencing backend data.
