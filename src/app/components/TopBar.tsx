/**
 * TopBar Component — Premium Enterprise Dashboard
 *
 * Completely redesigned header that serves as one of the strongest
 * visual elements of the application. Premium, spacious, professional,
 * executive, modern, and minimal.
 */
import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Bell,
  Menu,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
  ExternalLink,
  Sun,
  Moon,
  Monitor,
  MessageSquare,
  Download,
  ChevronDown,
  X,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../layouts/RootLayout';
import { useNotifications } from '@/api/hooks/useNotifications';
import { useNotificationToast } from '@/api/hooks/useNotificationToast';
import { useNotificationRealtime } from '@/api/hooks/useNotificationRealtime';
import { useTheme } from '../hooks/useTheme';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import type { Notification } from '@/api/services/notification-service';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface TopBarProps {
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  onMenuClick: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(fullName: string | null | undefined): string {
  const name = fullName ?? '';
  if (!name) return '؟';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '؟';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '');
}

function displayName(user: { fullName?: string | null; email?: string | null } | null | undefined): string {
  return user?.fullName ?? user?.email ?? 'المستخدم';
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case 'URGENT':
    case 'HIGH':
      return AlertTriangle;
    case 'MEDIUM':
      return Info;
    case 'LOW':
    default:
      return CheckCircle;
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'URGENT':
      return '#DC2626';
    case 'HIGH':
      return '#EA580C';
    case 'MEDIUM':
      return '#CA8A04';
    case 'LOW':
    default:
      return '#2563EB';
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return date.toLocaleDateString('ar-SA');
}

/* ------------------------------------------------------------------ */
/* Theme-cycle helper                                                 */
/* ------------------------------------------------------------------ */

type ThemeMode = 'light' | 'dark' | 'system';
const themeCycle: ThemeMode[] = ['light', 'dark', 'system'];

function nextTheme(current: ThemeMode): ThemeMode {
  const idx = themeCycle.indexOf(current);
  return themeCycle[(idx + 1) % themeCycle.length];
}

function themeIcon(mode: ThemeMode) {
  switch (mode) {
    case 'light':
      return Sun;
    case 'dark':
      return Moon;
    case 'system':
      return Monitor;
  }
}

