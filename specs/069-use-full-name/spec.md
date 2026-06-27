# Feature Specification: Use Full Name Across Frontend

**Feature Branch**: `069-use-full-name`  
**Created**: 2026-06-27  
**Status**: Draft  
**Input**: User description: "now I removed the first_name and last_name form all backend api and database, we are depending on full_name instead of first_name and last_name so update the code and views which depend on this cloumn like the menu profile icon and registration page"

## Clarifications

### Session 2026-06-27

- **Q**: When `full_name` is missing or empty, what should the frontend display as the fallback? → **A**: `full_name` is a required field, so it should always be displayed as-is and no fallback is necessary.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Profile Menu Shows Correct Name (Priority: P1)

As a registered user, when I open the application menu or profile area, I see my name displayed correctly based on the `full_name` value returned by the backend, so that I can confirm I am signed in as the right person.

**Why this priority**: This is the most visible user-facing element after the data model change. A missing or broken name display degrades trust and usability immediately.

**Independent Test**: Verify that the menu/profile icon or dropdown renders the user's `full_name` when the backend returns only a `full_name` field and no `first_name`/`last_name` fields.

**Acceptance Scenarios**:

1. **Given** a user is signed in and their profile API returns `{ full_name: "Ahmad Smith" }`, **When** the user opens the main menu, **Then** the profile section displays "Ahmad Smith".
2. **Given** a user is signed in and their profile API returns `{ full_name: "" }`, **When** the user opens the main menu, **Then** client-side validation or an empty state indicator reflects that `full_name` is required.

---

### User Story 2 - Registration Page Uses Full Name (Priority: P1)

As a new user, when I register for an account, I am asked to provide a single "Full name" field instead of separate "First name" and "Last name" fields, so that the signup experience matches the updated data model and is faster to complete.

**Why this priority**: The registration page is a primary conversion path. Keeping two obsolete fields that the backend no longer accepts will cause registration to fail or store inconsistent data.

**Independent Test**: Verify that the registration form submits successfully with a single `full_name` value and that the backend creates the user without requiring `first_name` or `last_name`.

**Acceptance Scenarios**:

1. **Given** a new user on the registration page, **When** they enter valid full name, email, and password and submit, **Then** the registration API is called with a `full_name` field and the account is created.
2. **Given** a new user on the registration page, **When** they leave the full name field empty, **Then** client-side validation displays an error and the form is not submitted.

---

### User Story 3 - Other Views Displaying User Name Are Updated (Priority: P2)

As a user, when I navigate through any area of the application that previously showed my first and last name separately (e.g., profile settings, welcome messages, collaboration panels, dashboards), I see my full name displayed consistently.

**Why this priority**: This ensures the name change is applied comprehensively across the frontend and prevents fragmented or broken user experiences in secondary screens.

**Independent Test**: Verify that a sample of views previously referencing `first_name` or `last_name` now reference `full_name` and render correctly.

**Acceptance Scenarios**:

1. **Given** a profile/settings page that previously rendered `first_name` and `last_name`, **When** the page loads, **Then** it renders `full_name` and no separate name fields are shown.
2. **Given** a welcome message that previously combined `first_name` and `last_name`, **When** the page loads, **Then** it displays the `full_name` value.

---

### Edge Cases

- What happens if the registration API rejects a `full_name` that is too short or too long?
- How should the frontend behave if a legacy cached response still contains `first_name` or `last_name` but no `full_name`?
- How are names with non-Latin scripts or special characters displayed in the profile icon or avatar?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The frontend MUST consume the `full_name` field returned by backend APIs wherever user identity is displayed or used.
- **FR-002**: The frontend MUST stop sending `first_name` and `last_name` fields in registration and profile update requests.
- **FR-003**: The registration page MUST present a single "Full name" input field in place of separate "First name" and "Last name" fields.
- **FR-004**: The menu/profile icon and dropdown MUST display the user's `full_name`.
- **FR-005**: All other user-facing views that previously referenced `first_name` or `last_name` MUST reference `full_name` instead.
- **FR-006**: The frontend MUST treat `full_name` as a required field and MUST display it as-is wherever user identity is shown; no fallback display is required.

### Key Entities *(include if feature involves data)*

- **User Profile**: Represents the authenticated user's identity. Key attributes include `full_name`, `email`, and `username`. The profile is no longer expected to include `first_name` or `last_name`.
- **Registration Form**: Represents the new user signup input. Key attributes include `full_name`, `email`, and `password`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully register an account after the form is updated to use a single full name field, with registration completion rate maintained at or above the pre-change baseline.
- **SC-002**: 100% of inspected user-facing views that previously rendered `first_name` or `last_name` now render `full_name` without error.
- **SC-003**: The menu/profile icon displays the `full_name` value for every authenticated user, since `full_name` is a required field.
- **SC-004**: No registration or profile request includes `first_name` or `last_name` fields after the update.

## Assumptions

- The backend has already removed `first_name` and `last_name` from all APIs and the database.
- The frontend codebase has existing references to `first_name` and `last_name` that need to be identified and updated.
- `full_name` is a required field on the backend; the frontend should enforce it as required and display it as-is.
- The change is limited to user-facing views and request payloads; automated backend data migration is out of scope.
