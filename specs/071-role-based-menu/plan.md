# Implementation Plan: Role-Based Navigation Menu

**Branch**: `071-role-based-menu` | **Date**: 2026-07-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/071-role-based-menu/spec.md`

## Summary

Filter the dashboard navigation menu and route access based on the authenticated user's `roleSlug`. Users with `project-managers` see three items, users with `entity-managers` see three items, and unrecognized roles see no menu items. Direct URL access to disallowed routes is blocked.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.3.1  
**Primary Dependencies**: React Router 7.13.0, Vite 6.3.5, Tailwind CSS 4.1.12, Radix UI, lucide-react  
**Storage**: N/A (client-side mapping only)  
**Testing**: Project test framework not detected; prefer Vitest/Jest if available, otherwise add minimal component tests  
**Target Platform**: Modern browsers (RTL Arabic UI)  
**Project Type**: Web application (React SPA)  
**Performance Goals**: Menu render and route guard evaluation must complete synchronously; no perceptible delay  
**Constraints**: Must not break existing `.env` restricted-user allow-list in `Sidebar.tsx`; must keep mobile and desktop nav consistent  
**Scale/Scope**: Two role slugs, five distinct menu items affected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file is a placeholder and contains no active principles or constraints. No gates to enforce. Proceed.

## Project Structure

### Documentation (this feature)

```text
specs/071-role-based-menu/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── menu-access.ts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── components/
│   │   ├── Sidebar.tsx          # Filter desktop nav by role slug
│   │   └── MobileNav.tsx        # Filter mobile nav by role slug
│   ├── layouts/
│   │   └── RootLayout.tsx       # Exposes user profile including role slug
│   ├── routes.tsx               # Add role guards to protected route branches
│   └── utils/                   # cn helper already exists
├── api/
│   ├── services/
│   │   └── auth-service.ts      # UserProfile type may need roleSlug field
│   └── types.ts
└── config/                      # NEW: role-menu mapping
    └── menuAccess.ts
```

**Structure Decision**: Add a small shared configuration file under `src/config/menuAccess.ts` that both `Sidebar.tsx` and `MobileNav.tsx` consume. Add a lightweight route guard wrapper used in `routes.tsx` for the affected route branches. No new backend services or routes are required.

## Complexity Tracking

> No constitution violations identified.

## Research Findings

See [research.md](./research.md) for full details. Key takeaways:

- `Sidebar.tsx` already has stable IDs and Arabic labels for the relevant items.
- `MobileNav.tsx` duplicates the menu and currently has no role filtering.
- `UserProfile` exposes `role?: string | null`, which we will treat as the role slug.
- No route guards currently exist in `routes.tsx`; we will add a client-side guard for the affected routes.

## Design Decisions

1. **Role-menu mapping**: A static, TypeScript-first mapping file (`src/config/menuAccess.ts`) is the source of truth. This keeps the React components declarative and easy to test.
2. **Navigation filtering**: Both `Sidebar.tsx` and `MobileNav.tsx` filter their local `navItems` arrays by calling `getAllowedMenuIds(roleSlug)`. The existing `restricted`/`.env` allow-list remains as an additional filter in `Sidebar.tsx`.
3. **Route guarding**: A `RoleRouteGuard` component reads `useAuth`, computes allowed paths from the mapping, and redirects unauthorized users to `/dashboard/charity-assessment` (the current app-wide fallback route).
4. **Unknown/missing role**: Show no menu items and redirect to the safe fallback. This satisfies the spec's safe-default edge case.
5. **No backend changes required** unless the canonical role slug field is not yet exposed on `UserProfile`.

## Implementation Phases

### Phase 0 — Research

- ✅ Completed. See [research.md](./research.md).

### Phase 1 — Design & Contracts

- ✅ Completed.
  - `data-model.md` defines `MenuItem`, `RoleSlug`, and `RoleMenuMapping`.
  - `contracts/menu-access.ts` provides the canonical mapping and helper functions.
  - `quickstart.md` documents local testing and deployment notes.
  - `AGENTS.md` updated to reference this plan.

### Phase 2 — Tasks

To be generated by `/speckit.tasks`.

## Files to Create or Modify

| File | Action | Reason |
|------|--------|--------|
| `src/config/menuAccess.ts` | Create | Canonical role-to-menu mapping and helper functions |
| `src/app/components/Sidebar.tsx` | Modify | Filter items by role slug |
| `src/app/components/MobileNav.tsx` | Modify | Filter items by role slug |
| `src/app/routes.tsx` | Modify | Add role guards to protected route branches |
| `src/api/services/auth-service.ts` | Modify | Ensure `UserProfile` exposes role slug under a clear field |
| `src/app/layouts/RootLayout.tsx` | Maybe modify | Expose `roleSlug` clearly through `useAuth` if needed |
| Tests | Add | Verify filtering for both roles, unknown role, and route guard |

## Testing Strategy

- **Unit tests**: `getAllowedMenuIds` and `isRouteAllowed` for all role slugs plus unknown/missing values.
- **Component tests**: Render `Sidebar` and `MobileNav` with each role via mocked `useAuth`; assert exact visible labels.
- **Route guard tests**: Simulate direct navigation to disallowed routes for each role and assert redirect.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Backend returns role under a different field name | Update `UserProfile` and auth context to expose `roleSlug`; keep mapping unchanged |
| Existing `.env` restricted-user allow-list conflicts | Keep it as an additional filter, not a replacement |
| Mobile nav and desktop nav drift | Use the same `ROLE_MENU_MAP` and helper for both |
| Direct URL access bypasses menu filter | Add `RoleRouteGuard` to affected route branches |

## Suggested Next Command

`/speckit.tasks` to break the implementation into actionable development tasks.
