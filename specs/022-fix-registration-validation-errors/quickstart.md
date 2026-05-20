# Quick Start: Fix Registration Error Rendering

## Prerequisites

- Read `spec.md` for user stories and acceptance criteria.
- Read `data-model.md` for entity definitions and data flow.
- Read `contracts/auth-api-errors.md` for backend response format and parsing strategy.
- Familiarity with React Hook Form `setError()` API.

## Environment

Branch: `022-rushd-frontend-fix`

Files touched:
- `src/app/utils/fieldErrorMap.ts` — parser update
- `src/app/services/auth.ts` — summary message construction
- `src/app/components/RegistrationPage.tsx` — summary + field display wiring

## Local Development Steps

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Trigger backend validation errors**:
   - Navigate to `/auth/register`.
   - Submit the form with:
     - Password: `password123` (no uppercase)
     - Role: select an invalid or unexpected value
   - Observe the 400 response in browser DevTools → Network tab.

3. **Verify field-level rendering**:
   - Each mapped error should appear under its corresponding input.
   - Password input should have `border-red-500` class.
   - Role select should have `border-red-500` class.

4. **Verify summary rendering**:
   - All backend messages (including mapped ones) should appear in the top red banner.
   - No generic "Fetch error" should appear.

5. **Verify granular clearing**:
   - Edit the password field — only password error/highlight should clear.
   - Role error should remain.
   - Edit the role select — role error should now clear.

## Testing

### Run unit tests for parser

```bash
npx vitest run src/app/utils/fieldErrorMap.test.ts
```

Expected cases:
- `password must contain at least one uppercase letter` → maps to `password` field.
- `property roleId should not exist` → maps to `roleId` field (extracts after `property `).
- `unknownField is invalid` → treated as unmapped.
- Empty array → returns empty parsed and unmapped.

### Run component tests

```bash
npx vitest run src/app/components/RegistrationPage.test.tsx
```

Expected assertions:
- Summary banner renders with all messages.
- Per-field messages render under correct inputs.
- Border classes toggle on/off with errors.
- Editing a field clears that field's error only.

### Run typecheck

```bash
npm run typecheck
```

No new types are introduced; existing types `BackendValidationErrorResponse`, `ParsedFieldError`, etc. are reused.

## Common Issues

- **Summary only shows first message**: Check `auth.ts` `handleResponse` — `bannerMessage` should join the entire array.
- **"property" prefix not mapping**: Check `fieldErrorMap.ts` `parseFieldErrors` — ensure `property ` prefix is stripped before field lookup.
- **Field highlight not appearing**: Verify `setError()` is called with `type: 'server'` and the `className` condition checks `errors[field]`.
- **Arabic layout broken**: Ensure no absolute positioning changes; error text placement should not affect RTL flow.
