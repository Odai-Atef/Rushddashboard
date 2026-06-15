# Quickstart: Handle 401 Session Expired

**Date**: 2026-06-14
**Feature**: Handle 401 Session Expired

## Prerequisites

- Node.js & npm/yarn installed
- Project dependencies installed (`npm install`)
- Backend API running (to test real 401 responses)

## Manual Testing Steps

### 1. Simulate token expiry

Open browser DevTools → Application → Local Storage → modify `auth_token` to an invalid value, or delete it entirely.

### 2. Trigger an API call

Navigate to any authenticated page (e.g., `/dashboard`) and perform an action that triggers an API request.

### 3. Observe redirect

You should be automatically redirected to `/auth/login?expired=true&redirect=/dashboard`.

### 4. Verify Arabic message

The login page should display the Arabic message:

> "انتهت صلاحية جلستك، يرجى تسجيل الدخول مرة أخرى"

### 5. Re-login and return

Enter valid credentials. After successful login, you should be redirected back to `/dashboard` (or whichever page triggered the 401).

## Edge Cases to Test

| Scenario | Expected Behavior |
|----------|------------------|
| Multiple parallel API calls return 401 | Only one redirect happens; no infinite loop |
| Already on `/auth/login` when 401 occurs | No redirect (stay on login page) |
| Background API call returns 401 | Immediate redirect even if user isn't actively clicking |
| Submitting a form when 401 hits | Form submission completes/fails gracefully, then redirect |
| Login without `?redirect` param | Defaults to `/dashboard` after login |

## Files Modified

| File | Change |
|------|--------|
| `src/api/client.ts` | Add 401 intercept logic, redirect handling |
| `src/app/components/LoginPage.tsx` | Read `?expired` param, display Arabic message, handle `?redirect` param |
