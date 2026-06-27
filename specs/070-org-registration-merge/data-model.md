# Data Model: Merge User and Organization Registration

## Entities

### User Account (existing)

Represents the new user account created during registration.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fullName` | `string` | Yes | User display name |
| `email` | `string` | Yes | Primary contact email |
| `phone` | `string` | Yes | Contact phone number |
| `password` | `string` | Yes | Account password |
| `companyName` | `string` | Yes | Maps to organization `name` |
| `roleSlug` | `string` | Yes | Default `executive` |

### Organization (existing)

Represents the organization being registered.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | Yes | Organization name (from shared `companyName`) |
| `licenseNumber` | `string` | Yes | Organization license number |
| `registrationDate` | `string` | Yes | ISO date string |
| `type` | `OrganizationType` | Yes | `CHARITY` or `COOP` |
| `city` | `string` | Yes | City / region |
| `email` | `string` | Yes | Shared with user account |
| `mobile` | `string` | Yes | Shared with user account phone |
| `overview` | `string` | No | Activity overview (private companies) |
| `areasOfWork` | `string[]` | No | Funding area IDs (charities) |

### OrgRegistrationData (new)

Represents the merged form payload sent to the new atomic endpoint.

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| `fullName` | `string` | Yes | User `fullName` |
| `email` | `string` | Yes | User `email` + Organization `email` |
| `phone` | `string` | Yes | User `phone` + Organization `mobile` |
| `password` | `string` | Yes | User `password` |
| `confirmPassword` | `string` | Yes | UI validation only |
| `agreeToTerms` | `boolean` | Yes | UI validation only |
| `orgName` | `string` | Yes | Organization `name` (also User `companyName`) |
| `licenseNumber` | `string` | Yes | Organization `licenseNumber` |
| `registrationDate` | `string` | Yes | Organization `registrationDate` |
| `orgType` | `'charity' \| 'private_company'` | Yes | Organization `type` |
| `city` | `string` | Yes | Organization `city` |
| `activity` | `string` | Conditional | Organization `overview` when `orgType === 'private_company'` |
| `fundingAreas` | `string[]` | Conditional | Organization `areasOfWork` when `orgType === 'charity'` |

## Validation Rules

- `fullName`: required, 2–100 characters.
- `email`: required, valid email format.
- `phone`: required, not empty.
- `password`: required, meets password policy.
- `confirmPassword`: must match `password`.
- `agreeToTerms`: must be true.
- `orgName`: required, not empty.
- `licenseNumber`: required, not empty.
- `registrationDate`: required.
- `orgType`: required, either `charity` or `private_company`.
- `city`: required, not empty.
- `activity`: required when `orgType === 'private_company'`.
- `fundingAreas`: at least one required when `orgType === 'charity'`.

## Response

On success, the atomic endpoint should return tokens and basic user/organization info so the frontend can redirect to the onboarding assessment flow.

## Removed Duplicates

- `email` appears once and maps to both user and organization.
- `phone` appears once and maps to both user phone and organization mobile.
- `companyName` (user page) and `orgName` (organization page) are merged into a single `orgName` field.
