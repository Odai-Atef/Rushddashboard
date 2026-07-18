/**
 * Notifications Page
 *
 * Displays real-time notifications fetched from backend API.
 * Integrates with useNotifications hook for REST API and useNotificationRealtime for WebSocket updates.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Bell,
  Sparkles,
  AlertCircle,
  Info,
  X,
  ExternalLink,
  Calendar,
  Users,
  Package,
  Activity,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useNotifications } from '@/api/hooks/useNotifications';
import { useNotificationRealtime } from '@/api/hooks/useNotificationRealtime';
import { useNotificationToast } from '@/api/hooks/useNotificationToast';
import { useAuth } from '@/app/layouts/RootLayout';
import type { Notification, NotificationPriority } from '@/api/services/notification-service';

type CategoryFilter = 'all' | 'system_update' | 'project_alert' | 'ai_recommendation' | 'operational';
type PriorityFilter = 'all' | NotificationPriority;
type StatusFilter = 'all' | 'unread' | 'read';

const categoryConfig: Record<string, { label: string; icon: typeof AlertTriangle; color: string }> = {
  system_update: { label: 'تحديث النظام', icon: Zap, color: '#2563eb' },
  project_alert: { label: 'تنبيه المشروع', icon: AlertTriangle, color: '#dc2626' },
  ai_recommendation: { label: 'توصية ذكية', icon: Sparkles, color: '#7c3aed' },
  operational: { label: 'تشغيلي', icon: Activity, color: '#059669' },
};

function getPriorityConfig(priority: NotificationPriority) {
  switch (priority) {
    case 'URGENT':
      return { label: 'عاجل', color: '#dc2626', bgColor: '#fef2f2', icon: AlertTriangle };
    case 'HIGH':
      return { label: 'مهم', color: '#ea580c', bgColor: '#fff7ed', icon: AlertTriangle };
    case 'MEDIUM':
      return { label: 'متوسط', color: '#ca8a04', bgColor: '#fefce8', icon: Info };
    case 'LOW':
    default:
      return { label: 'عادي', color: '#2563eb', bgColor: '#eff6ff', icon: CheckCircle };
  }
}

function getCategoryIcon(type: string) {
  const config = categoryConfig[type] || categoryConfig.operational;
  return config.icon;
}

function getCategoryLabel(type: string) {
  const config = categoryConfig[type] || categoryConfig.operational;
  return config.label;
}

function getCategoryColor(type: string) {
  const config = categoryConfig[type] || categoryConfig.operational;
  return config.color;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const {
    notifications,
    total,
    unreadCount,
    loading,
    error,
    hasMore,
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

  // Connect to real-time notifications
  useEffect(() => {
    if (user?.id) {
      connect(user.id);
    }
    return () => disconnect();
  }, [user?.id, connect, disconnect]);

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Filter notifications locally
  const filteredNotifications = notifications.filter((n) => {
    const categoryMatch = selectedCategory === 'all' || n.type === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || n.priority === selectedPriority;
    const statusMatch =
      selectedStatus === 'all' ||
      (selectedStatus === 'unread' && n.status !== 'READ') ||
      (selectedStatus === 'read' && n.status === 'READ');
    return categoryMatch && priorityMatch && statusMatch;
  });

  const handleMarkAsReadClick = async (id: string) => {
    await markAsRead(id);
    if (selectedNotification?.id === id) {
      setSelectedNotification((prev) => (prev ? { ...prev, status: 'READ', readAt: new Date().toISOString() } : null));
    }
  };

  const handleMarkAllAsReadClick = async () => {
    await markAllAsRead();
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications({ page: Math.floor(notifications.length / 20) + 1 });
    }
  };

  const formatRelativeTime = (dateString: string) => {
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
  };

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الإشعارات والتنبيهات</h1>
            <p className="text-sm text-muted-foreground">
              لديك {unreadCount} إشعار{unreadCount !== 1 ? 'ات' : ''} غير مقروءة
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsReadClick}
            disabled={unreadCount === 0 || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            تحديد الكل كمقروء
          </button>
          <button
            onClick={() => fetchNotifications({ page: 1 })}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            تحديث
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={() => fetchNotifications({ page: 1 })}
            className="mr-auto text-sm font-medium hover:underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
            className="px-3 py-2 border rounded-lg text-sm bg-background"
          >
            <option value="all">جميع الحالات</option>
            <option value="unread">غير مقروء</option>
            <option value="read">مقروء</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as PriorityFilter)}
            className="px-3 py-2 border rounded-lg text-sm bg-background"
          >
            <option value="all">جميع الأولويات</option>
            <option value="URGENT">عاجل</option>
            <option value="HIGH">مهم</option>
            <option value="MEDIUM">متوسط</option>
            <option value="LOW">عادي</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
            className="px-3 py-2 border rounded-lg text-sm bg-background"
          >
            <option value="all">جميع الأنواع</option>
            <option value="system_update">تحديث النظام</option>
            <option value="project_alert">تنبيه المشروع</option>
            <option value="ai_recommendation">توصية ذكية</option>
            <option value="operational">تشغيلي</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading && notifications.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {filteredNotifications.map((notification) => {
          const priorityConfig = getPriorityConfig(notification.priority);
          const CategoryIcon = getCategoryIcon(notification.type);
          const isUnread = notification.status !== 'READ';

          return (
            <div
              key={notification.id}
              onClick={() => setSelectedNotification(notification)}
              className={cn(
                'group relative p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md',
                isUnread ? 'bg-white border-l-4 border-l-amber-500' : 'bg-muted/30 border-transparent'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: getCategoryColor(notification.type) + '15' }}
                >
                  <CategoryIcon className="w-5 h-5" style={{ color: getCategoryColor(notification.type) }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: priorityConfig.bgColor,
                        color: priorityConfig.color,
                      }}
                    >
                      {priorityConfig.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getCategoryLabel(notification.type)}
                    </span>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </div>

                  <h3 className={cn('font-semibold mb-1', isUnread ? 'text-foreground' : 'text-muted-foreground')}>
                    {notification.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {notification.body}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isUnread && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsReadClick(notification.id);
                      }}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="تحديد كمقروء"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  <button
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && !loading && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
            <p className="text-muted-foreground">ستظهر الإشعارات الجديدة هنا عند وصولها</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              'تحميل المزيد'
            )}
          </button>
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: getCategoryColor(selectedNotification.type) + '15' }}
                  >
                    {(() => {
                      const Icon = getCategoryIcon(selectedNotification.type);
                      return <Icon className="w-5 h-5" style={{ color: getCategoryColor(selectedNotification.type) }} />;
                    })()}
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1"
                      style={{
                        background: getPriorityConfig(selectedNotification.priority).bgColor,
                        color: getPriorityConfig(selectedNotification.priority).color,
                      }}
                    >
                      {getPriorityConfig(selectedNotification.priority).label}
                    </span>
                    <h2 className="text-xl font-bold">{selectedNotification.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4">
                <p className="text-base leading-relaxed">{selectedNotification.body}</p>

                {selectedNotification.payload && Object.keys(selectedNotification.payload).length > 0 && (
                  <div className="bg-muted rounded-xl p-4 hidden">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      بيانات إضافية
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedNotification.payload).map(([key, value]) => (
                        <div key={key} className="bg-background rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">{key}</div>
                          <div className="text-sm font-medium">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    تاريخ الإنشاء: {new Date(selectedNotification.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                  {selectedNotification.readAt && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      تم القراءة: {new Date(selectedNotification.readAt).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t">
                {selectedNotification.status !== 'READ' && (
                  <button
                    onClick={() => {
                      handleMarkAsReadClick(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 border border-border hover:bg-accent rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    تحديد كمقروء
                  </button>
                )}
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-6 py-2.5 border border-border hover:bg-accent rounded-lg transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
