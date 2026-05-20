# Quick Start: Dashboard User Identity Display

## Prerequisites

- Node.js >= 18
- Existing Rushd frontend repo already installed (`npm install`)
- Existing auth system working (login/logout already functional)

## Development Steps

1. **Implement display-name utility**
   - File: `src/app/utils/getDisplayName.ts`
   - Handle all fallback cases: full name → single name → email → "User"

2. **Update Sidebar component**
   - File: `src/app/components/Sidebar.tsx`
   - Add a user identity block near the footer using `useAuth()`
   - Show name + email with appropriate fallback

3. **Update MobileNav component**
   - File: `src/app/components/MobileNav.tsx`
   - Add matching user identity block above footer
   - Ensure it appears in the mobile drawer

4. **Update TopBar user dropdown**
   - File: `src/app/components/TopBar.tsx`
   - Replace hardcoded Arabic name/email with live `useAuth()` data
   - Keep existing `Avatar` and `DropdownMenu` structure

5. **Write tests**
   - Unit tests for `getDisplayName.ts`
   - Component tests for identity rendering in `Sidebar` and `TopBar`

## Running Locally

```bash
# Run unit tests
npm run test

# Run dev server
npm run dev
```

## Verifying Acceptance Criteria

| Criterion | How to Verify |
|-----------|-------------|
| AC-1: Name visible after login | Log in → open dashboard → observe name in Sidebar and TopBar dropdown |
| AC-2: Email visible | Same as AC-1; email should appear under/ beside the name |
| AC-3: Identity preserved on refresh | Refresh the page → check Sidebar/TopBar still shows identity without re-login |
| AC-4: Missing data handled | Simulate empty `firstName`/`lastName` in `localStorage` → observe graceful fallback |
| AC-5: Responsive alignment | Resize to mobile (< 1024px) → open MobileNav → verify identity block appears and is readable |

## No Additional Setup Required

This feature requires **no new environment variables, no backend changes, and no new dependencies**. It builds purely on the existing `AuthProvider` and `UserProfile` types.
