import { AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '@/app/utils/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'عذراً، حدث خطأ',
  message = 'تعذر تحميل البيانات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'p-[var(--spacing-card-padding)] sm:p-12',
        'min-h-[200px]',
        className
      )}
    >
      <div
        className={cn(
          'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl',
          'bg-[var(--destructive)]/[0.08] flex items-center justify-center mb-5'
        )}
      >
        <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--destructive)]/[0.7]" />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-md leading-relaxed mb-6">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium',
            'bg-[var(--primary)] text-[var(--primary-foreground)]',
            'hover:bg-[var(--primary)]/90 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40',
            'min-h-[44px]'
          )}
        >
          <RotateCcw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
