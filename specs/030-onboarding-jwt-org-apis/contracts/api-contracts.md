# API Contracts: Onboarding JWT Organization APIs

## Contract 1: Get My Organization

**Endpoint**: `GET /api/v1/onboarding/organizations/me`

### Request

| Aspect | Value |
|--------|-------|
| Method | GET |
| Headers | `Authorization: Bearer <JWT>` (injected automatically by `apiClient`) |
| Query Params | None |
| Body | None |

### Response 200 — Organization Exists

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Al-Rushd Foundation",
  "licenseNumber": "LIC-123456",
  "registrationDate": "2024-01-15T00:00:00.000Z",
  "type": "CHARITY",
  "city": "Riyadh",
  "website": "https://example.org",
  "contactPerson": "Ahmed Al-Rashid",
  "email": "contact@example.org",
  "mobile": "+966501234567",
  "status": "DRAFT",
  "currentStep": "ORGANIZATION_INFO",
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

**Frontend action**: Deserialize into `OrganizationResponse`, pre-populate all form fields.

### Response 404 — No Organization Yet

**Body**: `{}` or empty response body.

**Frontend action**: Render empty form; do NOT show an error toast.

### Response 401 — Unauthorized

**Body**: Generic unauthorized message.

**Frontend action**: `apiClient` intercepts and redirects to `/auth/login` automatically.

### Network / Timeout Error

**Frontend action**: Display inline retry button; keep user on the registration form with all current input values intact.

---

## Contract 2: Save My Organization

**Endpoint**: `PUT /api/v1/onboarding/organizations/me`

### Request

| Aspect | Value |
|--------|-------|
| Method | PUT |
| Headers | `Authorization: Bearer <JWT>`, `Content-Type: application/json` |
| Body | `CreateOrganizationDto` JSON (see below) |

**Request Body Example**:

```json
{
  "name": "Al-Rushd Foundation",
  "licenseNumber": "LIC-123456",
  "registrationDate": "2024-01-15",
  "type": "CHARITY",
  "city": "Riyadh",
  "website": "https://example.org",
  "contactPerson": "Ahmed Al-Rashid",
  "email": "contact@example.org",
  "mobile": "+966501234567"
}
```

### Response 200 — Updated

```json
{
  "org": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Al-Rushd Foundation",
    ...
  },
  "statusCode": 200
}
```

**Frontend action**: Proceed to next onboarding step (profile screen). Do **not** persist `org.id` in any client storage.

### Response 201 — Created

```json
{
  "org": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    ...
  },
  "statusCode": 201
}
```

**Frontend action**: Same as 200 — proceed to next step without client-side `orgId` storage.

### Response 400 — Validation Error

**Body shapes supported** (backend may return either):

**Shape A — Array of field errors**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "licenseNumber", "message": "License number already exists" }
  ]
}
```

**Shape B — Object keyed by field**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "errors": {
    "email": ["Invalid email format"],
    "licenseNumber": ["License number already exists"]
  }
}
```

**Frontend action**: Map each error to the corresponding form input. Display message beneath the input in Arabic. Keep all user-entered data intact.

### Response 401 — Unauthorized

**Frontend action**: `apiClient` auto-redirects to `/auth/login`.

### Response 500 — Server Error

**Body**: Generic server error message.

**Frontend action**: Show `sonner` toast with Arabic error message (e.g. `"حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً."`). Do not clear form fields.

### Idempotency & Duplicate Prevention

Because the endpoint is `PUT /organizations/me` keyed by the JWT subject (not an explicit `orgId` in the payload), calling it twice with the same JWT:
- First call → creates the organization (201).
- Second call → updates the same organization (200).
- No duplicate records are created.

The frontend therefore does not need debounce guards beyond standard UI button disabled state during submission.

---

## Error Message Mapping (Arabic)

| Scenario | Arabic Message (displayed to user) |
|----------|------------------------------------|
| Network failure | `"لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."` |
| 400 validation | `"يرجى تصحيح الأخطاء التالية:"` + field-level messages |
| 500 server | `"حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً."` |
| 409 duplicate license | `"رقم الترخيص مستخدم مسبقاً. يرجى استخدام رقم آخر."` |
| Timeout | `"انتهت مهلة الطلب. يرجى المحاولة مرة أخرى."` |
