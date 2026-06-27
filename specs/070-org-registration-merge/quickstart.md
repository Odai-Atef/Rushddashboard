# Quick Start: Verify /auth/register/org

## Prerequisites

- Node.js and `npm` installed.
- Dependencies installed: `npm i`
- Backend service running and reachable via `API_BASE_URL` (set in `.env`).

## Start the Development Server

```bash
npm run dev
```

The Vite dev server will start, typically at `http://localhost:5173`.

## Access the Page

Open in a browser:

```text
http://localhost:5173/auth/register/org
```

## Happy-Path Smoke Test

1. Fill in the form:
   - الاسم الكامل (Full name)
   - اسم الجهه (Organization / company name)
   - البريد الإلكتروني (Email)
   - رقم الهاتف (Phone)
   - كلمة المرور / تأكيد كلمة المرور (Password / Confirm)
   - رقم الترخيص (License number)
   - تاريخ التسجيل (Registration date)
   - نوع الجهه (Organization type: **private company** until funding-areas endpoint is public)
   - المدينة / المنطقة (City)
   - النشاط (Activity, for private company)
   - Accept terms.
2. Click **إنشاء حساب وتسجيل الجهه**.
3. Expected: a success toast appears and the app redirects to `/auth/login?registered=true`.
4. The user should **not** be logged in automatically (no token stored, no redirect to dashboard).

> **Important prerequisites**
>
> - The backend must accept `fullName`, `registrationDate`, `city`, and `companyName` in `POST /api/v1/auth/register-organization`.
> - `GET /api/v1/donors/funding-areas` must be **public/unauthenticated** so the charity type can load its checklist on this public page.
>
> Until the funding-areas endpoint is public, use the **private company** type to exercise the full submit flow.

## Error-Path Smoke Test

1. Leave required fields empty and submit.
2. Expected: inline field errors appear and no API call is made.
3. Submit with an email that already exists.
4. Expected: a single inline API error message appears; no separate pre-check API call is visible in the network tab.

## Regression Tests

- Visit `/auth/register` and confirm it still submits and redirects exactly as before.
- Visit `/dashboard/onboarding/registration` and confirm it still submits and redirects exactly as before.

## Build Verification

```bash
npm run build
```

The build must complete without TypeScript or Vite errors.
