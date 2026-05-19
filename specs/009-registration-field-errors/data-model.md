# Registration Field-Level Error Mapping — Data Model

## Overview

When a user submits the Registration form, the NestJS backend may return a `400 Bad Request` with a `message: string[]` payload. Each string entry follows the convention `"{fieldName} {validationMessage}"` (e.g., `"email must be a valid email address"`).

The frontend must parse these entries, map each backend field name to the corresponding React Hook Form (RHF) field name, aggregate messages per field, and surface them via `setError()`.

---

## Entities

### BackendValidationErrorResponse

Represents the raw HTTP 400 payload from the NestJS `ValidationPipe`.

- **`statusCode`** `number`
  - Always `400` for validation failures.
- **`message`** `string | string[]`
  - A single error message or an array of messages.
  - When an **array**, each entry is `"{fieldName} {validationMessage}"`.
  - Example: `"email must be a valid email address"`
- **`error`** `string`
  - Human-readable error type, e.g. `"Bad Request"`.

### ParsedFieldError

Intermediate representation after tokenizing a single entry from `message[]`.

- **`backendField`** `string`
  - The field name as provided by the backend (e.g., `"user.email"`, `"password"`).
- **`frontendField`** `string`
  - The mapped RHF field name if lookup succeeds; otherwise same as `backendField`.
- **`message`** `string`
  - The validation message stripped of its prefix, e.g., `"must be a valid email address"`.

### EnhancedAuthError

Extends the existing `AuthError` class in `src/app/services/auth.ts`.

- **`code`** `string`
  - Retained from the original `AuthError` (e.g., `"VALIDATION_ERROR"`).
- **`message`** `string`
  - Primary error message (often a summary or the first backend message).
- **`fieldErrors?`** `Record<string, string[]>`
  - Keyed by frontend RHF field name.
  - Value is an array of error messages for that field.
  - Example:
    ```ts
    {
      email: ["must be a valid email address", "already exists"],
      password: ["too weak"]
    }
    ```

### FieldErrorMapEntry

A lookup record that bridges backend field identifiers to frontend form fields.

- **`backendField`** `string`
  - The exact field name/key the backend uses.
- **`frontendField`** `string`
  - Must be a valid key of `RegisterFormData` (e.g., `"email"`, `"password"`).
- **`label?`** `string`
  - Optional Arabic-friendly field label used when rendering **unmapped** errors in a fallback banner.

### RegisterFormData

Existing form shape aligned with `src/app/types/auth.ts`.

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | `string` | User's full name |
| `email` | `string` | Email address |
| `phone` | `string` | Phone number |
| `company` | `string` | Company name |
| `password` | `string` | Password input |
| `confirmPassword` | `string` | Password confirmation |
| `role` | `string` | Selected role identifier |
| `agreeToTerms` | `boolean` | Terms acceptance flag |

---

## Relationships

1. **`BackendValidationErrorResponse` → ParsedFieldError[]`**
   - Transform utility: `parseFieldErrors(response: BackendValidationErrorResponse): ParsedFieldError[]`
   - Splits each `message[]` entry into `(backendField, rawMessage)`.

2. **`ParsedFieldError[]` → `EnhancedAuthError.fieldErrors`**
   - Mapping utility: `mapParsedErrorsToFields(parsedErrors: ParsedFieldError[], fieldMap: FieldErrorMapEntry[]): Record<string, string[]>`
   - Looks up each `backendField` in `FIELD_ERROR_MAP`.
   - Groups messages under the mapped `frontendField` key.
   - Unmapped backend fields remain in a summary message (with optional `label`).

3. **`EnhancedAuthError` → UI via setError`**
   - In `RegistrationPage.tsx`:
     - The `onSubmit` handler catches the `EnhancedAuthError`.
     - If `fieldErrors` is present, iterates and calls `formMethods.setError(frontendField, { type: "manual", message })` for each entry.

---

## Data Flow Diagram

```mermaid
flowchart LR
    A[API Response<br/>BackendValidationErrorResponse] -->|parseFieldErrors| B["ParsedFieldError[]"]
    B -->|FIELD_ERROR_MAP lookup| C["EnhancedAuthError<br/>with fieldErrors"]
    C -->|throw / catch| D[RegistrationPage.tsx]
    D -->|setError()| E["RHF Form<br/>RegisterFormData"]
```

---

## Notes

- `FIELD_ERROR_MAP` should be defined as a constant array of `FieldErrorMapEntry` entries, imported by the service layer and (optionally) by the registration page.
- If the backend changes its field naming convention or adds new fields, only `FieldErrorMapEntry` records need to be updated.
- The mapping intentionally keeps unmapped errors surfaced (via `label` or raw key) so the UI never silently drops validation feedback.
