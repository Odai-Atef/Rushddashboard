/**
 * useConversationMessages Hook
 *
 * Manages messages for a single conversation: cursor pagination, optimistic
 * send, edit, delete, and mark-as-read. Keeps message ordering stable by
 * sorting on createdAt and de-duplicating by id.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  collaborationService,
  CreateMessageDto,
  Message,
  MessageFilters,
  MessagesResponse,
  UpdateMessageDto,
} from '@/api/services/collaboration-service';
import { ApiResponse } from '@/api/types';
import { getCollaborationErrorMessage } from '@/app/lib/error-messages';

const DEFAULT_LIMIT = 50;
const MAX_CONTENT_LENGTH = 10000;

export interface SendMessageOptions {
  replyToId?: string;
}

export interface UseConversationMessagesReturn {
  messages: Message[];
  cursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  loadMessages: (reset?: boolean) => Promise<void>;
  sendMessage: (content: string, options?: SendMessageOptions) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  retrySend: (messageId: string) => Promise<void>;
  clearError: () => void;
  appendMessage: (message: Message) => void;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateMessageContent(content: string): ValidationResult {
  const trimmed = content.trim();
  if (!trimmed) {
    return { valid: false, error: 'لا يمكن إرسال رسالة فارغة.' };
  }
  if (trimmed.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: 'الرسالة طويلة جداً. الحد الأقصى 10,000 حرف.' };
  }
  return { valid: true };
}

export function useConversationMessages(
  projectId: string | undefined,
  conversationId: string | null
): UseConversationMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const optimisticIdRef = useRef(0);
  const lastCreatedAtRef = useRef<number>(0);
  const readIdsRef = useRef<Set<string>>(new Set());
  const pendingReadRef = useRef<Set<string>>(new Set());

  const cleanupRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const nextCreatedAt = useCallback(() => {
    const now = Date.now();
    const next = Math.max(now, lastCreatedAtRef.current + 1);
    lastCreatedAtRef.current = next;
    return new Date(next).toISOString();
  }, []);

  const loadMessages = useCallback(
    async (reset: boolean = false) => {
      if (!projectId || !conversationId) return;

      cleanupRequest();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      const filters: MessageFilters = {
        limit: DEFAULT_LIMIT,
        ...(reset ? {} : cursor ? { cursor } : {}),
      };

      try {
        const response: ApiResponse<MessagesResponse> =
          await collaborationService.getConversationMessages(
            projectId,
            conversationId,
            filters,
            { signal: controller.signal }
          );

        if (!isMountedRef.current) return;

        const { data: page, nextCursor, hasMore: more } = response.data;

        setMessages((prev) => {
          const base = reset ? [] : prev;
          const merged = mergeMessages(base, page);
          return sortMessages(merged);
        });
        setCursor(nextCursor);
        setHasMore(more);
      } catch (err) {
        if ((err as Error)?.name === 'AbortError' && controller.signal.aborted) {
          return;
        }
        if (!isMountedRef.current) return;
        setError(getCollaborationErrorMessage(err));
      } finally {
        setIsLoading(false);
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [projectId, conversationId, cursor, cleanupRequest]
  );

  const sendMessage = useCallback(
    async (content: string, options?: SendMessageOptions): Promise<void> => {
      if (!projectId || !conversationId) return;

      const validation = validateMessageContent(content);
      if (!validation.valid) {
        setError(validation.error ?? 'رسالة غير صالحة');
        return;
      }

      const trimmed = content.trim();
      const optimisticId = `optimistic-${++optimisticIdRef.current}`;
      const now = nextCreatedAt();

      const optimisticMessage: Message = {
        id: optimisticId,
        conversationId,
        senderUserId: 'me',
        content: trimmed,
        messageType: 'TEXT',
        status: 'SENDING',
        replyToId: options?.replyToId ?? null,
        isPinned: false,
        editedAt: null,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      setIsSending(true);
      setMessages((prev) => sortMessages([...prev, optimisticMessage]));

      try {
        const dto: CreateMessageDto = {
          content: trimmed,
          messageType: 'TEXT',
          ...(options?.replyToId ? { replyToId: options.replyToId } : {}),
          attachmentIds: [],
        };
        const response = await collaborationService.sendMessage(
          projectId,
          conversationId,
          dto
        );

        if (!isMountedRef.current) return;

        const sent = response.data;
        setMessages((prev) => {
          const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
          const merged = mergeMessages(withoutOptimistic, [sent]);
          return sortMessages(merged);
        });
      } catch (err) {
        if (!isMountedRef.current) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...m, status: 'FAILED' as const } : m
          )
        );
        setError(getCollaborationErrorMessage(err));
        throw err;
      } finally {
        if (isMountedRef.current) {
          setIsSending(false);
        }
      }
    },
    [projectId, conversationId, nextCreatedAt]
  );

  const retrySend = useCallback(
    async (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      if (!message || message.status !== 'FAILED') return;

      if (!projectId || !conversationId) return;

      const validation = validateMessageContent(message.content);
      if (!validation.valid) {
        setError(validation.error ?? 'رسالة غير صالحة');
        return;
      }

      setIsSending(true);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: 'SENDING' as const } : m
        )
      );

      try {
        const dto: CreateMessageDto = {
          content: message.content.trim(),
          messageType: 'TEXT',
          ...(message.replyToId ? { replyToId: message.replyToId } : {}),
          attachmentIds: [],
        };
        const response = await collaborationService.sendMessage(
          projectId,
          conversationId,
          dto
        );

        if (!isMountedRef.current) return;

        const sent = response.data;
        setMessages((prev) => {
          const withoutFailed = prev.filter((m) => m.id !== messageId);
          const merged = mergeMessages(withoutFailed, [sent]);
          return sortMessages(merged);
        });
      } catch (err) {
        if (!isMountedRef.current) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, status: 'FAILED' as const } : m
          )
        );
        setError(getCollaborationErrorMessage(err));
        throw err;
      } finally {
        if (isMountedRef.current) {
          setIsSending(false);
        }
      }
    },
    [messages, projectId, conversationId]
  );

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!projectId || !content.trim()) return;

      const trimmed = content.trim();
      try {
        const response = await collaborationService.editMessage(projectId, messageId, {
          content: trimmed,
        });

        if (!isMountedRef.current) return;

        const updated = response.data;
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(getCollaborationErrorMessage(err));
      }
    },
    [projectId]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!projectId) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: 'تم حذف هذه الرسالة', deletedAt: new Date().toISOString() }
            : m
        )
      );

      try {
        await collaborationService.deleteMessage(projectId, messageId);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(getCollaborationErrorMessage(err));
      }
    },
    [projectId]
  );

  const markAsRead = useCallback(
    async (messageId: string) => {
      if (!projectId || readIdsRef.current.has(messageId) || pendingReadRef.current.has(messageId)) {
        return;
      }

      pendingReadRef.current.add(messageId);
      try {
        await collaborationService.markMessageAsRead(projectId, messageId);
        if (!isMountedRef.current) {
          pendingReadRef.current.delete(messageId);
          return;
        }
        readIdsRef.current.add(messageId);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId && m.status !== 'READ' ? { ...m, status: 'READ' as const } : m
          )
        );
      } catch {
        // Silently ignore read failures so chat UX is not interrupted.
      } finally {
        pendingReadRef.current.delete(messageId);
      }
    },
    [projectId]
  );

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => sortMessages(mergeMessages(prev, [message])));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    readIdsRef.current.clear();
    pendingReadRef.current.clear();
    setMessages([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
    setIsSending(false);
    lastCreatedAtRef.current = 0;
    if (projectId && conversationId) {
      loadMessages(true);
    }
    return () => {
      isMountedRef.current = false;
      cleanupRequest();
    };
  }, [projectId, conversationId, loadMessages, cleanupRequest]);

  return {
    messages,
    cursor,
    hasMore,
    isLoading,
    isSending,
    error,
    loadMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    retrySend,
    clearError,
    appendMessage,
  };
}

function mergeMessages(existing: Message[], incoming: Message[]): Message[] {
  const map = new Map<string, Message>();
  for (const m of existing) {
    map.set(m.id, m);
  }
  for (const m of incoming) {
    const current = map.get(m.id);
    if (!current || shouldReplace(current, m)) {
      map.set(m.id, m);
    }
  }
  return Array.from(map.values());
}

function shouldReplace(current: Message, incoming: Message): boolean {
  if (current.status === 'SENDING' || current.status === 'FAILED') {
    return incoming.status !== 'SENDING' && incoming.status !== 'FAILED';
  }
  return new Date(incoming.updatedAt).getTime() > new Date(current.updatedAt).getTime();
}

function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export default useConversationMessages;
