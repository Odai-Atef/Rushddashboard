# Feature Specification: Global Session Expiry Check and Auto Logout

**Feature Branch**: `031-session-expiry-logout`  
**Created**: Friday, May 22, 2026  
**Status**: Draft  
**Input**: User description: "[Rushd Frontend] Add global session expiry check + auto logout

Implement a frontend-wide session/token validity check on all protected pages every 15 seconds. If the token is expired or invalid, automatically log the user out, redirect to the login screen, and show a localized toast message based on selected language.

Toast messages
- EN: Session expired, please login again
- AR: انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى

Acceptance Criteria
- Check token validity every 15 seconds on all authenticated pages
- If invalid/expired:
  - logout user
  - clear auth/session state
  - redirect to login
  - show localized toast message
- Use current selected language for the toast
- Show expiry toast only once per session-expiry event
- Avoid duplicate polling intervals or repeated logout loops
- Do not affect public pages

Notes
- Implement in a centralized auth/session layer, not separately per page
- Integrate with existing route guards / auth provider / interceptor if available"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Protected Page Session Expiry Alert (Priority: P1)

As an authenticated user navigating protected areas, my session/token validity is regularly checked every 15 seconds so that if it becomes invalid or expired, I am immediately logged out, redirected to the login screen, and informed of the expiry in my chosen language with a single toast message.

**Why this priority**: Session expiry is a core security and UX concern; users must be protected from continuing to work under an invalid session, and they need clear, localized feedback without being overwhelmed by repeated messages.

**Independent Test**: Can be fully tested by simulating token expiry after accessing a protected page, verifying logout, redirect, and a single language-appropriate toast message appears.

**Acceptance Scenarios**:

1. **Given** the user is on a protected page with a valid session, **When** the token is still valid, **Then** the user continues without interruption and no toast is shown.
2. **Given** the user is on a protected page, **When** the token becomes expired or invalid during the periodic check, **Then** the user is logged out, auth/session state is cleared, the user is redirected to the login page, and a single localized toast message is shown in the currently selected language.

---

### User Story 2 - Language-Specific Toast on Expiry (Priority: P2)

As an authenticated user who has selected Arabic as the interface language, I see a localized Arabic toast message when my session expires, so I understand the reason for being logged out without needing to read English.

**Why this priority**: Localization support is important for user inclusivity and a polished UX, but it depends on the core expiry behavior (P1).

**Independent Test**: Can be fully tested by switching to Arabic and triggering session expiry on a protected page, verifying the Arabic toast appears exactly once.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and the UI language is set to Arabic, **When** the session expiry check detects an invalid token, **Then** the toast reads "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى" and appears only once.
2. **Given** the user is authenticated and the UI language is set to English, **When** the session expiry check detects an invalid token, **Then** the toast reads "Session expired, please login again" and appears only once.

---

### User Story 3 - Public Pages Unaffected (Priority: P3)

As a site visitor on a public page, I am not affected by session expiry checks or shown expiry toasts, so my experience remains normal.

**Why this priority**: Ensures non-authenticated users and public content are not disrupted, but it is a dependency of the core expiry system already tested in P1.

**Independent Test**: Can be fully tested by confirming no polling or toast appears on public pages under any session state.

**Acceptance Scenarios**:

1. **Given** a user is on a public page with no active session, **When** time passes, **Then** no session validity polling occurs and no toast messages are shown.
2. **Given** a user is on a public page with an expired session, **When** time passes, **Then** no automatic logout, redirect, or toast is triggered.

---

### Edge Cases

- What happens if the user attempts to navigate between protected pages during a token expiry event? — The check runs across all protected routes; only one logout/redirect/toast sequence should execute.
- How does the system handle intermittent network failures during the validity check? — It should not treat a network error as an expired token; only explicit invalid/expired token responses trigger logout.
- What happens when multiple tabs are open? — Each tab may have its own check, but duplicate logout loops must be avoided (e.g., via debouncing or a shared flag).
- How is the 15-second interval managed to avoid duplicate polling when navigating or when components re-mount? — A single, shared timer instance should be used.
- If the token is renewed/refreshed by another process while on a protected page, does the check reflect the updated token? — The check must evaluate the current token at each interval.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST periodically verify session/token validity every 15 seconds while the user is on any protected/authenticated page.
- **FR-002**: System MUST NOT perform session validity checks on public/unauthenticated pages.
- **FR-003**: When an invalid or expired token is detected, System MUST log the user out immediately and clear all auth/session state.
- **FR-004**: Following a detected token expiry or invalidity, System MUST redirect the user to the login screen.
- **FR-005**: System MUST display a localized toast message upon token expiry, using the current selected language of the user.
  - English: “Session expired, please login again”
  - Arabic: “انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى”
- **FR-006**: The expiry toast message MUST be shown only once per session-expiry event, even if multiple protected pages are open.
- **FR-007**: System MUST avoid duplicate polling intervals and repeated automatic logout loops (e.g., centralized timer with guards/debounce).
- **FR-008**: Session expiry detection and handling MUST be implemented centrally within the authentication/session layer rather than implemented separately on each page.

### Key Entities *(include if feature involves data)*

- **Session/Token**: Represents the user’s current authentication state; expiry or invalidity triggers logout, redirect, and toast.
- **Language Preference**: Represents the user-selected UI language; determines the localized content of the expiry toast.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users on protected pages are reliably logged out and redirected to the login screen within 15 seconds of token expiry or invalidation.
- **SC-002**: The expiry toast message appears exactly once per session-expiry event in the user's selected language.
- **SC-003**: No duplicate polling intervals or repeated logout loops occur during extended usage across multiple protected pages.
- **SC-004**: Public pages experience zero session-check polling and zero unintended logout/redirect/toast behavior.
- **SC-005**: User comprehension of the logout reason is maintained across supported languages without confusion or repeated interruptions.

## Assumptions

- The application already supports a language selection mechanism (e.g., English and Arabic) and localized strings.
- An existing authentication/session layer, route guard, and/or auth provider is available for integration.
- The token/session can be programmatically checked for validity/expiry on the frontend.
- The login screen route is publicly accessible and known.
- The target interval of 15 seconds is acceptable for the application's UX and performance constraints.
