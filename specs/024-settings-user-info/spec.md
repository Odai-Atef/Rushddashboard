# Feature Specification: Settings Page User Info

**Feature Branch**: `024-rushd-frontend-update`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "[Rushd][Frontend] Update dashboard/settings page with logged-in user information

Problem
- The `dashboard/settings` page needs to show the real logged-in user information instead of missing, placeholder, or static values.
- User wants the settings page to reflect the authenticated user's current profile details.

Scope
- Update the Rushd frontend settings page at `dashboard/settings`.
- Read the authenticated user info from the existing auth/session source.
- Populate the settings page with the logged-in user's data.
- Handle partial/missing user data safely.
- Keep the page aligned with the current dashboard/settings UI design.

Requirements
- Show the logged-in user's name.
- Show the logged-in user's email.
- If the settings page has profile fields already, bind them to real authenticated user data.
- Avoid hardcoded demo values.
- Do not break the page if some user fields are unavailable.

Acceptance Criteria
1. Opening `dashboard/settings` shows the current logged-in user's name.
2. Opening `dashboard/settings` shows the current logged-in user's email.
3. Existing placeholder/static profile data is replaced with real session/auth user data.
4. Refreshing the page preserves the displayed user info if auth state is still valid.
5. Missing optional fields do not break rendering or layout.
6. Styling remains consistent with the existing Rushd dashboard/settings page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View own profile on settings page (Priority: P1)

As a logged-in user, I want to open the dashboard/settings page and see my real name and email address displayed, so I can confirm my account details are correct.

**Why this priority**: This is the core value of the feature — replacing placeholders with real user data directly addresses the stated problem.

**Independent Test**: Can be fully tested by navigating to `dashboard/settings` after login and verifying that the displayed name and email match the authenticated user's session data.

**Acceptance Scenarios**:

1. **Given** I am logged in with a valid session, **When** I navigate to `dashboard/settings`, **Then** my real name and email are shown.
2. **Given** I am logged in with a valid session, **When** the settings page profile fields are visible, **Then** they display real authenticated user data instead of placeholders.

---

### User Story 2 - Handle partial or missing data gracefully (Priority: P2)

As a logged-in user with incomplete profile data, I want the settings page to render correctly even if some optional fields are missing, so I can still see my name and email without layout issues.

**Why this priority**: This ensures robustness and prevents user-facing errors when the auth source provides only basic identity fields.

**Independent Test**: Can be fully tested by simulating a session response with missing optional fields and verifying the settings page still renders name, email, and layout correctly.

**Acceptance Scenarios**:

1. **Given** I am logged in but my profile is missing optional fields, **When** I open `dashboard/settings`, **Then** the page renders without broken layout and my available name/email are still visible.
2. **Given** I am logged in with only name and email present, **When** the settings page loads, **Then** no placeholder text appears in those fields.

---

### Edge Cases

- What happens when the authenticated user's name or email is missing?
- How does the settings page behave if the auth/session data is still loading when the page renders?
- What happens if the user's session becomes invalid after a page refresh?
- How does the page handle an empty string for name or email?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The settings page MUST display the logged-in user's name sourced from the active auth/session.
- **FR-002**: The settings page MUST display the logged-in user's email sourced from the active auth/session.
- **FR-003**: Any existing placeholder or static profile data on the settings page MUST be replaced with real authenticated user data.
- **FR-004**: The settings page MUST render correctly when optional user fields are absent, without breaking layout or causing visible errors.
- **FR-005**: The settings page MUST retain its existing visual styling and layout after binding real user data.

### Key Entities *(include if feature involves data)*

- **User Profile**: The authenticated user's identity information, including at minimum name and email, and optionally additional profile fields.
- **Auth Session**: The active authentication context that provides the current user's profile data to the frontend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user viewing the settings page can confirm their name is displayed accurately without seeing placeholder text.
- **SC-002**: A user viewing the settings page can confirm their email is displayed accurately without seeing placeholder text.
- **SC-003**: No placeholder, static, or demo names/emails appear anywhere on the settings page.
- **SC-004**: Refreshing the settings page while authenticated continues to display accurate user data matching the active session.
- **SC-005**: Missing optional profile fields do not visibly break the layout or prevent name/email from displaying.

## Assumptions

- The project has an existing authentication/session system capable of providing the current user's profile data.
- The settings page already exists at `dashboard/settings` and requires only data binding updates, not structural redesign.
- User name and email are considered core identity fields expected to be present in the auth/session response.
- Any additional profile fields on the settings page, if they exist, are optional and may be absent from the auth/session response.
