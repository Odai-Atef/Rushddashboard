# Feature Specification: Merge User and Organization Registration

**Feature Branch**: `070-org-registration-merge`  
**Created**: 2026-06-27  
**Status**: Draft  
**Input**: User description: "create new page like /auth/register name it as /auth/register/org which merge the page dashboard/onboarding/registration and /auth/register so I has the fields from both pages and remove duplicates"

## Clarifications

### Session 2026-06-27

- **Q**: When the combined registration form is submitted and one of the two operations fails, what should the system do? → **A**: The new page will use a single backend API call that handles both user and organization creation atomically; the frontend will not chain two separate calls.
- **Q**: After successful combined registration, should the user be automatically logged in or redirected to login? → **A**: Do not log the user in; redirect to `/auth/login` with a success message.
- **Q**: Which password complexity rules should the combined registration form enforce? → **A**: Use the same rules as the existing `/auth/register` user-account form.
- **Q**: When the user's "company name" and the organization's "name" are duplicated, how should the single field be mapped to the backend? → **A**: The single field maps to both `user.companyName` and `organization.name` on the backend.
- **Q**: How should the combined registration page handle detection of duplicate user accounts (e.g., existing email or phone)? → **A**: Frontend validates required format only; the backend atomic API detects duplicates and returns a single field-level error, which the frontend displays.
- **Q**: What is the intended implementation approach for reusing existing registration components, and is the page already built? → **A**: The page is already implemented at the route `/auth/register/org`; existing pages remain independent and unchanged.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Combined Organization Registration Page (Priority: P1)

As a new organization representative, when I visit `/auth/register/org`, I see a single registration form that collects both my user account details and my organization details, so that I can create an account and register my organization in one step instead of navigating through two separate pages.

**Why this priority**: This is the core feature request. A single combined page reduces drop-off, removes duplicate navigation, and simplifies onboarding for new organizations.

**Independent Test**: Visit `/auth/register/org`, complete all required fields, submit the form, and verify that both the user account and the organization are created and that I am redirected to the next onboarding step.

**Acceptance Scenarios**:

1. **Given** a visitor on `/auth/register/org`, **When** the page loads, **Then** the form displays all merged fields (user account fields + organization fields) with no duplicated labels or fields.
2. **Given** a visitor who fills all required fields correctly, **When** they submit the form, **Then** the system creates a user account, creates/saves the organization record, and redirects the user to the onboarding assessment flow.
3. **Given** a visitor who leaves required fields empty, **When** they submit the form, **Then** client-side validation shows errors and the form is not submitted.

---

### User Story 2 - No Duplicate Fields (Priority: P1)

As a new organization representative, when I use the combined registration page, I do not see the same information requested twice (e.g., one email or company name field instead of two), so that the form feels concise and I am not confused.

**Why this priority**: Duplicate fields are explicitly called out as a problem in the request. Removing them directly improves completion rate and trust.

**Independent Test**: Inspect the `/auth/register/org` form and confirm that fields shared between the user and organization pages appear only once.

**Acceptance Scenarios**:

1. **Given** the combined registration page, **When** fields are merged, **Then** shared fields such as email, phone, and organization/company name appear exactly once.
2. **Given** the combined registration page, **When** duplicate fields are removed, **Then** the backend still receives all data needed to create both the user and the organization.

---

### User Story 3 - Preserved Existing Registration Pages (Priority: P2)

As a product owner, I want the existing `/auth/register` and `/dashboard/onboarding/registration` pages to remain functional, so that existing flows, links, and tests continue to work while the new combined page is rolled out.

**Why this priority**: Keeping existing pages intact reduces regression risk and allows gradual adoption. Deprecation can be handled separately.

**Independent Test**: Visit `/auth/register` and `/dashboard/onboarding/registration` and confirm both still load and submit successfully.

**Acceptance Scenarios**:

