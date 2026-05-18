import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getChatSessions, createChatSession, deleteChatSession } from '../services/chat';
import { useChatContext } from './useChatContext';
import type { ChatSession } from '../types/chat';

export function useChatSessions() {
  const {
    sessions,
    setSessions,
    isLoadingSessions,
    setIsLoadingSessions,
    setError,
  } = useChatContext();

  const [isCreating, setIsCreating] = useState(false);

  const fetchSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    setError(null);

    try {
      const response = await getChatSessions();
      setSessions(response.sessions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل في تحميل المحادثات';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [setSessions, setIsLoadingSessions, setError]);

  const createSession = useCallback(
    async (title?: string) => {
      setIsCreating(true);
      setError(null);

      try {
        const response = await createChatSession({ title });
        const newSession = response.session;
        setSessions((prev) => [newSession, ...prev]);
        toast.success('تم إنشاء محادثة جديدة');
        return newSession;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'فشل في إنشاء المحادثة';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [setSessions, setError]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await deleteChatSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success('تم حذف المحادثة');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'فشل في حذف المحادثة';
        setError(message);
        toast.error(message);
        return false;
      }
    },
    [setSessions, setError]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    isLoading: isLoadingSessions,
    isCreating,
    fetchSessions,
    createSession,
    deleteSession,
  };
}