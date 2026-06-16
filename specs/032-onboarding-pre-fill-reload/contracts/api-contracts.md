# API Contracts

## GET /api/v1/onboarding/organizations/me

Retrieve the current user's organization with embedded profile and funding areas.

**Authentication**: Bearer JWT (`Authorization: Bearer <token>`)

### Response 200

**Body** (`Organization` with embedded profile):
```json
{
  "id": "uuid",
  "name": "جمعية البر الخيرية",
  "licenseNumber": "LIC-123456",
  "registrationDate": "2024-01-15T00:00:00.000Z",
  "type": "CHARITY",
  "city": "الرياض",
  "website": "https://example.org",
  "contactPerson": "أحمد الرشيد",
  "email": "contact@example.org",
  "mobile": "+966501234567",
  "status": "DRAFT",
  "currentStep": "PROFILE",
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z",
  "profile": {
    "id": "uuid",
    "organizationId": "uuid",
    "overview": "جمعية خيرية تهتم بتعليم الأطفال...",
    "targetBeneficiaries": "أطفال في الفئة العمرية 5-15",
    "geographicCoverage": "NATIONAL",
    "employeeCount": 25,
    "volunteerCount": 100,
    "activeProjects": 5,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "fundingAreas": [
      {
        "id": "uuid",
        "fundingAreaId": "uuid-1",
        "fundingAreaName": "Education",
        "fundingAreaNameAr": "التعليم",
        "customName": null
      }
    ]
  },
  "fundingAreas": [
    {
      "id": "uuid",
      "fundingAreaId": "uuid-1",
      "fundingAreaName": "Education",
      "fundingAreaNameAr": "التعليم",
      "customName": null
    }
  ]
}
```

**Field Rules for Pre-fill**:
- `registrationDate`: Slice to `YYYY-MM-DD` for date input
- `type`: Convert to lowercase for select value matching
- `currentStep`: Convert to lowercase for `ViewType` matching
- `profile.geographicCoverage`: Convert to lowercase for select value matching
- `profile.employeeCount`, `profile.volunteerCount`, `profile.activeProjects`: Convert `number | null` to `string` (empty string if null)
- `profile.fundingAreas`: Map to `areasOfWork` using `fundingAreaId` (not `id` of the assignment)

### Response 404

```json
{
  "statusCode": 404,
  "message": "No organization found for this user"
}
```

**Handling**: Show empty forms, start from landing step. This is expected for new users.

### Response 401

Handled by the API client interceptor — redirects to `/auth/login?expired=true`.

---

## GET /api/v1/donors/funding-areas

Retrieve the list of available system-managed funding areas (for checkbox rendering).

**Authentication**: Bearer JWT (with `skipAuthRedirect: true`)

### Response 200

**Body** (`FundingArea[]`):
```json
[
  {
    "id": "uuid",
    "name": "Education",
    "description": "التعليم والتدريب",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Checkbox checked logic**:
```
checked = profileData.areasOfWork.includes(area.id)
```
Where `profileData.areasOfWork` is populated from `profile.fundingAreas.map(fa => fa.fundingAreaId)`.
