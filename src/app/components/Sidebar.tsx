/**
 * Sidebar Component — Premium Enterprise Navigation
 *
 * A completely redesigned sidebar that serves as the strongest navigation
 * element in the application. Inspired by Microsoft Fabric, Azure Portal,
 * Atlassian, Stripe, and modern Saudi government platforms.
 *
 * Premium, spacious, professional, executive, modern, and fully integrated
 * with both Light and Dark themes.
 */
import { NavLink, useNavigate } from 'react-router';
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
  LogOut,
  LifeBuoy,
  MapPin,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../layouts/RootLayout';
import { ENV } from '@/lib/env';
import { filterMenuItemsByRole } from '@/config/menuAccess';
import { useTheme } from '../hooks/useTheme';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  linkTo?: string;
  restricted?: boolean;
}

interface SidebarProps {
  activeView: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Tooltip — Simple inline tooltip for collapsed mode                 */
/* ------------------------------------------------------------------ */

function Tooltip({
  children,
  label,
  visible,
}: {
  children: React.ReactNode;
  label: string;
  visible: boolean;
}) {
  return (
    <div className="relative group/tooltip">
      {children}
      <div
        className={cn(
          'absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg z-50 whitespace-nowrap',
          'text-sm font-medium shadow-lg pointer-events-none',
          'transition-all duration-200',
          visible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2 pointer-events-none'
        )}
        style={{
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {label}
        <span
          className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45"
          style={{ background: 'var(--card)' }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation Groups Logic                                            */
/* ------------------------------------------------------------------ */

interface NavGroup {
  label?: string;
  items: NavItem[];
}

function buildNavGroups(items: NavItem[], roleSlug: string | null): NavGroup[] {
  // For project-managers, simplified nav
  if (roleSlug === 'project-managers') {
    return [
      {
        items: items.filter(
          (i) =>
            i.id === 'project-management-dashboard' ||
            i.id === 'collaboration'
        ),
      },
      {
        label: 'أدوات',
        items: items.filter(
          (i) =>
            i.id !== 'project-management-dashboard' &&
            i.id !== 'collaboration'
        ),
      },
    ];
  }

  // Group items by logical sections
  const overviewItems = items.filter(
    (i) =>
      i.id === 'executive' ||
      i.id === 'incubator-overview' ||
      i.id === 'onboarding'
  );

  const analysisItems = items.filter(
    (i) =>
      i.id === 'ai-analysis' ||
      i.id === 'ai-innovation' ||
      i.id === 'analysis-history'
  );

  const projectItems = items.filter(
    (i) =>
      i.id === 'project-management' ||
      i.id === 'project-journey' ||
      i.id === 'collaboration'
  );

  const assessmentItems = items.filter(
    (i) =>
      i.id === 'charity-assessment' ||
      i.id === 'charity-assessment-results'
  );

  const analyticsItems = items.filter(
    (i) =>
      i.id === 'charity-analytics' ||
      i.id === 'project-analytics' ||
      i.id === 'funding-analytics' ||
      i.id === 'operations-analytics'
  );

  const donorItems = items.filter(
    (i) =>
      i.id === 'donors' ||
      i.id === 'organization-donors'
  );

  const managementItems = items.filter(
    (i) =>
      i.id === 'manage-org' ||
      i.id === 'manage-subscriptions' ||
      i.id === 'manage-coupons'
  );

  const businessItems = items.filter(
    (i) =>
      i.id === 'sales' ||
      i.id === 'customers' ||
      i.id === 'profitability' ||
      i.id === 'inventory' ||
      i.id === 'operations' ||
      i.id === 'hr' ||
      i.id === 'marketing'
  );

  const insightItems = items.filter(
    (i) =>
      i.id === 'recommendations' ||
      i.id === 'opportunities'
  );

  const systemItems = items.filter(
    (i) =>
      i.id === 'notifications' ||
      i.id === 'data-sources' ||
      i.id === 'compliance-risk'
  );

  const otherItems = items.filter(
    (i) =>
      ![
        ...overviewItems,
        ...analysisItems,
        ...projectItems,
        ...assessmentItems,
        ...analyticsItems,
        ...donorItems,
        ...managementItems,
        ...businessItems,
        ...insightItems,
        ...systemItems,
      ].some((si) => si.id === i.id) &&
      i.id !== 'settings' &&
      i.id !== 'pricing'
  );

  const groups: NavGroup[] = [];

  if (overviewItems.length > 0) groups.push({ label: 'نظرة عامة', items: overviewItems });
  if (projectItems.length > 0) groups.push({ label: 'المشاريع', items: projectItems });
  if (assessmentItems.length > 0) groups.push({ label: 'التقييم', items: assessmentItems });
  if (donorItems.length > 0) groups.push({ label: 'الجهات المانحة', items: donorItems });
  if (analyticsItems.length > 0) groups.push({ label: 'التحليلات', items: analyticsItems });
  if (analysisItems.length > 0) groups.push({ label: 'الذكاء الاصطناعي', items: analysisItems });
  if (businessItems.length > 0) groups.push({ label: 'الأعمال', items: businessItems });
  if (insightItems.length > 0) groups.push({ label: 'الرؤى', items: insightItems });
  if (managementItems.length > 0) groups.push({ label: 'الإدارة', items: managementItems });
  if (systemItems.length > 0) groups.push({ label: 'النظام', items: systemItems });
  if (otherItems.length > 0) groups.push({ items: otherItems });

  return groups;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function Sidebar({ activeView, className }: SidebarProps) {
  const { user, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const allowedUserIds = ENV.RESTRICTED_MENU_USER_IDS;
  const currentUserId = user?.id;
  const canSeeRestricted = Boolean(currentUserId && allowedUserIds.includes(currentUserId));
  const roleSlug = user?.roleSlug ?? null;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isDark = resolvedTheme === 'dark';

  /* --- Menu Items (identical to original logic) ------------------- */
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

    const navItems: NavItem[] =
      roleSlug === 'project-managers'
        ? [
            { id: 'project-management-dashboard', label: 'إدارة المشاريع', icon: Briefcase, path: '/dashboard/project-management' },
            { id: 'impact-map', label: 'خارطة الأثر', icon: MapPin, path: '/dashboard/impact-map' },
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

  const groups = useMemo(() => buildNavGroups(visibleItems, roleSlug), [visibleItems, roleSlug]);

  /* --- Sidebar width ----------------------------------------------- */
  const sidebarWidth = isCollapsed ? 'w-[88px]' : 'w-[288px]';

  /* --- Handlers --------------------------------------------------- */
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <aside
      className={cn(
        'flex-col hidden lg:flex relative z-30',
        'transition-all duration-[200ms] ease-in-out',
        sidebarWidth,
        className
      )}
      style={{
        background: 'var(--sidebar)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* ── Logo Section ───────────────────────────────────────── */}
      <div
        className="flex-shrink-0"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div
          className={cn(
            'flex items-center gap-0 relative',
            isCollapsed ? 'justify-center px-4 py-6' : 'px-8 py-8'
          )}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'absolute transition-all duration-200 ease-out',
              'flex items-center justify-center rounded-lg',
              'w-7 h-7',
              isCollapsed
                ? 'top-2 left-1/2 -translate-x-1/2'
                : 'top-6 left-4',
              'text-[var(--sidebar-foreground)]/60 hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)]/50 focus:ring-offset-0'
            )}
            aria-label={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            <Menu
              className={cn(
                'w-4 h-4 transition-transform duration-300',
                isCollapsed ? 'rotate-180' : ''
              )}
            />
          </button>

          {/* Logo + Text */}
          <div
            className={cn(
              'flex flex-col items-center gap-0 transition-all duration-300',
              isCollapsed && 'mt-6'
            )}
          >
            <img
              src="/logo.png"
              alt="منصة رشد"
              className={cn(
                'object-contain transition-all duration-300 drop-shadow-lg',
                isCollapsed ? 'w-10 h-10' : 'w-14 h-14'
              )}
            />
            {!isCollapsed && (
              <div className="flex flex-col items-center gap-0.5 mt-2">
                <h1
                  className="font-bold tracking-wide leading-tight text-[var(--sidebar-foreground)]"
                  style={{ fontSize: '20px', fontWeight: 700 }}
                >
                  منصة رشد
                </h1>
                <p
                  className="leading-tight text-[var(--sidebar-foreground)]/60"
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                  }}
                >
                  Rushd Virtual Incubator
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation Groups ──────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2" aria-label="التنقل الرئيسي">
        <div
          className={cn(
            'flex flex-col',
            isCollapsed ? 'px-[18px] gap-3' : 'px-5 gap-6'
          )}
        >
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-2">
              {/* Section Label */}
              {group.label && !isCollapsed && (
                <div className="flex items-center gap-2 px-[18px] mb-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'var(--sidebar-primary)',
                      opacity: 0.7,
                    }}
                  />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sidebar-foreground)]/50"
                    style={{
                      letterSpacing: '0.05em',
                    }}
                  >
                    {group.label}
                  </span>
                </div>
              )}

              {/* Items */}
              <ul className="flex flex-col" style={{ gap: '6px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  const isItemHovered = hoveredItem === item.id;

                  const navContent = (
                    <NavLink
                      to={item.linkTo ?? item.path}
                      title={isCollapsed ? item.label : undefined}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        'group relative flex items-center transition-all duration-200 ease-out',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)]/40 focus:ring-offset-0',
                        isCollapsed ? 'justify-center px-0' : 'gap-[14px] px-[18px]',
                        isCollapsed ? 'w-[52px] h-[52px] mx-auto' : 'w-full'
                      )}
                      style={{
                        height: '52px',
                        borderRadius: '14px',
                        ...(isActive
                          ? {
                              background: 'var(--sidebar-primary)',
                              color: 'var(--sidebar-primary-foreground)',
                              fontWeight: 600,
                              boxShadow: 'var(--shadow-md)',
                            }
                          : {
                              color: isItemHovered
                                ? 'var(--sidebar-foreground)'
                                : 'var(--sidebar-foreground)',
                              fontWeight: 500,
                              ...(isItemHovered
                                ? {
                                    background: 'var(--sidebar-accent)',
                                  }
                                : {}),
                            }),
                      }}
                    >
                      {/* Icon */}
                      <span
                        className={cn(
                          'flex items-center justify-center flex-shrink-0',
                          isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
                        )}
                      >
                        <Icon
                          className={cn(
                            'transition-all duration-200',
                            isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'
                          )}
                          style={{
                            color: isActive
                              ? 'var(--sidebar-primary-foreground)'
                              : isItemHovered
                                ? 'var(--sidebar-foreground)'
                                : 'var(--sidebar-foreground)',
                            filter:
                              isActive && isDark
                                ? 'drop-shadow(0 0 4px rgba(255,255,255,0.4))'
                                : undefined,
                          }}
                          aria-hidden="true"
                        />
                      </span>

                      {/* Label */}
                      {!isCollapsed && (
                        <span
                          className="whitespace-nowrap overflow-hidden text-ellipsis leading-tight"
                          style={{
                            fontSize: '16px',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive
                              ? 'var(--sidebar-primary-foreground)'
                              : isItemHovered
                                ? 'var(--sidebar-foreground)'
                                : 'var(--sidebar-foreground)',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  );

                  if (isCollapsed) {
                    return (
                      <li key={item.id}>
                        <Tooltip label={item.label} visible={isItemHovered}>
                          {navContent}
                        </Tooltip>
                      </li>
                    );
                  }

                  return <li key={item.id}>{navContent}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0"
        style={{ borderTop: '1px solid var(--sidebar-border)' }}
      >
        <div
          className={cn(
            'flex flex-col',
            isCollapsed ? 'px-[18px] py-4' : 'px-6 py-5'
          )}
        >
          {/* Divider */}
          <div
            className="w-full mb-4"
            style={{
              height: '1px',
              background: 'var(--sidebar-border)',
            }}
          />

          {/* Footer items */}
          <div className={cn('flex flex-col', isCollapsed ? 'gap-2' : 'gap-1')}>
            {/* Support */}
            {(() => {
              const isHovered = hoveredItem === 'footer-support';
              const btn = (
                <button
                  onMouseEnter={() => setHoveredItem('footer-support')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'group flex items-center transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)]/40 focus:ring-offset-0',
                    isCollapsed
                      ? 'justify-center w-[52px] h-[52px] mx-auto'
                      : 'gap-[14px] px-[18px] w-full'
                  )}
                  style={{
                    height: '48px',
                    borderRadius: '14px',
                    color: isHovered
                      ? 'var(--sidebar-foreground)'
                      : 'var(--sidebar-foreground)',
                    background: isHovered
                      ? 'var(--sidebar-accent)'
                      : 'transparent',
                  }}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center flex-shrink-0',
                      isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
                    )}
                  >
                    <LifeBuoy
                      className={cn(
                        'transition-all duration-200',
                        isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'
                      )}
                      style={{ color: isHovered ? 'var(--sidebar-foreground)' : 'var(--sidebar-foreground)' }}
                    />
                  </span>
                  {!isCollapsed && (
                    <span
                      className="whitespace-nowrap text-sm font-medium text-[var(--sidebar-foreground)]"
                    >
                      الدعم
                    </span>
                  )}
                </button>
              );
              if (isCollapsed) {
                return (
                  <Tooltip key="support" label="الدعم" visible={isHovered}>
                    {btn}
                  </Tooltip>
                );
              }
              return btn;
            })()}

            {/* Settings */}
            {(() => {
              const isHovered = hoveredItem === 'footer-settings';
              const btn = (
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  onMouseEnter={() => setHoveredItem('footer-settings')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'group flex items-center transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)]/40 focus:ring-offset-0',
                    isCollapsed
                      ? 'justify-center w-[52px] h-[52px] mx-auto'
                      : 'gap-[14px] px-[18px] w-full'
                  )}
                  style={{
                    height: '48px',
                    borderRadius: '14px',
                    color: isHovered
                      ? 'var(--sidebar-foreground)'
                      : 'var(--sidebar-foreground)',
                    background: isHovered
                      ? 'var(--sidebar-accent)'
                      : 'transparent',
                  }}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center flex-shrink-0',
                      isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
                    )}
                  >
                    <Settings
                      className={cn(
                        'transition-all duration-200',
                        isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'
                      )}
                      style={{ color: isHovered ? 'var(--sidebar-foreground)' : 'var(--sidebar-foreground)' }}
                    />
                  </span>
                  {!isCollapsed && (
                    <span
                      className="whitespace-nowrap text-sm font-medium text-[var(--sidebar-foreground)]"
                    >
                      الإعدادات
                    </span>
                  )}
                </button>
              );
              if (isCollapsed) {
                return (
                  <Tooltip key="settings" label="الإعدادات" visible={isHovered}>
                    {btn}
                  </Tooltip>
                );
              }
              return btn;
            })()}

            {/* Logout */}
            {(() => {
              const isHovered = hoveredItem === 'footer-logout';
              const btn = (
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => setHoveredItem('footer-logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'group flex items-center transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--destructive)]/40 focus:ring-offset-0',
                    isCollapsed
                      ? 'justify-center w-[52px] h-[52px] mx-auto'
                      : 'gap-[14px] px-[18px] w-full'
                  )}
                  style={{
                    height: '48px',
                    borderRadius: '14px',
                    color: isHovered
                      ? 'var(--destructive)'
                      : 'var(--sidebar-foreground)',
                    background: isHovered
                      ? 'var(--destructive)'
                      : 'transparent',
                    opacity: isHovered ? 1 : 0.7,
                  }}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center flex-shrink-0',
                      isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
                    )}
                  >
                    <LogOut
                      className={cn(
                        'transition-all duration-200',
                        isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'
                      )}
                      style={{ color: isHovered ? 'var(--destructive)' : 'var(--sidebar-foreground)' }}
                    />
                  </span>
                  {!isCollapsed && (
                    <span
                      className="whitespace-nowrap text-sm font-medium"
                      style={{ color: isHovered ? 'var(--destructive)' : 'var(--sidebar-foreground)' }}
                    >
                      تسجيل الخروج
                    </span>
                  )}
                </button>
              );
              if (isCollapsed) {
                return (
                  <Tooltip key="logout" label="تسجيل الخروج" visible={isHovered}>
                    {btn}
                  </Tooltip>
                );
              }
              return btn;
            })()}
          </div>

          {/* Vision 2030 branding */}
          {!isCollapsed && (
            <div
              className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: 'var(--sidebar-accent)' }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-[10px] font-medium text-[var(--sidebar-foreground)]/50"
                >
                  ضمن مبادرات
                </span>
                <span
                  className="text-[11px] font-bold text-[var(--sidebar-primary)]"
                >
                  رؤية السعودية 2030
                </span>
              </div>
            </div>
          )}

          {/* Collapsed branding dot */}
          {isCollapsed && (
            <div className="mt-3 flex justify-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'var(--sidebar-primary)',
                  color: 'var(--sidebar-primary-foreground)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                ر
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
