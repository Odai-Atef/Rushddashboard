/**
 * Notification Real-Time Hook (Socket.IO)
 *
 * Connects to backend WebSocket gateway at /notifications namespace
 * to receive real-time push notifications.
 */
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { AUTH_CONFIG } from '@/api/config';
import { ENV } from '@/lib/env';
import type { Notification } from '@/api/services/notification-service';

const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

interface NotificationRealtimeHook {
  connect: (userId: string) => void;
  disconnect: () => void;
  isConnected: () => boolean;
}

type NotificationCallback = (notification: Notification) => void;

export function useNotificationRealtime(onNotification: NotificationCallback): NotificationRealtimeHook {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getSocketUrl = useCallback(() => {
    return ENV.WEBSOCKET_BASE_URL;
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) || '';
  }, []);

  const connect = useCallback(
    (userId: string) => {
      if (socketRef.current?.connected) return;

      const token = getToken();
      if (!token) {
        console.warn('[NotificationRealtime] No auth token found, skipping connection');
        return;
      }

      const socketUrl = getSocketUrl();
      console.log('[NotificationRealtime] Connecting to:', socketUrl);

      const socket = io(`${socketUrl}/notifications`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: false, // We handle reconnection manually
      });

      socket.on('connect', () => {
        console.log('[NotificationRealtime] Connected, joining room for user:', userId);
        reconnectAttempts.current = 0;
        socket.emit('join', { userId });
      });

      socket.on('notification:new', (data: Notification) => {
        console.log('[NotificationRealtime] New notification:', data);
        onNotification(data);
      });

      socket.on('connect_error', (err) => {
        console.error('[NotificationRealtime] Connection error:', err.message);
        socket.disconnect();

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current - 1);
          console.log(`[NotificationRealtime] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`);
          reconnectTimerRef.current = setTimeout(() => {
            connect(userId);
          }, delay);
        } else {
          console.error('[NotificationRealtime] Max reconnect attempts reached');
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('[NotificationRealtime] Disconnected:', reason);
      });

      socketRef.current = socket;
    },
    [getToken, getSocketUrl, onNotification]
  );

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.emit('leave', { userId: socketRef.current.id });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    reconnectAttempts.current = 0;
  }, []);

  const isConnected = useCallback(() => {
    return socketRef.current?.connected ?? false;
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, isConnected };
}
