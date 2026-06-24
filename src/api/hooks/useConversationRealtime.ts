/**
 * useConversationRealtime Hook
 *
 * Subscribes to real-time conversation events via SSE if the backend exposes a
 * stream endpoint. Falls back gracefully to standard fetch when the transport
 * is unavailable. Currently uses a generic SSE URL pattern that can be adapted
 * once the backend contract is known.
 */

import { useCallback, useEffect, useRef } from 'react';
import { AUTH_CONFIG } from '@/api/config';
import apiClient from '@/api/client';
import { Message } from '@/api/services/collaboration-service';

const REALTIME_ENABLED = false;

export interface UseConversationRealtimeReturn {
  isConnected: boolean;
}

export function useConversationRealtime(
  projectId: string | undefined,
  conversationId: string | null,
  onMessage: (message: Message) => void
): UseConversationRealtimeReturn {
  const isConnectedRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (!REALTIME_ENABLED || !projectId || !conversationId) {
      isConnectedRef.current = false;
      return null;
    }

    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) || '';
    if (!token) {
      isConnectedRef.current = false;
      return null;
    }

    const baseURL = apiClient.defaults.baseURL;
    const url = `${baseURL}/api/v1/projects/${projectId}/conversations/${conversationId}/stream?token=${encodeURIComponent(token)}`;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(url);
      eventSource.onopen = () => {
        isConnectedRef.current = true;
      };
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.type === 'conversation:message' && payload?.data) {
            onMessageRef.current(payload.data as Message);
          }
        } catch {
          // Ignore malformed events.
        }
      };
      eventSource.onerror = () => {
        isConnectedRef.current = false;
      };
    } catch {
      isConnectedRef.current = false;
      return null;
    }

    return eventSource;
  }, [projectId, conversationId]);

  useEffect(() => {
    const eventSource = connect();
    return () => {
      isConnectedRef.current = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [connect]);

  return { isConnected: isConnectedRef.current };
}

export default useConversationRealtime;
