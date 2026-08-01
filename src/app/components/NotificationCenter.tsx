/**
 * NotificationCenter — Modern enterprise notification popover + mobile drawer.
 *
 * Desktop: anchored popover below the bell with fade + slide animation.
 * Mobile: full-height drawer sliding in from the bottom.
 *
 * Features:
 * • Sticky header with unread count + "Mark all as read".
 * • Scrollable notification list.
 * • Skeleton loading state.
 * • Empty state with icon.
 * • Click outside / Escape to close.
 * • Focus returns to the trigger button on close.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bell,
  X,
  Check,
  CheckCircle,
  AlertTriangle,
  Info,
  Inbox,
} from 'lucide-react';
import { cn } from '@/app/utils/cn';
import type { Notification } from '@/api/services/notification-service';

export interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onViewAll: () => void;
  onViewNotification?: (notification: Notification) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/* ─── Helpers ──────────────────────────────────────────────────── */

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
      return 'var(--info)';
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

/* ─── Skeleton Item ────────────────────────────────────────────── */

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-[var(--hover)] flex-shrink-0" />
      <div className="flex-1 space-y-2 min-w-0 py-0.5">
        <div className="h-3.5 bg-[var(--hover)] rounded w-3/4" />
        <div className="h-3 bg-[var(--hover)] rounded w-1/2" />
        <div className="h-2.5 bg-[var(--hover)] rounded w-1/4" />
      </div>
    </div>
  );
}

/* ─── Empty State ──────────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-[var(--primary)]" />
      </div>
      <h4 className="text-base font-semibold text-[var(--foreground)] mb-1">
        لا توجد إشعارات
      </h4>
      <p className="text-sm text-[var(--muted-foreground)]">
        You're all caught up.
      </p>
    </div>
  );
}

/* ─── Notification Item ────────────────────────────────────────── */

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = getPriorityIcon(notification.priority);
  const color = getPriorityColor(notification.priority);
  const isUnread = notification.status !== 'READ';

  return (
    <button
      onClick={() => onClick(notification)}
      className={cn(
        'w-full text-right flex items-start gap-3 p-3 rounded-xl transition-colors duration-200',
        'hover:bg-[var(--hover)] focus:outline-none focus:bg-[var(--hover)] focus:ring-2 focus:ring-[var(--ring)]/30',
        isUnread ? 'bg-[var(--primary)]/[0.04]' : 'bg-transparent'
      )}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <p
            className={cn(
              'text-sm leading-snug flex-1 min-w-0',
              isUnread ? 'font-semibold text-[var(--foreground)]' : 'font-medium text-[var(--muted-foreground)]'
            )}
          >
            {notification.title}
          </p>
          {isUnread && (
            <span
              className="w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0 mt-1.5"
              aria-hidden="true"
            />
          )}
        </div>

        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-1">
          {notification.body}
        </p>

        <span className="text-[11px] text-[var(--muted-foreground)]">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </button>
  );
}

/* ─── Panel Content ──────────────────────────────────────────────── */

interface NotificationPanelContentProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => Promise<void>;
  onViewAll: () => void;
  onItemClick: (notification: Notification) => void;
}

