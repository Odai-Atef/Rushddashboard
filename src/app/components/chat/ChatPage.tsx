import { useEffect, useCallback } from 'react';
import { useChatContext } from '../../hooks/useChatContext';
import { useChatSessions } from '../../hooks/useChatSessions';
import { useChatMessages } from '../../hooks/useChatMessages';
import { ChatSessionList } from './ChatSessionList';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';

export function ChatPage() {
  const { activeSession, setActiveSession, error, clearError } = useChatContext();
  const {
    sessions,
    isLoading: isLoadingSessions,
    isCreating,
    createSession,
    deleteSession,
  } = useChatSessions();

  const {
    messages,
    isLoadingMessages,
    isSendingMessage,
    fetchMessages,
    sendMessage,
    retryMessage,
    messagesEndRef,
  } = useChatMessages();

  const handleSelectSession = useCallback(
    async (session) => {
      setActiveSession(session);
      clearError();
    },
    [setActiveSession, clearError]
  );

  const handleCreateSession = useCallback(async () => {
    const newSession = await createSession();
    if (newSession) {
      setActiveSession(newSession);
      clearError();
    }
  }, [createSession, setActiveSession, clearError]);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id);
    }
  }, [activeSession, fetchMessages]);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Session List Sidebar */}
      <div className="hidden w-80 shrink-0 rounded-lg border bg-card md:block">
        <ChatSessionList
          sessions={sessions}
          activeSession={activeSession}
          isLoading={isLoadingSessions}
          isCreating={isCreating}
          onSelectSession={handleSelectSession}
          onCreateSession={handleCreateSession}
          onDeleteSession={deleteSession}
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col rounded-lg border bg-card">
        {activeSession ? (
          <>
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">
                {activeSession.title || 'محادثة جديدة'}
              </h3>
            </div>

            {error && (
              <div className="flex items-center gap-2 border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                <span>{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-auto h-auto px-2 py-1"
                  onClick={clearError}
                >
                  إغلاق
                </Button>
              </div>
            )}

            <ChatMessageList
              messages={messages}
              isLoading={isLoadingMessages}
              isSending={isSendingMessage}
              messagesEndRef={messagesEndRef}
              onRetry={retryMessage}
            />

            <ChatInput
              onSend={sendMessage}
              disabled={isSendingMessage}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="space-y-2">
              <p className="text-lg font-medium">اختر محادثة</p>
              <p className="text-sm text-muted-foreground">
                اختر محادثة من القائمة أو ابدأ محادثة جديدة
              </p>
            </div>
            <Button onClick={handleCreateSession} disabled={isCreating}>
              {isCreating ? 'جاري الإنشاء...' : 'بدء محادثة جديدة'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
