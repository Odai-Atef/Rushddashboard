# Data Model: Onboarding Pre-fill on Reload

## Entities

### Organization (with embedded profile)

The response from `GET /api/v1/onboarding/organizations/me`. Contains both registration data and optional embedded profile.

| Attribute | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | UUID of the organization |
| name | string | Yes | Organization name |
| licenseNumber | string | Yes | License identifier |
| registrationDate | string | Yes | ISO date string |
| type | string | Yes | Organization type (e.g., `CHARITY`) |
| city | string | Yes | City / region |
| website | string \| null | No | Website URL |
| contactPerson | string | Yes | Contact person name |
| email | string | Yes | Contact email |
| mobile | string | Yes | Contact mobile |
| status | string | Yes | Organization status (e.g., `DRAFT`) |
| currentStep | string | Yes | Current onboarding step enum value |
| profile | OrganizationProfileResponse \| null | No | Embedded profile if created |
| fundingAreas | FundingAreaAssignment[] | No | Linked funding areas if set |
| createdAt | string | Yes | ISO timestamp |
| updatedAt | string | Yes | ISO timestamp |

### OrganizationProfileResponse

Embedded profile within the Organization response.

| Attribute | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | UUID of the profile |
| organizationId | string | Yes | Parent organization UUID |
| overview | string | Yes | Organization overview |
| targetBeneficiaries | string | Yes | Target beneficiary groups |
| geographicCoverage | string | Yes | Coverage scope (e.g., `NATIONAL`) |
| employeeCount | number \| null | No | Employee count |
| volunteerCount | number \| null | No | Volunteer count |
| activeProjects | number \| null | No | Active project count |
| fundingAreas | FundingAreaAssignment[] | No | Linked funding area assignments |
| createdAt | string | Yes | ISO timestamp |

### FundingAreaAssignment

Represents a funding area linked to an organization, as returned in the embedded profile or organization root.

| Attribute | Type | Description |
|---|---|---|
| id | string | UUID of the assignment record |
| fundingAreaId | string \| null | UUID of the linked system funding area |
| fundingAreaName | string | Display name |
| fundingAreaNameAr | string \| null | Arabic display name |
| customName | string \| null | Custom name if not a system area |

### FundingArea (system-managed)

Available areas of work from `GET /api/v1/donors/funding-areas`.

| Attribute | Type | Description |
|---|---|---|
| id | string | UUID of the funding area |
| name | string | English name |
| description | string \| null | Optional description |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

## Form State Entities

### RegistrationData

Local form state for the registration step.

| Attribute | Type | Mapping from Organization |
|---|---|---|
| orgName | string | `organization.name` |
| licenseNumber | string | `organization.licenseNumber` |
| registrationDate | string | `organization.registrationDate` (slice to YYYY-MM-DD) |
| orgType | string | `organization.type` (lowercase) |
| city | string | `organization.city` |
| website | string | `organization.website` (or `''`) |
| contactPerson | string | `organization.contactPerson` |
| email | string | `organization.email` |
| mobile | string | `organization.mobile` |

### ProfileData

Local form state for the profile step.

| Attribute | Type | Mapping from Profile |
|---|---|---|
| overview | string | `profile.overview` |
| areasOfWork | string[] | `profile.fundingAreas.map(fa => fa.fundingAreaId)` |
| targetBeneficiaries | string | `profile.targetBeneficiaries` |
| geographicCoverage | string | `profile.geographicCoverage` (lowercase) |
| employeeCount | string | `profile.employeeCount?.toString()` (or `''`) |
| volunteerCount | string | `profile.volunteerCount?.toString()` (or `''`) |
| activeProjects | string | `profile.activeProjects?.toString()` (or `''`) |

## State Transitions

1. **Page Mount** → Call `loadOrganization()`
2. **Loading** → Show spinner
3. **404 / No org** → Empty forms, `currentView = 'landing'`
4. **200 / Has org** → Pre-fill `registrationData` from `organization`
5. **Has embedded profile** → Pre-fill `profileData` from `organization.profile`
6. **Has currentStep** → Set `currentView` from `organization.currentStep` (lowercased)
