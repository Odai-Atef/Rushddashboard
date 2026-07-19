import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Cog,
  UserCog,
  Package,
  FileCheck,
  Lightbulb,
  Sparkles,
  DollarSign,
  Warehouse,
  Settings,
  Bell,
  Database,
  ShieldAlert,
  History,
  Briefcase,
  ClipboardCheck,
  UserPlus,
  Brain,
  MessageSquare,
  HeartHandshake,
  BarChart3,
  Building2,
  FolderKanban,
  Activity
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../layouts/RootLayout';
import { ENV } from '@/lib/env';
import { filterMenuItemsByRole } from '@/config/menuAccess';

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  /** Optional distinct navigation target (e.g. with query params) for NavLink `to`. */
  linkTo?: string;
  /** Set to true to only render this item for users listed in VITE_RESTRICTED_MENU_USER_IDS. */
  restricted?: boolean;
}

interface SidebarProps {
  activeView: string;
  className?: string;
}

export function Sidebar({ activeView, className }: SidebarProps) {
  const { user } = useAuth();
  const allowedUserIds = ENV.RESTRICTED_MENU_USER_IDS;
  const currentUserId = user?.id;
  const canSeeRestricted = Boolean(currentUserId && allowedUserIds.includes(currentUserId));
  const roleSlug = user?.roleSlug ?? null;

  const commonNavItems: NavItem[] = [
    { id: 'charity-assessment', label: 'تقييم الجاهزية', icon: ClipboardCheck, path: '/dashboard/charity-assessment', restricted: false },
    { id: 'project-management', label: 'إدارة المشاريع', icon: Briefcase, path: '/dashboard/project-management/list' },
    { id: 'donors', label: 'قاعدة الجهات المانحة', icon: HeartHandshake, path: '/dashboard/donors', restricted: false },
    { id: 'pricing', label: 'الباقات والأسعار', icon: Package, path: '/dashboard/pricing', restricted: false },

    { id: 'executive', label: 'لوحة القيادة التنفيذية', icon: LayoutDashboard, path: '/dashboard', restricted: true },
    { id: 'incubator-overview', label: 'نظرة شاملة للحاضنة', icon: BarChart3, path: '/dashboard/incubator-overview', restricted: true },
    { id: 'charity-analytics', label: 'تحليلات الجمعيات', icon: Building2, path: '/dashboard/charity-analytics', restricted: true },
    { id: 'project-analytics', label: 'تحليلات المشاريع', icon: FolderKanban, path: '/dashboard/project-analytics', restricted: true },
    { id: 'funding-analytics', label: 'تحليلات التمويل والمانحين', icon: DollarSign, path: '/dashboard/funding-analytics', restricted: true },
    { id: 'operations-analytics', label: 'تحليلات التشغيل والأداء', icon: Activity, path: '/dashboard/operations-analytics', restricted: true },
    { id: 'manage-org', label: 'إدارة تفعيل الجهات', icon: Users, path: '/dashboard/manage/org', restricted: false },
    { id: 'ai-analysis', label: 'المحلل التنفيذي الذكي', icon: Sparkles, path: '/dashboard/ai-analysis', restricted: false },
    { id: 'ai-innovation', label: 'استوديو المشاريع الذكي', icon: Brain, path: '/dashboard/ai-innovation', restricted: true },
    { id: 'analysis-history', label: 'التحليلات السابقة', icon: History, path: '/dashboard/analysis-history', restricted: true },
    { id: 'project-journey', label: 'رحلة المشروع', icon: Briefcase, path: '/dashboard/project-journey', restricted: true },
    { id: 'notifications', label: 'الإشعارات والتنبيهات', icon: Bell, path: '/dashboard/notifications', restricted: true },
    { id: 'data-sources', label: 'مصادر البيانات', icon: Database, path: '/dashboard/data-sources', restricted: true },
    { id: 'compliance-risk', label: 'الامتثال والمخاطر', icon: ShieldAlert, path: '/dashboard/compliance-risk', restricted: true },
    { id: 'sales', label: 'لوحة المبيعات', icon: TrendingUp, path: '/dashboard/sales', restricted: true },
    { id: 'customers', label: 'لوحة العملاء', icon: Users, path: '/dashboard/customers', restricted: true },
    { id: 'profitability', label: 'لوحة الربحية', icon: DollarSign, path: '/dashboard/profitability', restricted: true },
    { id: 'inventory', label: 'لوحة المخزون', icon: Warehouse, path: '/dashboard/inventory', restricted: true },
    { id: 'operations', label: 'لوحة التشغيل', icon: Cog, path: '/dashboard/operations', restricted: true },
    { id: 'hr', label: 'لوحة الموارد البشرية', icon: UserCog, path: '/dashboard/hr', restricted: true },
    { id: 'marketing', label: 'لوحة التسويق', icon: TrendingUp, path: '/dashboard/marketing', restricted: true },
    { id: 'recommendations', label: 'لوحة التوصيات', icon: Lightbulb, path: '/dashboard/recommendations', restricted: true },
    { id: 'opportunities', label: 'لوحة الفرص', icon: FileCheck, path: '/dashboard/opportunities', restricted: true },
    { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/dashboard/settings', restricted: true },
  ];

  const navItems: NavItem[] = roleSlug === 'project-managers'
    ? [
        { id: 'project-management-dashboard', label: 'إدارة المشاريع', icon: Briefcase, path: '/dashboard/project-management' },
        { id: 'collaboration', label: 'التعاون والتواصل', icon: MessageSquare, path: '/dashboard/collaboration' },
        ...commonNavItems.filter((item) => item.id !== 'project-management'),
      ]
    : [
        { id: 'onboarding', label: 'معلوماتي', icon: UserPlus, path: '/dashboard/onboarding/info', linkTo: '/dashboard/onboarding/info?tab=info' },
        { id: 'collaboration', label: 'التعاون والتواصل', icon: MessageSquare, path: '/dashboard/collaboration' },
        ...commonNavItems,
      ];

  const roleAllowedItems = filterMenuItemsByRole(navItems, roleSlug);
  const visibleItems = roleAllowedItems.filter((item) => !item.restricted || canSeeRestricted);

  return (
    <aside className={cn("bg-sidebar border-l border-sidebar-border flex flex-col", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border text-center">
        <img
          src="/logo.png"
          alt="منصة رشد"
          className="w-[80px] h-[80px] object-contain mx-auto mb-2"
        />
        <p className="text-muted-foreground text-sm">منصة رشد</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.linkTo ?? item.path}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-muted-foreground text-xs text-center">
          © 2026 منصة رشد
        </p>
      </div>
    </aside>
  );
}
