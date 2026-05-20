# API Contract: Authentication Validation Errors (Fixed Rendering)

**Feature**: Fix Registration Error Rendering and Field Highlighting
**Date**: 2026-05-20
**Base URL**: `${VITE_API_BASE_URL}/auth`
**Depends On**: `specs/020-align-registration-dto/contracts/auth-api.md`

## Endpoint

### POST /auth/register

#### Error Response: 400 Bad Request

**Shape A (Single message — non-field or system error)**:
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

**Shape B (Field-level array — validation failures)**:
```json
{
  "statusCode": 400,
  "message": [
    "firstName should not be empty",
    "lastName should not be empty",
    "password must contain at least one uppercase letter",
    "property roleId should not exist"
  ],
  "error": "Bad Request"
}
```

**Shape C (Empty array)**:
```json
{
  "statusCode": 400,
  "message": [],
  "error": "Bad Request"
}
```

#### Parsing Strategy

1. Check if `message` is an array.
2. For each string in the array:
   - If it matches `property {fieldName} should not exist`, extract `fieldName` after `"property "`.
   - Otherwise, extract the leading word before the first space as `fieldName`.
   - Look up `fieldName` in `FIELD_ERROR_MAP`.
3. If the `fieldName` is found in `FIELD_ERROR_MAP`:
   - Map the full message string to `frontendField`.
   - Include the full original message (not stripped) in the frontend field error array.
4. If the `fieldName` is NOT found in `FIELD_ERROR_MAP`:
   - Add the full original message to `unmapped` array.
5. Construct `AuthError`:
   - `message`: `messageArray.join('; ')` — **all** messages, not just unmapped or first.
   - `fieldErrors`: grouped mapped messages keyed by `frontendField`.
   - `code`: `"VALIDATION_ERROR"`.

#### Frontend Error Display

| Error Type | Display Location | Highlight |
|------------|------------------|-----------|
| Mapped field error | Beneath the mapped input field | Yes — `border-red-500` on input/select |
| Mapped field error | Top summary banner | No — summary only |
| Unmapped error | Top summary banner only | No |
| Non-400 error (e.g., 500) | Top summary banner with actual message | No |

#### Visual Highlight Rules

- When `errors[field]` exists (from any source: Zod client-side, or `setError('server')`), the field receives `border-red-500`.
- Errors set via `setError()` with `type: 'server'` are visually indistinguishable from client-side Zod errors.
- Fields clear highlight automatically when user edits the field value.

## Field-Level Error Mapping

| Backend Field | Frontend Field | Example Error Message |
|---------------|----------------|-----------------------|
| `firstName` | `firstName` | `"firstName should not be empty"` |
| `lastName` | `lastName` | `"lastName should not be empty"` |
| `email` | `email` | `"email must be an email"` |
| `password` | `password` | `"password must contain at least one uppercase letter"` |
| `companyId` | `companyId` | `"companyId must be a UUID"` |
| `roleId` | `roleId` | `"property roleId should not exist"` |

## Client-Side Rendering Contract

### Summary Banner (Top of Form)

```
All backend messages joined with "; "
```
- Must contain **every** message from the `message` array.
- Must be visible whenever `messageArray.length > 0`.
- Must remain visible even when all messages are mapped to fields.

### Per-Field Message

```
{errors[field]?.message}
```
- Rendered beneath the corresponding input/select.
- Multiple messages for the same field are joined with `; ` in `setError` call.
- Cleared automatically on field edit.

### Error Clearing Behavior

| Action | Effect |
|--------|--------|
| User edits a field with an active error | That field's error and highlight clear |
| User edits a field without an error | No visual change |
| User resubmits form | All previous errors cleared before new submission |
| Backend returns empty `message` array | No summary, no field errors |
