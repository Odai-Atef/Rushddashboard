/**
 * Notification Hook
 *
 * Provides notifications state management with REST API integration.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  notificationService,
  Notification,
  NotificationFilters,
  NotificationPriority,
} from '@/api/services/notification-service';
import { useAuth } from '@/app/layouts/RootLayout';

interface UseNotificationsReturn {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  loading: boolean;
  error: string;
  page: number;
  hasMore: boolean;
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const PAGE_SIZE = 20;

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const fetchNotifications = useCallback(
    async (filters?: NotificationFilters) => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await notificationService.getNotifications({
          ...filters,
          page: filters?.page ?? page,
          limit: filters?.limit ?? PAGE_SIZE,
        });
        if (res.success && res.data) {
          const newNotifications = res.data.data;
          if (filters?.page === 1 || page === 1) {
            setNotifications(newNotifications);
          } else {
            setNotifications((prev) => [...prev, ...newNotifications]);
          }
          setTotal(res.data.total);
        } else {
          setError(res.message || 'فشل في تحميل الإشعارات');
        }
      } catch {
        setError('حدث خطأ أثناء تحميل الإشعارات');
      } finally {
        setLoading(false);
      }
    },
    [user, page]
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success && res.data) {
        setUnreadCount(res.data.count);
      }
    } catch {
      // Silently fail — badge count is non-critical
    }
  }, [user]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!user) return;
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'READ' as const, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        const res = await notificationService.markAsRead(id);
        if (!res.success) {
          // Revert on failure
          setNotifications((prev) =
            prev.map((n) => (n.id === id ? { ...n, status: 'DELIVERED' as const, readAt: null } : n))
          );
          setUnreadCount((prev) => prev + 1);
        }
      } catch {
        // Revert on failure
        setNotifications((prev) =
          prev.map((n) => (n.id === id ? { ...n, status: 'DELIVERED' as const, readAt: null } : n))
        );
        setUnreadCount((prev) => prev + 1);
      }
    },
    [user]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user || notifications.length === 0) return;
    const unreadIds = notifications.filter((n) => n.status !== 'READ').map((n) => n.id);
    if (unreadIds.length === 0) return;

    // Optimistic update
    setNotifications((prev) =
      prev.map((n) => ({ ...n, status: 'READ' as const, readAt: new Date().toISOString() }))
    );
    setUnreadCount(0);

    try {
      await Promise.all(unreadIds.map((id) => notificationService.markAsRead(id)));
    } catch {
      // Revert on failure
      setNotifications((prev) =
        prev.map((n) =>
          unreadIds.includes(n.id) ? { ...n, status: 'DELIVERED' as const, readAt: null } : n
        )
      );
      setUnreadCount(unreadIds.length);
    }
  }, [user, notifications]);

  useEffect(() => {
    fetchNotifications({ page: 1 });
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Auto-refresh unread count every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const hasMore = notifications.length < total;

  return {
    notifications,
    total,
    unreadCount,
    loading,
    error,
    page,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
}