function NotificationPanelContent({
  notifications,
  unreadCount,
  loading,
  onClose,
  onMarkAllAsRead,
  onViewAll,
  onItemClick,
}: NotificationPanelContentProps) {
  const [markingAll, setMarkingAll] = useState(false);

  const handleMarkAll = async () => {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await onMarkAllAsRead();
    } finally {
      setMarkingAll(false);
    }
  };

  const hasNotifications = notifications.length > 0;

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Sticky Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--popover)]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--muted-foreground)]" />
          <h3 className="font-semibold text-sm text-[var(--foreground)]">
            الإشعارات
          </h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              {unreadCount} غير مقروء
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {hasNotifications && (
            <button
              onClick={handleMarkAll}
              disabled={unreadCount === 0 || markingAll}
              title="تعيين الكل مقروء"
              className={cn(
                'flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
                'text-[var(--primary)] hover:bg-[var(--primary)]/10 disabled:opacity-40 disabled:hover:bg-transparent'
              )}
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تعيين الكل مقروء</span>
            </button>
          )}
          <button
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover)]'
            )}
            aria-label="إغلاق الإشعارات"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-2">
        {loading ? (
          <div className="space-y-1">
            {<NotificationSkeleton />}
            {<NotificationSkeleton />}
            {<NotificationSkeleton />}
            {<NotificationSkeleton />}
            {<NotificationSkeleton />}
          </div>
        ) : hasNotifications ? (
          <div className="space-y-1" role="list" aria-label="قائمة الإشعارات">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onItemClick}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Sticky Footer */}
      {hasNotifications && !loading && (
        <div className="px-3 py-2.5 border-t border-[var(--border)] bg-[var(--popover)]">
          <button
            onClick={onViewAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors duration-200 text-[var(--primary)] hover:bg-[var(--hover)]"
          >
            عرض كل الإشعارات
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */

export function NotificationCenter({
  notifications,
  unreadCount,
  loading,
  isOpen,
  onOpenChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  onViewNotification,
  triggerRef,
}: NotificationCenterProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  /* Detect mobile viewport */ 
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Close on Escape */ 
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onOpenChange]);

  /* Close on click outside */ 
  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        onOpenChange(false);
      }
    };
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, [isOpen, onOpenChange, triggerRef]);

  /* Return focus to trigger on close */ 
  const prevOpenRef = useRef(isOpen);
  useEffect(() => {
    if (prevOpenRef.current && !isOpen) {
      triggerRef.current?.focus();
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, triggerRef]);

  const handleItemClick = useCallback(
    async (notification: Notification) => {
      if (notification.status !== 'READ') {
        await onMarkAsRead(notification.id);
      }
      onViewNotification?.(notification);
      onOpenChange(false);
    },
    [onMarkAsRead, onViewNotification, onOpenChange]
  );

  const handleViewAll = useCallback(() => {
    onViewAll();
    onOpenChange(false);
  }, [onViewAll, onOpenChange]);

  if (!isOpen) return null;

  /* Mobile: bottom sheet drawer */ 
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 z-[60] animate-fade-in md:hidden"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          ref={panelRef}
          className={cn(
            'fixed bottom-0 right-0 left-0 z-[70]',
            'bg-[var(--popover)] border-t border-[var(--border)]',
            'rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)]',
            'h-[85vh] max-h-[600px] flex flex-col',
            'md:hidden',
            'animate-slide-up'
          )}
          role="dialog"
          aria-modal="true"
          aria-label="مركز الإشعارات"
        >
          <NotificationPanelContent
            notifications={notifications}
            unreadCount={unreadCount}
            loading={loading}
            onClose={() => onOpenChange(false)}
            onMarkAllAsRead={onMarkAllAsRead}
            onViewAll={handleViewAll}
            onItemClick={handleItemClick}
          />
        </div>
      </>
    );
  }

  /* Desktop: anchored popover */ 
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] hidden md:block"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Popover anchored to trigger via absolute positioning relative to viewport */}
      <div
        ref={panelRef}
        className={cn(
          'fixed z-[70] w-[420px] max-w-[calc(100vw-2rem)]',
          'bg-[var(--popover)] border border-[var(--border)]',
          'rounded-2xl shadow-[var(--shadow-xl)]',
          'flex flex-col overflow-hidden',
          'hidden md:flex',
          'origin-top-right',
          'animate-popover-in'
        )}
        style={{
          top: 'calc(var(--topbar-height, 64px) + 8px)',
          right: '1rem',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="مركز الإشعارات"
      >
        <NotificationPanelContent
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onClose={() => onOpenChange(false)}
          onMarkAllAsRead={onMarkAllAsRead}
          onViewAll={handleViewAll}
          onItemClick={handleItemClick}
        />
      </div>
    </>
  );
}
