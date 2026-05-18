import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  getChatSessionMessages,
  sendChatMessage,
} from '../services/chat';
import { useChatContext } from './useChatContext';
import type { ChatMessage } from '../types/chat';

export function useChatMessages() {
  const {
    messages,
    setMessages,
    activeSession,
    isLoadingMessages,
    setIsLoadingMessages,
    isSendingMessage,
    setIsSendingMessage,
    addMessage,
    updateMessage,
    setError,
  } = useChatContext();

  const [hasMore, setHasMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(
    async (sessionId: string, limit = 50, offset = 0) => {
      if (!sessionId) return;

      setIsLoadingMessages(true);
      setError(null);

      try {
        const response = await getChatSessionMessages(sessionId, limit, offset);
        if (offset === 0) {
          setMessages(response.messages);
        } else {
          setMessages((prev) => [...response.messages, ...prev]);
        }
        setHasMore(response.messages.length === limit);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'فشل في تحميل الرسائل';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [setMessages, setIsLoadingMessages, setError]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeSession || !content.trim() || isSendingMessage) {
        return null;
      }

      setIsSendingMessage(true);
      setError(null);

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: ChatMessage = {
        id: tempId,
        sessionId: activeSession.id,
        role: 'user',
        content: content.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      addMessage(optimisticMessage);

      try {
        const response = await sendChatMessage(activeSession.id, {
          content: content.trim(),
        });

        updateMessage(tempId, {
          id: response.userMessage.id,
          status: 'sent',
          createdAt: response.userMessage.createdAt,
        });

        addMessage({
          ...response.assistantMessage,
          status: 'sent',
        });

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'فشل في إرسال الرسالة';
        updateMessage(tempId, { status: 'failed' });
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [activeSession, isSendingMessage, addMessage, updateMessage, setIsSendingMessage, setError]
  );

  const retryMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!activeSession) return null;

      updateMessage(messageId, { status: 'pending' });

      try {
        const response = await sendChatMessage(activeSession.id, { content });
        updateMessage(messageId, {
          id: response.userMessage.id,
          status: 'sent',
          createdAt: response.userMessage.createdAt,
        });
        addMessage({
          ...response.assistantMessage,
          status: 'sent',
        });
        return response;
      } catch (err) {
        updateMessage(messageId, { status: 'failed' });
        const message = err instanceof Error ? err.message : 'فشل في إعادة إرسال الرسالة';
        toast.error(message);
        return null;
      }
    },
    [activeSession, updateMessage, addMessage]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  return {
    messages,
    isLoadingMessages,
    isSendingMessage,
    hasMore,
    fetchMessages,
    sendMessage,
    retryMessage,
    scrollToBottom,
    messagesEndRef,
  };
}
