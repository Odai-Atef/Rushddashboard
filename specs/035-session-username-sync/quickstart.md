# Quickstart: Session Username Sync

**Branch**: `035-session-username-sync`

## Prerequisites

- Node.js 18+ and npm installed
- Backend API running with `GET /auth/profile` endpoint accessible
- Valid `.env` with `VITE_API_BASE_URL` pointing to the backend

## Local Verification Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Log in** with a valid account:
   - Navigate to `/auth/login`
   - Enter credentials and submit
   - After successful login, the top bar avatar should show initials from your `fullName`

4. **Verify Top Bar**:
   - Click the avatar in the top-right corner
   - Confirm the dropdown shows your actual `fullName` and `email`
   - Confirm the avatar initials match the first character of the first word + first character of the last word of `fullName`

5. **Verify Settings Page**:
   - Navigate to `/dashboard/settings`
   - Ensure the "الملف الشخصي" section is active
   - Confirm the avatar shows your initials
   - Confirm first name, last name, and email fields are pre-filled from session data

6. **Test Fallbacks** (optional):
   - Block the `/auth/profile` endpoint in DevTools Network panel
   - Refresh the page
   - Confirm the top bar shows `؟` for avatar and `المستخدم` for name without crashing

## Running Tests

```bash
npm test
```

*(No new tests added for this feature; existing auth and component tests should continue passing.)*

## Files Modified

- `src/app/layouts/RootLayout.tsx` — extended `AuthContext` with `user`
- `src/app/components/TopBar.tsx` — reads `user` from context for name/email/avatar
- `src/app/components/SettingsPage.tsx` — reads `user` from context for profile fields
