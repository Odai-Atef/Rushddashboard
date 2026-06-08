# Feature Specification: Session Username Sync

**Feature Branch**: `035-session-username-sync`  
**Created**: 2026-06-08  
**Status**: Draft  
**Input**: User description: "on the top menu and settings page update the user name from static code to the data from the session"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Top Menu Displays Authenticated User (Priority: P1)

A logged-in user navigates the application and sees their own name, email, and avatar initials in the top bar user menu instead of a hardcoded placeholder.

**Why this priority**: This is the primary deliverable. It ensures the UI reflects the actual authenticated identity and prevents confusion in multi-user environments.

**Independent Test**: Can be fully tested by logging in with different accounts and verifying the top bar menu shows the corresponding name and email from the session.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they view the top bar, **Then** the user menu trigger shows their avatar initials derived from `fullName`.
2. **Given** a user opens the user dropdown menu, **When** the menu renders, **Then** it displays the authenticated `fullName` and `email` from the session.
3. **Given** a user has a single-word name (e.g., "أحمد"), **When** the avatar is rendered, **Then** it shows the first two characters of that name.

---

### User Story 2 - Settings Profile Page Reflects Session Data (Priority: P1)

A logged-in user opens the Settings page and navigates to the Profile section. The form fields are pre-filled with their actual session data (name, email) rather than static placeholder values.

**Why this priority**: This is the second core deliverable. Pre-filling profile settings with real data reduces manual entry errors and provides a trustworthy account management experience.

**Independent Test**: Can be fully tested by opening the Settings > Profile page and verifying that the name and email inputs match the authenticated session.

**Acceptance Scenarios**:

1. **Given** the user is on the Profile settings page, **When** the page loads, **Then** the avatar shows initials derived from `fullName`.
2. **Given** the user is on the Profile settings page, **When** the page loads, **Then** the first/last name fields and email field are pre-filled from the session.

---

### User Story 3 - Handle Missing or Failed Profile Fetch (Priority: P2)

If the backend profile endpoint is temporarily unavailable, the application should not crash and should display sensible fallback values while preserving core navigation functionality.

**Why this priority**: Resilience is important for a smooth user experience, especially when network conditions are unstable.

**Independent Test**: Can be tested by blocking the profile endpoint and verifying the top bar and settings page still render with generic fallbacks.

**Acceptance Scenarios**:

1. **Given** the profile fetch fails or the user has no profile data, **When** the top bar renders, **Then** the avatar shows a generic fallback (`؟`) and the name shows a placeholder (`المستخدم`).
2. **Given** the profile fetch fails, **When** the settings page renders, **Then** the profile fields remain empty or show placeholders instead of stale hardcoded data.

---

### Edge Cases

- What happens when the user has no `fullName` in their profile?  
  → The avatar shows `؟` and the top bar name shows `المستخدم`.
- What happens when the user has a very long name?  
  → The UI should truncate gracefully without breaking the dropdown or settings layout.
- What happens on logout?  
  → The user state is cleared so no stale identity data persists after sign-out.
- How does the system handle concurrent edits to profile data in another tab?  
  → The current implementation reads session data at mount/login; real-time sync is out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The authentication context MUST expose the current authenticated `UserProfile` (including `fullName` and `email`) to all child components.
- **FR-002**: On application mount, if the user is already authenticated, the system MUST fetch their profile from the backend and store it in the auth context.
- **FR-003**: After a successful login, the system MUST fetch the user profile and update the auth context with the session data.
- **FR-004**: On logout, the system MUST clear the user profile from the auth context.
- **FR-005**: The top bar user menu MUST display the authenticated user's `fullName`, `email`, and avatar initials derived from `fullName`.
- **FR-006**: The Settings > Profile page MUST pre-fill the name and email fields from the authenticated session data.
- **FR-007**: If the profile data is missing or the fetch fails, the system MUST show generic fallback values (`؟` for avatar, `المستخدم` for name, empty for email) without crashing.

### Key Entities *(include if feature involves data)*

- **UserProfile**: Represents the authenticated user's identity.
  - `id`: Unique identifier.
  - `fullName`: Display name for the user (used for top bar and settings).
  - `email`: Contact email (used for display in top bar and settings).
  - `role`: User role within the organization.
  - `avatar`: Optional profile image URL (fallback to initials if absent).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of authenticated sessions display the user's actual name in the top bar within 1 second of page load under normal network conditions.
- **SC-002**: The Settings > Profile page pre-fills name and email correctly for 100% of users with valid profiles.
- **SC-003**: If the profile endpoint is unreachable, the UI remains usable (no crashes, no blank sections) in 100% of observed cases.
- **SC-004**: After logout, all user-specific data is cleared from the UI within 200 milliseconds.

## Assumptions

- The backend exposes a `GET /auth/profile` endpoint that returns `UserProfile` data in the shape already defined in `auth-service.ts`.
- The existing token-based authentication (stored in `localStorage`) is sufficient to authorize the profile fetch.
- The `fullName` field is a single string; splitting into first/last name for the settings form uses simple whitespace splitting.
- Avatar images are not in scope for this feature; initials-based fallbacks remain the primary display method.
- Real-time profile synchronization across tabs is out of scope.
