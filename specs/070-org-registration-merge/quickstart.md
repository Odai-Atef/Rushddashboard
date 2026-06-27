# Quickstart: Merge User and Organization Registration

## Verify the Change

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open the new combined registration page at `/auth/register/org`.

   - Confirm all merged fields are present.
   - Confirm no duplicate fields exist (email, phone, organization/company name appear once).

3. Fill the form and submit.

   - Open the browser DevTools Network tab.
   - Confirm the request is sent to the single new backend endpoint (e.g., `POST /api/v1/auth/register/org`).
   - Confirm the response includes tokens, user info, and organization info.

4. Confirm redirect.

   - After successful submission, verify the browser redirects to the onboarding assessment flow.

5. Test validation.

   - Leave required fields empty and submit; confirm client-side validation errors appear.
   - Choose `charity` organization type and confirm `fundingAreas` becomes required.
   - Choose `private_company` organization type and confirm `activity` becomes required.

6. Verify existing pages are unchanged.

   - Visit `/auth/register` and confirm it still works as before.
   - Visit `/dashboard/onboarding/registration` and confirm it still works as before.

7. Run the production build to catch type errors:

   ```bash
   npm run build
   ```

## Definition of Done

- New route `/auth/register/org` exists and renders a combined registration page.
- The page contains all unique fields from both source pages with duplicates removed.
- The page submits to a single new backend API endpoint.
- Client-side validation covers all required fields and conditional fields.
- Successful submission redirects to the onboarding assessment flow.
- Existing `/auth/register` and `/dashboard/onboarding/registration` pages remain functional.
- `npm run build` succeeds with zero TypeScript errors.
