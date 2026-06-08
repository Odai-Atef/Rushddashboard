/**
 * Donors Filters
 *
 * Search and filter bar for the donors table.
 * Includes: search by name, type filter dropdown, funding area filter dropdown.
 */

import { Search, X } from 'lucide-react';
import { DonorType, DONOR_TYPE_LABELS } from '@/types/donors';
import { cn } from '@/app/utils/cn';

interface DonorsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: DonorType | null;
  onTypeChange: (type: DonorType | null) => void;
  selectedFundingArea: string | null;
  onFundingAreaChange: (area: string | null) => void;
  availableFundingAreas: string[];
  activeFiltersCount: number;
  onClearAll: () => void;
}

export function DonorsFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedFundingArea,
  onFundingAreaChange,
  availableFundingAreas,
  activeFiltersCount,
  onClearAll,
}: DonorsFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search and Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث باسم الجهة المانحة..."
            className="w-full pr-10 pl-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <select
          value={selectedType || ''}
          onChange={(e) => {
            const value = e.target.value;
            onTypeChange(value ? (value as DonorType) : null);
          }}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">جميع الأنواع</option>
          {(Object.entries(DONOR_TYPE_LABELS) as [DonorType, string][]).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>

        {/* Funding Area Filter */}
        <select
          value={selectedFundingArea || ''}
          onChange={(e) => {
            const value = e.target.value;
            onFundingAreaChange(value || null);
          }}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[180px]"
        >
          <option value="">جميع مجالات التمويل</option>
          {availableFundingAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        {/* Clear All */}
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            مسح الفلاتر ({activeFiltersCount})
          </button>
        )}
      </div>
    </div>
  );
}
