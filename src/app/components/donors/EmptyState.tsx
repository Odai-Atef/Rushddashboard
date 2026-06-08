/**
 * Empty State
 *
 * Displayed when no donors are available or no results match
 * the applied filters. Provides a friendly message to users.
 */

import { Inbox, SearchX } from 'lucide-react';

interface EmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ hasFilters = false, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {hasFilters ? (
        <SearchX className="w-16 h-16 text-muted-foreground mb-4" />
      ) : (
        <Inbox className="w-16 h-16 text-muted-foreground mb-4" />
      )}

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {hasFilters ? 'لا توجد نتائج مطابقة' : 'لا توجد جهات مانحة'}
      </h3>

      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {hasFilters
          ? 'جرب تعديل معايير البحث أو الفلاتر للعثور على ما تبحث عنه.'
          : 'لم يتم العثور على أي جهات مانحة في النظام حالياً.'}
      </p>

      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          مسح الفلاتر
        </button>
      )}
    </div>
  );
}
