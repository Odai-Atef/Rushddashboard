# Organization Registration API Contract

## Base URL

All endpoints are relative to the configured API base URL in `src/api/client.ts`.

## Endpoints

### POST /api/v1/auth/register/org

Create a new user account and an associated organization atomically.

#### Request Body

```json
{
  "fullName": "Ahmad Mohammed",
  "email": "user@company.com",
  "phone": "+966 50 123 4567",
  "password": "securePassword123",
  "orgName": "شركة الرشد للاستثمار",
  "licenseNumber": "1234567890",
  "registrationDate": "2026-06-27",
  "orgType": "private_company",
  "city": "الرياض",
  "activity": "خدمات مالية",
  "fundingAreas": []
}
```

#### Request Rules

- `orgType` must be either `charity` or `private_company`.
- `activity` is required when `orgType` is `private_company`.
- `fundingAreas` must contain at least one item when `orgType` is `charity`.
- All other fields are required.
- The backend MUST create the user and organization atomically.

#### Response Body (Success)

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "user@company.com",
      "fullName": "Ahmad Mohammed"
    },
    "organization": {
      "id": "uuid",
      "name": "شركة الرشد للاستثمار",
      "type": "COOP"
    }
  },
  "message": "Registration successful"
}
```

#### Response Rules

- On success, both user and organization are created.
- If either creation fails, the entire operation fails and no partial data is persisted.

#### Response Body (Error)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "البريد الإلكتروني مطلوب" }
  ]
}
```

## TypeScript Types (suggested)

```typescript
export interface OrgRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  orgName: string;
  licenseNumber: string;
  registrationDate: string;
  orgType: 'charity' | 'private_company';
  city: string;
  activity: string;
  fundingAreas: string[];
}

export interface OrgRegistrationResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  organization: {
    id: string;
    name: string;
    type: string;
  };
}
```

## Notes

- The endpoint name `POST /api/v1/auth/register/org` is a suggested convention. The implementation should align with the backend team on the final path.
- The frontend MUST NOT chain this call with separate user-registration and organization-registration calls.
