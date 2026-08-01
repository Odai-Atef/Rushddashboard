/**
 * TopBar Component
 *
 * Redesigned horizontal navigation bar with logo (left), search (center),
 * and actions (right) including a theme toggle that uses useTheme().
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
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TopBarProps {
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  onMenuClick: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
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
      return '#dc2626';
    case 'HIGH':
      return '#ea580c';
    case 'MEDIUM':
      return '#ca8a04';
    case 'LOW':
    default:
      return '#2563eb';
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
/*  Theme-cycle helper                                                  */
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
      return 'الوضع الداكن';
    case 'system':
      return 'وضع النظام';
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
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

  /* ---------------------------------------------------------------- */
  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-4 lg:px-6 transition-all duration-200',
        // Light mode
        !isDark && 'bg-background text-foreground shadow-sm border-b border-border',
        // Dark mode — glass
        isDark && 'bg-white/10 backdrop-blur-md text-white border-b border-white/10',
        className
      )}
    >
      {/* ---------------------------------------------------------- */}
      {/*  LEFT — Logo + Branding                                    */}
      {/* ---------------------------------------------------------- */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile hamburger (lg and below) */}
        <button
          onClick={onMenuClick}
          className={cn(
            'lg:hidden p-2 rounded-lg transition-colors duration-200',
            isDark
              ? 'hover:bg-white/10 text-white'
              : 'hover:bg-muted text-foreground'
          )}
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="منصة رشد"
            className="w-9 h-9 object-contain drop-shadow-sm"
          />
          <div className="hidden sm:block leading-tight">
            <p className="font-bold text-sm tracking-tight">Rushd</p>
            <p
              className={cn(
                'text-xs font-medium',
                isDark ? 'text-white/60' : 'text-muted-foreground'
              )}
            >
              Rushd Virtual Incubator
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  CENTER — Search                                           */}
      {/* ---------------------------------------------------------- */}
      <div className="hidden md:flex flex-1 max-w-xl mx-6">
        <div className="relative w-full">
          <Search
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none',
              isDark ? 'text-white/50' : 'text-muted-foreground'
            )}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث..."
            className={cn(
              'w-full rounded-xl pr-10 pl-4 py-2 text-sm transition-all duration-200',
              'focus:outline-none focus:ring-2',
              isDark
                ? 'bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:ring-emerald-400/40'
                : 'bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:ring-emerald-500/30'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                isDark ? 'text-white/40 hover:text-white' : 'text-muted-foreground hover:text-muted-foreground'
              )}
              aria-label="مسح البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile search icon (opens inline below or could expand) */}
      <div className="flex md:hidden flex-1 justify-center">
        {!searchOpen ? (
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              'p-2 rounded-lg transition-colors duration-200',
              isDark
                ? 'hover:bg-white/10 text-white/70'
                : 'hover:bg-muted text-muted-foreground'
            )}
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative w-full max-w-[200px]">
            <Search
              className={cn(
                'absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none',
                isDark ? 'text-white/50' : 'text-muted-foreground'
              )}
            />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث..."
              className={cn(
                'w-full rounded-lg pr-8 pl-7 py-1.5 text-sm',
                'focus:outline-none focus:ring-2',
                isDark
                  ? 'bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:ring-emerald-400/40'
                  : 'bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:ring-emerald-500/30'
              )}
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2',
                isDark ? 'text-white/40 hover:text-white' : 'text-muted-foreground hover:text-muted-foreground'
              )}
              aria-label="إغلاق البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  RIGHT — Actions                                             */}
      {/* ---------------------------------------------------------- */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'relative p-2 rounded-lg transition-all duration-200',
                isDark
                  ? 'hover:bg-white/10 text-white/80'
                  : 'hover:bg-muted text-muted-foreground'
              )}
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4.5 h-4.5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold px-1 shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-xl shadow-xl p-2 w-96 z-50 overflow-hidden',
                isDark
                  ? 'bg-card/95 backdrop-blur-md border-white/10'
                  : 'bg-card border-border'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* Header */}
              <div
                className={cn(
                  'p-3 flex items-center justify-between',
                  isDark ? 'border-b border-white/10' : 'border-b border-border'
                )}
              >
                <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-foreground')}>
                  الإشعارات
                </h3>
                {unreadCount > 0 && (
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-semibold',
                      isDark
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-red-50 text-red-600'
                    )}
                  >
                    {unreadCount} غير مقروء
                  </span>
                )}
              </div>

              {/* List */}
              <div className="py-1 max-h-[400px] overflow-y-auto">
                {loading && recentNotifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2
                      className={cn(
                        'w-5 h-5 animate-spin',
                        isDark ? 'text-white/40' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell
                      className={cn(
                        'w-8 h-8 mx-auto mb-2 opacity-40',
                        isDark ? 'text-white' : 'text-muted-foreground'
                      )}
                    />
                    <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-muted-foreground')}>
                      لا توجد إشعارات
                    </p>
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
                          'px-3 py-3 rounded-lg cursor-pointer transition-colors duration-150',
                          isDark
                            ? 'hover:bg-white/10'
                            : 'hover:bg-secondary',
                          isUnread && (isDark ? 'bg-white/5' : 'bg-amber-50/50')
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
                              <p
                                className={cn(
                                  'font-medium text-sm truncate',
                                  isUnread
                                    ? isDark
                                      ? 'text-white'
                                      : 'text-foreground'
                                    : isDark
                                    ? 'text-white/60'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {notification.title}
                              </p>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                              )}
                            </div>
                            <p
                              className={cn(
                                'text-xs line-clamp-2 mb-1',
                                isDark ? 'text-white/50' : 'text-muted-foreground'
                              )}
                            >
                              {notification.body}
                            </p>
                            <span
                              className={cn(
                                'text-xs',
                                isDark ? 'text-white/40' : 'text-muted-foreground'
                              )}
                            >
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
                <div
                  className={cn(
                    'p-2',
                    isDark ? 'border-t border-white/10' : 'border-t border-border'
                  )}
                >
                  <button
                    onClick={() => navigate('/dashboard/notifications')}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-150',
                      isDark
                        ? 'text-emerald-400 hover:bg-white/10'
                        : 'text-emerald-600 hover:bg-emerald-50'
                    )}
                  >
                    عرض الكل
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Messages icon (decorative — no real count hook yet) */}
        <button
          className={cn(
            'relative p-2 rounded-lg transition-all duration-200 hidden sm:flex',
            isDark
              ? 'hover:bg-white/10 text-white/80'
              : 'hover:bg-muted text-muted-foreground'
          )}
          aria-label="الرسائل"
          onClick={() => navigate('/dashboard/collaboration')}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Downloads icon (decorative) */}
        <button
          className={cn(
            'relative p-2 rounded-lg transition-all duration-200 hidden md:flex',
            isDark
              ? 'hover:bg-white/10 text-white/80'
              : 'hover:bg-muted text-muted-foreground'
          )}
          aria-label="التنزيلات"
        >
          <Download className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          title={themeLabel(theme)}
          className={cn(
            'relative p-2 rounded-lg transition-all duration-200',
            isDark
              ? 'hover:bg-white/10 text-white/80'
              : 'hover:bg-muted text-muted-foreground'
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
                isDark
                  ? 'hover:bg-white/10'
                  : 'hover:bg-muted'
              )}
            >
              <Avatar.Root
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  isDark
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    : 'bg-gradient-to-br from-primary to-accent text-white'
                )}
              >
                <Avatar.Fallback className="text-sm">
                  {getInitials(user?.fullName ?? '')}
                </Avatar.Fallback>
              </Avatar.Root>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 hidden sm:block',
                  isDark ? 'text-white/50' : 'text-muted-foreground'
                )}
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-xl shadow-xl p-2 w-56 z-50',
                isDark
                  ? 'bg-card/95 backdrop-blur-md border-white/10'
                  : 'bg-card border-border'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* User info */}
              <div
                className={cn(
                  'px-3 py-2 mb-2',
                  isDark ? 'border-b border-white/10' : 'border-b border-border'
                )}
              >
                <p
                  className={cn(
                    'font-semibold text-sm',
                    isDark ? 'text-white' : 'text-foreground'
                  )}
                >
                  {displayName(user)}
                </p>
                <p
                  className={cn(
                    'text-sm truncate',
                    isDark ? 'text-white/50' : 'text-muted-foreground'
                  )}
                >
                  {user?.email ?? ''}
                </p>
              </div>

              {/* Profile link */}
              {!isProjectManager && (
                <DropdownMenu.Item
                  className={cn(
                    'px-3 py-2 rounded-lg cursor-pointer outline-none transition-colors duration-150 text-sm',
                    isDark
                      ? 'hover:bg-white/10 text-white'
                      : 'hover:bg-secondary text-foreground'
                  )}
                  onSelect={() => navigate('/dashboard/onboarding/info?tab=info')}
                >
                  الملف الشخصي
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Separator
                className={cn(
                  'h-px my-2',
                  isDark ? 'bg-white/10' : 'bg-muted'
                )}
              />

              {/* Logout */}
              <DropdownMenu.Item
                className={cn(
                  'px-3 py-2 rounded-lg cursor-pointer outline-none transition-colors duration-150 flex items-center gap-2 text-sm',
                  isDark
                    ? 'hover:bg-red-500/10 text-red-400'
                    : 'hover:bg-red-50 text-red-600'
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
    </header>
  );
}
