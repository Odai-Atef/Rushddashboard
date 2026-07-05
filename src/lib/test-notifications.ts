/**
 * Test Script: Simulate WebSocket Notifications
 *
 * Run this in browser console to test the notification system
 * without a real backend WebSocket connection.
 *
 * Usage:
 *   import('./test-notifications.js').then(m => m.simulateNotification())
 *   Or paste directly into browser console
 */

export function simulateNotification(
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'HIGH',
  title?: string,
  body?: string
) {
  const notification = {
    id: `test-${Date.now()}`,
    type: 'system_update',
    title: title || 'إشعار تجريبي',
    body: body || 'هذا إشعار تجريبي للتحقق من عمل النظام بشكل صحيح.',
    priority,
    channel: 'IN_APP' as const,
    status: 'SENT' as const,
    payload: { test: true, timestamp: new Date().toISOString() },
    readAt: null,
    deliveredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  // Dispatch custom event that the app listens to
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'rushd_test_notification',
      newValue: JSON.stringify(notification),
    })
  );

  // Also dispatch as regular custom event for immediate testing
  window.dispatchEvent(
    new CustomEvent('test-notification', { detail: notification })
  );

  console.log('[Test] Simulated notification:', notification);
  return notification;
}

export function simulateUrgentNotification() {
  return simulateNotification(
    'URGENT',
    'تنبيه عاجل',
    'هذا تنبيه عاجل يتطلب اهتمامك الفوري.'
  );
}

export function simulateMultipleNotifications(count: number = 3) {
  const priorities: ('LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const notifications = [];
  for (let i = 0; i < count; i++) {
    notifications.push(
      simulateNotification(
        priorities[i % priorities.length],
        `إشعار تجريبي #${i + 1}`,
        `هذا هو الإشعار التجريبي رقم ${i + 1} للتحقق من النظام.`
      )
    );
  }
  return notifications;
}

// Auto-expose to window for console testing
if (typeof window !== 'undefined') {
  (window as any).simulateNotification = simulateNotification;
  (window as any).simulateUrgentNotification = simulateUrgentNotification;
  (window as any).simulateMultipleNotifications = simulateMultipleNotifications;
}
