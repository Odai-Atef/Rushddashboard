import { AlertTriangle } from 'lucide-react';

interface UnknownWidgetProps {
  type: string;
  title: string;
}

export function UnknownWidget({ type, title }: UnknownWidgetProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
      <AlertTriangle className="h-8 w-8 text-yellow-500 mb-3" />
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">
        نوع العنصر "{type}" غير مدعوم
      </p>
    </div>
  );
}
