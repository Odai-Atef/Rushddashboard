# Quickstart: Reset Password Page and Token Flow

**Date**: 2026-06-09
**Feature**: Reset Password Page and Token Flow
**Branch**: `039-rushd-frontend-auth`

---

## Prerequisites

- Node.js 18+ and `npm`/`pnpm` installed
- Backend API running locally or accessible via `VITE_API_BASE_URL`
- Existing auth pages (`LoginPage`, `ForgetPasswordPage`) are already implemented and working

## Development Setup

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Verify backend is accessible**:
   ```bash
   curl -X POST $VITE_API_BASE_URL/api/v1/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token":"invalid-token","newPassword":"Weak"}'
   ```
   You should receive a `400 Bad Request` response.

## Testing the Feature

### Manual Testing Steps

1. **Request a reset token** (via existing forgot-password flow or backend directly):
   - Navigate to `/auth/forgot-password`
   - Enter a registered email and submit
   - The backend stores a token (currently no email is sent in dev)

2. **Simulate a reset link**:
   - Manually construct the URL: `/auth/reset-password?token=VALID_UUID`
   - Replace `VALID_UUID` with a real token from the database

3. **Happy path**:
   - Enter a valid password (e.g., `NewSecurePass456!`)
   - Confirm password matches
   - Submit → expect success message → redirect to `/auth/login`

4. **Invalid token**:
   - Use a made-up UUID or an expired one
   - Submit → expect "الرمز غير صالح أو منتهي الصلاحية" error with link to forgot-password

5. **Validation errors**:
   - Enter a short password (e.g., `123`) → expect inline rule checklist
   - Enter mismatched confirmation → expect "كلمتا المرور غير متطابقتين"

### Testing Token States

| Token State | UUID Example | Expected UX |
|-------------|--------------|-------------|
| Valid, unused | Real token from DB | Form renders; submission succeeds |
| Expired | Real token with past `expiresAt` | "Invalid or expired token" error |
| Already used | Real token with `usedAt` set | "Invalid or expired token" error |
| Malformed | `not-a-uuid` | "Invalid or expired token" error |
| Missing | No `?token=` param | "Invalid link" error |

## Key Files

| File | Purpose |
|------|---------|
| `src/app/components/ResetPasswordPage.tsx` | Main reset-password page component |
| `src/app/routes.tsx` | Route definition for `/auth/reset-password` |
| `src/api/services/auth-service.ts` | `AuthService.resetPassword()` method |
| `src/app/layouts/AuthLayout.tsx` | Layout that redirects authenticated users |
| `src/app/components/ForgetPasswordPage.tsx` | Link target for "Request new link" CTA |

## Notes

- The reset-password page follows the **same split-screen layout** as `LoginPage` and `ForgetPasswordPage`
- **RTL Arabic** text is used throughout; right-aligned icons in input fields
- **No new dependencies** are required for this feature beyond existing `lucide-react` and Tailwind
- The backend does **not** expose distinct error codes** for expired vs. used vs. missing tokens; the frontend shows a **unified error state**

