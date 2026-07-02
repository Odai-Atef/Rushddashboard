# Data Model: Role-Based Navigation Menu

**Date**: 2026-07-02

## Entities

### `MenuItem`

A single entry in the navigation UI.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Stable identifier used for filtering and active-state matching. |
| `label` | `string` | Arabic display label shown to the user. |
| `icon` | `LucideIcon` | Visual icon component imported from `lucide-react`. |
| `path` | `string` | Absolute route the item links to. |
| `allowedRoles` | `RoleSlug[]` | List of role slugs that may see this item. Derived from `ROLE_MENU_MAP`. |

### `RoleSlug`

A union/string value representing the user's assigned role.

| Attribute | Type | Description |
|-----------|------|-------------|
| `value` | `"project-managers" \| "entity-managers" \| string` | Canonical slug returned by the auth profile. |

### `RoleMenuMapping`

Static configuration object that maps each known role slug to the set of allowed `MenuItem.id`s.

| Attribute | Type | Description |
|-----------|------|-------------|
| `roleSlug` | `RoleSlug` | Key in the mapping. |
| `allowedItemIds` | `Set<string>` | Menu item IDs visible to users with this role. |

## Relationships

- A `User` has zero or one `RoleSlug` (the spec assumes a single role per user; unknown/missing roles fall back to empty allowed set).
- A `MenuItem` may belong to one or more `RoleSlug` allowed sets.
- The `RoleMenuMapping` is the source of truth for both the sidebar and mobile navigation visibility.

## Validation Rules

- Every menu item ID referenced in a role mapping must exist in the master `navItems` list.
- The Arabic labels for the five mapped items must exactly match the spec:
  - `project-managers`: 'قاعدة الجهات المانحة', 'إدارة المشاريع', 'التطابق الذكي مع المانحين'
  - `entity-managers`: 'معلوماتي', 'تقييم الجاهزية', 'إدارة المشاريع'
- An unrecognized role slug results in an empty allowed set: no dashboard menu items are shown.
- A missing role slug is treated the same as an unrecognized slug.

## State Transitions

1. **On login / profile load**: `useAuth` fetches `UserProfile`, including the role slug.
2. **On role change**: The auth context updates `user.role`; the sidebar and mobile nav re-render and re-filter items based on the new role.
3. **On direct URL navigation**: A route guard checks the requested path against `isRouteAllowed(roleSlug, path)`. If not allowed, the user is redirected to the safe fallback route (`/dashboard/charity-assessment`).
