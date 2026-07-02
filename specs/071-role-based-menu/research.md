# Research Notes: Role-Based Navigation Menu

**Date**: 2026-07-02

## Technical Context

- **Framework**: React 18 SPA with React Router v7, bundled by Vite, styled with Tailwind CSS.
- **UI Library**: Radix UI primitives + custom components; icons from `lucide-react`.
- **Language**: TypeScript 5.x (strict not confirmed).
- **State/Auth**: `AuthContext` in `RootLayout` loads `UserProfile` via `authService.getProfile()`; profile currently exposes `role?: string | null` (free-form) but `OrgRegistrationResponse` also exposes `roleId`. Auth service defines `RegisterData.roleSlug` as a string, suggesting the backend already supports role slugs.
- **Navigation**: Two components render the dashboard menu — `Sidebar.tsx` (desktop) and `MobileNav.tsx` (mobile drawer). Both currently hardcode `navItems` arrays.
- **Access control**: Currently only an `.env`-driven `RESTRICTED_MENU_USER_IDS` allow-list in `Sidebar.tsx`. `MobileNav.tsx` has no role filtering. No route guards exist in `routes.tsx` for dashboard routes.

## Decisions

- **Decision**: Filter the existing `navItems` arrays in both `Sidebar.tsx` and `MobileNav.tsx` by a mapping from `roleSlug` to allowed item IDs.
- **Rationale**: The feature is small, scoped, and the existing duplication between sidebar and mobile nav makes a shared mapping the simplest path. A shared, static mapping file avoids coupling the menu components to auth internals.
- **Alternatives considered**:
  - Backend-driven menu config: rejected because the spec explicitly lists the items per role slug and the backend profile already returns the role; no need for a new API.
  - Centralized `<MenuConfigProvider>`: rejected as over-engineering for two components and a static two-role mapping.
  - Route-level guards alone: insufficient because the requirement is to *hide* menu items, not only block routes.

## Open Questions Resolved

- **Where does the role slug come from?** `UserProfile.role` (currently typed as `string | null`). We will treat this value as the role slug. If the backend uses a different field, the implementation step will update `UserProfile` and `useAuth` accordingly.
- **What IDs map to the Arabic labels?** Sidebar already has stable `id` values:
  - `donors` → 'قاعدة الجهات المانحة'
  - `project-management` → 'إدارة المشاريع'
  - `donor-matching` → 'التطابق الذكي مع المانحين'
  - `onboarding` → 'معلوماتي' (current label uses `UserPlus` icon; note onboarding label is 'معلوماتي' in spec for entity managers)
  - `charity-assessment` → 'تقييم الجاهزية'
- **Direct URL access**: Because there are no server-side rendered routes, client-side route guards are acceptable. We will add a reusable `RoleGuard` wrapper or loader logic that reads `useAuth` and redirects unrecognized roles to a safe default route (e.g., `/dashboard/charity-assessment` which is the current fallback).
- **Multiple roles / unknown roles**: The spec assumes a single role slug per user. We implement a single-role lookup with a fallback to no visible menu items for unrecognized slugs. If `role` is missing/unknown, the menu is empty and the user is redirected to the safe fallback route.

## Implementation Notes (non-binding)

1. Introduce `src/config/menuAccess.ts` exporting `ROLE_MENU_MAP` and helpers `getAllowedMenuIds(roleSlug)` and `isRouteAllowed(roleSlug, path)`.
2. Update `Sidebar.tsx` and `MobileNav.tsx` to consume the map and hide items not in the allowed set for the current role.
3. Add a route guard component (e.g., `RoleRouteGuard`) used in `routes.tsx` for the three role-gated route branches to enforce direct URL access rules.
4. Update `UserProfile` to include `roleSlug?: string | null` if `role` is not the canonical field, and ensure `useAuth` exposes it.
5. Add unit tests for the mapping helper and integration tests rendering the two nav components with mocked roles.
