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
        'flex items-center justify-between h-16 px-[var(--spacing-page-padding)] transition-all duration-[var(--transition-duration)] theme-fade',
        // Exact topbar colors: #FFFFFF (light), #081A2E (dark)
        'bg-[#FFFFFF] dark:bg-[#081A2E]',
        // Text colors
        'text-[#1E293B] dark:text-white',
        // Border & shadow
        'border-b border-[var(--border)] dark:border-white/10',
        'shadow-[var(--shadow-sm)]',
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
            'lg:hidden p-2 rounded-[var(--radius-button)] transition-all duration-[var(--transition-duration)]',
            isDark
              ? 'hover:bg-white/10 text-white'
              : 'hover:bg-[var(--hover)] text-[var(--text-primary)]'
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
            <p className="font-bold text-sm tracking-tight text-[var(--text-primary)] dark:text-white">
              Rushd
            </p>
            <p className="text-xs font-medium text-[var(--text-muted)] dark:text-white/60">
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
              isDark ? 'text-white/50' : 'text-[var(--text-muted)]'
            )}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث..."
            className={cn(
              'w-full rounded-[var(--radius-input)] pr-10 pl-4 py-2 text-sm transition-all duration-[var(--transition-duration)]',
              'focus:outline-none focus:ring-2',
              isDark
                ? 'bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:ring-[var(--primary)]/40'
                : 'bg-[var(--input-background)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-[var(--primary)]/30'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                isDark ? 'text-white/40 hover:text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
              aria-label="مسح البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile search icon */}
      <div className="flex md:hidden flex-1 justify-center">
        {!searchOpen ? (
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              'p-2 rounded-[var(--radius-button)] transition-all duration-[var(--transition-duration)]',
              isDark
                ? 'hover:bg-white/10 text-white/70'
                : 'hover:bg-[var(--hover)] text-[var(--text-muted)]'
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
                isDark ? 'text-white/50' : 'text-[var(--text-muted)]'
              )}
            />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث..."
              className={cn(
                'w-full rounded-[var(--radius-input)] pr-8 pl-7 py-1.5 text-sm',
                'focus:outline-none focus:ring-2',
                isDark
                  ? 'bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:ring-[var(--primary)]/40'
                  : 'bg-[var(--input-background)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-[var(--primary)]/30'
              )}
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2',
                isDark ? 'text-white/40 hover:text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
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
                'relative p-2 rounded-[var(--radius-button)] transition-all duration-[var(--transition-duration)] btn-scale',
                isDark
                  ? 'hover:bg-white/10 text-white/80'
                  : 'hover:bg-[var(--hover)] text-[var(--text-secondary)]'
              )}
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[var(--danger)] rounded-[var(--radius-badge)] text-xs text-white flex items-center justify-center font-bold px-1 shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-[var(--radius-dialog)] shadow-[var(--shadow-xl)] p-2 w-96 z-50 overflow-hidden',
                isDark
                  ? 'bg-[var(--card)]/95 backdrop-blur-md border-white/10'
                  : 'bg-[var(--card)] border-[var(--border)]'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* Header */}
              <div
                className={cn(
                  'p-3 flex items-center justify-between',
                  isDark ? 'border-b border-white/10' : 'border-b border-[var(--border)]'
                )}
              >
                <h3 className={cn('font-semibold text-[var(--text-primary)] dark:text-white')}>
                  الإشعارات
                </h3>
                {unreadCount > 0 && (
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-[var(--radius-badge)] font-semibold',
                      isDark
                        ? 'bg-[var(--danger)]/20 text-red-300'
                        : 'bg-red-50 text-[var(--danger)]'
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
                        isDark ? 'text-white/40' : 'text-[var(--text-muted)]'
                      )}
                    />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell
                      className={cn(
                        'w-8 h-8 mx-auto mb-2 opacity-40',
                        isDark ? 'text-white' : 'text-[var(--text-muted)]'
                      )}
                    />
                    <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-[var(--text-muted)]')}>
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
                          'px-3 py-3 rounded-[var(--radius-card)] cursor-pointer transition-colors duration-[var(--transition-duration)]',
                          isDark
                            ? 'hover:bg-white/10'
                            : 'hover:bg-[var(--hover)]',
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
                                    ? 'text-[var(--text-primary)] dark:text-white'
                                    : 'text-[var(--text-muted)] dark:text-white/60'
                                )}
                              >
                                {notification.title}
                              </p>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-[var(--warning)] shrink-0" />
                              )}
                            </div>
                            <p
                              className={cn(
                                'text-xs line-clamp-2 mb-1',
                                isDark ? 'text-white/50' : 'text-[var(--text-muted)]'
                              )}
                            >
                              {notification.body}
                            </p>
                            <span
                              className={cn(
                                'text-xs',
                                isDark ? 'text-white/40' : 'text-[var(--text-muted)]'
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
                    isDark ? 'border-t border-white/10' : 'border-t border-[var(--border)]'
                  )}
                >
                  <button
                    onClick={() => navigate('/dashboard/notifications')}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-[var(--radius-button)] transition-colors duration-[var(--transition-duration)]',
                      isDark
                        ? 'text-[var(--primary)] hover:bg-white/10'
                        : 'text-[var(--primary)] hover:bg-[var(--hover-primary)]'
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

        {/* Messages icon */}
        <button
          className={cn(
            'relative p-2 rounded-[var(--radius-button)] transition-all duration-[var(--transition-duration)] hidden sm:flex btn-scale',
            isDark
              ? 'hover:bg-white/10 text-white/80'
              : 'hover:bg-[var(--hover)] text-[var(--text-secondary)]'
          )}
          aria-label="الرسائل"
          onClick={() => navigate('/dashboard/collaboration')}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Downloads icon */}
        <button
          className={cn(
            'relative p-2 rounded-[var(--radius-button)] transition-all duration-[var(--transition-duration)] hidden md:flex btn-scale',
            isDark
              ? 'hover:bg-white/10 text-white/80'
              : 'hover:bg-[var(--hover)] text-[var(--text-secondary)]'
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
            'relative p-2 rounded-[var(--radius-button)] transition-all duration-[var(--transition-duration)] btn-scale',
            isDark
              ? 'hover:bg-white/10 text-white/80'
              : 'hover:bg-[var(--hover)] text-[var(--text-secondary)]'
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
                'flex items-center gap-2 p-1 pr-2 rounded-[var(--radius-card)] transition-all duration-[var(--transition-duration)]',
                isDark
                  ? 'hover:bg-white/10'
                  : 'hover:bg-[var(--hover)]'
              )}
            >
              <Avatar.Root
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white'
                )}
              >
                <Avatar.Fallback className="text-sm">
                  {getInitials(user?.fullName ?? '')}
                </Avatar.Fallback>
              </Avatar.Root>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 hidden sm:block',
                  isDark ? 'text-white/50' : 'text-[var(--text-muted)]'
                )}
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                'border rounded-[var(--radius-dialog)] shadow-[var(--shadow-xl)] p-2 w-56 z-50',
                isDark
                  ? 'bg-[var(--card)]/95 backdrop-blur-md border-white/10'
                  : 'bg-[var(--card)] border-[var(--border)]'
              )}
              sideOffset={8}
              align="end"
              dir="rtl"
            >
              {/* User info */}
              <div
                className={cn(
                  'px-3 py-2 mb-2',
                  isDark ? 'border-b border-white/10' : 'border-b border-[var(--border)]'
                )}
              >
                <p className="font-semibold text-sm text-[var(--text-primary)] dark:text-white">
                  {displayName(user)}
                </p>
                <p className="text-sm truncate text-[var(--text-muted)] dark:text-white/50">
                  {user?.email ?? ''}
                </p>
              </div>

              {/* Profile link */}
              {!isProjectManager && (
                <DropdownMenu.Item
                  className={cn(
                    'px-3 py-2 rounded-[var(--radius-button)] cursor-pointer outline-none transition-colors duration-[var(--transition-duration)] text-sm',
                    isDark
                      ? 'hover:bg-white/10 text-white'
                      : 'hover:bg-[var(--hover)] text-[var(--text-primary)]'
                  )}
                  onSelect={() => navigate('/dashboard/onboarding/info?tab=info')}
                >
                  الملف الشخصي
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Separator
                className={cn(
                  'h-px my-2',
                  isDark ? 'bg-white/10' : 'bg-[var(--border)]'
                )}
              />

              {/* Logout */}
              <DropdownMenu.Item
                className={cn(
                  'px-3 py-2 rounded-[var(--radius-button)] cursor-pointer outline-none transition-colors duration-[var(--transition-duration)] flex items-center gap-2 text-sm',
                  isDark
                    ? 'hover:bg-[var(--danger)]/10 text-[var(--danger)]'
                    : 'hover:bg-red-50 text-[var(--danger)]'
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
