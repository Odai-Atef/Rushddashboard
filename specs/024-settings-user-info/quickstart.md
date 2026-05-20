# Quick Start: Settings Page User Info

**Feature**: Settings Page User Info  
**Date**: 2026-05-20

## Prerequisites

- Existing Rushd frontend running locally (`npm run dev` or equivalent).
- Valid user account (can log in via `/auth/login`).
- Backend returning user object with fields: `id`, `email`, and optionally `firstName`, `lastName`, `companyName`.

## Running the Feature Locally

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Log in** at `/auth/login` with a valid user.

3. **Navigate** to `/dashboard/settings`.

4. **Expected behavior**:
   - Profile section shows the logged-in user's real `firstName`, `lastName`, and `email`.
   - Company section shows the real `companyName` if returned by the backend.
   - No hardcoded Arabic demo text appears.
   - If optional fields are missing, inputs remain empty and the page renders cleanly.

## Testing

- **Component test** (`src/tests/components/SettingsPage.test.tsx`):
  - Mock `useAuth` to return a user with `firstName`, `lastName`, `email`, `companyName`.
  - Assert that inputs render the provided values.
  - Mock `useAuth` with only `id` and `email`.
  - Assert that inputs are empty and no placeholder text appears.

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Name still shows demo text | `SettingsPage` not consuming `useAuth` | Import `useAuth` and bind `defaultValue` to `user.firstName` etc. |
| Page breaks on refresh | `UserProfile` type mismatch in `localStorage` | Ensure `localStorage` key `rushd_user` is cleared after type changes, or handle parse fallback gracefully. |
| TypeScript errors on `user.firstName` | `UserProfile` missing optional fields | Extend `UserProfile` interface in `src/app/types/auth.ts`. |

## Rollback

- Revert `src/app/types/auth.ts`, `src/app/utils/auth.ts`, `src/app/components/SettingsPage.tsx`, and any new test file.
- No database or backend changes required.
