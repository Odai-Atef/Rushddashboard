# Data Model: Forgot Password API Integration

**Feature**: Forgot Password API Integration
**Date**: 2026-06-10

## Entities

### ForgotPasswordRequest

Represents the payload sent to the backend to initiate a password reset.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `email` | `string` | Required, valid email format | The user's email address. Max length per RFC 5321 (254 chars). |

### ForgotPasswordResponse

Represents the API response envelope returned by the backend.

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Whether the request was processed successfully (uniform regardless of account existence). |
| `data` | `null \| void` | No payload data for this endpoint. |
| `message` | `string \| undefined` | Human-readable message (e.g., confirmation text). |

### ForgotPasswordFormState

Represents the local component state for the UI.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `email` | `string` | Required, valid email format | Bound to the form input. |
| `isSubmitting` | `boolean` | — | True while the API request is in flight. |
| `status` | `'idle' \| 'success' \| 'error'` | — | Current UI status for conditional rendering. |
| `errorMessage` | `string` | — | User-friendly error message in Arabic. |

## Validation Rules

### Client-Side

| Rule | Error Message (Arabic) |
|------|------------------------|
| Email is required | "البريد الإلكتروني مطلوب" |
| Email must be a valid format | "يرجى إدخال بريد إلكتروني صحيح" |
| Email must not exceed 254 characters | Implicit HTML `maxLength` constraint |

### Server-Side (Backend)

| Rule | Response |
|------|----------|
| Invalid email format | `400 Bad Request` with validation error details |
| Rate limit exceeded | `429 Too Many Requests` (frontend shows generic retry message) |
| Service error | `500 Internal Server Error` (retried by `ApiClient`, then generic message) |

## State Transitions

```
[Idle] --(submit)--> [Submitting] --(success)--> [Success]
                                     |
                                     +--(error)--> [Error] --(retry)--> [Submitting]
```

## Notes

- The backend is the source of truth for email format validation; client-side rules are for UX improvement only.
- The response must be uniform (same structure and timing) for both existing and non-existing emails to prevent account enumeration.
