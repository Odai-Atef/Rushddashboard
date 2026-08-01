/**
 * TopBar Component — Premium Enterprise Dashboard
 *
 * Completely redesigned header that serves as one of the strongest
 * visual elements of the application. Premium, spacious, professional,
 * executive, modern, and minimal.
 * 
 * Theme-aware: uses semantic CSS variables for full light/dark support.
 */
import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Bell,
  Menu,
  LogOut,
  Sun,
  Moon,
  Monitor,
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
import { NotificationCenter } from './NotificationCenter';
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
    markAllAsRead,
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

  /* --- Notifications panel --------------------------------------- */
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationTriggerRef = useRef<HTMLButtonElement | null>(null);

  /* --- Derived ----------------------------------------------------- */
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

  const handleViewAllNotifications = () => {
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
        'text-[var(--topbar-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]',
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
            'rounded-full text-[10px] font-bold',
            'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );

  /* ================================================================ */
  /*  NOTIFICATION CENTER — Modern popover / drawer                    */
  /* ================================================================ */
  const NotificationPanel = () => (
    <NotificationCenter
      notifications={notifications}
      unreadCount={unreadCount}
      loading={loading}
      isOpen={notificationsOpen}
      onOpenChange={setNotificationsOpen}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onViewAll={handleViewAllNotifications}
      onViewNotification={handleNotificationClick}
      triggerRef={notificationTriggerRef}
    />
  );

  /* ================================================================ */
  /*  USER DROPDOWN CONTENT — Shared between mobile/desktop            */
  /* ================================================================ */
  const UserDropdownContent = () => (
    <DropdownMenu.Content
      className={cn(
        'border rounded-2xl shadow-xl p-2 z-50',
        'bg-[var(--popover)] border-[var(--border)] text-[var(--popover-foreground)]'
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
            'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)]'
          )}
        >
          <Avatar.Fallback className="text-sm">
            {getInitials(user?.fullName ?? '')}
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate text-[var(--foreground)]">
            {displayName(user)}
          </p>
          <p className="text-xs truncate text-[var(--muted-foreground)]">
            {user?.email ?? ''}
          </p>
        </div>
      </div>

      <DropdownMenu.Separator className="h-px my-2 bg-[var(--border)]" />

      {/* Profile link */}
      {!isProjectManager && (
        <DropdownMenu.Item
          className="px-3 py-2.5 rounded-xl cursor-pointer outline-none transition-colors duration-200 text-sm text-[var(--foreground)] hover:bg-[var(--hover)]"
          onSelect={() => navigate('/dashboard/onboarding/info?tab=info')}
        >
          الملف الشخصي
        </DropdownMenu.Item>
      )}

      {/* Theme info */}
      <div className="px-3 py-2 text-xs flex items-center gap-2 text-[var(--muted-foreground)]">
        <ThemeIcon className="w-3.5 h-3.5" />
        <span>{themeLabel(theme)}</span>
      </div>

      <DropdownMenu.Separator className="h-px my-2 bg-[var(--border)]" />

      {/* Logout */}
      <DropdownMenu.Item
        className="px-3 py-2.5 rounded-xl cursor-pointer outline-none transition-colors duration-200 flex items-center gap-2 text-sm text-[var(--destructive)] hover:bg-[var(--destructive)]/[0.08]"
        onSelect={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        <span>تسجيل الخروج</span>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
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
            'text-[var(--topbar-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
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
            <p className="font-semibold text-sm tracking-tight text-[var(--foreground)]">
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
              'text-[var(--topbar-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
            )}
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative flex-1 max-w-[200px]">
            <Search
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--muted-foreground)]"
            />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث..."
              className={cn(
                'w-full h-9 rounded-lg pr-9 pl-8 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/30',
                'bg-[var(--input-background)] border border-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]'
              )}
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="إغلاق البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Notifications */}
        <button
          ref={notificationTriggerRef}
          onClick={() => setNotificationsOpen(true)}
          className={cn(
            'relative flex items-center justify-center w-10 h-10 rounded-xl',
            'transition-all duration-200',
            'text-[var(--topbar-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
          )}
          aria-label="الإشعارات"
          aria-expanded={notificationsOpen}
          aria-haspopup="dialog"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          title={themeLabel(theme)}
          className={cn(
            'relative flex items-center justify-center w-10 h-10 rounded-xl',
            'transition-all duration-200',
            'text-[var(--topbar-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
          )}
          aria-label={`تبديل الوضع الحالي: ${themeLabel(theme)}`}
        >
          <ThemeIcon className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 p-1 pr-2 rounded-xl transition-all duration-200',
                'hover:bg-[var(--hover)]'
              )}
            >
              <Avatar.Root
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                  'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)]'
                )}
              >
                <Avatar.Fallback className="text-xs">
                  {getInitials(user?.fullName ?? '')}
                </Avatar.Fallback>
              </Avatar.Root>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <UserDropdownContent />
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
            <p className="font-bold text-[15px] tracking-tight text-[var(--foreground)]">
              Rushd
            </p>
            <p className="text-xs font-medium text-[var(--muted-foreground)]">
              حاضنة رشد الافتراضية
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
            className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none text-[var(--muted-foreground)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في لوحة التحكم..."
            className={cn(
              'w-full h-[46px] rounded-[14px] pr-11 pl-10 text-sm',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/30',
              'bg-[var(--input-background)] border border-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'w-6 h-6 flex items-center justify-center rounded-full',
                'transition-colors duration-200',
                'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
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
        <button
          ref={notificationTriggerRef}
          onClick={() => setNotificationsOpen(true)}
          className={cn(
            'relative flex items-center justify-center',
            'w-10 h-10 rounded-xl',
            'transition-all duration-200 ease-out',
            'text-[var(--topbar-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
          )}
          aria-label="الإشعارات"
          aria-expanded={notificationsOpen}
          aria-haspopup="dialog"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute -top-0.5 -right-0.5',
                'min-w-[18px] h-[18px] px-1',
                'flex items-center justify-center',
                'rounded-full text-[10px] font-bold',
                'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          title={themeLabel(theme)}
          className={cn(
            'relative flex items-center justify-center',
            'w-10 h-10 rounded-xl',
            'transition-all duration-200 ease-out',
            'text-[var(--topbar-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
          )}
          aria-label={`تبديل الوضع الحالي: ${themeLabel(theme)}`}
        >
          <ThemeIcon className="w-[18px] h-[18px]" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 mx-1 bg-[var(--border)]" />

        {/* User Profile */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl',
                'transition-all duration-200 ease-out',
                'hover:bg-[var(--hover)]'
              )}
            >
              <Avatar.Root
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold',
                  'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)]'
                )}
              >
                <Avatar.Fallback className="text-sm">
                  {getInitials(user?.fullName ?? '')}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="hidden xl:block text-right leading-tight">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {displayName(user)}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {user?.email?.split('@')[0] ?? ''}
                </p>
              </div>
              <ChevronDown
                className="w-3.5 h-3.5 hidden xl:block text-[var(--muted-foreground)]"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <UserDropdownContent />
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-40',
          'transition-all duration-200 ease-out',
          'bg-[var(--topbar)] border-b border-[var(--border)] shadow-[var(--shadow-sm)]',
          className
        )}
      >
        <DesktopHeader />
        <MobileHeader />
      </header>
      <NotificationPanel />
    </>
  );
}
