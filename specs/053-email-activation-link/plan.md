# Implementation Plan: Email Activation Link Handling

**Branch**: `053-email-activation-link` | **Date**: 2026-06-17 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/053-email-activation-link/spec.md`

## Summary

Wire the existing `/auth/activate` route and `ActivateAccountPage` component to call the backend activation endpoint (`GET /api/v1/auth/activate?token=`) and redirect the user to `/auth/login` with an activation status message. The activation service method already exists in `auth-service.ts`; the remaining work is limited to ensuring the component behaves correctly, messages are surfaced on the login page, and the contract is documented.

## Technical Context

**Language/Version**: TypeScript / React 18.3.1 / react-router 7.13.0 / Vite 6.3.5  
**Primary Dependencies**: `lucide-react` (icons), existing `@/api/client` fetch wrapper, Tailwind CSS  
**Storage**: N/A  
**Testing**: Project currently has no automated test harness configured. Validation is manual via the dev server and production build.  
**Target Platform**: Browser (desktop + responsive)  
**Project Type**: Single-page web application (frontend)  
**Performance Goals**: Activation call + redirect should complete within 3 seconds on a stable connection; UI should show feedback immediately while loading.  
**Constraints**: Activation endpoint is public (no auth token required). Route is already registered at `/auth/activate`. Login page already renders activation banners from `?activated` and `?message` query params.  
**Scale/Scope**: Single-user request, no batching or background processing.

## Constitution Check

The constitution file is a placeholder template with no active principles or gates defined. No explicit gates to evaluate. The feature does not introduce complexity requiring justification: it reuses existing auth service, API client, routing, and login page components.

## Project Structure

### Documentation (this feature)

```text
specs/053-email-activation-link/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── client.ts                 # fetch wrapper with retry/timeout
│   ├── services/
│   │   └── auth-service.ts       # activateAccount(token) method
│   └── types.ts                  # ApiResponse / ApiError shapes
└── app/
    ├── components/
    │   ├── ActivateAccountPage.tsx   # activation flow UI
    │   └── LoginPage.tsx             # renders activation status banners
    └── routes.tsx                  # /auth/activate route registration
```

**Structure Decision**: Use the existing single-project frontend structure. No new directories are needed; the change is localized to `ActivateAccountPage.tsx` and may require small defensive tweaks to `LoginPage.tsx` and `auth-service.ts`.

## Research & Design

### Phase 0: Resolved Unknowns

No external research required. The relevant implementation already exists and the shape is known:

- Endpoint: `GET /api/v1/auth/activate?token=<token>`
- Expected success response: `{ "success": true, "message": "Account activated successfully. You can now log in." }`
- Failure response: HTTP 4xx from backend carrying `{ success: false, message: "..." }` (or generic client error)
- Current `ActivateAccountPage` already performs the call and redirects to `/auth/login?activated=<status>&message=<encodedMessage>`.
- Current `LoginPage` already reads `activated` and `message` query params and renders green/red banners.

### Phase 1: Data Model

No new backend or frontend state entities are introduced. The feature reuses existing constructs. See [data-model.md](data-model.md).

### Phase 1: Contract

See [contracts/activation-contract.md](contracts/activation-contract.md) for the public interface between the activation page, auth service, backend endpoint, and login page.

### Phase 1: Quickstart

See [quickstart.md](quickstart.md) for how to verify the activation flow locally and in production.

## Implementation Notes

1. **Service layer**: `AuthService.activateAccount(token)` currently returns `ApiResponse<{ message?: string }>` and passes the token via `params: { token }`. The `apiClient.get` wrapper appends the token as a URL query parameter. This is correct.
2. **Activation page**: `ActivateAccountPage` reads `token` from `useSearchParams`, calls `authService.activateAccount`, and after 2.5 seconds navigates to `/auth/login?activated=success|error&message=...`. Review and fix any cleanup bugs:
   - `setTimeout` cleanup is returned inside the success branch, but other branches do not return cleanup functions. Promote cleanup to the outer `useEffect` level using `cancelled` flag plus `timerRef`.
   - The page mixes Arabic UI text with an English backend message. Decide whether to use the backend-supplied message verbatim on the login page or to translate it. The simplest approach: pass the backend message through and let the login page display it, because the spec asks for "message of success or failure".
3. **Login page**: `LoginPage` already supports `?activated=success` and `?activated=error` banners. Ensure the message is URL-decoded and safely rendered (it already does via `activationMessage` search param).
4. **Edge cases to validate**:
   - Missing token → immediate redirect with error.
   - Network failure (`Failed to fetch`) → friendly Arabic connectivity error.
   - 401/403 from backend → treated as error; avoid the global 401 redirect because this is an unauthenticated call.
   - Already activated token → backend should return a clear error message.
5. **Security**:
   - Token is treated as opaque; no client-side parsing.
   - Token is forwarded only to the trusted backend endpoint over the configured API base URL.
   - No token persisted to storage.

## Acceptance Verification

Manual test plan:

1. Open `/auth/activate?token=VALID` → see spinner, then success icon, then redirect to `/auth/login?activated=success&message=...` with green banner.
2. Open `/auth/activate?token=INVALID` → see error icon, then redirect to `/auth/login?activated=error&message=...` with red banner.
3. Open `/auth/activate` (no token) → see error icon, then redirect to login with error banner.
4. Throttle network to offline → see connectivity error, then redirect to login with error banner.
5. Verify the message text matches the backend response (English backend message displayed on Arabic page is acceptable unless product decides otherwise).

## Complexity Tracking

No constitution gates triggered; no complexity table required.
