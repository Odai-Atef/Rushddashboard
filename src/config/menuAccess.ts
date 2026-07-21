/**
 * Canonical mapping between user role slugs and the navigation items they may access.
 *
 * Source of truth for sidebar, mobile navigation, and route guards.
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
 * Derived from the feature specification:
 * - project-managers: 'قاعدة الجهات المانحة', 'إدارة المشاريع', 'التطابق الذكي مع المانحين'
 * - entity-managers: 'معلوماتي', 'تقييم الجاهزية', 'إدارة المشاريع'
 */
export const ROLE_MENU_MAP: Record<string, string[]> = {
  'project-managers': [
    'onboarding-assessment',
    'onboarding-preloader',
    'onboarding-results',
    'onboarding-documents',
    'onboarding-thanks',
    'onboarding-analysis',
    'onboarding-roadmap',
    'onboarding-processing',
    'charity-assessment-results',
    'charity-assessment-roadmap',
    'project-management',
    'project-management-dashboard',
    'project-management-list',
    'project-management-create',
    'project-management-edit',
    'project-management-details',
    'project-management-lifecycle',
    'project-management-versions',
    'project-management-activity',
    'project-management-reporting',
    'donors',
    'donor-matching',
    'manage-org',
    'collaboration',
  ],
  'entity-managers': [
    'onboarding',
    'onboarding-assessment',
    'onboarding-preloader',
    'onboarding-results',
    'onboarding-documents',
    'onboarding-thanks',
    'onboarding-analysis',
    'onboarding-roadmap',
    'onboarding-processing',
    'charity-assessment',
    'charity-assessment-results',
    'charity-assessment-roadmap',
    'project-management',
    'project-management-dashboard',
    'project-management-list',
    'project-management-create',
    'project-management-details',
    'project-management-lifecycle',
    'project-management-versions',
    'project-management-activity',
    'project-management-reporting',
    'pricing',
    'organization-donors',
    'collaboration',
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
 *
 * Note: child routes are considered allowed if their parent menu item path is allowed.
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

  // Exact match first
  if (allowedPaths.has(path)) return true;

  // Allow child routes of an allowed parent menu item
  for (const allowedPath of allowedPaths) {
    if (path === allowedPath || path.startsWith(`${allowedPath}/`)) return true;
  }

  return false;
}

/**
 * Filter a list of menu items down to the ones allowed for the role slug.
 */
export function filterMenuItemsByRole<T extends { id: string }>(
  items: T[],
  roleSlug: string | null | undefined
): T[] {
  const allowedIds = new Set(getAllowedMenuIds(roleSlug));
  return items.filter((item) => allowedIds.has(item.id));
}
