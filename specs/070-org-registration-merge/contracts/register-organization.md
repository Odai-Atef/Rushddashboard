# Contract: POST /api/v1/auth/register-organization

## Endpoint

```
POST /api/v1/auth/register-organization
```

## Purpose

Atomically create a new user account and the organization they represent. The frontend uses this single endpoint instead of chaining separate user and organization registration calls.

## Request Body

```json
{
  "fullName": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "confirmPassword": "string",
  "licenseNumber": "string",
  "registrationDate": "YYYY-MM-DD",
  "type": "CHARITY | PRIVATE_COMPANY",
  "city": "string",
  "overview": "string",
  "areasOfWork": ["string"]
}
```

### Field Semantics

| Field | Maps to | Required | Validation |
|-------|---------|----------|------------|
| `fullName` | User full name | Yes | Non-empty after trim |
| `name` | Organization name | Yes | Non-empty after trim |
| `email` | User email, Organization email | Yes | Valid email format |
| `phone` | User phone, Organization mobile | Yes | Non-empty after trim |
| `password` | User password | Yes | Non-empty |
| `confirmPassword` | Password confirmation | Yes | Must equal `password` |
| `licenseNumber` | Organization license | Yes | Non-empty after trim |
| `registrationDate` | Organization registration date | Yes | ISO date string |
| `type` | Organization type | Yes | `CHARITY` or `PRIVATE_COMPANY` |
| `city` | Organization city | Yes | Non-empty after trim |
| `overview` | Organization profile overview | Conditional | Required when `type === PRIVATE_COMPANY` |
| `areasOfWork` | Organization funding/activity areas | Conditional | Required, non-empty when `type === CHARITY` |

## Success Response

```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 3600,
    "user": {
      "id": "string",
      "email": "string",
      "fullName": "string",
      "phone": "string",
      "roleId": "string",
      "status": "string",
      "createdAt": "string"
    },
    "organization": {
      "id": "string",
      "name": "string",
      "licenseNumber": "string",
      "type": "string",
      "email": "string",
      "mobile": "string",
      "ownerId": "string",
      "status": "string",
      "currentStep": "string",
      "createdAt": "string"
    }
  },
  "message": "string"
}
```

**Frontend handling**: The frontend must **ignore** `accessToken`/`refreshToken` for authentication and must redirect to `/auth/login?registered=true` with a success toast.

## Error Responses

### 400 Bad Request — validation error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "البريد الإلكتروني مستخدم بالفعل" }
  ]
}
```

Frontend displays either the first field-level message or the top-level `message` as the API error banner.

### 409 Conflict — duplicate account

```json
{
  "success": false,
  "message": "Account already exists",
  "errors": [
    { "field": "email", "message": "An account with this email already exists" }
  ]
}
```

### 422 Unprocessable Entity — business rule violation

```json
{
  "success": false,
  "message": "Organization license number is already registered"
}
```

### 500 / Network Error

Frontend catches network failures and renders a generic Arabic connection error message.

## Consumer

- `src/api/services/auth-service.ts` — `AuthService.registerOrganization()`
- `src/app/pages/auth/OrgRegistrationPage.tsx` — form submit handler

## Supporting Public Endpoint: GET /api/v1/donors/funding-areas

### Purpose

Provide the list of charity funding areas to the **public** `/auth/register/org` page so a visitor can select مجالات العمل before they have an access token.

### Requirements

- **Must be unauthenticated** or accept unauthenticated requests for this use case.
- **Response shape**:

  ```json
  {
    "success": true,
    "data": [
      { "id": "string", "name": "string", "description": "string | null", "createdAt": "string", "updatedAt": "string" }
    ]
  }
  ```

### Consumer

- `src/api/services/onboarding-service.ts` — `OnboardingService.getFundingAreas()`
- `src/app/pages/auth/OrgRegistrationPage.tsx` — charity funding-areas checklist

## Notes

- The current backend already returns tokens on success. The frontend contract changes only in consumer behavior, not in backend response shape.
- If the backend does not yet accept `fullName`, `registrationDate`, or `city`, those fields must be added to the backend endpoint before this plan can be fully implemented.
- The funding-areas endpoint must be made public before charity registration can be smoke-tested end-to-end on `/auth/register/org`.
