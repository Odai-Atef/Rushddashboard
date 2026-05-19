# Quick Start: Registration Field-Level Error Mapping

## Feature Context

This feature enhances the existing registration form to display backend validation errors under their related input fields instead of a generic API error banner.

## Running the App

```bash
# From repo root
npm install
npm run dev
```

Navigate to `http://localhost:5173/auth/register` to view the registration form.

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `src/app/services/auth.ts` | AuthError class extended with fieldErrors; handleResponse updated for array-style 400s |
| `src/app/types/auth.ts` | Error types and interfaces added |
| `src/app/components/RegistrationPage.tsx` | Consumes fieldErrors via setError; existing uiError banner reused for unmapped errors |
| `src/app/utils/fieldErrorMap.ts` | New utility: FIELD_ERROR_MAP and parseFieldErrors() |

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Mock backend error**: Temporarily point `register()` to a local mock returning Shape B 400 responses (see [contracts/auth-api-errors.md](contracts/auth-api-errors.md)).
3. **Verify field-level errors**: Submit invalid data and confirm each error appears under its related input.
4. **Verify banner fallback**: Submit data with an unmapped backend field error and confirm it appears in the generic error banner.

## Testing

### Unit Tests

Run unit tests for the field error parser:

```bash
npx vitest src/app/utils/fieldErrorMap.test.ts
```

### Component Tests

Run tests for the RegistrationPage error handling:

```bash
npx vitest src/app/components/RegistrationPage.test.tsx
```

### E2E Tests

Run Playwright E2E tests for the registration flow:

```bash
npx playwright test tests/e2e/registration.spec.ts
```

## Common Issues & Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Backend errors still appear only in banner | `message` is a single string, not array | Check API response shape; plain-string 400s fall back to banner by design |
| Error shown under wrong field | FIELD_ERROR_MAP entry missing or incorrect | Verify `backendField` key and `frontendField` value in `fieldErrorMap.ts` |
| Multiple errors for one field only show last | `setError` is overwriting instead of appending | Use `type: 'server'` and render all messages in UI |
| RTL layout broken by long error messages | Text wrapping or alignment issues | Ensure `text-red-600 mt-1` uses `text-start` or inherits RTL direction |

## References

- [Specification](../spec.md)
- [Plan](../plan.md)
- [Data Model](../data-model.md)
- [API Contract](contracts/auth-api-errors.md)
