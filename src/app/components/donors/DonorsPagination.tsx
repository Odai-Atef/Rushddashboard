/**
 * Donors Pagination
 *
 * Pagination controls for the donors table including:
 * - Previous/Next buttons
 * - Page number buttons
 * - Items per page selector (10, 25, 50)
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/app/utils/cn';

interface DonorsPaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function DonorsPagination({
  page,
  totalPages,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: DonorsPaginationProps) {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = total > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-border">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        عرض {startItem}–{endItem} من {total} جهة مانحة
      </div>

      <div className="flex items-center gap-4">
        {/* Page controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={cn(
              'p-2 rounded-md transition-colors',
              page <= 1
                ? 'text-muted-foreground cursor-not-allowed opacity-50'
                : 'hover:bg-muted text-foreground'
            )}
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {pageNumbers.map((pageNum, index) => (
            <button
              key={index}
              onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
              disabled={typeof pageNum !== 'number'}
              className={cn(
                'min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors',
                typeof pageNum !== 'number'
                  ? 'cursor-default text-muted-foreground'
                  : pageNum === page
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
              )}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={cn(
              'p-2 rounded-md transition-colors',
              page >= totalPages
                ? 'text-muted-foreground cursor-not-allowed opacity-50'
                : 'hover:bg-muted text-foreground'
            )}
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            لكل صفحة:
          </span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 px-2 rounded-md border border-border bg-background text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
