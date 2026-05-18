import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ChatSession, ChatMessage } from '../types/chat';

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  messages: ChatMessage[];
  isLoadingSessions: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  error: string | null;
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSession: (session: ChatSession | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  setIsLoadingSessions: (loading: boolean) => void;
  setIsLoadingMessages: (loading: boolean) => void;
  setIsSendingMessage: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
    );
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSession,
        messages,
        isLoadingSessions,
        isLoadingMessages,
        isSendingMessage,
        error,
        setSessions,
        setActiveSession,
        setMessages,
        addMessage,
        updateMessage,
        setIsLoadingSessions,
        setIsLoadingMessages,
        setIsSendingMessage,
        setError,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}