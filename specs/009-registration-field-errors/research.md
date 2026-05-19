# Research: Registration Field-Level Error Mapping

## Problem

The Rushd platform's frontend registration form currently displays all backend validation errors in a single generic API error banner at the top of the form. Backend 400 responses contain an array of field-specific validation messages (e.g., `"firstName should not be empty"`, `"Password must contain at least one uppercase letter"`), but users must read through the generic banner to identify which inputs need correction. This degrades the registration experience—especially for Arabic-speaking users relying on an RTL layout—and increases form abandonment.

### Current Behavior

- `POST /auth/register` returns `400 Bad Request` with `message` as `string | string[]`
- `AuthError` throws a flat string message into the component's `apiError` state
- Users see a single red banner with all errors concatenated or dumped together

### Desired Behavior

- Each backend validation message is shown directly beneath its related input field
- Unmapped or non-validation errors continue to appear in the generic banner
- No visual regressions in the existing Arabic-friendly RTL layout

---

## Research Findings

### 1. Backend Error Format

Based on existing API contracts and observed NestJS `ValidationPipe` behavior, the backend 400 response shape is:

```json
{
  "statusCode": 400,
  "message": [
    "firstName should not be empty",
    "lastName should not be empty",
    "companyId must be a UUID",
    "Password must contain at least one uppercase letter"
  ],
  "error": "Bad Request"
}
```

> **Note**: When only one validation fails, `message` may be a single `string` rather than an array. Non-400 errors (500, network failures) use the same envelope but with a different `statusCode`.

Each `message` entry embeds the backend field name followed by the error text. Field names are not provided separately, so extraction must rely on prefix matching.

### 2. Field Name Mapping

The frontend registration form (`RegistrationPage.tsx`) uses the following RHF fields:

| Frontend RHF Path | UI Label (AR) | Current Type |
|---|---|---|
| `fullName` | الاسم الكامل | `registerSchema` → `fullName: string` |
| `email` | البريد الإلكتروني | `registerSchema` → `email: string` |
| `phone` | رقم الهاتف | `registerSchema` → `phone: string` |
| `company` | اسم الشركة | `registerSchema` → `company: string` |
| `role` | الدور | `registerSchema` → `role: string` |
| `password` | كلمة المرور | `registerSchema` → `password: string` |
| `confirmPassword` | تأكيد كلمة المرور | `registerSchema` → `confirmPassword: string` |
| `agreeToTerms` | الموافقة على الشروط | `registerSchema` → `agreeToTerms: boolean` |

The backend uses different identifiers:

```
firstName  → front: fullName
lastName   → front: fullName
email      → front: email
phone      → front: phone
company    → front: company (or backend companyId in some flows)
role       → front: role (or backend roleId in some flows)
password   → front: password
```

Because `fullName` is a single frontend field backed by potentially two backend fields (`firstName`, `lastName`), the mapper must support **multiple backend names targeting the same frontend path**.

### 3. RHF `setError` Integration

`RegistrationPage.tsx` currently uses:

```tsx
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  setValue,
  watch,
} = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
  defaultValues: { role: 'executive' },
});
```

The component already renders field-level errors with:

```tsx
{errors[fieldName] && (
  <p className="text-xs text-red-600 mt-1">{errors[fieldName].message}</p>
)}
```

React Hook Form's `setError(name, { type, message })` API can attach server-side errors to individual fields. When the user edits a field, RHF automatically clears that field's error, satisfying the "clear on change" requirement without extra wiring.

### 4. Existing Error Handling in `src/app/services/auth.ts`

The `AuthError` class is defined as:

```ts
class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
```

The `handleResponse` function only throws a flat `message`; there is no structured field-error payload today.

### 5. RTL / Arabic-Friendly UX

The registration form is fully RTL. Field-level error messages already appear under inputs inside `<p className="text-xs text-red-600 mt-1">`. Reusing the same element and Tailwind classes guarantees:

- Text direction stays natural (`dir="rtl"` from the root)
- No layout reflows or extra spacing changes needed
- Error color (`text-red-600`) is already chosen for high contrast in both light and dark modes

---

## Decisions

### Decision 1: Prefix-Based Extraction Utility

**Approach**: Create a pure utility `parseFieldErrors(message: string[]): Record<string, string[]>` that extracts the backend field name by splitting on the first space or by matching known prefixes against a whitelist.

**Rationale**: Since the backend does not return `{ field, message }` pairs, we must parse the string. A simple prefix match against a known backend field list is deterministic and avoids fragile regex splitting on English grammar.

