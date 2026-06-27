# Authentication API Contract

## Base URL

All endpoints are relative to the configured API base URL in `src/api/client.ts`.

## Endpoints

### POST /api/v1/auth/register

Register a new user.

#### Request Body

```json
{
  "email": "user@company.com",
  "password": "securePassword123",
  "fullName": "Ahmad Mohammed",
  "companyName": "شركة الرشد للاستثمار",
  "roleSlug": "executive",
  "phone": "+966 50 123 4567"
}
```

#### Request Rules

- `fullName` is required.
- `firstName`, `lastName`, `first_name`, and `last_name` must NOT be sent.

#### Response Body

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 3600
  },
  "message": "Registration successful"
}
```

### GET /api/v1/auth/me

Return the current authenticated user's profile.

#### Response Body

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@company.com",
    "fullName": "Ahmad Mohammed",
    "phone": "+966 50 123 4567",
    "jobTitle": null,
    "avatarUrl": null,
    "preferredLanguage": "ar",
    "timezone": "Asia/Riyadh",
    "status": "active",
    "role": "executive",
    "company": "شركة الرشد للاستثمار",
    "lastLoginAt": "2026-06-27T10:00:00Z",
    "createdAt": "2026-06-27T10:00:00Z",
    "updatedAt": "2026-06-27T10:00:00Z"
  }
}
```

#### Response Rules

- `fullName` is always present and is a non-empty string.
- `firstName`, `lastName`, `first_name`, and `last_name` are NOT present.

### PATCH /api/v1/auth/profile

Update the current user's profile.

#### Request Body

```json
{
  "fullName": "Ahmad Mohammed Al-Saud"
}
```

#### Request Rules

- Only `fullName` should be sent for name updates.
- `firstName`, `lastName`, `first_name`, and `last_name` must NOT be sent.

#### Response Body

Same shape as `GET /api/v1/auth/me`.

## Error Responses

Standard `ApiError` shape from `src/api/types.ts`:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "statusCode": 422,
  "errors": [
    { "field": "fullName", "message": "الاسم الكامل مطلوب" }
  ]
}
```

## TypeScript Types

See `src/api/services/auth-service.ts`:

- `RegisterData`
- `UserProfile`
- `AuthTokens`
