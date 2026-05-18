import { memo } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import type { ChatSession } from '../../types/chat';
import { formatChatDate } from '../../utils/chat';

interface ChatSessionListProps {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isLoading: boolean;
  isCreating: boolean;
  onSelectSession: (session: ChatSession) => void;
  onCreateSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const ChatSessionList = memo(function ChatSessionList({
  sessions,
  activeSession,
  isLoading,
  isCreating,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}: ChatSessionListProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-2 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">المحادثات</h2>
        <Button
          size="sm"
          onClick={onCreateSession}
          disabled={isCreating}
          className="gap-1"
        >
          <Plus className="size-4" />
          {isCreating ? 'جاري الإنشاء...' : 'محادثة جديدة'}
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <MessageSquare className="size-12 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">لا توجد محادثات</p>
            <p className="text-sm text-muted-foreground">
              ابدأ محادثة جديدة مع المساعد الذكي
            </p>
          </div>
          <Button onClick={onCreateSession} disabled={isCreating}>
            <Plus className="size-4" />
            {isCreating ? 'جاري الإنشاء...' : 'بدء محادثة جديدة'}
          </Button>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`group flex items-start gap-3 rounded-lg p-3 text-right transition-colors hover:bg-accent ${
                  activeSession?.id === session.id
                    ? 'bg-accent'
                    : 'bg-transparent'
                }`}
              >
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {session.title || 'محادثة جديدة'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatChatDate(session.updatedAt)}</span>
                    <span>·</span>
                    <span>{session.messageCount} رسائل</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
});
