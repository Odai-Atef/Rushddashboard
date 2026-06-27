# Quickstart: Use Full Name Across Frontend

## Verify the Change

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Open the standalone registration page at `/auth/register`.

   - Confirm there is a single "الاسم الكامل" field.
   - Confirm no separate "First name" / "Last name" fields exist.

3. Submit the registration form with a valid `fullName`.

   - Open the browser DevTools Network tab.
   - Confirm the `POST /api/v1/auth/register` request body contains `fullName` and no `firstName`/`lastName` fields.

4. Log in and open the application.

   - Confirm the top-bar avatar displays initials derived from `fullName`.
   - Confirm the profile dropdown shows the `fullName` value.

5. Navigate to Settings → الملف الشخصي.

   - Confirm the "الاسم الكامل" input displays the current `fullName`.
   - Confirm the avatar initials match the `fullName` value.

6. Run the production build to catch type errors:

   ```bash
   pnpm build
   ```

## Search Verification

Run the following to confirm no stale references remain in `src/`:

```bash
# Should return no matches
grep -R "firstName\|lastName\|first_name\|last_name" src/ --include="*.ts" --include="*.tsx"

# Should show only fullName/full_name matches
grep -R "fullName\|full_name" src/ --include="*.ts" --include="*.tsx"
```

## Definition of Done

- `UserProfile.fullName` is typed as `string` (required).
- `RegisterData.fullName` is typed as `string` (required).
- The standalone registration page validates `fullName` (2–100 characters).
- The top-bar profile menu displays `fullName` with no fallback fallback string.
- The settings profile section displays and edits `fullName`.
- No request payload includes `firstName`, `lastName`, `first_name`, or `last_name`.
- `pnpm build` succeeds with zero TypeScript errors.
