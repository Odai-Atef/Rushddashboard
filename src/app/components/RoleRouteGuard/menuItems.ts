/**
 * Menu item definitions shared between the sidebar, mobile navigation, and
 * the role-based route guard. Kept in one place so guards and menus stay in sync.
 */

import { MenuItemDefinition } from './index';

export const MENU_ITEMS_FOR_GUARD: MenuItemDefinition[] = [
  { id: 'onboarding', label: 'معلوماتي', path: '/dashboard/onboarding/registration' },
  { id: 'onboarding-assessment', label: 'تقييم الجاهزية', path: '/dashboard/onboarding/assessment' },
  { id: 'onboarding-preloader', label: 'معالجة التقييم', path: '/dashboard/onboarding/preloader' },
  { id: 'onboarding-results', label: 'نتائج التقييم', path: '/dashboard/onboarding/results' },
  { id: 'onboarding-documents', label: 'رفع المستندات', path: '/dashboard/onboarding/documents' },
  { id: 'onboarding-thanks', label: 'شاشة الشكر', path: '/dashboard/onboarding/thanks' },
  { id: 'onboarding-analysis', label: 'تحليل الفجوات', path: '/dashboard/onboarding/analysis' },
  { id: 'onboarding-roadmap', label: 'خطة التحسين', path: '/dashboard/onboarding/roadmap' },
  { id: 'onboarding-processing', label: 'معالجة البيانات', path: '/dashboard/onboarding/processing' },
  { id: 'charity-assessment', label: 'تقييم الجاهزية', path: '/dashboard/charity-assessment' },
  { id: 'charity-assessment-results', label: 'نتائج تقييم الجاهزية', path: '/dashboard/charity-assessment/results' },
  { id: 'charity-assessment-roadmap', label: 'خطة تحسين الجاهزية', path: '/dashboard/charity-assessment/roadmap' },
  { id: 'project-management', label: 'إدارة المشاريع', path: '/dashboard/project-management' },
  { id: 'donors', label: 'قاعدة الجهات المانحة', path: '/dashboard/donors' },
  { id: 'pricing', label: 'الباقات والأسعار', path: '/dashboard/pricing' },
  { id: 'donor-matching', label: 'التطابق الذكي مع المانحين', path: '/dashboard/donor-matching' },
];
