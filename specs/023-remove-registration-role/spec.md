# Feature Specification: Remove Role Selection from Registration Flow

**Feature Branch**: `023-rushd-frontend-remove-role`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "[Rushd][Frontend+Backend] Remove or resolve unsupported roleId in registration flow. Choose path B: roleId is NOT required during self-registration."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register Without Choosing a Role (Priority: P1)

As a new user, I want to register for the Rushd application without having to select a role so that I can quickly create an account and start using the platform.

**Why this priority**: This is the core onboarding flow. Registration currently fails because the form sends a role identifier that the backend no longer accepts. Removing the role selector and letting the backend assign a default role eliminates this blocking failure and simplifies registration.

**Independent Test**: Can be fully tested by completing the registration form without a role field and verifying the account is created successfully.

**Acceptance Scenarios**:

1. **Given** a new user visits the registration page, **When** they view the form, **Then** they see input fields for: email, password, confirm password, first name, last name, and a selector for company, but no role selector.
2. **Given** a user fills in all visible fields correctly and passwords match, **When** they click "Create Account", **Then** the system creates an account successfully and the backend assigns a default role automatically.
3. **Given** a successful registration, **When** the user first accesses the platform, **Then** they have a valid role with appropriate default permissions.

---

### User Story 2 - Consistent Registration Contract Between Frontend and Backend (Priority: P1)

As a system administrator, I want the frontend registration form to match the backend contract exactly so that no unsupported data is sent and validation errors are avoided.

**Why this priority**: Mismatched contracts cause registration failures and confusion for users. Ensuring alignment prevents "property should not exist" errors and maintains trust in the signup process.

**Independent Test**: Can be fully tested by submitting a registration request and confirming the backend accepts every field sent without rejecting unsupported properties.

**Acceptance Scenarios**:

1. **Given** a user submits the registration form, **When** the backend receives the request, **Then** it accepts the payload without rejecting any fields as unsupported.
2. **Given** the backend processes the registration, **When** the payload is valid, **Then** the response confirms successful account creation without any property-level validation errors.
3. **Given** the frontend registration form, **When** it is compared against the backend self-registration contract, **Then** every visible field has a matching backend field and no extra fields are sent.

---

### User Story 3 - Role Assignment After Registration (Priority: P2)

As an administrator, I want the system to assign a safe default role to self-registered users so that every new account has the minimum permissions needed to use the platform.

**Why this priority**: Role assignment is necessary for access control, but requiring users to self-assign can lead to errors or privilege escalation. A backend default ensures consistency and security.

**Independent Test**: Can be fully tested by creating an account through self-registration and verifying the assigned role in the user profile or administration panel.

**Acceptance Scenarios**:

1. **Given** a user completes self-registration, **When** their account is created, **Then** the backend assigns the system-defined default role automatically.
2. **Given** a newly registered user logs in for the first time, **When** they access features, **Then** they can use all features appropriate to the default role level.
3. **Given** an administrator reviews newly registered users, **When** they inspect the user's role, **Then** they see the default role assigned and not null or missing.

---

### Edge Cases

- What happens if the backend default role is misconfigured or missing? (Registration should still succeed, but the system should log or alert administrators to fix the default configuration.)
- How does the system behave if a legacy link or cached page still references a role selection step? (The form should simply not render the role field; no error should appear.)
- What happens if the backend later reintroduces role selection as optional? (The frontend should continue to omit it until explicitly updated, maintaining backward compatibility.)
- How are existing registration invitations or pre-registered accounts handled? (Accounts created before this change retain their originally assigned roles; only new self-registrations receive the default.)
- What happens if a user bypasses the frontend and sends a raw registration request with a roleId? (The backend should reject the unsupported property with a clear error, or silently ignore it based on system policy.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow new users to self-register without providing a role.
- **FR-002**: The frontend registration form MUST NOT display a role selector or collect role information from the user.
- **FR-003**: The frontend registration submission MUST NOT include a role identifier or any role-related field.
- **FR-004**: The backend MUST accept a registration payload that does not contain a role identifier and MUST NOT reject it as unsupported.
- **FR-005**: The backend MUST automatically assign a predefined default role to every account created through self-registration.
- **FR-006**: System MUST ensure the assigned default role enables the user to access the platform with standard user-level permissions.
- **FR-007**: System MUST display field-specific validation errors for the fields that remain in the registration form (email, password, first name, last name, company).
- **FR-008**: System MUST preserve all existing client-side validations (email format, password length, password confirmation match, required fields).
- **FR-009**: System MUST successfully complete registration and redirect the user to the application dashboard or a welcome screen upon account creation.
- **FR-010**: All existing specifications, API contracts, and documentation that describe the registration payload MUST be updated to reflect that role is no longer part of self-registration.
- **FR-011**: If a raw registration request containing `roleId` is received at the backend, the backend MUST silently ignore it and proceed with default role assignment rather than returning a validation error.

## Clarifications

### Session 2026-05-20

- **Q**: What should the backend do if a raw registration request containing `roleId` is received?  
  **A**: Option B accepted — silently ignore `roleId`, proceed with registration, and assign the default role.

### Key Entities *(include if feature involves data)*

- **Self-Registration Data**: The information collected and transmitted during user-initiated registration. Key attributes include:
  - Email (unique identifier for login, valid email format)
  - Password (credential for authentication, minimum requirement enforced)
  - First Name (personal identifier, non-empty string)
  - Last Name (personal identifier, non-empty string)
  - Company ID (reference to the selected organization)
- **Default Role**: The role automatically assigned by the system when a user self-registers. Represents the minimum set of permissions a new user receives.
- **User Account**: The record created upon successful registration, which includes personal details, company association, and the auto-assigned default role.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of self-registration attempts with valid data result in successful account creation, with zero failures caused by unsupported role properties.
- **SC-002**: The registration form contains no role-related field or selector, and users can complete registration in the same or fewer steps than before.
- **SC-003**: Every account created through self-registration receives a valid default role automatically, with no manual assignment required.
- **SC-004**: Users report zero confusion or support requests related to role selection during registration.
- **SC-005**: Existing registration documentation and API contracts accurately describe the updated payload that excludes role identifiers.

## Assumptions

- The backend maintains a valid default role configuration that can be assigned automatically at registration time.
- The frontend registration form can be updated to hide or remove the role selector without impacting other fields or styling.
- No active business requirement exists requiring users to choose their own role during self-registration.
- Administrators can adjust user roles after registration through an existing user management interface if needed.
- The company selector remains part of self-registration and is unaffected by the removal of the role selector.
