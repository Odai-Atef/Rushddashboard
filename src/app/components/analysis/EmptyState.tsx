import { Target, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'target' | 'folder';
}

export function EmptyState({ title, description, icon = 'target' }: EmptyStateProps) {
  const Icon = icon === 'folder' ? FolderOpen : Target;

  return (
    <div className="bg-muted/50 border border-border rounded-xl p-8 text-center">
      <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
