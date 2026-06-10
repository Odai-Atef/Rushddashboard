# API Contract: Forgot Password

**Endpoint**: `POST /api/v1/auth/forgot-password`

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `Accept` | `application/json` | Yes |
| `X-App-Version` | `{APP_VERSION}` | Yes (injected by `ApiClient`) |

### Body

```json
{
  "email": "user@example.com"
}
```

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `email` | `string` | Required, valid email format | User's registered email address. |

### Validation Rules (Backend)

- `email` must be present.
- `email` must conform to standard email format.
- Response timing and structure must be uniform regardless of account existence.

## Response

### Success (200 OK)

```json
{
  "success": true,
  "data": null,
  "message": "If this email exists, password reset instructions have been sent."
}
```

> **Security Note**: The message must be identical for both existing and non-existing emails to prevent account enumeration.

### Client Error (400 Bad Request)

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "details": {
    "email": ["The email field is required.", "The email must be a valid email address."]
  }
}
```

### Rate Limit (429 Too Many Requests)

```json
{
  "success": false,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again later.",
  "statusCode": 429
}
```

### Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "code": "INTERNAL_ERROR",
  "message": "An unexpected error occurred. Please try again later.",
  "statusCode": 500
}
```

## Error Handling (Frontend)

| Error Type | User-Facing Message (Arabic) |
|------------|------------------------------|
| Network failure (`Failed to fetch`) | "تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت" |
| Backend 4xx/5xx (generic) | "حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور" |
| Backend validation (field-level) | Display per-field errors below the email input. |

## Security Considerations

1. **Uniform Response**: Backend must return the same HTTP status (200) and response shape for both existing and non-existing emails.
2. **Timing Attack Mitigation**: Response time should be consistent (or artificially padded) to prevent timing-based enumeration.
3. **Rate Limiting**: Backend should enforce rate limiting per IP and/or per email to prevent abuse.
4. **No Sensitive Data**: Response must never include user identifiers, account status, or internal system details.
