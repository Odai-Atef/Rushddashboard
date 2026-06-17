# Quickstart: Email Activation Link Handling

**Feature**: Email Activation Link Handling  
**Date**: 2026-06-17

## How to run the application

The project uses Vite. From the repository root:

```bash
npm install   # if dependencies are not present
npm run dev
```

The dev server URL is printed in the terminal (usually `http://localhost:5173`).

## How to test the activation flow

### 1. Valid token

1. Obtain a valid activation token from the backend or a recent test registration.
2. Open:

   ```text
   http://localhost:5173/auth/activate?token=YOUR_VALID_TOKEN
   ```

3. Expected behavior:
   - A loading spinner appears with "جاري تفعيل حسابك...".
   - After the backend responds, a success icon appears.
   - The page automatically redirects to `/auth/login?activated=success&message=...`.
   - The login page shows a green banner with the backend message.

### 2. Invalid or expired token

1. Open:

   ```text
   http://localhost:5173/auth/activate?token=00000000-0000-0000-0000-000000000000
   ```

2. Expected behavior:
   - A loading spinner appears briefly.
   - An error icon appears.
   - The page redirects to `/auth/login?activated=error&message=...`.
   - The login page shows a red banner with the failure message.

### 3. Missing token

1. Open:

   ```text
   http://localhost:5173/auth/activate
   ```

2. Expected behavior:
   - An error icon appears.
   - The page redirects to `/auth/login?activated=error&message=...`.
   - The login page shows a red banner explaining the link is invalid or missing.

### 4. Offline / network failure

1. Open DevTools → Network → set to "Offline".
2. Open a valid activation URL.
3. Expected behavior:
   - An error icon appears with a connectivity message.
   - The page redirects to `/auth/login?activated=error&message=...`.

## Build verification

To verify the production build still compiles:

```bash
npm run build
```

No new build configuration is required for this feature.

## Files to review

- `src/app/components/ActivateAccountPage.tsx`
- `src/app/components/LoginPage.tsx`
- `src/api/services/auth-service.ts`
- `src/app/routes.tsx`
