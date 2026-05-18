import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
      <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
