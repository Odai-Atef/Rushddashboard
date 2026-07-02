/**
 * Contract: Menu Access Configuration
 *
 * This TypeScript contract defines the canonical mapping between user role slugs
 * and the navigation items they are allowed to see. It is shared by the sidebar,
 * mobile navigation, and route guards.
 */

export type RoleSlug = 'project-managers' | 'entity-managers' | string;

export interface MenuItemDefinition {
  id: string;
  label: string;
  path: string;
}

/**
 * Maps each known role slug to the set of menu item IDs the user may access.
 *
 * Source of truth derived from the feature specification.
 */
export const ROLE_MENU_MAP: Record<string, string[]> = {
  'project-managers': [
    'donors', // قاعدة الجهات المانحة
    'project-management', // إدارة المشاريع
    'donor-matching', // التطابق الذكي مع المانحين
  ],
  'entity-managers': [
    'onboarding', // معلوماتي
    'charity-assessment', // تقييم الجاهزية
    'project-management', // إدارة المشاريع
  ],
};

/**
 * Return the allowed menu item IDs for a given role slug.
 * Unrecognized or missing slugs yield an empty array.
 */
export function getAllowedMenuIds(roleSlug: string | null | undefined): string[] {
  if (!roleSlug) return [];
  return ROLE_MENU_MAP[roleSlug] ?? [];
}

/**
 * Check whether a route path is accessible for a given role slug.
 * The path is normalized to the menu item's declared `path`.
 */
export function isRouteAllowed(
  roleSlug: string | null | undefined,
  path: string,
  menuItems: MenuItemDefinition[]
): boolean {
  const allowedIds = new Set(getAllowedMenuIds(roleSlug));
  const allowedPaths = new Set(
    menuItems.filter((item) => allowedIds.has(item.id)).map((item) => item.path)
  );
  return allowedPaths.has(path);
}
