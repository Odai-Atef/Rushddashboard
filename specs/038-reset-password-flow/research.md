# Research: Reset Password Page and Token Flow

**Date**: 2026-06-09
**Feature**: Reset Password Page and Token Flow (specs/038-reset-password-flow)

---

## Scope

Research the backend auth contract, existing frontend auth patterns, and form validation approaches to inform the implementation of the reset-password page.

---

## Background

The Rushd frontend already has:
- `ForgetPasswordPage.tsx` at `/auth/forgot-password` for requesting reset emails
- `AuthService` with a `resetPassword(token, newPassword)` method calling `POST /api/v1/auth/reset-password`
- `AuthLayout` that redirects authenticated users to `/dashboard`
- React Router v7 with route definitions in `routes.tsx`

However, there is **no** `/auth/reset-password` route or page component to consume the reset token and collect a new password from the user.

---

## Backend Contract

### Endpoint

```
POST /api/v1/auth/reset-password
```

### Request Body (`ResetPasswordDto`)

| Field | Type | Constraints |
|-------|------|-------------|
| `token` | `string` | `@IsUUID()`, `@IsNotEmpty()` — the raw reset token (UUID) from the email link |
| `newPassword` | `string` | `@MinLength(8)`, `@Matches(/[A-Z]/)`, `@Matches(/[a-z]/)`, `@Matches(/[0-9]/)`, `@Matches(/[^A-Za-z0-9]/)` |

**Note**: The backend DTO does **not** include a `confirmPassword` field. Confirmation matching is a **frontend-only** concern.

### Response

- **Success (200)**: `{ message: "Password reset successfully" }`
- **Error (400)**: `{ statusCode: 400, message: "Invalid or expired token" }` — returned for expired, already-used, or unrecognized tokens
- **Error (400)**: Validation errors for malformed `token` or weak `newPassword` (if class-validator catches them before service logic)

### Token Lifecycle

1. Backend generates a raw UUID token and stores a hashed version in `passwordResetToken` table with a 24-hour expiry
2. Email sends the raw token to the user (out of scope for this feature)
3. User clicks link → frontend receives raw token as a URL query parameter
4. Frontend submits raw token + new password to backend
5. Backend hashes the submitted token, looks up the active (unused + unexpired) record, and replaces the user's password
6. Backend marks the token as used

---

## Existing Frontend Patterns

### AuthService

Located at `src/api/services/auth-service.ts`.

```typescript
async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
  return apiClient.post(`${this.baseEndpoint}/reset-password`, { token, newPassword });
}
```

The `ApiResponse<T>` type wraps backend responses with `success`, `data`, `message`, and optional `meta`.

### AuthLayout

Located at `src/app/layouts/AuthLayout.tsx`.

- Redirects authenticated users to `/dashboard`
- Unauthenticated users see the child route (`<Outlet />`)
- This behavior should apply to the new `/auth/reset-password` route automatically

### ForgetPasswordPage

Located at `src/app/components/ForgetPasswordPage.tsx`.

- Uses local React state (`useState`) for form state, loading state, and error/success statuses
- Uses `lucide-react` icons (`Mail`, `ArrowRight`, `CheckCircle`, `AlertCircle`, `Loader2`)
- Tailwind CSS styling with RTL Arabic text
- Form has email input with right-aligned icons (Arabic RTL)
- Success state shows a centered card with confirmation message and action buttons
- Error state renders a red-bordered alert box with an icon

### LoginPage & RegistrationPage

Located at `src/app/components/LoginPage.tsx` and `RegistrationPage.tsx`.

- Similar split-screen layout: form on the left, gradient promotional panel on the right
- Consistent input styling: `w-full pr-11 pl-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`
- Consistent button styling: `w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90`

### Routes

Located at `src/app/routes.tsx`.

- Auth routes are nested under `path: 'auth'` with `Component: AuthLayout`
- Children: `login`, `register`, `forgot-password`
- New route to add: `reset-password`

---

## Research Decisions

### Decision 1: No separate "validate token" API call

**Decision**: The frontend will **not** pre-validate the token on page load. It will only validate on submission.

**Rationale**:
- The backend returns `400` on invalid/expired tokens at submission time
- There is no dedicated token-validation endpoint
- A separate validation call would add latency with minimal UX gain
- The spec's error-handling requirement is satisfied by showing the error after the backend rejects the submission

**Alternative considered**: Add a separate `validateToken` step before showing the form. Rejected because it requires backend changes and adds an extra network round-trip.

### Decision 2: Password confirmation is frontend-only

**Decision**: The form will collect `confirmPassword` for UX, but only `newPassword` is sent to the backend.

**Rationale**:
- The backend `ResetPasswordDto` does not have a `confirmPassword` field
- This is standard practice: confirmation is a UX guard, not a business rule
- Matches the existing registration pattern (if present)

### Decision 3: Unified token error message

**Decision**: The frontend will show a single error state for all token failures: "Invalid or expired token" (translated to Arabic).

**Rationale**:
- The backend returns identical messages for expired, already-used, and non-existent tokens
- Differentiating them requires backend changes or client-side heuristics
- A unified message with a "Request new link" CTA satisfies the spec requirements
- Security best practice: don't leak whether a token existed but expired vs. never existed

**Alternative considered**: Parse the backend error message to show different UI. Rejected because the messages are identical and the backend does not expose error codes.

### Decision 4: Reuse local state pattern (no form library)

**Decision**: Use React `useState` for form state, matching `ForgetPasswordPage.tsx`.

**Rationale**:
- The existing auth pages use this pattern consistently
- Adding a form library (e.g., React Hook Form + Zod) would be a larger refactor across all auth pages
- The scope of this feature is a single form with two fields and basic validation
- Keep the codebase consistent

**Alternative considered**: Introduce React Hook Form + Zod. Rejected because it creates inconsistency with existing auth pages without a compelling reason.

### Decision 5: Arabic RTL text with bilingual support readiness

**Decision**: All user-facing text will be in Arabic (RTL), matching existing auth pages. English translations are out of scope but can be added later via a translation layer.

**Rationale**:
- Existing pages (`ForgetPasswordPage`, `LoginPage`) are fully in Arabic
- The project does not currently have an i18n framework in place
- Changing text direction at this stage would require reworking all existing auth pages

---

## Assumptions Validated

| Assumption | Status | Evidence |
|---|---|---|
| Backend provides a single POST endpoint for reset | ✅ Confirmed | `AuthController.resetPassword()` at `POST /auth/reset-password` |
| No separate validate-token endpoint | ✅ Confirmed | No such endpoint exists in `auth.controller.ts` |
| Token is delivered via email | ✅ Confirmed | `AuthService.forgotPassword()` stores token and TODOs email sending |
| Frontend should enforce password rules client-side | ✅ Confirmed | Backend `ResetPasswordDto` defines exact rules; duplicating them improves UX |
| Auth layout redirects authenticated users | ✅ Confirmed | `AuthLayout.tsx` checks `isAuthenticated` and redirects to `/dashboard` |
| Forgot-password flow exists | ✅ Confirmed | `ForgetPasswordPage.tsx` exists at `/auth/forgot-password` |

