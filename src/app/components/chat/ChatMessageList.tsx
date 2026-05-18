import { memo } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { ChatMessage } from '../../types/chat';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onRetry?: (messageId: string, content: string) => void;
}

export const ChatMessageList = memo(function ChatMessageList({
  messages,
  isLoading,
  isSending,
  messagesEndRef,
  onRetry,
}: ChatMessageListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-start">
          <Skeleton className="h-20 w-[70%]" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-16 w-[60%]" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="h-24 w-[80%]" />
        </div>
      </div>
    );
  }

  if (messages.length === 0 && !isSending) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="space-y-2">
          <p className="text-lg font-medium">ابدأ محادثة</p>
          <p className="text-sm text-muted-foreground">
            اكتب رسالتك الأولى لبدء المحادثة مع المساعد الذكي
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="flex flex-col gap-4 py-4">
        {messages.map((message) => (
          <ChatMessageBubble
            key={message.id}
            message={message}
            onRetry={onRetry}
          />
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
              <div className="flex gap-1">
                <span className="size-2 animate-bounce rounded-full bg-foreground/50" />
                <span className="size-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.1s]" />
                <span className="size-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.2s]" />
              </div>
              <span className="text-sm text-muted-foreground">
                يكتب...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
});