function themeLabel(mode: ThemeMode): string {
  switch (mode) {
    case 'light':
      return 'الوضع الفاتح';
    case 'dark':
      return 'وضع مظلم';
    case 'system':
      return 'وضع النظام';
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function TopBar({
  theme: _theme,
  onThemeToggle,
  onMenuClick,
  className,
}: TopBarProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const roleSlug = user?.roleSlug ?? null;
  const isProjectManager = roleSlug === 'project-managers';
  const isDark = resolvedTheme === 'dark';

  /* --- Notifications ----------------------------------------------- */
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
  } = useNotifications();

  const { showNotificationToast } = useNotificationToast();

  const handleRealtimeNotification = useCallback(
    (notification: Notification) => {
      showNotificationToast(notification);
      fetchUnreadCount();
      fetchNotifications({ page: 1 });
    },
    [showNotificationToast, fetchUnreadCount, fetchNotifications]
  );

  const { connect, disconnect } = useNotificationRealtime(handleRealtimeNotification);

  useEffect(() => {
    if (user?.id) {
      connect(user.id);
    }
    return () => disconnect();
  }, [user?.id, connect, disconnect]);

  /* --- Search ------------------------------------------------------ */
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* --- Derived ----------------------------------------------------- */
  const recentNotifications = notifications.slice(0, 5);
  const ThemeIcon = themeIcon(theme);

  /* --- Handlers ---------------------------------------------------- */
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status !== 'READ') {
      await markAsRead(notification.id);
    }
    navigate('/dashboard/notifications');
  };

  const handleThemeToggle = () => {
    const next = nextTheme(theme);
    setTheme(next);
  };

  /* ================================================================ */
  /*  ICON BUTTON — Reusable action button                             */
  /* ================================================================ */
  const IconButton = ({
    children,
    onClick,
    label,
    badge,
    hiddenOn,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    label: string;
    badge?: number;
    hiddenOn?: 'sm' | 'md';
  }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'relative flex items-center justify-center',
        'w-10 h-10 rounded-xl',
        'transition-all duration-200 ease-out',
        isDark
          ? 'text-[#D8E4F0] hover:text-white hover:bg-white/[0.08]'
          : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9]',
        hiddenOn === 'sm' && 'hidden sm:flex',
        hiddenOn === 'md' && 'hidden md:flex'
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            'absolute -top-0.5 -right-0.5',
            'min-w-[18px] h-[18px] px-1',
            'flex items-center justify-center',
            'rounded-full text-[10px] font-bold text-white',
            'bg-emerald-500 shadow-sm'
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );

  /* ================================================================ */
  /*  MOBILE HEADER — Dedicated mobile-only header                    */
  /* ================================================================ */
  const MobileHeader = () => (
    <div className="lg:hidden flex items-center justify-between w-full h-[60px] px-4">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-xl',
            'transition-all duration-200',
            isDark
              ? 'text-[#D8E4F0] hover:text-white hover:bg-white/[0.08]'
              : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
          )}
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="منصة رشد"
            className={cn(
              'w-8 h-8 object-contain',
              isDark ? 'brightness-125' : ''
            )}
          />
          <div className="leading-tight">
            <p className="font-semibold text-sm tracking-tight text-[#1E293B] dark:text-white">
              Rushd
            </p>
          </div>
        </div>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-1">
        {/* Mobile search icon */}
        {!searchOpen ? (
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl',
              'transition-all duration-200',
              isDark
                ? 'text-[#D8E4F0] hover:text-white hover:bg-white/[0.08]'
                : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
            )}
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative flex-1 max-w-[200px]">
            <Search
              className={cn(
                'absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none',
                isDark ? 'text-[#7C95AA]' : 'text-[#94A3B8]'
              )}
            />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث..."
              className={cn(
                'w-full h-9 rounded-lg pr-9 pl-8 text-sm',
                'focus:outline-none focus:ring-2',
                isDark
                  ? 'bg-[#102942] border border-white/[0.08] text-white placeholder:text-[#7C95AA] focus:ring-[#3B82F6]/40'
                  : 'bg-white border border-[#E2E8F0] text-[#1E293B] placeholder:text-[#94A3B8] focus:ring-[#2563EB]/30'
              )}
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2',
                isDark ? 'text-[#7C95AA] hover:text-white' : 'text-[#94A3B8] hover:text-[#1E293B]'
              )}
              aria-label="إغلاق البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-xl',
                'transition-all duration-200',
                isDark
                  ? 'text-[#D8E4F0] hover:text-white hover:bg-white/[0.08]'
                  : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              )}
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-emerald-500 shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-2xl shadow-xl p-2 w-80 z-50 overflow-hidden',
                isDark
                  ? 'bg-[rgba(8,26,46,0.94)] backdrop-blur-[20px] border-white/[0.08]'
                  : 'bg-white border-[#E2E8F0]'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* Header */}
              <div
                className={cn(
                  'px-3 py-3 flex items-center justify-between',
                  isDark ? 'border-b border-white/[0.08]' : 'border-b border-[#E2E8F0]'
                )}
              >
                <h3 className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-[#1E293B]')}>
                  الإشعارات
                </h3>
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {unreadCount} غير مقروء
                  </span>
                )}
              </div>

              {/* List */}
              <div className="py-1 max-h-[320px] overflow-y-auto">
                {loading && recentNotifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className={cn('w-5 h-5 animate-spin', isDark ? 'text-[#B7C7D8]/40' : 'text-[#94A3B8]')} />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell className={cn('w-8 h-8 mx-auto mb-2 opacity-40', isDark ? 'text-[#B7C7D8]' : 'text-[#94A3B8]')} />
                    <p className={cn('text-sm', isDark ? 'text-[#B7C7D8]/50' : 'text-[#94A3B8]')}>لا توجد إشعارات</p>
                  </div>
                ) : (
                  recentNotifications.map((notification) => {
                    const Icon = getPriorityIcon(notification.priority);
                    const color = getPriorityColor(notification.priority);
                    const isUnread = notification.status !== 'READ';

                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          'px-3 py-3 rounded-xl cursor-pointer transition-colors duration-200',
                          isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#F1F5F9]',
                          isUnread && (isDark ? 'bg-white/[0.03]' : 'bg-emerald-50/50')
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: color + '15' }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={cn('font-medium text-sm truncate', isUnread ? 'text-[#1E293B] dark:text-white' : 'text-[#64748B] dark:text-[#B7C7D8]/60')}>
                                {notification.title}
                              </p>
                              {isUnread && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                            </div>
                            <p className={cn('text-xs line-clamp-2 mb-1', isDark ? 'text-[#B7C7D8]/60' : 'text-[#64748B]')}>
                              {notification.body}
                            </p>
                            <span className={cn('text-xs', isDark ? 'text-[#7C95AA]' : 'text-[#94A3B8]')}>
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {recentNotifications.length > 0 && (
                <div className={cn('p-2', isDark ? 'border-t border-white/[0.08]' : 'border-t border-[#E2E8F0]')}>
                  <button
                    onClick={() => navigate('/dashboard/notifications')}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm rounded-xl transition-colors duration-200',
                      isDark ? 'text-[#3B82F6] hover:bg-white/[0.08]' : 'text-[#2563EB] hover:bg-[#F1F5F9]'
                    )}
                  >
                    عرض الكل
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* User Profile */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 p-1 pr-2 rounded-xl transition-all duration-200',
                isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#F1F5F9]'
              )}
            >
              <Avatar.Root
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                  'bg-gradient-to-br from-emerald-500 to-blue-500 text-white'
                )}
              >
                <Avatar.Fallback className="text-xs">
                  {getInitials(user?.fullName ?? '')}
                </Avatar.Fallback>
              </Avatar.Root>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-2xl shadow-xl p-2 w-56 z-50',
                isDark
                  ? 'bg-[rgba(8,26,46,0.94)] backdrop-blur-[20px] border-white/[0.08]'
                  : 'bg-white border-[#E2E8F0]'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* User info */}
              <div className={cn('px-3 py-2 mb-2', isDark ? 'border-b border-white/[0.08]' : 'border-b border-[#E2E8F0]')}>
                <p className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-[#1E293B]')}>
                  {displayName(user)}
                </p>
                <p className="text-xs truncate text-[#64748B] dark:text-[#7C95AA]">
                  {user?.email ?? ''}
                </p>
              </div>

              {/* Profile link */}
              {!isProjectManager && (
                <DropdownMenu.Item
                  className={cn(
                    'px-3 py-2.5 rounded-xl cursor-pointer outline-none transition-colors duration-200 text-sm',
                    isDark ? 'hover:bg-white/[0.08] text-[#B7C7D8]' : 'hover:bg-[#F1F5F9] text-[#1E293B]'
                  )}
                  onSelect={() => navigate('/dashboard/onboarding/info?tab=info')}
                >
                  الملف الشخصي
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Separator className={cn('h-px my-2', isDark ? 'bg-white/[0.08]' : 'bg-[#E2E8F0]')} />

              {/* Logout */}
              <DropdownMenu.Item
                className={cn(
                  'px-3 py-2.5 rounded-xl cursor-pointer outline-none transition-colors duration-200 flex items-center gap-2 text-sm',
                  isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
                )}
                onSelect={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  DESKTOP HEADER — Premium enterprise layout                        */
  /* ================================================================ */
  const DesktopHeader = () => (
    <div className="hidden lg:flex items-center justify-between w-full h-[76px] px-8">
      {/* ---------------------------------------------------------- */}
      {/* LEFT — Logo + Branding                                       */}
      {/* ---------------------------------------------------------- */}
      <div className="flex items-center gap-4 shrink-0 min-w-[200px]">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="منصة رشد"
            className={cn(
              'w-12 h-12 object-contain',
              isDark ? 'brightness-125' : ''
            )}
          />
          <div className="leading-tight">
            <p className="font-bold text-[15px] tracking-tight text-[#1E293B] dark:text-white">
              Rushd
            </p>
            <p className="text-xs font-medium text-[#64748B] dark:text-[#B7C7D8]">
              Rushd Virtual Incubator
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* CENTER — Global Search                                       */}
      {/* ---------------------------------------------------------- */}
      <div className="flex-1 flex justify-center max-w-xl mx-8">
        <div className="relative w-full max-w-[520px]">
          <Search
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none',
              isDark ? 'text-[#7C95AA]' : 'text-[#94A3B8]'
            )}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في لوحة التحكم..."
            className={cn(
              'w-full h-[46px] rounded-[14px] pr-11 pl-10 text-sm',
              'transition-all duration-200 ease-out',
              'focus:outline-none',
              isDark
                ? 'bg-[#102942] border border-white/[0.08] text-white placeholder:text-[#7C95AA] focus:border-[#3B82F6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
                : 'bg-white border border-[#E2E8F0] text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'w-6 h-6 flex items-center justify-center rounded-full',
                'transition-colors duration-200',
                isDark
                  ? 'text-[#7C95AA] hover:text-white hover:bg-white/[0.08]'
                  : 'text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              )}
              aria-label="مسح البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* RIGHT — Actions                                              */}
      {/* ---------------------------------------------------------- */}
      <div className="flex items-center gap-3 shrink-0 min-w-[200px] justify-end">
        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'relative flex items-center justify-center',
                'w-10 h-10 rounded-xl',
                'transition-all duration-200 ease-out',
                isDark
                  ? 'text-[#D8E4F0] hover:text-white hover:bg-white/[0.08]'
                  : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              )}
              aria-label="الإشعارات"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span
                  className={cn(
                    'absolute -top-0.5 -right-0.5',
                    'min-w-[18px] h-[18px] px-1',
                    'flex items-center justify-center',
                    'rounded-full text-[10px] font-bold text-white',
                    'bg-emerald-500 shadow-sm'
                  )}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-2xl shadow-xl p-2 w-96 z-50 overflow-hidden',
                isDark
                  ? 'bg-[rgba(8,26,46,0.94)] backdrop-blur-[20px] border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                  : 'bg-white border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* Header */}
              <div
                className={cn(
                  'px-4 py-3 flex items-center justify-between',
                  isDark ? 'border-b border-white/[0.08]' : 'border-b border-[#E2E8F0]'
                )}
              >
                <h3 className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-[#1E293B]')}>
                  الإشعارات
                </h3>
                {unreadCount > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {unreadCount} غير مقروء
                  </span>
                )}
              </div>

              {/* List */}
              <div className="py-1 max-h-[400px] overflow-y-auto">
                {loading && recentNotifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className={cn('w-5 h-5 animate-spin', isDark ? 'text-[#B7C7D8]/40' : 'text-[#94A3B8]')} />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell className={cn('w-8 h-8 mx-auto mb-2 opacity-40', isDark ? 'text-[#B7C7D8]' : 'text-[#94A3B8]')} />
                    <p className={cn('text-sm', isDark ? 'text-[#B7C7D8]/50' : 'text-[#94A3B8]')}>لا توجد إشعارات</p>
                  </div>
                ) : (
                  recentNotifications.map((notification) => {
                    const Icon = getPriorityIcon(notification.priority);
                    const color = getPriorityColor(notification.priority);
                    const isUnread = notification.status !== 'READ';

                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          'px-3 py-3 rounded-xl cursor-pointer transition-colors duration-200',
                          isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#F1F5F9]',
                          isUnread && (isDark ? 'bg-white/[0.03]' : 'bg-emerald-50/50')
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: color + '15' }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={cn('font-medium text-sm truncate', isUnread ? 'text-[#1E293B] dark:text-white' : 'text-[#64748B] dark:text-[#B7C7D8]/60')}>
                                {notification.title}
                              </p>
                              {isUnread && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                            </div>
                            <p className={cn('text-xs line-clamp-2 mb-1', isDark ? 'text-[#B7C7D8]/60' : 'text-[#64748B]')}>
                              {notification.body}
                            </p>
                            <span className={cn('text-xs', isDark ? 'text-[#7C95AA]' : 'text-[#94A3B8]')}>
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {recentNotifications.length > 0 && (
                <div className={cn('p-2', isDark ? 'border-t border-white/[0.08]' : 'border-t border-[#E2E8F0]')}>
                  <button
                    onClick={() => navigate('/dashboard/notifications')}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm rounded-xl transition-colors duration-200',
                      isDark ? 'text-[#3B82F6] hover:bg-white/[0.08]' : 'text-[#2563EB] hover:bg-[#F1F5F9]'
                    )}
                  >
                    عرض الكل
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Messages */}
        <IconButton
          onClick={() => navigate('/dashboard/collaboration')}
          label="الرسائل"
          hiddenOn="sm"
        >
          <MessageSquare className="w-[18px] h-[18px]" />
        </IconButton>

        {/* Downloads */}
        <IconButton label="التنزيلات" hiddenOn="md">
          <Download className="w-[18px] h-[18px]" />
        </IconButton>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          title={themeLabel(theme)}
          className={cn(
            'relative flex items-center justify-center',
            'w-10 h-10 rounded-xl',
            'transition-all duration-200 ease-out',
            isDark
              ? 'text-[#D8E4F0] hover:text-white hover:bg-white/[0.08]'
              : 'text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
          )}
          aria-label={`تبديل الوضع الحالي: ${themeLabel(theme)}`}
        >
          <ThemeIcon className="w-[18px] h-[18px]" />
        </button>

        {/* Divider */}
        <div className={cn('w-px h-6 mx-1', isDark ? 'bg-white/[0.08]' : 'bg-[#E2E8F0]')} />

        {/* User Profile */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl',
                'transition-all duration-200 ease-out',
                isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#F1F5F9]'
              )}
            >
              <Avatar.Root
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold',
                  'bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-sm'
                )}
              >
                <Avatar.Fallback className="text-sm">
                  {getInitials(user?.fullName ?? '')}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="hidden xl:block text-right leading-tight">
                <p className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-[#1E293B]')}>
                  {displayName(user)}
                </p>
                <p className="text-xs text-[#64748B] dark:text-[#7C95AA]">
                  {user?.email?.split('@')[0] ?? ''}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 hidden xl:block',
                  isDark ? 'text-[#7C95AA]' : 'text-[#94A3B8]'
                )}
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-2xl shadow-xl p-2 w-64 z-50',
                isDark
                  ? 'bg-[rgba(8,26,46,0.94)] backdrop-blur-[20px] border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                  : 'bg-white border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-3 mb-2">
                <Avatar.Root
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
                    'bg-gradient-to-br from-emerald-500 to-blue-500 text-white'
                  )}
                >
                  <Avatar.Fallback className="text-sm">
                    {getInitials(user?.fullName ?? '')}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="min-w-0">
                  <p className={cn('font-semibold text-sm truncate', isDark ? 'text-white' : 'text-[#1E293B]')}>
                    {displayName(user)}
                  </p>
                  <p className="text-xs truncate text-[#64748B] dark:text-[#7C95AA]">
                    {user?.email ?? ''}
                  </p>
                </div>
              </div>

              <DropdownMenu.Separator className={cn('h-px my-2', isDark ? 'bg-white/[0.08]' : 'bg-[#E2E8F0]')} />

              {/* Profile link */}
              {!isProjectManager && (
                <DropdownMenu.Item
                  className={cn(
                    'px-3 py-2.5 rounded-xl cursor-pointer outline-none transition-colors duration-200 text-sm',
                    isDark ? 'hover:bg-white/[0.08] text-[#B7C7D8]' : 'hover:bg-[#F1F5F9] text-[#1E293B]'
                  )}
                  onSelect={() => navigate('/dashboard/onboarding/info?tab=info')}
                >
                  الملف الشخصي
                </DropdownMenu.Item>
              )}

              {/* Theme info */}
              <div className={cn('px-3 py-2 text-xs flex items-center gap-2', isDark ? 'text-[#7C95AA]' : 'text-[#94A3B8]')}>
                <ThemeIcon className="w-3.5 h-3.5" />
                <span>{themeLabel(theme)}</span>
              </div>

              <DropdownMenu.Separator className={cn('h-px my-2', isDark ? 'bg-white/[0.08]' : 'bg-[#E2E8F0]')} />

              {/* Logout */}
              <DropdownMenu.Item
                className={cn(
                  'px-3 py-2.5 rounded-xl cursor-pointer outline-none transition-colors duration-200 flex items-center gap-2 text-sm',
                  isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
                )}
                onSelect={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-40',
        'transition-all duration-200 ease-out',
        isDark
          ? 'bg-[rgba(8,26,46,0.94)] backdrop-blur-[20px] border-b border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
          : 'bg-white border-b border-[#E2E8F0] shadow-[0_2px_10px_rgba(15,23,42,0.05)]',
        className
      )}
    >
      <DesktopHeader />
      <MobileHeader />
    </header>
  );
}
