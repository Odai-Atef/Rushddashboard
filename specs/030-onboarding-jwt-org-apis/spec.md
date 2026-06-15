# Feature Specification: Onboarding JWT Organization APIs

**Feature Branch**: `[###-feature-name]`
**Created**: 2026-06-15
**Status**: Draft
**Input**: User description: "The onboarding flow stores orgId in sessionStorage and localStorage. When the user reloads the page or browser storage is cleared, the orgId is lost and the user cannot recover their organization. The backend now exposes GET /organizations/me and PUT /organizations/me endpoints. The frontend must switch to these JWT-based APIs and remove all orgId session storage dependency, completing the onboarding refactor."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reload Resumes Onboarding (Priority: P1)

As a user filling out the onboarding organization-info form, when I refresh the page, I want the form to repopulate with my previously entered organization data so that I don't have to re-enter everything.

**Why this priority**: Users frequently refresh pages or restore sessions; losing organization data blocks onboarding completion and increases support burden.

**Independent Test**: Can be fully tested by refreshing the organization-info screen after partial data entry and verifying the fields repopulate without any `orgId` stored in browser storage.

**Acceptance Scenarios**:

1. **Given** the user has partially filled and saved organization info, **When** they refresh the organization-info screen, **Then** the form fields are pre-populated from `GET /organizations/me`.
2. **Given** the user has never created an organization, **When** they land on the organization-info screen, **Then** all form fields are empty.

---

### User Story 2 - Secure Organization Persistence (Priority: P1)

As a user completing onboarding, I want my organization identity tied solely to my authenticated JWT so that clearing browser storage does not disconnect me from my organization.

**Why this priority**: Org IDs persisted in `sessionStorage`/`localStorage` are fragile and represent a data-loss security risk.

**Independent Test**: Can be fully tested by clearing all browser storage mid-onboarding and reloading the organization-info screen; the form should still load existing data via JWT.

**Acceptance Scenarios**:

1. **Given** an existing organization, **When** the user clears `sessionStorage` and `localStorage`, **Then** reloading the onboarding page still retrieves the organization via the JWT.
2. **Given** any onboarding step, **When** inspecting browser storage, **Then** no `orgId` key is present.

---

### User Story 3 - Server-Driven Save with Validation Feedback (Priority: P2)

As a user submitting organization details, I want the system to save via `PUT /organizations/me` and show field-level validation errors inline so that I can correct mistakes without losing my progress.

**Why this priority**: Accurate data entry reduces downstream operational issues; preserving form state on errors prevents user frustration.

**Independent Test**: Can be fully tested by submitting an invalid organization form and verifying inline error messages appear while all entered data remains intact.

**Acceptance Scenarios**:

1. **Given** the user fills out the form with an invalid email, **When** they click Save / Next, **Then** a 400 response displays an email validation error beneath the email field and no data is lost.
2. **Given** the user is offline, **When** they attempt to save, **Then** a retry button appears and all form values remain unchanged.

---

### Edge Cases

- **401 on GET /organizations/me**: redirect immediately to `/auth/login`.
- **Network failure on GET /organizations/me**: show retry button; keep user on the form without clearing fields.
- **Double-submit of the form**: no duplicate organization should be created; subsequent PUTs update the same entity.
- **Server 500 on PUT /organizations/me**: display a friendly error toast (Arabic if the app supports it); do not clear any form fields.
- **User navigates directly to onboarding step 3 (profile) without ever completing organization info**: system should gracefully guide the user back or allow forward progression depending on existing backend state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST remove all code that reads or writes `orgId` to `sessionStorage` or `localStorage`.
- **FR-002**: On mount of the organization-info screen (Screen 2), the system MUST call `GET /api/v1/onboarding/organizations/me` using the existing `apiClient` (JWT attached automatically).
- **FR-003**: If the GET response is `200`, the system MUST pre-populate every form field (`name`, `licenseNumber`, `registrationDate`, `type`, `city`, `website`, `contactPerson`, `email`, `mobile`) with the returned data.
- **FR-004**: If the GET response is `404`, the system MUST present an empty form (no pre-filled values).
- **FR-005**: If the GET response is `401`, the system MUST redirect the user to `/auth/login`.
- **FR-006**: If the GET request encounters a network error, the system MUST display a retry button and MUST NOT navigate away from the form.
- **FR-007**: On Save or Next, the system MUST assemble all form fields into a `CreateOrganizationDto` payload and call `PUT /api/v1/onboarding/organizations/me`.
- **FR-008**: If the PUT response is `200` (updated) or `201` (created), the system MUST advance the user to the next onboarding step (profile screen) and MUST NOT store the returned `organization.id` in any browser storage.
- **FR-009**: If the PUT response is `400`, the system MUST render field-level validation errors beneath the corresponding inputs.
- **FR-010**: If the PUT response is `401`, the system MUST redirect the user to `/auth/login`.
- **FR-011**: If the PUT response is `500` or an unexpected server error occurs, the system MUST show an error toast with a user-friendly message (Arabic preferred if bilingual) and MUST leave the form data intact.
- **FR-012**: The system MUST add an API service method `getMyOrganization()` that performs `GET /api/v1/onboarding/organizations/me` and returns an `OrganizationResponse`.
- **FR-013**: The system MUST add an API service method `saveMyOrganization(data)` that performs `PUT /api/v1/onboarding/organizations/me` with a `CreateOrganizationDto` payload and returns `{ org: OrganizationResponse, statusCode: number }`.
- **FR-014**: Both new API methods MUST use the existing `apiClient` so the JWT token is automatically attached via the configured auth interceptor.

### Key Entities *(include if feature involves data)*

- **OrganizationResponse**: Represents the full organization domain object returned by the backend. Attributes include `id`, `name`, `licenseNumber`, `registrationDate`, `type`, `city`, `website`, `contactPerson`, `email`, `mobile`, `status`, `currentStep`, `createdAt`, `updatedAt`. Used for pre-filling the organization-info form.
- **CreateOrganizationDto**: Represents the writable subset of organization attributes sent to the backend on `PUT /organizations/me`. Attributes include `name`, `licenseNumber`, `registrationDate`, `type`, `city`, `website`, `contactPerson`, `email`, `mobile`. Used as the request body for creating or updating the user's organization.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can refresh the organization-info onboarding page and have their existing organization data loaded within 2 seconds without any `orgId` present in browser storage.
- **SC-002**: Submitting the organization form updates the existing record via `PUT /organizations/me` when one already exists, and no duplicate organization is created upon double-submit or page reload.
- **SC-003**: 100% of API calls from the onboarding flow include a valid JWT token via the existing auth interceptor.
- **SC-004**: On network or server errors, the form retains 100% of the user's entered data and presents a retry mechanism or actionable error message.
- **SC-005**: All validation errors returned as `400` responses are displayed as field-level messages, allowing users to correct and resubmit successfully on the first retry at least 90% of the time.
- **SC-006**: No `orgId` key exists in `sessionStorage` or `localStorage` after any onboarding step.

## Assumptions

- The existing `apiClient` is already configured with a JWT auth interceptor that attaches the `Authorization: Bearer <token>` header automatically.
- The `OrganizationResponse` type on the frontend already mirrors the backend `OrganizationResponseDto` shape.
- The onboarding flow contains at least two screens: organization info (Screen 2) and profile (next step after save).
- Form field names align exactly with `CreateOrganizationDto` keys.
- The application supports Arabic translations for user-facing error messages, or will default to Arabic for toasts where available.
