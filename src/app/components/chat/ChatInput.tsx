import { useState, KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!content.trim() || disabled) return;
    onSend(content.trim());
    setContent('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t bg-background p-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="اكتب رسالتك هنا..."
        disabled={disabled}
        className="max-h-32 min-h-[52px] resize-none"
        rows={1}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={disabled || !content.trim()}
        className="size-10 shrink-0"
      >
        {disabled ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </div>
  );
}
