# Data Model: Fix Registration Error Rendering and Field Highlighting

## Date
2026-05-20

## Overview

The frontend receives a `400 Bad Request` response from the backend `/auth/register` endpoint containing an array of validation error strings. Each string may follow one of two patterns:

1. **Field-value pattern**: `fieldName message` (e.g., `password must contain at least one uppercase letter`)
2. **Property-forbidden pattern**: `property fieldName should not exist` (e.g., `property roleId should not exist`)

The system must parse both patterns, extract the field identifier, map it to the corresponding React Hook Form field, and surface all messages in both per-field displays and a top summary.

## Entities

### BackendValidationErrorResponse

Raw HTTP 400 payload from the NestJS `ValidationPipe`.

| Attribute | Type | Description |
|-----------|------|-------------|
| `statusCode` | `number` | Always `400` for validation failures |
| `message` | `string \| string[]` | Single error message or array of messages |
| `error` | `string` | Human-readable error type, e.g. `"Bad Request"` |

When `message` is an array, each entry is one of:
- `"{backendField} {validationMessage}"`
- `"property {backendField} should not exist"`

### ParsedFieldError

Intermediate representation after tokenizing a single `message[]` entry.

| Attribute | Type | Description |
|-----------|------|-------------|
| `backendField` | `string` | Field name as returned by backend (e.g., `"password"`, `"roleId"`) |
| `frontendField` | `string` | Mapped RHF field name (same as `backendField` after spec 020 alignment) |
| `message` | `string` | Human-readable validation text without field prefix |

### FieldErrorMapEntry

Lookup record bridging backend identifiers to frontend form fields.

| Attribute | Type | Description |
|-----------|------|-------------|
| `backendField` | `string` | Exact backend field name |
| `frontendField` | `string` | Must be a valid key of `RegisterFormData` |
| `label` | `string?` | Optional Arabic-friendly label for unmapped fallback |

Current mappings (post-020 alignment):

| Backend Field | Frontend Field | Label |
|---------------|----------------|-------|
| `firstName` | `firstName` | الاسم الأول |
| `lastName` | `lastName` | اسم العائلة |
| `email` | `email` | البريد الإلكتروني |
| `password` | `password` | كلمة المرور |
| `companyId` | `companyId` | الشركة |
| `roleId` | `roleId` | الدور |

### EnhancedAuthError

Extends `Error` with structured server error data.

| Attribute | Type | Description |
|-----------|------|-------------|
| `message` | `string` | Summary string containing ALL backend messages (joined with `; `) |
| `statusCode` | `number` | HTTP status code |
| `code` | `string` | Error code string (e.g., `"VALIDATION_ERROR"`) |
| `fieldErrors` | `Record<string, string[]>?` | Mapped errors keyed by frontend field name |

### RegisterFormData

Full form shape collected in the UI.

| Field | Type | Sent to Backend | Notes |
|-------|------|-----------------|-------|
| `firstName` | `string` | Yes | |
| `lastName` | `string` | Yes | |
| `email` | `string` | Yes | |
| `password` | `string` | Yes | |
| `confirmPassword` | `string` | **No** | Client-side only |
| `companyId` | `string` | Yes | UUID selector |
| `roleId` | `string` | Yes | UUID selector |
| `agreeToTerms` | `boolean` | **No** | Client-side only |

## Relationships

1. **BackendValidationErrorResponse → ParsedFieldError[]**
   - Transform: `parseFieldErrors(response)` splits each message and detects `property` prefix.
   - Unparsable strings are returned as `unmapped`.

2. **ParsedFieldError[] → EnhancedAuthError.fieldErrors**
   - Transform: `groupFieldErrors(parsed)` groups by `frontendField`.
   - Unmapped entries remain in `unmapped` array.

3. **EnhancedAuthError → RegistrationPage UI**
   - Catch in `onSubmit`:
     - `setError(field, { type: 'server', message })` for each `fieldErrors` entry.
     - `setApiError(error.message)` to populate top summary with ALL messages.
   - UI automatically highlights fields via `errors[field] ? 'border-red-500' : 'border-border'`.
   - RHF automatically clears field errors on edit.

## Data Flow

```mermaid
flowchart LR
    A[POST /auth/register] -->|400 + message[]| B[handleResponse]
    B -->|parseFieldErrors| C[ParsedFieldError[] + unmapped]
    C -->|groupFieldErrors| D[EnhancedAuthError]
    D -->|throw| E[RegistrationPage onSubmit catch]
    E -->|setError| F[Per-field error display]
    E -->|setApiError| G[Top summary banner]
    F -->|border-red-500| H[Visual field highlight]
    I[User edits field] -->|RHF onChange| J[Field error cleared]
```
