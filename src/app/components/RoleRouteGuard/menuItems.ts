/**
 * Menu item definitions shared between the sidebar, mobile navigation, and
 * the role-based route guard. Kept in one place so guards and menus stay in sync.
 */

import { MenuItemDefinition } from './index';

export const MENU_ITEMS_FOR_GUARD: MenuItemDefinition[] = [
  { id: 'onboarding', label: 'معلوماتي', path: '/dashboard/onboarding/registration' },
  { id: 'charity-assessment', label: 'تقييم الجاهزية', path: '/dashboard/charity-assessment' },
  { id: 'project-management', label: 'إدارة المشاريع', path: '/dashboard/project-management' },
  { id: 'donors', label: 'قاعدة الجهات المانحة', path: '/dashboard/donors' },
  { id: 'donor-matching', label: 'التطابق الذكي مع المانحين', path: '/dashboard/donor-matching' },
];
