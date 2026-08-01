import { AlertCircle, RefreshCw } from 'lucide-react';

interface PanelErrorProps {
 message: string;
 onRetry?: () => void;
 retryLabel?: string;
}

export function PanelError({
 message,
 onRetry,
 retryLabel = 'إعادة المحاولة',
}: PanelErrorProps) {
 return (
 <div className="flex flex-col items-center justify-center p-8 text-center">
 <AlertCircle className="w-8 h-8 text-[var(--destructive)] mb-3" />
 <p className="text-foreground mb-4 max-w-md">{message}</p>
 {onRetry && (
 <button
 onClick={onRetry}
 className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
 >
 <RefreshCw className="w-4 h-4" />
 <span>{retryLabel}</span>
 </button>
 )}
 </div>
 );
}
