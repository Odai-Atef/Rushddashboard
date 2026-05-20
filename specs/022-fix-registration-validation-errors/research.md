# Research: Fix Registration Error Rendering and Field Highlighting

## Date
2026-05-20

## Unknowns Resolved

### 1. Backend 400 Payload Shape

**Decision**: The backend returns NestJS `ValidationPipe` 400 errors in `{ statusCode: 400, message: string[], error: "Bad Request" }` format. Each string follows `{fieldName} {message}` or `property {fieldName} should not exist`.

**Rationale**: The existing `handleResponse` in `auth.ts` already checks `Array.isArray(error.message)`, confirming this is the active shape. The `fieldErrorMap.ts` parser splits on the first space for the `fieldName` prefix pattern. However, it does not handle the `property` prefix shape (`property roleId should not exist`), which causes field name extraction to fail.

**Alternatives considered**:
- Structured `{ errors: [{ field, message }] }` — matches spec 020 contract but not what the current code actually receives.
- Mixed array of strings and objects — no evidence in current code or user description.

### 2. Field Mapping Strategy

**Decision**: Keep and extend the existing `FIELD_ERROR_MAP` in `fieldErrorMap.ts`.

**Rationale**: `FIELD_ERROR_MAP` already maps `firstName → firstName`, `lastName → lastName`, `password → password`, `companyId → companyId`, `roleId → roleId`, `email → email`. The RegistrationPage now uses these same field names (aligned in spec 020). Extending the parser to handle `property {field} should not exist` is simpler than replacing the entire strategy.

### 3. Why "Fetch Error" Appears

**Decision**: The generic "Fetch error" is caused by the `catch` branch in `RegistrationPage.tsx` not receiving an `AuthError` with `fieldErrors`, OR the `setApiError()` being set to a string that may include unmapped messages but not all messages.

**Rationale**: In `auth.ts`:
- When 400 with array `message` is parsed, `bannerMessage` is set to `unmapped.join('; ')` or `error.message[0]`.
- If all errors are mapped, `bannerMessage` becomes `error.message[0]` — only the first message. The remaining mapped messages are in `fieldErrors` but never shown in the summary.
- The `RegistrationPage` only uses `error.message` (the banner message) for the top block, which means:
  - If there are unmapped messages, only unmapped ones show in the summary.
  - If all errors are mapped, only the *first* error string shows in the summary.
  - Multiple mapped field errors are never shown in the summary because `setApiError` is only set conditionally and the joined `fieldErrors` strings are not passed to it.
- Additionally, `error.message[0]` is just the first raw string, which may itself be "Fetch error" if the fetch wrapper threw before `handleResponse` finished parsing.

**Fix approach**: Change `handleResponse` in `auth.ts` to include ALL messages in `AuthError.message`, not just unmapped or `message[0]`. Update `RegistrationPage` to always display `error.message` as the summary (which now contains all messages) and attach `fieldErrors` via `setError`.

### 4. Visual Highlighting Approach

**Decision**: Reuse existing `border-red-500` className logic already present in `RegistrationPage.tsx` for `errors[field]`.

**Rationale**: The page already conditionally applies `border-red-500` when `errors[field]` exists. The fix is to ensure backend errors are attached via `setError()` so `formState.errors` populates correctly. No new visual treatment needed.

### 5. Granular Error Clearing

**Decision**: RHF's built-in `register()` already wires `onChange` handlers that clear errors for that field automatically. No custom code needed.

**Rationale**: React Hook Form clears field errors when the field value changes, provided the error was set with `setError()`. The existing `RegistrationPage` already uses `setError()` for server errors, so clearing should work. Need to verify that select/checkbox fields also clear.

### 6. Summary Block Strategy

**Decision**: Keep the existing top `apiError` banner in `RegistrationPage.tsx`, but populate it with all backend messages (joined), not just unmapped/first messages.

**Rationale**: The spec requires showing ALL messages in the summary. The simplest change is to modify `AuthError.message` construction in `auth.ts` to join the full `message` array, while still providing `fieldErrors` for per-field display.

### 7. Test Strategy

**Decision**: Add unit tests for `fieldErrorMap.ts` and component tests for `RegistrationPage.tsx`.

**Rationale**:
- `fieldErrorMap.ts` is pure utility logic — ideal for Vitest unit tests.
- `RegistrationPage` needs React Testing Library tests to assert DOM output for summary banner and per-field messages.
- Mock `registerApi` to return controlled `AuthError` instances.

## Research Artifacts

| Artifact | Location | Description |
|----------|----------|-------------|
| Existing parser | `src/app/utils/fieldErrorMap.ts` | Current parsing logic with `property` prefix gap |
| Existing service | `src/app/services/auth.ts` | `AuthError` construction missing all messages in summary |
| Existing page | `src/app/components/RegistrationPage.tsx` | Already uses `setError` and `border-red-500`; needs summary fix |
| UI primitives | `src/app/components/ui/form.tsx` | shadcn Form components available for future refactor |
