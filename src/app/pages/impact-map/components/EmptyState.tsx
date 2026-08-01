import { Search, FolderOpen } from 'lucide-react';
import { cn } from '@/app/utils/cn';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'لا توجد بيانات',
  description = 'لم يتم العثور على أي بيانات حالياً. حاول تعديل الفلاتر أو المحاولة لاحقاً.',
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
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
          'bg-[var(--primary)]/[0.08] flex items-center justify-center mb-5'
        )}
      >
        {icon ?? (
          <Search className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary)]/[0.5]" />
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-md leading-relaxed mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={cn(
            'px-6 py-2.5 rounded-lg text-sm font-medium',
            'bg-[var(--primary)] text-[var(--primary-foreground)]',
            'hover:bg-[var(--primary)]/90 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40',
            'min-h-[44px]'
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyProjectsState({ className, onAction }: { className?: string; onAction?: () => void }) {
  return (
    <EmptyState
      title="لا توجد مشاريع"
      description="لم يتم العثور على مشاريع تطابق معايير البحث الحالية."
      actionLabel="عرض جميع المشاريع"
      onAction={onAction}
      icon={<FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary)]/[0.5]" />}
      className={className}
    />
  );
}
