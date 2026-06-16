# Data Model: Organization Profile API Integration

## Entities

### OrganizationProfile

Represents the detailed profile of an organization after registration.

| Attribute | Type | Required | Description |
|---|---|---|---|
| overview | string | Yes | Brief description of organization's vision, mission, and goals |
| targetBeneficiaries | string | Yes | Description of beneficiary groups |
| geographicCoverage | GeographicCoverage | Yes | Scope of operations: LOCAL, REGIONAL, NATIONAL, INTERNATIONAL |
| employeeCount | number | No | Number of paid employees |
| volunteerCount | number | No | Number of volunteers |
| activeProjects | number | No | Count of currently active projects |
| areasOfWork | string[] | Yes | Array of FundingArea IDs |

### OrganizationProfileResponse

The response returned after creating or fetching a profile.

| Attribute | Type | Description |
|---|---|---|
| id | string | UUID of the profile record |
| organizationId | string | UUID of the parent organization |
| overview | string | Brief description |
| targetBeneficiaries | string | Beneficiary groups |
| geographicCoverage | string | Coverage scope |
| employeeCount | number \| null | Employee count |
| volunteerCount | number \| null | Volunteer count |
| activeProjects | number \| null | Active project count |
| fundingAreas | FundingArea[] | Populated linked funding areas |
| createdAt | string | ISO timestamp |

### FundingArea

A system-managed category describing a charitable focus area.

| Attribute | Type | Description |
|---|---|---|
| id | string | UUID of the funding area |
| name | string | English name |
| description | string \| null | Optional description |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

### FundingAreaAssignment

Represents a funding area linked to a specific organization.

| Attribute | Type | Description |
|---|---|---|
| id | string | UUID of the assignment record |
| fundingAreaId | string \| null | UUID of the linked funding area (null for custom) |
| fundingAreaName | string | Display name |
| fundingAreaNameAr | string \| null | Arabic display name |
| customName | string \| null | Custom name if not a system area |

### SetFundingAreasRequest

Payload for assigning funding areas to an organization.

| Attribute | Type | Required | Description |
|---|---|---|---|
| fundingAreaIds | string[] | Yes | IDs of selected system funding areas |
| customAreas | CustomFundingArea[] | No | Optional user-defined custom areas |

### CustomFundingArea

A user-defined area of work not in the system list.

| Attribute | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | Name of the custom area |

## Relationships

- **Organization** → **OrganizationProfile** (1:1)
  - Each organization has exactly one profile.
  - Profile is created after registration step.
- **Organization** → **FundingAreaAssignment** (1:N)
  - An organization can have multiple funding areas assigned.
  - Each assignment links either a system `FundingArea` or a custom area.
- **FundingArea** → **FundingAreaAssignment** (1:N)
  - A system funding area can be assigned to many organizations.

## State Transitions

1. **Registration** → `organization` exists with `id`
2. **Profile Form** → User fills `OrganizationProfile` fields
3. **Create Profile** → `POST /organizations/:id/profile` → `OrganizationProfileResponse`
4. **Save Funding Areas** → `POST /organizations/:id/funding-areas` → `FundingAreaAssignment[]`
5. **Assessment** → Profile data is persisted; user can safely navigate/refresh

## Validation Rules

- `overview`: Required, non-empty string
- `targetBeneficiaries`: Required, non-empty string
- `geographicCoverage`: Required, must be one of LOCAL, REGIONAL, NATIONAL, INTERNATIONAL
- `areasOfWork`: Required, at least one item must be selected
- `employeeCount`, `volunteerCount`, `activeProjects`: Optional, must be non-negative integers if provided
