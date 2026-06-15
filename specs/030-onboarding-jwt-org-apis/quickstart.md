# Quickstart: Onboarding JWT Organization APIs

## Local Development Setup

1. **Start the dev server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

2. **Log in** to obtain a valid JWT token. The `apiClient` reads the token automatically from `localStorage` under the key defined in `AUTH_CONFIG.TOKEN_KEY`.

3. **Navigate** to the onboarding flow route (typically `/onboarding` or whatever route renders `<CharityOnboardingFlow />`).

## Testing the Registration Screen (Step 2)

### Happy Path — First-Time User (404 → Create)

1. Open browser DevTools → Network tab.
2. Land on the organization-info screen.
3. Observe `GET /api/v1/onboarding/organizations/me`.
   - Expect **404** → form renders empty.
4. Fill in all required fields:
   - اسم المؤسسة, رقم الترخيص, تاريخ التسجيل, نوع المؤسسة, المدينة, الشخص المسؤول, البريد الإلكتروني, رقم الجوال.
5. Click **"التالي"** (Next).
6. Observe `PUT /api/v1/onboarding/organizations/me`.
   - Expect **201** → response contains `org` object.
7. UI advances automatically to the **Profile** screen.
8. Verify **no `orgId` key** exists in `sessionStorage` or `localStorage` (Application tab in DevTools).

### Happy Path — Returning User (200 → Update)

1. With an existing organization record for your JWT user, reload the registration screen.
2. Observe `GET /api/v1/onboarding/organizations/me`.
   - Expect **200** → all form fields are pre-filled with existing data.
3. Modify one field (e.g. city).
4. Click **"التالي"**.
5. Observe `PUT /api/v1/onboarding/organizations/me`.
   - Expect **200** → response contains updated `org` object.
6. UI advances to Profile screen.
7. Reload the registration screen again — pre-filled data should reflect the recent update.

### Error Scenarios

#### 400 — Validation Errors

1. Enter an invalid email (e.g. `not-an-email`).
2. Leave a required field blank.
3. Click **"التالي"**.
4. Observe **400** response.
5. Inline error messages appear beneath offending inputs in Arabic.
6. All other entered data remains intact.

#### 401 — Session Expired

1. Clear `localStorage` token manually (Application tab → localStorage → delete auth token).
2. Click **"التالي"** or reload the page.
3. Observe redirect to `/auth/login?expired=true&redirect=...`.

#### 500 — Server Error

1. (Requires backend mock or forced server error.)
2. Submit the form.
3. Observe **500** response.
4. A `sonner` toast appears with Arabic error message.
5. Form data is **not** cleared; user can retry.

#### Network / Offline

1. Disable network (DevTools → Network → Offline).
2. Attempt to load or save.
3. A retry button appears inline.
4. Re-enable network, click retry — request succeeds without data loss.

### Double-Submit / Refresh Safety

1. Click **"التالي"** twice rapidly.
2. Verify in Network tab: only one `PUT` executes (UI should disable button during `isSaving`).
3. Reload the page after a successful save.
4. Verify no duplicate organization exists (`GET` returns the same single record).

## Sanity Checklist

- [ ] `GET /organizations/me` fires on registration screen mount.
- [ ] 200 pre-fills all 9 fields correctly.
- [ ] 404 shows empty form, no error toast.
- [ ] 401 redirects to login.
- [ ] Network error shows retry button.
- [ ] `PUT /organizations/me` fires on Next/Save.
- [ ] 200/201 advances to profile screen.
- [ ] 400 shows field-level errors under inputs.
- [ ] 500 shows Arabic toast, form preserved.
- [ ] No `orgId` key in `sessionStorage` or `localStorage` at any point.
- [ ] JWT token present in `Authorization` header for both GET and PUT.
- [ ] Rapid double-click does not create duplicate organizations.
