import { Loader2 } from 'lucide-react';

interface PanelLoadingProps {
  message?: string;
}

export function PanelLoading({ message = 'جاري التحميل...' }: PanelLoadingProps) {
  return (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="w-5 h-5 animate-spin ml-2" />
      <span>{message}</span>
    </div>
  );
}
