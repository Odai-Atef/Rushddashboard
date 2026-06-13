# Quick Start: Forgot Password API Integration

**Feature**: Forgot Password API Integration
**Date**: 2026-06-10

## Developer Notes

### How to Test Locally

1. **Start the frontend dev server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Navigate to the forgot-password page**:
   ```
   http://localhost:5173/auth/forgot-password
   ```

3. **Test scenarios**:
   - **Happy path**: Enter a valid email → submit → observe success state.
   - **Validation error**: Leave field empty or enter malformed email → submit → observe inline error.
   - **Network error**: Disable network (DevTools > Network > Offline) → submit → observe generic retry message.
   - **Account enumeration check**: Submit with non-existent email vs. existing email → both should show identical success state and take similar time.

### Key Files

| File | Role |
|------|------|
| `src/app/components/ForgetPasswordPage.tsx` | Main page component (target for changes) |
| `src/api/services/auth-service.ts` | `AuthService.forgotPassword(email)` (already implemented) |
| `src/api/client.ts` | `ApiClient` (handles retries, errors, auth headers) |
| `src/app/components/ui/form.tsx` | `Form*` primitives (react-hook-form wrappers) |
| `src/app/components/ui/input.tsx` | `Input` primitive |
| `src/app/components/ui/button.tsx` | `Button` primitive |
| `src/app/routes.tsx` | Route definition (`/auth/forgot-password`) |

### Architecture Decision Records

1. **No `zod` dependency**: For a single-field form, `react-hook-form` built-in validation (`required`, `pattern`) is sufficient. Adding `zod` would be overkill.
2. **No new auth hook**: The existing `AuthService` singleton pattern is reused. A custom hook (`useForgotPassword`) could be added if multiple components need this logic, but currently only one page uses it.
3. **Generic error messages**: All backend and network errors are mapped to generic Arabic messages. This prevents account enumeration and aligns with security best practices.
4. **No toast notifications**: Success/error states are rendered inline in the page. This is consistent with the current `ForgetPasswordPage` design.

### Related Features

- **Reset Password Page**: `src/app/components/ResetPasswordPage.tsx` — consumes the reset token sent by this flow.
- **Login Page**: `src/app/components/LoginPage.tsx` — entry point from "Back to Login" links.

### Common Pitfalls

- **Do not** expose backend error details (e.g., "User not found") in the UI.
- **Do not** add a `console.log` of the API response in production code.
- **Do not** disable the submit button based solely on `!isValid` if you want to show validation errors on submit attempt (standard `react-hook-form` behavior).
- **Ensure** the `email` input uses `type="email"` for native keyboard and validation.
