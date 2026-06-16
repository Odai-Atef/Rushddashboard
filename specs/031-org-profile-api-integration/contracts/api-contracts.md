# API Contracts

## POST /api/v1/onboarding/organizations/:id/profile

Create or update an organization profile.

**Authentication**: Bearer JWT (`Authorization: Bearer <token>`)

### Request

**Path Parameters**:
| Parameter | Type | Description |
|---|---|---|
| id | string (UUID) | Organization ID |

**Body** (`CreateOrganizationProfileDto`):
```json
{
  "overview": "جمعية خيرية تهتم بتعليم الأطفال في المناطق الريفية",
  "targetBeneficiaries": "أطفال في الفئة العمرية 5-15 سنة",
  "geographicCoverage": "NATIONAL",
  "employeeCount": 25,
  "volunteerCount": 100,
  "activeProjects": 5,
  "areasOfWork": ["Education", "Healthcare"]
}
```

**Field Rules**:
- `overview`: Required, string
- `targetBeneficiaries`: Required, string
- `geographicCoverage`: Required, enum: LOCAL, REGIONAL, NATIONAL, INTERNATIONAL
- `employeeCount`: Optional, number, >= 0
- `volunteerCount`: Optional, number, >= 0
- `activeProjects`: Optional, number, >= 0
- `areasOfWork`: Required, string[] (funding area IDs or names depending on backend contract)

### Response 201

**Body** (`OrganizationProfileResponseDto`):
```json
{
  "id": "uuid",
  "organizationId": "uuid",
  "overview": "جمعية خيرية تهتم بتعليم الأطفال في المناطق الريفية",
  "targetBeneficiaries": "أطفال في الفئة العمرية 5-15 سنة",
  "geographicCoverage": "NATIONAL",
  "employeeCount": 25,
  "volunteerCount": 100,
  "activeProjects": 5,
  "fundingAreas": [
    {
      "id": "uuid",
      "name": "Education",
      "nameAr": "التعليم"
    },
    {
      "id": "uuid",
      "name": "Healthcare",
      "nameAr": "الصحة"
    }
  ],
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

### Response 404

```json
{
  "statusCode": 404,
  "message": "Organization uuid not found"
}
```

---

## POST /api/v1/onboarding/organizations/:id/funding-areas

Assign funding areas to an organization.

**Authentication**: Bearer JWT

### Request

**Path Parameters**:
| Parameter | Type | Description |
|---|---|---|
| id | string (UUID) | Organization ID |

**Body** (`SetFundingAreasDto`):
```json
{
  "fundingAreaIds": ["uuid-1", "uuid-2"],
  "customAreas": [
    { "name": "Custom Area 1" }
  ]
}
```

**Field Rules**:
- `fundingAreaIds`: Required, string[] of FundingArea UUIDs
- `customAreas`: Optional, array of `{ name: string }`

### Response 201

**Body** (`OrganizationFundingAreaResponseDto[]`):
```json
[
  {
    "id": "uuid",
    "fundingAreaId": "uuid-1",
    "fundingAreaName": "Education",
    "fundingAreaNameAr": "التعليم",
    "customName": null
  },
  {
    "id": "uuid",
    "fundingAreaId": "uuid-2",
    "fundingAreaName": "Healthcare",
    "fundingAreaNameAr": "الصحة",
    "customName": null
  },
  {
    "id": "uuid",
    "fundingAreaId": null,
    "fundingAreaName": "Custom Area 1",
    "fundingAreaNameAr": null,
    "customName": "Custom Area 1"
  }
]
```

---

## GET /api/v1/donors/funding-areas

Retrieve the list of available system-managed funding areas.

**Authentication**: Bearer JWT (with `skipAuthRedirect: true` in client config)

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

---

## GET /api/v1/onboarding/organizations/:id/profile

Retrieve an organization's profile (for pre-fill / reload scenarios).

**Authentication**: Bearer JWT

### Request

**Path Parameters**:
| Parameter | Type | Description |
|---|---|---|
| id | string (UUID) | Organization ID |

### Response 200

Same shape as `OrganizationProfileResponseDto` from the POST endpoint.

### Response 404

Organization or profile not found.
