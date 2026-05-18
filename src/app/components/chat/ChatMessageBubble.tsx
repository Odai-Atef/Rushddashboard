import { memo } from 'react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import type { ChatMessage } from '../../types/chat';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string, content: string) => void;
}

export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
  onRetry,
}: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const isFailed = message.status === 'failed';

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'relative max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>

        <div className="mt-2 flex items-center justify-end gap-2">
          {isFailed && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1 px-2 py-1 text-xs"
              onClick={() => onRetry(message.id, message.content)}
            >
              <RefreshCw className="size-3" />
              إعادة المحاولة
            </Button>
          )}

          {message.status === 'pending' && (
            <span className="text-xs opacity-70">جاري الإرسال...</span>
          )}

          {isFailed && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" />
              فشل الإرسال
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
