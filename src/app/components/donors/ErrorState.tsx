/**
 * Error State
 *
 * Displayed when the API request fails. Shows a user-friendly
 * error message with a retry button.
 */

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiError } from '@/api/types';

interface ErrorStateProps {
  error: ApiError | null;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error?.message || 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />

      <h3 className="text-lg font-semibold text-foreground mb-2">
        فشل تحميل البيانات
      </h3>

      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        إعادة المحاولة
      </button>
    </div>
  );
}
