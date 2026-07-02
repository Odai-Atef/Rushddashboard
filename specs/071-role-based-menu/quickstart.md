# Quickstart: Role-Based Navigation Menu

## Local Development

1. Ensure dependencies are installed:
   ```bash
   pnpm install
   ```

2. Start the dev server:
   ```bash
   pnpm dev
   ```

3. Log in with a user whose `roleSlug` is either `project-managers` or `entity-managers`.

4. Verify the sidebar and mobile navigation show only the permitted items.

## Testing Roles Locally

Because the backend controls the `role` field on `UserProfile`, you can temporarily override the role in the frontend for manual testing by hardcoding a value in `RootLayout` after profile load (do not commit this).

| Role | Expected visible menu items |
|------|-----------------------------|
| `project-managers` | قاعدة الجهات المانحة, إدارة المشاريع, التطابق الذكي مع المانحين |
| `entity-managers` | معلوماتي, تقييم الجاهزية, إدارة المشاريع |
| unknown / missing | No dashboard menu items; redirect to `/dashboard/charity-assessment` |

## Running Tests

```bash
# If Vitest or Jest is configured in the project
pnpm test
```

Add or update tests that render `<Sidebar />` and `<MobileNav />` with mocked `useAuth` values for each role slug.

## Deployment Notes

- This change is purely client-side; no backend deployment is required unless the `role` field needs to be promoted to `roleSlug`.
- If the backend already returns the role slug under a different field name, update `UserProfile` and the auth context to expose it.
