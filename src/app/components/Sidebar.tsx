import { NavLink } from 'react-router';
import { useState, useMemo } from 'react';
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
  Activity,
  Ticket,
  CreditCard,
  Menu,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../layouts/RootLayout';
import { ENV } from '@/lib/env';
import { filterMenuItemsByRole } from '@/config/menuAccess';
import { useTheme } from '../hooks/useTheme';

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
  const { resolvedTheme } = useTheme();
  const allowedUserIds = ENV.RESTRICTED_MENU_USER_IDS;
  const currentUserId = user?.id;
  const canSeeRestricted = Boolean(currentUserId && allowedUserIds.includes(currentUserId));
  const roleSlug = user?.roleSlug ?? null;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const visibleItems = useMemo(() => {
    const commonNavItems: NavItem[] = [
      { id: 'charity-assessment', label: 'تقييم الجاهزية', icon: ClipboardCheck, path: '/dashboard/charity-assessment', restricted: false },
      { id: 'charity-assessment-results', label: 'نتائج تقييم الجاهزية', icon: BarChart3, path: '/dashboard/charity-assessment/results' },
      { id: 'project-management', label: 'إدارة المشاريع', icon: Briefcase, path: '/dashboard/project-management/list' },
      { id: 'donors', label: 'قاعدة الجهات المانحة', icon: HeartHandshake, path: '/dashboard/donors', restricted: false },
      { id: 'organization-donors', label: 'الجهات المانحة', icon: Building2, path: '/dashboard/organization-donors', restricted: false },
      { id: 'pricing', label: 'الباقات والأسعار', icon: Package, path: '/dashboard/pricing', restricted: false },
      { id: 'executive', label: 'لوحة القيادة التنفيذية', icon: LayoutDashboard, path: '/dashboard', restricted: true },
      { id: 'incubator-overview', label: 'نظرة شاملة للحاضنة', icon: BarChart3, path: '/dashboard/incubator-overview', restricted: true },
      { id: 'charity-analytics', label: 'تحليلات الجمعيات', icon: Building2, path: '/dashboard/charity-analytics', restricted: true },
      { id: 'project-analytics', label: 'تحليلات المشاريع', icon: FolderKanban, path: '/dashboard/project-analytics', restricted: true },
      { id: 'funding-analytics', label: 'تحليلات التمويل والمانحين', icon: DollarSign, path: '/dashboard/funding-analytics', restricted: true },
      { id: 'operations-analytics', label: 'تحليلات التشغيل والأداء', icon: Activity, path: '/dashboard/operations-analytics', restricted: true },
      { id: 'manage-org', label: 'إدارة تفعيل الجهات', icon: Users, path: '/dashboard/manage/org', restricted: false },
      { id: 'manage-subscriptions', label: 'إدارة الاشتراكات', icon: CreditCard, path: '/dashboard/manage/subscriptions', restricted: false },
      { id: 'manage-coupons', label: 'إدارة الكوبونات', icon: Ticket, path: '/dashboard/manage/coupons', restricted: false },
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
    return roleAllowedItems.filter((item) => !item.restricted || canSeeRestricted);
  }, [roleSlug, canSeeRestricted]);

  const isDark = resolvedTheme === 'dark';

  return (
    <aside className={cn(
      "flex-col hidden lg:flex transition-all duration-300 relative",
      // Light mode: dark navy background, dark mode: deep navy
      "bg-[#1a2744] dark:bg-[#0f172a]",
      // Border
      "border-l border-white/10 dark:border-white/5",
      // Glass effect in dark mode
      isDark && "backdrop-blur-md bg-opacity-95",
      isCollapsed ? "w-[80px]" : "w-[280px]",
      className
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10 dark:border-white/10 text-center relative">
        <img
          src="/logo.png"
          alt="منصة رشد"
          className={cn(
            "object-contain mx-auto transition-all duration-300 drop-shadow-lg",
            isCollapsed ? "w-[48px] h-[48px]" : "w-[80px] h-[80px]"
          )}
        />
        {!isCollapsed && (
          <p className="text-white/70 text-sm mt-2 font-medium tracking-wide">منصة رشد</p>
        )}
        {/* Collapse toggle for desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200",
            "text-white/50 hover:text-white hover:bg-white/10",
            "focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-0"
          )}
          aria-label={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
        >
          <Menu className={cn("w-4 h-4 transition-transform duration-300", isCollapsed ? "rotate-180" : "")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto" aria-label="التنقل الرئيسي">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.linkTo ?? item.path}
                  title={item.label}
                  className={cn(
                    "group w-full flex items-center gap-3 rounded-xl transition-all duration-200",
                    "text-right focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-0",
                    isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3",
                    isActive
                      ? [
                          // Active state — green background, white text
                          "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
                          "dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-500",
                          "dark:shadow-emerald-500/20",
                        ]
                      : [
                          // Inactive — white text with subtle hover
                          "text-white/80 hover:text-white hover:bg-white/10",
                        ]
                  )}
                >
                  <span className={cn(
                    "flex items-center justify-center flex-shrink-0",
                    isCollapsed ? "w-6 h-6" : "w-5 h-5"
                  )}>
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive && isDark && "drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]",
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 dark:border-white/10">
        {!isCollapsed ? (
          <p className="text-white/40 text-xs text-center">
            © 2026 منصة رشد
          </p>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] text-white/60 font-medium">
              ر
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
