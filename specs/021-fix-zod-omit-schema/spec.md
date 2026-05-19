# Feature Specification: Fix Zod Omit Schema Blank Page

**Feature Branch**: `[021-fix-zod-omit-schema]`  
**Created**: 2026-05-19  
**Status**: Draft  
**Input**: User description: "[Rushd][Frontend][Auth] Fix blank white page caused by Zod .omit() on refined register schema"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registration Page Renders Without Crash (Priority: P1)

As a new user, I visit the registration page and expect it to load and display the registration form so I can create an account without the browser showing a blank white page.

**Why this priority**: A blank white page is a critical blocker. Users cannot interact with the registration flow at all if the frontend crashes before rendering.

**Independent Test**: Can be fully tested by visiting the registration page in a browser and confirming the registration form renders and is visible.

**Acceptance Scenarios**:

1. **Given** the registration route is accessed, **When** the page loads, **Then** the browser console reports no runtime errors and the registration form is visible.
2. **Given** a build with the auth schema loaded, **When** the app initializes the auth module, **Then** it does not throw the Zod `.omit()` on refined schemas error.

---

### User Story 2 - Registration Validation Preserved After Fix (Priority: P2)

As a user attempting to register, I expect password rules, confirm-password matching, and field validations to continue working as before so that I receive helpful inline error messages when entering invalid data.

**Why this priority**: Restoring the page without its validation logic would leave the form silently broken. Regression of validation rules degrades data quality and user experience.

**Independent Test**: Can be fully tested by entering invalid data (short password, mismatched confirm password, empty required fields) and confirming error messages appear under the affected fields.

**Acceptance Scenarios**:

1. **Given** the registration form is visible, **When** a user enters a password that violates the defined rules, **Then** the password input displays the correct validation error immediately.
2. **Given** the registration form is visible, **When** a user enters mismatched passwords, **Then** the confirm-password field displays a mismatch error.

---

### User Story 3 - Login and Derived Auth Flows Unaffected (Priority: P3)

As an existing user, I can visit the login page and related auth flows (e.g., password reset) without encountering regressions introduced by the schema refactor.

**Why this priority**: While the fix targets registration schema composition, the auth module may share schemas. Unintended side effects on other flows must be avoided.

**Independent Test**: Can be fully tested by visiting the login page and any reset forms, confirming they render and accept input without new console errors.

**Acceptance Scenarios**:

1. **Given** the login route is accessed, **When** the page loads, **Then** the login form renders and no new console errors appear.
2. **Given** the auth module is initialized, **When** derived schemas are evaluated at runtime, **Then** no errors related to `.omit()` or refinements are thrown.

---

### Edge Cases

- What happens when the register schema is composed with `.refine()` before `.omit()` is called?
- How do we ensure that any new derived schema (e.g., for login or password reset) does not repeat the same runtime `.omit()` pitfall?
- What happens if a downstream component or hook reads from a removed field type after schema recomposition?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the registration page without a blank white page
- **FR-002**: System MUST avoid using `.omit()` on any Zod object schema that contains refinements (`.refine()`, `.superRefine()`, or similar)
- **FR-003**: System MUST preserve existing registration validation rules and constraints
- **FR-004**: System MUST preserve confirm-password matching logic so mismatched passwords produce the expected validation error
- **FR-005**: System MUST ensure login and any other derived auth schemas are not broken by the refactor
- **FR-006**: System MUST compose runtime-safe schemas when deriving sub-schemas from the base registration schema

### Non-Functional Requirements

- **NFR-001**: Schema recomposition changes MUST be documented with a brief comment explaining why the approach is runtime-safe and referencing the Zod behavior

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The registration page loads and renders successfully in under 1 second with no blank white page
- **SC-002**: Browser console reports zero errors related to `.omit() cannot be used on object schemas containing refinements`
- **SC-003**: Existing registration validation (password rules, confirm-password matching, required fields) behaves identically before and after the fix
- **SC-004**: Login page and any other auth flows remain free of new runtime errors after the refactor
- **SC-005**: Derived login/register/request schemas are composed predictably and do not rely on `.omit()` over refined parent schemas

## Assumptions

- The fix is scoped to the frontend auth schema layer (`auth.ts` and related auth form types/usages)
- Zod version behavior is consistent with the stated error message (`.omit()` forbidden on refined object schemas)
- The project prefers runtime-safe schema composition over version-upgrading Zod to bypass the restriction, unless a version upgrade is the minimal viable fix
- Current UI requirements do not introduce new registration fields during this fix
- Regression testing relies on manual QA and existing unit/integration tests for the auth module
