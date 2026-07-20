/**
 * TopBar Component
 *
 * Displays header with search, notification bell, and user menu.
 * Notifications are fetched from backend API.
 */
import { useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../layouts/RootLayout';
import { useNotifications } from '@/api/hooks/useNotifications';
import { useNotificationToast } from '@/api/hooks/useNotificationToast';
import { useNotificationRealtime } from '@/api/hooks/useNotificationRealtime';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import type { Notification } from '@/api/services/notification-service';
import { useCallback } from 'react';

interface TopBarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onMenuClick: () => void;
  className?: string;
}

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

export function TopBar({
  theme,
  onThemeToggle,
  onMenuClick,
  className,
}: TopBarProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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

  // Connect to real-time notifications
  useEffect(() => {
    if (user?.id) {
      connect(user.id);
    }
    return () => disconnect();
  }, [user?.id, connect, disconnect]);

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

  // Get last 5 notifications for dropdown
  const recentNotifications = notifications.slice(0, 5);

  return (
    <header className={cn('bg-card border-b border-border flex items-center justify-between px-4 h-16', className)}>
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
        aria-label="القائمة"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث..."
            className="w-full bg-input-background border border-border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-destructive rounded-full text-[10px] text-white flex items-center justify-center font-bold px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-popover border border-border rounded-lg shadow-lg p-2 w-96 z-50"
              sideOffset={5}
              align="end"
              dir="rtl"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-medium">الإشعارات</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} غير مقروء
                  </span>
                )}
              </div>

              <div className="py-2 max-h-[400px] overflow-y-auto">
                {loading && recentNotifications.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-muted-foreground">لا توجد إشعارات</p>
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
                          'px-3 py-3 hover:bg-accent rounded-lg cursor-pointer transition-colors',
                          isUnread && 'bg-amber-50/50'
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
                              <p className={cn('font-medium text-sm truncate', isUnread ? 'text-foreground' : 'text-muted-foreground')}>
                                {notification.title}
                              </p>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{notification.body}</p>
                            <span className="text-[11px] text-muted-foreground">{formatRelativeTime(notification.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {recentNotifications.length > 0 && (
                <div className="border-t border-border p-2">
                  <button
                    onClick={() => navigate('/dashboard/notifications')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent rounded-lg transition-colors"
                  >
                    عرض الكل
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 p-1 hover:bg-accent rounded-lg transition-colors">
              <Avatar.Root className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Avatar.Fallback className="text-sm">{getInitials(user?.fullName ?? '')}</Avatar.Fallback>
              </Avatar.Root>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-popover border border-border rounded-lg shadow-lg p-2 w-56 z-50"
              sideOffset={5}
              align="end"
              dir="rtl"
            >
              <div className="px-3 py-2 border-b border-border mb-2">
                <p className="font-medium">{displayName(user)}</p>
                <p className="text-muted-foreground text-sm">{user?.email ?? ''}</p>
              </div>
              <DropdownMenu.Item className="px-3 py-2 hover:bg-accent rounded cursor-pointer outline-none">
                الملف الشخصي
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-3 py-2 hover:bg-accent rounded cursor-pointer outline-none">
                الإعدادات
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-2" />
              <DropdownMenu.Item
                className="px-3 py-2 hover:bg-accent rounded cursor-pointer outline-none text-destructive flex items-center gap-2"
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
