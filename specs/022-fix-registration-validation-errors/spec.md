# Feature Specification: Fix Registration Error Rendering and Field Highlighting from Backend Validation

**Feature Branch**: `022-fix-registration-validation-errors`
**Created**: 2026-05-20
**Status**: Draft
**Input**: User description: "[Rushd][Frontend] Fix registration error rendering and field highlighting from backend validation"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Password Validation Errors Displayed Under Password Input with Highlighting (Priority: P1)

A new user enters a password that does not meet backend complexity requirements (e.g., missing an uppercase letter) and submits the registration form. The user sees the specific validation message rendered beneath the password input, and the password field is visually highlighted as invalid.

**Why this priority**: Password complexity failures are the most common registration blocking errors. Immediate field-level feedback with visual highlighting prevents confusion and reduces form abandonment.

**Independent Test**: Can be fully tested by submitting a password like "password123" (no uppercase) and verifying the error "Password must contain at least one uppercase letter" appears under the password input and the password input/select receives an invalid visual state.

**Acceptance Scenarios**:

1. **Given** the user is on the registration form, **When** the user enters a password without an uppercase letter and submits, **Then** the message "Password must contain at least one uppercase letter" appears under the password input and the password field is highlighted in an invalid state.
2. **Given** the user is on the registration form with a password error already displayed, **When** the user edits the password field, **Then** the password-specific error message disappears and the invalid highlight is removed.

---

### User Story 2 - Role-Related Errors Displayed Under Role Selection with Highlighting (Priority: P2)

A new user submits the registration form with an invalid or unexpected role selection. The user sees the backend role-related validation message rendered near the role selection UI, and the role field is visually highlighted as invalid.

**Why this priority**: Role selection is a critical organizational assignment field. Users need contextual feedback to understand when their selection is rejected and to correct it without scanning a generic message.

