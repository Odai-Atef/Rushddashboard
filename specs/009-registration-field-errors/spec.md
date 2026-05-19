# Feature Specification: Registration Field-Level Error Mapping

**Feature Branch**: `[009-registration-field-errors]`
**Created**: 2026-05-19
**Status**: Draft
**Input**: User description: "[Rushd][Frontend] Show backend registration validation errors under related inputs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Password Validation Errors Under Password Input (Priority: P1)

A new user enters a password that does not meet complexity requirements (e.g., missing uppercase letter) and submits the registration form. The user sees the specific password validation message displayed directly beneath the password input field.

**Why this priority**: Password complexity is the most common registration failure and immediate field-level feedback prevents user confusion and reduces form abandonment.

**Independent Test**: Can be fully tested by submitting a password like "password123" (no uppercase) and verifying the error "Password must contain at least one uppercase letter" appears only under the password field.

**Acceptance Scenarios**:

1. **Given** the user is on the registration form, **When** the user enters a password without an uppercase letter and submits, **Then** the message "Password must contain at least one uppercase letter" appears under the password input and the generic API error banner does not show this message.
2. **Given** the user is on the registration form, **When** the user enters a valid password meeting all requirements and submits, **Then** no password-related error appears under the password input.

---

### User Story 2 - Name Validation Errors Under Name Inputs (Priority: P2)

A new user leaves the first name or last name fields empty and submits the registration form. The user sees the corresponding validation message displayed directly beneath the relevant name input field.

**Why this priority**: Name fields are basic required information and immediate feedback helps users understand exactly which required field was missed.

**Independent Test**: Can be fully tested by submitting the form with an empty first name and verifying the error "firstName should not be empty" appears under the first name input.

**Acceptance Scenarios**:

1. **Given** the user is on the registration form, **When** the user leaves the first name field empty and submits, **Then** the message "firstName should not be empty" appears under the first name input.
2. **Given** the user is on the registration form, **When** the user leaves the last name field empty and submits, **Then** the message "lastName should not be empty" appears under the last name input.
3. **Given** the user is on the registration form, **When** both first and last name are empty and submitted, **Then** each respective error appears under its corresponding input field.

---

### User Story 3 - Company and Role Resolution Errors Near Selection UI (Priority: P2)

A new user submits the registration form with an invalid company or role selection. The user sees the UUID validation message displayed near the company or role selection interface.

**Why this priority**: Company and role selections are typically dropdowns or selectors, and users need to understand when their selection fails backend validation so they can choose a valid option.

**Independent Test**: Can be fully tested by submitting the form with an invalid company ID and verifying the error "companyId must be a UUID" appears near the company selection UI.

**Acceptance Scenarios**:

1. **Given** the user is on the registration form, **When** the user selects an invalid company and submits, **Then** the message "companyId must be a UUID" appears near the company selection interface.
2. **Given** the user is on the registration form, **When** the user selects an invalid role and submits, **Then** the message "roleId must be a UUID" appears near the role selection interface.

---

### User Story 4 - Multiple Field Errors and Unknown Error Handling (Priority: P3)

A new user submits the registration form with multiple validation failures across different fields, plus an unexpected system error. The user sees each mapped validation error under its related input, while any unmapped or non-field errors appear in a general error banner at the top of the form.

**Why this priority**: Users often make multiple mistakes on a single form submission, and comprehensive feedback with a fallback for unknown errors ensures no information is lost.

**Independent Test**: Can be fully tested by submitting a form with invalid password, empty first name, and simulating an unmapped backend error, then verifying all field errors appear under their fields while the unmapped error appears in the general banner.

**Acceptance Scenarios**:

1. **Given** the user submits the form with password, first name, and last name errors, **When** the backend returns all three field errors, **Then** each error appears under its respective input field and no generic banner is shown for these known fields.
2. **Given** the user submits the form with a known field error and an unknown backend field error, **When** the backend returns both errors, **Then** the known field error appears under its input and the unknown error appears in the general error banner.
3. **Given** the user submits the form, **When** the backend returns a non-validation error (e.g., 500 server error), **Then** no field-level errors appear and the general error banner displays the server error message.

### Edge Cases

- What happens when the backend returns multiple error messages for the same field? (All messages should appear under that field in the order received)
- How does the system handle a backend field name that has no frontend mapping? (Error appears in the general banner with its original message)
- What happens when the backend returns both field-level and global-level errors in the same response? (Mapped field errors under fields, unmapped/global errors in the banner)
- How does the system behave when the backend returns a 400 validation response with an empty message array? (No field errors shown, form proceeds as valid)
- What happens if the user corrects a field and resubmits but another field still has an error? (Only the still-invalid fields show errors; corrected fields clear their errors)
- How are Arabic users affected when backend error messages are in English? (Field-level placement reduces reliance on reading the generic banner; error mapping preserves the Arabic-friendly form layout)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST parse the backend's 400 Bad Request validation response and extract the array of field-specific error messages.
- **FR-002**: The system MUST map backend field names (e.g., "firstName", "lastName", "password", "companyId", "roleId") to their corresponding frontend form input fields.
- **FR-003**: The system MUST display each mapped validation error message directly beneath or adjacent to its related frontend input field.
- **FR-004**: The system MUST support displaying multiple error messages under a single input field when the backend returns multiple errors for that field.
- **FR-005**: The system MUST display any unmapped backend field errors or non-field errors in a general error banner at the top of the registration form.
- **FR-006**: The system MUST clear field-level error messages when the user modifies the corresponding input field or successfully resubmits the form.
- **FR-007**: The system MUST preserve the existing Arabic-friendly form layout and ensure error messages do not break RTL text direction or visual alignment.
- **FR-008**: The system MUST handle mixed responses containing both field-level validation errors and non-validation errors, routing each to its appropriate display location.

### Key Entities *(include if feature involves data)*

- **Registration Form**: The user interface where new users enter first name, last name, password, company, and role to create an account.
- **Backend Validation Error Response**: A 400 Bad Request response containing an array of objects, each with a backend field name and an associated error message string.
- **Field Error Map**: An internal mapping that translates backend field identifiers (e.g., "companyId", "roleId") to frontend UI components so errors appear in contextually appropriate locations.
- **General Error Banner**: A UI element at the top of the form that displays errors which cannot be mapped to a specific field, as well as non-validation API errors.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of backend password validation errors (complexity, length, pattern) appear under the password input field instead of the generic banner.
- **SC-002**: 100% of backend first name and last name validation errors appear under their respective name input fields.
- **SC-003**: 100% of backend company and role validation errors appear near their respective selection UI components.
- **SC-004**: Zero mapped field-level errors appear in the generic API error banner; only unknown or non-field errors are displayed there.
- **SC-005**: Users can identify and correct all registration validation errors in a single review of the form without needing to scroll to a top banner.

## Assumptions

- The backend returns validation errors in a consistent 400 Bad Request response format containing an array of field-message pairs.
- The frontend registration form already uses a controlled input pattern (e.g., React Hook Form or similar) that supports attaching error messages to individual fields.
- The existing generic API error banner component can be reused for unmapped and non-field errors.
- Backend error messages are provided in English; the frontend will display them as-is and rely on context (field placement) for clarity.
- Arabic-friendly UX means maintaining RTL layout compatibility and not disrupting existing visual hierarchy when adding per-field error messages.
- The registration form has no more than five primary fields (firstName, lastName, password, company, role) requiring backend-to-frontend error mapping.
