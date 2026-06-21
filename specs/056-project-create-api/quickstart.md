# Quickstart: Project Create API Integration

**Feature**: Project Create API Integration  
**Date**: 2026-06-21

## How to Run and Validate This Feature

1. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Open the create page**:
   Navigate to `http://localhost:5173/dashboard/project-management/create` (or the port printed by Vite).

3. **Log in** if the application requires authentication.

4. **Fill out the form**:
   - Project name
   - Project type
   - Organization (selection)
   - Category
   - Description
   - Budget (in SAR)
   - Start date (`YYYY-MM-DD`)
   - End date (`YYYY-MM-DD`)
   - Beneficiaries
   - Geographic scope
   - Project manager (selection)

5. **Submit the form**:
   - Click the "إنشاء المشروع" button.
   - The submit button should disable and show a loading state.
   - On success, the page navigates to `/dashboard/project-management/list`.

6. **Verify the API call**:
   - Open the browser DevTools Network tab.
   - Confirm a `POST /api/v1/projects` request is sent with a JSON body matching the contract.
   - Confirm the response status is `201 Created`.

## How to Test Error Handling

1. **Validation errors**:
   - Leave a required field empty and submit.
   - Confirm the form does not call the API and highlights the missing field.

2. **API validation errors**:
   - Trigger a backend validation error (e.g., duplicate project name).
   - Confirm field-level or page-level error messages appear and form values are preserved.

3. **Server error**:
   - Simulate a 500 response from the backend or disconnect the backend.
   - Confirm a user-friendly error message is shown and the user can retry without re-entering data.

4. **Duplicate submission**:
   - Click the submit button rapidly.
   - Confirm only one API request is sent because the button disables during submission.

## How to Build for Production

```bash
npm run build
# or
pnpm build
```

Verify the build completes without TypeScript or Vite errors.

## Notes

- The backend `/api/v1/projects` endpoint must be running and accessible at the URL configured in `ENV.API_BASE_URL`.
- The `currencyCode` field defaults to `"SAR"` and is not shown as a selectable input in this version.
- Draft save and cancel navigation remain unchanged from the previous implementation.
