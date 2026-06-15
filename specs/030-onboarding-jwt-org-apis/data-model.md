# Data Model: Onboarding JWT Organization APIs

## Entity: OrganizationResponse (Read Model)

Represents the full organization domain object returned by `GET /api/v1/onboarding/organizations/me`.

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| id | UUID string | No | Backend-generated identifier. Returned to the frontend but **must not be stored** in `sessionStorage` or `localStorage`. |
| name | string | No | Official organization name (Arabic/English). |
| licenseNumber | string | No | Government-issued license number. |
| registrationDate | ISO-8601 string | No | Date of official registration (`2024-01-15T00:00:00.000Z`). |
| type | OrganizationType enum | No | `CHARITY` \| `FOUNDATION` \| `NGO` \| `COOP` |
| city | string | No | Primary city / region of operation. |
| website | string \| null | Yes | Official website URL. |
| contactPerson | string | No | Primary contact person's full name. |
| email | string | No | Contact email address. |
| mobile | string | No | Contact mobile number (intl format, e.g. `+966...`). |
| status | OrganizationStatus enum | No | `DRAFT` \| `SUBMITTED` \| `UNDER_REVIEW` \| `APPROVED` \| `REJECTED` |
| currentStep | OnboardingStep enum | No | `REGISTRATION` \| `PROFILE` \| `ASSESSMENT` \| `DOCUMENTS` \| `PROCESSING` \| `RESULTS` |
| createdAt | ISO-8601 string | No | Record creation timestamp. |
| updatedAt | ISO-8601 string | No | Last update timestamp. |

## Entity: CreateOrganizationDto (Write Payload)

Sent as JSON body on `PUT /api/v1/onboarding/organizations/me`. Identical field set to `OrganizationResponse` except `id`, `status`, `currentStep`, `createdAt`, `updatedAt` are omitted (server-managed).

| Field | Type | Required | Frontend Validation Rule |
|-------|------|----------|--------------------------|
| name | string | Yes | Min 2 characters |
| licenseNumber | string | Yes | Non-empty, exact format validated server-side |
| registrationDate | string (YYYY-MM-DD) | Yes | Valid date, not in the future |
| type | OrganizationType | Yes | Must match one of the four enum values |
| city | string | Yes | Min 2 characters |
| website | string | No | Valid URL if provided; empty string treated as absent |
| contactPerson | string | Yes | Min 2 characters |
| email | string | Yes | RFC-5322-ish email format (regex) |
| mobile | string | Yes | E.164-like format (`+` followed by digits) |

## Type Enums

```typescript
type OrganizationType   = 'CHARITY' | 'FOUNDATION' | 'NGO' | 'COOP';
type OrganizationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
type OnboardingStep   = 'REGISTRATION' | 'PROFILE' | 'ASSESSMENT' | 'DOCUMENTS' | 'PROCESSING' | 'RESULTS';
```

## State Transitions

```
[User lands on Registration Screen]
            │
            ▼
    GET /organizations/me
            │
    ┌───────┴────────┐
    ▼                ▼
  200              404
 (pre-fill)      (empty form)
    │                │
    └───────┬────────┘
            ▼
   User edits form ──► PUT /organizations/me
            │
    ┌───────┼────────┐
    ▼       ▼        ▼
  200     201      400
(update) (create) (validation)
    │       │        │
    ▼       ▼        ▼
 Advance  Advance  Show field
 to next  to next  errors
  step     step
```

## Relationships

- **OrganizationResponse** 1:1 **OrganizationProfileResponse** — a profile is created in the next onboarding step and linked implicitly by the same JWT subject.
- **OrganizationResponse** 1:N **FundingAreaAssignment** — set in a later step via `POST /organizations/:id/funding-areas` (legacy endpoint; out of scope for this feature).
