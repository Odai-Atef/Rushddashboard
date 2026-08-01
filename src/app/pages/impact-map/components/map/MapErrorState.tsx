'use client';

import { cn } from '@/app/utils/cn';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface MapErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function MapErrorState({
  message = 'حدث خطأ أثناء تحميل بيانات الخارطة. يرجى المحاولة مرة أخرى.',
  onRetry,
  className,
}: MapErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'w-full h-full min-h-[320px] p-8',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-5',
          'bg-[var(--impact-danger)]/10 text-[var(--impact-danger)]'
        )}
      >
        <AlertTriangle className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--impact-text-primary)' }}
      >
        تعذر تحميل الخارطة
      </h3>
      <p
        className="text-sm max-w-xs leading-relaxed mb-6"
        style={{ color: 'var(--impact-text-muted)' }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl',
            'bg-[var(--impact-primary)] text-white text-sm font-medium',
            'hover:bg-[var(--impact-primary-hover)] transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--impact-primary)]/40'
          )}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
