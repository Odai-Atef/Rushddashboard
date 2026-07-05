/**
 * Notification Toast Hook
 *
 * Displays toast notifications for incoming push notifications.
 * Uses sonner toast library (already in dependencies).
 */
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { notificationSound } from '@/lib/notification-sound';
import type { Notification, NotificationPriority } from '@/api/services/notification-service';

function getPriorityColor(priority: NotificationPriority): string {
  switch (priority) {
    case 'URGENT':
      return '#dc2626'; // red-600
    case 'HIGH':
      return '#ea580c'; // orange-600
    case 'MEDIUM':
      return '#ca8a04'; // yellow-600
    case 'LOW':
    default:
      return '#2563eb'; // blue-600
  }
}

function getPriorityIcon(priority: NotificationPriority) {
  switch (priority) {
    case 'URGENT':
      return AlertTriangle;
    case 'HIGH':
      return AlertTriangle;
    case 'MEDIUM':
      return Info;
    case 'LOW':
    default:
      return CheckCircle;
  }
}

function getPriorityLabel(priority: NotificationPriority): string {
  switch (priority) {
    case 'URGENT':
      return 'عاجل';
    case 'HIGH':
      return 'مهم';
    case 'MEDIUM':
      return 'متوسط';
    case 'LOW':
    default:
      return 'عادي';
  }
}

export function useNotificationToast() {
  const navigate = useNavigate();

  const showNotificationToast = useCallback(
    (notification: Notification) => {
      const Icon = getPriorityIcon(notification.priority);
      const color = getPriorityColor(notification.priority);

      // Play sound for URGENT and HIGH priority
      notificationSound.play(notification.priority);

      toast.custom(
        (t) => (
          <div
            dir="rtl"
            onClick={() => {
              toast.dismiss(t);
              navigate('/dashboard/notifications');
            }}
            style={{
              background: '#fff',
              border: `2px solid ${color}`,
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              width: '360px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              direction: 'rtl',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={18} color={color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: color,
                    background: `${color}10`,
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}
                >
                  {getPriorityLabel(notification.priority)}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {new Date(notification.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '4px',
                  lineHeight: 1.4,
                }}
              >
                {notification.title}
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {notification.body}
              </p>
            </div>
          </div>
        ),
        {
          duration: 6000,
          position: 'top-left',
        }
      );
    },
    [navigate]
  );

  return { showNotificationToast };
}