1. **Given** a visitor on `/auth/register`, **When** the page loads, **Then** it behaves exactly as before the new feature was added.
2. **Given** a visitor on `/dashboard/onboarding/registration`, **When** the page loads, **Then** it behaves exactly as before the new feature was added.

---

### Edge Cases

- What happens if the atomic registration API returns an error?
- How does the page behave for large forms on mobile devices?
- What validation messages appear when only one side of the merged form has errors?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST expose a new route `/auth/register/org` that renders a combined registration page.
- **FR-002**: The combined registration page MUST include all unique fields from both `/auth/register` and `/dashboard/onboarding/registration`.
- **FR-003**: The combined registration page MUST remove duplicate fields so that any field present on both source pages appears only once.
- **FR-004**: The combined registration page MUST validate all required fields before submission.
- **FR-004A**: Password fields on the combined registration page MUST follow the same complexity rules as the existing `/auth/register` user-account form.
- **FR-005**: Upon successful submission, the system MUST create the user account and organization record atomically through a single backend API call.
- **FR-006**: The system MUST redirect the user to `/auth/login` with a success message after successful combined registration; it MUST NOT automatically authenticate the user.
- **FR-007**: The existing `/auth/register` and `/dashboard/onboarding/registration` pages MUST remain functional and unchanged in behavior; the combined page at `/auth/register/org` already exists and does not alter them.
- **FR-008**: The frontend MUST send all combined registration data to a single new backend API endpoint; it MUST NOT chain separate user-registration and organization-registration calls.
- **FR-009**: The frontend MUST display a single, clear error message when the atomic registration API returns an error.
- **FR-010**: Duplicate account detection (e.g., existing email or phone) is handled by the backend atomic API; the frontend MUST surface returned field-level errors without making separate existence-check calls.
- **FR-011**: The backend MUST expose `GET /api/v1/donors/funding-areas` as a public (unauthenticated) endpoint so the public `/auth/register/org` page can load charity funding areas before the user is logged in.
- **FR-012**: When `type === CHARITY`, the backend atomic registration endpoint MUST persist the provided `areasOfWork` IDs as organization funding-area records and include them in the returned organization payload.

### Key Entities *(include if feature involves data)*

- **User Account**: Represents the new user. Key attributes include `fullName`, `email`, `phone`, `password`, `companyName`.
- **Organization**: Represents the organization being registered. Key attributes include `name`, `licenseNumber`, `registrationDate`, `type`, `city`, `email`, `mobile`, `overview`/`activity`, and `fundingAreas`.
- **Combined Registration Form**: Represents the merged input collection. It unifies shared attributes (email, phone, organization/company name) and keeps unique attributes from both source pages. The unified "Company / Organization Name" field is sent to the backend as both `user.companyName` and `organization.name`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the combined registration form on `/auth/register/org` in one step with no duplicate fields visible.
- **SC-002**: 100% of fields shared between `/auth/register` and `/dashboard/onboarding/registration` appear exactly once on the combined page.
- **SC-003**: Submission of the combined form successfully creates both a user account and an organization record, with a success rate equal to or greater than the existing separate flows.
- **SC-005**: After successful submission, the user is redirected to `/auth/login` with a success message rather than being automatically logged in.
- **SC-004**: Existing `/auth/register` and `/dashboard/onboarding/registration` pages continue to function without regression.

## Assumptions

- The backend already exposes (or will expose) a single new API endpoint that creates the user account and organization atomically.
- The new combined page will call the backend through a single new API endpoint that creates the user account and organization atomically.
- Shared fields (email, phone, organization/company name) will be mapped to both the user account and organization payloads.
- The existing `/auth/register` and `/dashboard/onboarding/registration` pages are not deprecated by this feature.
- The visual layout will follow the existing `/auth/register` two-column design (form left, benefits right) for consistency.
- The backend will make `GET /api/v1/donors/funding-areas` publicly accessible so the charity type on the public combined registration page can load funding areas before authentication.
