/**
 * Service Worker for Web Push Notifications
 *
 * Handles:
 * - Installation and activation
 * - Push notification events from backend
 * - Notification click to focus/open app
 * - Custom notification icons and actions
 *
 * NOTE: This is a plain JavaScript file (NOT TypeScript).
 * It runs directly in the browser's service worker environment.
 */

// Notification icon (must be available in public/)
const NOTIFICATION_ICON = '/logo.png';
const NOTIFICATION_BADGE = '/logo.png';

// Priority colors for notifications
const PRIORITY_COLORS = {
  URGENT: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#ca8a04',
  LOW: '#2563eb',
};

const PRIORITY_LABELS = {
  URGENT: 'عاجل',
  HIGH: 'مهم',
  MEDIUM: 'متوسط',
  LOW: 'عادي',
};

// Listen for push events from server
self.addEventListener('push', function(event) {
  if (!event.data) return;

  try {
    var data = event.data.json();

    var priority = data.priority || 'LOW';
    var color = PRIORITY_COLORS[priority] || PRIORITY_COLORS.LOW;
    var label = PRIORITY_LABELS[priority] || PRIORITY_LABELS.LOW;

    var notificationOptions = {
      body: data.body,
      icon: NOTIFICATION_ICON,
      badge: NOTIFICATION_BADGE,
      tag: data.id,
      requireInteraction: priority === 'URGENT' || priority === 'HIGH',
      vibrate: priority === 'URGENT' ? [500, 200, 500, 200, 500] : [200, 100, 200],
      data: {
        notificationId: data.id,
        type: data.type,
        priority: data.priority,
        payload: data.payload,
        url: '/dashboard/notifications',
      },
      actions: [
        {
          action: 'view',
          title: 'عرض',
        },
        {
          action: 'dismiss',
          title: 'تجاهل',
        },
      ],
      // Arabic RTL support
      dir: 'rtl',
      lang: 'ar',
    };

    event.waitUntil(
      self.registration.showNotification(label + ' · ' + data.title, notificationOptions)
    );
  } catch (err) {
    console.error('[SW] Failed to show push notification:', err);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var notificationData = event.notification.data || {};

  if (event.action === 'dismiss') {
    return;
  }

  var targetUrl = notificationData.url || '/dashboard/notifications';

  // Focus existing window or open new one
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Find existing window and navigate
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
            return client.navigate(targetUrl).then(function() {
              return client.focus();
            });
          }
        }
        // Open new window if none exists
        return self.clients.openWindow(targetUrl);
      })
  );
});

// Activate immediately
self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
