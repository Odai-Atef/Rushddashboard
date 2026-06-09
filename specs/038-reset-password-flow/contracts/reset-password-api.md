# Feature API Contract: Reset Password

**Date**: 2026-06-09
**Endpoint**: `POST /api/v1/auth/reset-password`
**Consumer**: Rushd Frontend (`ResetPasswordPage`)
**Provider**: Rushd Backend (`AuthController.resetPassword`)

---

## Endpoint Specification

### URL

```
POST /api/v1/auth/reset-password
```

### Headers

| Header | Value | Notes |
|--------|-------|-------|
| `Content-Type` | `application/json` | Standard JSON payload |
| `Authorization` | — | **Not required**. This is a public endpoint. |

### Request Body

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "newPassword": "NewSecurePass456!"
}
```

#### Field Definitions

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `token` | `string (UUID)` | Yes | `@IsUUID()`, `@IsNotEmpty()` | The raw reset token extracted from the email link URL query parameter |
| `newPassword` | `string` | Yes | `@MinLength(8)`, must contain uppercase, lowercase, number, and special character | The new password to set for the associated user account |

**Note**: The backend `ResetPasswordDto` does **not** include a `confirmPassword` field. Password confirmation matching is handled entirely by the frontend UI before submission.

---

### Response Body

#### Success (HTTP 200)

```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  },
  "message": "Password reset successfully"
}
```

**Note**: The Rushd backend wraps responses in a double envelope (`{ success, data, message }` inside `ApiResponse`). The `AuthService.unwrap()` method normalizes this for the frontend.

#### Error: Invalid or Expired Token (HTTP 400)

```json
{
  "statusCode": 400,
  "message": "Invalid or expired token",
  "error": "Bad Request"
}
```

**Frontend behavior**: Show a unified error state: "الرمز غير صالح أو منتهي الصلاحية" ("Invalid or expired token" in Arabic) with a call-to-action button linking to `/auth/forgot-password`.

**Important**: The backend returns the *same* message for:
- Token not found in database
- Token has expired (`expiresAt < now`)
- Token has already been used (`usedAt` is set)

The frontend does **not** differentiate these cases because the backend contract does not expose distinct error codes.

#### Error: Validation Failure (HTTP 400)

```json
{
  "statusCode": 400,
  "message": ["Password must contain at least one uppercase letter"],
  "error": "Bad Request"
}
```

**Frontend behavior**: Client-side validation should prevent weak passwords from being submitted. If backend validation still fails (e.g., edge case), display the first validation error message inline below the password field.

---

## State Diagram

```
User clicks email link
    │
    ▼
+----------------------------+
| ResetPasswordPage mounts   |
| Extracts ?token=...        |
+----------------------------+
    │
    ├─ token missing ──→ Show "Invalid link" error
    │                      + CTA to /auth/forgot-password
    │
    └─ token present ──→ Show password form
                           │
                           ▼
                    +------------------+
                    | User fills form  |
                    +------------------+
                           │
                           ▼
                    +------------------+
                    | Client validates |
                    +------------------+
                           │
                           ├─ invalid ──→ Show inline errors
                           │
                           └─ valid ──→ POST /auth/reset-password
                                              │
                                              ▼
                                    +------------------+
                                    | Backend responds |
                                    +------------------+
                                           │
                              ├─ 200 OK ──→ Show success
                              │               + redirect to /auth/login
                              │
                              └─ 400 ──→ Show "Invalid or expired token"
                                             + CTA to /auth/forgot-password
```

---

## Error Handling Matrix

| Scenario | HTTP Status | Backend Message | Frontend Display |
|----------|-------------|-----------------|------------------|
| Token valid, password strong | 200 | "Password reset successfully" | Success message + redirect |
| Token not found | 400 | "Invalid or expired token" | "الرمز غير صالح أو منتهي الصلاحية" + link to forgot-password |
| Token expired | 400 | "Invalid or expired token" | Same as above |
| Token already used | 400 | "Invalid or expired token" | Same as above |
| Password too weak | 400 | Validation message (e.g., "Password must contain...") | Inline field error |
| Network failure | — | — | Generic retry-friendly message ("تعذر الاتصال بالخادم") |

---

## Security Considerations

1. **Token exposure**: The raw UUID token is exposed in the URL query parameter. Browsers may log this in history. This is standard practice for password reset flows and is mitigated by the token's short expiry (24 hours) and single-use nature.
2. **Rate limiting**: The backend `POST /auth/reset-password` endpoint should ideally be rate-limited to prevent brute-force token guessing. This is a backend concern.
3. **No auth required**: The endpoint is public (`@Public()`), consistent with the forgot-password flow.
4. **Password confirmation**: Since `confirmPassword` is not sent to the backend, a malicious actor with the token but without seeing the form submission could not bypass confirmation matching. However, the token itself is the gatekeeper.