**Rules**:
1. Normalize `message` to an array if it's a single string.
2. Iterate each string; test if it starts with any known backend field key from `FIELD_ERROR_MAP`.
3. Collect matched messages under the corresponding frontend RHF path.
4. Any message that does not match a known backend key remains as a "general" error.

### Decision 2: Declarative `FIELD_ERROR_MAP`

**Approach**: Export a constant mapping object in `src/app/utils/fieldErrorMap.ts`:

```ts
export const FIELD_ERROR_MAP: Record<string, string> = {
  firstName: 'fullName',
  lastName: 'fullName',
  email: 'email',
  phone: 'phone',
  companyId: 'company',
  company: 'company',
  roleId: 'role',
  role: 'role',
  password: 'password',
};
```

**Rationale**: Keeps the mapping table in one place. If the backend renames a field or adds a new validation rule, only this object needs updating. It also supports future reuse by other forms (e.g., profile editing).

### Decision 3: Extend `AuthError` with `fieldErrors`

**Approach**: Add an optional `fieldErrors: Record<string, string[]>` property to `AuthError`.

```ts
class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
```

Update `handleResponse` so that on `400` with an array `message`:
- Run `parseFieldErrors(message)`.
- Build `fieldErrors` and compute a residual `generalMessage` from unmapped entries.
- Throw `new AuthError(generalMessage, 400, error.error, fieldErrors)`.

**Rationale**: The component layer should not parse API envelopes. Centralizing this in the service layer keeps `RegistrationPage.tsx` focused on UI concerns.

### Decision 4: RHF `setError` Loop in `RegistrationPage.tsx`

**Approach**: In the `catch` block of `onSubmit`, after detecting an `AuthError` with `fieldErrors`, iterate the record and call `setError` for each:

```ts
if (error instanceof AuthError && error.fieldErrors) {
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    setError(field as keyof RegisterFormData, {
      type: 'server',
      message: messages.join(' · '),
    });
  }
}
```

**Rationale**: Attaching errors via `setError` makes them first-class citizens in `formState.errors`, so the existing `<p className="text-xs text-red-600 mt-1">` rendering works immediately without additional JSX changes.

### Decision 5: Preserve Generic Banner for Fallbacks

**Approach**: Keep the `apiError` state and the top banner. Populate it with:
- `error.message` when `error.fieldErrors` is absent or empty.
- The residual unmapped messages when some messages mapped and others did not.
- Any non-400 error (network, 500, etc.).

**Rationale**: Prevents silent failures when the backend introduces a new validation message not yet mapped. Also provides a single place for global/server errors.

---

## Tradeoffs

| Decision | Pros | Cons | Mitigation |
|---|---|---|---|
| Prefix-based string parsing | Simple; no backend contract changes required | Breaks if backend changes message wording (e.g., `"firstName must not be empty"` instead of `"should not be empty"`) | Keep integration tests around `parseFieldErrors`; update map if wording changes |
| Single `FIELD_ERROR_MAP` for all forms | DRY; easy to maintain | Slightly wider scope than registration alone | Export from a shared utils folder; document that registration is the first consumer |
| `AuthError` carries both `message` and `fieldErrors` | Single throw; no double parsing | Slightly larger error object | Optional property keeps backward compatibility for login/refresh flows |
| `setError` with joined string messages | Works with existing `<p>` elements | Loses per-message structure if backend sends 3 errors for one field | Acceptable UX; messages are short and can be joined with a separator like `" · "` |
| No layout changes | RTL-safe; minimal risk | Slightly less visually distinct than custom callout boxes | Already sufficient; field-level red text under inputs is a well-understood pattern |

---

## Open Questions

1. **Does the backend ever return a non-array `message` for validation errors?** Yes—single-string messages are possible. The parser must normalize to an array before processing.
2. **Should `confirmPassword` or `agreeToTerms` ever receive backend errors?** In practice, backend validation usually targets `password`, not `confirmPassword`. If needed, the map can be extended later.
3. **What is the exact backend field name for the company UUID validation?** Assumed `companyId` / `roleId` based on spec; verify during contract review in `contracts/auth-api-errors.md`.

---

## References

- `src/app/services/auth.ts` — `AuthError` and `handleResponse`
- `src/app/components/RegistrationPage.tsx` — existing RHF form and error UI
- `src/app/types/auth.ts` — `RegisterFormData` and `registerSchema`
- `specs/009-registration-field-errors/spec.md` — full feature specification
- `specs/009-registration-field-errors/contracts/auth-api-errors.md` — backend error contract (to be finalized)