**Independent Test**: Can be fully tested by submitting the form with an invalid role value and verifying the error "property roleId should not exist" (or the backend's equivalent role message) appears near the role selection UI and the role field is highlighted as invalid.

**Acceptance Scenarios**:

1. **Given** the user is on the registration form, **When** the user submits with an invalid role and the backend returns a role-related validation error, **Then** the related message appears under or adjacent to the role selection UI and the role field is highlighted in an invalid state.
2. **Given** the user is on the registration form with a role error already displayed, **When** the user changes the role selection, **Then** the role-specific error message disappears and the invalid highlight is removed.

---

### User Story 3 - Top-of-Form Summary of All Validation Errors (Priority: P2)

A new user submits the registration form with one or more validation failures. In addition to field-level messages, all returned validation messages are also visible in a summary error block at the top of the form so the user has a complete overview of what needs correction.

**Why this priority**: A top summary provides a consolidated view of all issues, which is especially useful when errors are scattered across a long form or when screen readers announce the summary first.

**Independent Test**: Can be fully tested by submitting a form with multiple backend validation errors and verifying every returned message appears in the top summary block.

**Acceptance Scenarios**:

1. **Given** the user submits the registration form and the backend returns multiple validation messages, **When** the response is received, **Then** all messages appear in a top-of-form summary error block.
2. **Given** the user submits the registration form and the backend returns an unknown/unmapped validation message, **When** the response is received, **Then** the unknown message appears in the top summary block.
3. **Given** the user submits the registration form and the backend returns only validation errors that are successfully mapped to fields, **When** the response is received, **Then** those messages still appear in the top summary block as well as under their respective fields.

---

### User Story 4 - Multiple Simultaneous Field Errors with Granular Clearing (Priority: P3)

A new user submits the registration form with validation failures across multiple fields (e.g., password and role). The user sees each mapped error under its related input and in the top summary. When the user corrects one field, only that field's error clears; unrelated field errors remain visible.

**Why this priority**: Users often correct one field at a time. Preserving unrelated errors prevents premature clearing of still-invalid fields and guides users through iterative correction.

**Independent Test**: Can be fully tested by submitting a form with invalid password and invalid role, correcting the password, resubmitting (or simply editing), and verifying the role error remains while the password error is gone.

**Acceptance Scenarios**:

1. **Given** the user submits the form with both password and role validation errors, **When** the response is received, **Then** both errors appear under their respective fields and in the top summary.
2. **Given** both password and role errors are currently displayed, **When** the user edits the password field, **Then** only the password error and highlight are cleared; the role error and highlight remain.
3. **Given** both password and role errors are currently displayed, **When** the user edits the role selection, **Then** only the role error and highlight are cleared; the password error and highlight remain.

---

### User Story 5 - Replace Generic "Fetch Error" with Actionable Backend Messages (Priority: P1)

A new user submits the registration form and the backend returns a 400 validation response. The frontend surfaces the actual backend messages instead of collapsing them into a generic "Fetch error" string.

**Why this priority**: A generic error gives users no actionable information. Exposing backend validation details is essential for users to understand and fix their input.

**Independent Test**: Can be fully tested by triggering any backend 400 validation response and verifying the UI never displays "Fetch error" as the sole or primary message.

**Acceptance Scenarios**:

1. **Given** the user submits the registration form with invalid data, **When** the backend responds with 400 and an array of validation messages, **Then** the frontend does not display a generic "Fetch error" and instead renders the backend messages in the summary and under related fields.
2. **Given** the user submits the registration form and the backend responds with a non-400 error (e.g., 500), **When** the error is received, **Then** the frontend displays the actual server message (or a fallback) but never a collapsed "Fetch error".

---

### Edge Cases

- What happens when the backend returns multiple error messages for the same field? (All messages should appear under that field in the order received, and all should appear in the top summary.)
- How does the system handle a backend field name that has no frontend mapping? (Error appears in the top summary block with its original message; no field-level highlight is applied.)
- What happens when the backend returns both field-level and global-level errors in the same response? (Mapped field errors appear under fields and in the summary; global/unmapped errors appear only in the summary.)
- How does the system behave when the backend returns a 400 validation response with an empty message array? (No field errors shown, no summary shown, and the form does not display a generic error.)
- What happens if the user corrects a field and resubmits but another field still has an error? (Only the still-invalid fields show errors and highlights; corrected fields clear both error and highlight.)
- What happens if the user edits a field that was never invalid? (No visual change; no error appears.)
- How are Arabic users affected when backend error messages are in English? (Field-level placement reduces reliance on reading the summary banner; error mapping preserves the Arabic-friendly form layout.)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The system MUST parse the backend's 400 Bad Request validation response and extract the array of field-specific error messages.
- **FR-002**: The system MUST map backend field names (e.g., "firstName", "lastName", "password", "companyId", "roleId") to their corresponding frontend form input fields.
- **FR-003**: The system MUST display each mapped validation error message directly beneath or adjacent to its related frontend input field.
- **FR-004**: The system MUST visually highlight (mark as invalid) any input or select field that has an associated backend validation error.
- **FR-005**: The system MUST support displaying multiple error messages under a single input field when the backend returns multiple errors for that field.
- **FR-006**: The system MUST display all returned validation messages — mapped and unmapped — in a summary error block at the top of the registration form.
- **FR-007**: The system MUST display any unmapped backend field errors or non-field errors in the top summary block.
- **FR-008**: The system MUST clear a field-level error message and remove its invalid highlight when the user modifies the corresponding input field, without clearing errors from other fields.
- **FR-009**: The system MUST preserve the existing Arabic-friendly form layout and ensure error messages and highlights do not break RTL text direction or visual alignment.
- **FR-010**: The system MUST handle mixed responses containing both field-level validation errors and non-validation errors, routing each to its appropriate display location.
- **FR-011**: The system MUST never collapse a backend 400 validation response into a single generic "Fetch error" message; it MUST always surface the actual backend messages.

### Key Entities *(include if feature involves data)*

- **Registration Form**: The user interface where new users enter first name, last name, email, password, company, and role to create an account.
- **Backend Validation Error Response**: A 400 Bad Request response containing an array of objects or strings, each with a backend field name and an associated error message.
- **Field Error Map**: An internal mapping that translates backend field identifiers (e.g., "companyId", "roleId") to frontend UI components so errors appear in contextually appropriate locations.
- **Top Summary Error Block**: A UI element at the top of the form that displays all returned validation messages, both mapped and unmapped, as an overview of all issues.
- **Field-Level Error Display**: A per-input UI element that shows validation messages specific to that field and is cleared when the field is edited.
- **Invalid Field State**: A visual treatment (e.g., border color change) applied to inputs and selects that have active backend validation errors.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 100% of backend password validation errors (complexity, length, pattern) appear under the password input and the password field is visually highlighted as invalid.
- **SC-002**: Role-related backend validation errors appear under or adjacent to the role selection UI and the role field is visually highlighted as invalid.
- **SC-003**: 100% of returned backend validation messages appear in the top-of-form summary error block.
- **SC-004**: Zero mapped field-level errors are collapsed into a generic "Fetch error"; all backend messages are surfaced individually.
- **SC-005**: When a user edits a field with an active backend error, that field's error and highlight are cleared within 100 milliseconds, while errors on other fields remain unchanged.
- **SC-006**: Users can identify and correct all registration validation errors in a single review of the form without needing additional trial-and-error submissions.
- **SC-007**: Form abandonment rate on the registration page decreases by at least 20% after field-level error highlighting and summary blocks are introduced.

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- The backend returns validation errors in a consistent 400 Bad Request response format containing an array of field-message pairs or strings.
- The frontend registration form already uses a controlled input pattern that supports both attaching error messages to individual fields and applying visual invalid states.
- The existing generic API error banner component can be extended or reused for the top summary block, or a new summary component will be created in the same location.
- Backend error messages are provided in English; the frontend will display them as-is and rely on context (field placement and summary) for clarity.
- Arabic-friendly UX means maintaining RTL layout compatibility and not disrupting existing visual hierarchy when adding per-field error messages and highlights.
- The registration form has no more than six primary fields (firstName, lastName, email, password, companyId, roleId) requiring backend-to-frontend error mapping.
- The frontend already distinguishes between network/fetch failures (e.g., no response) and HTTP error responses (e.g., 400 with body); the fix applies to HTTP 400 responses with validation payloads.
