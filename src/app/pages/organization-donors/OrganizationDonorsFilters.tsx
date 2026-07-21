import { useMemo } from 'react';
import { Search, Loader2, Building2, Calendar, Coins, FilterX } from 'lucide-react';
import { OrganizationDonorMatch } from '@/api/services/project-service';

interface OrganizationDonorsFiltersProps {
  donors: OrganizationDonorMatch[];
  statusFilter: string;
  projectFilter: string;
  searchQuery: string;
  onStatusChange: (status: string) => void;
  onProjectChange: (projectId: string) => void;
  onSearchChange: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: '', label: 'جميع الحالات' },
  { value: 'SUBMITTED', label: 'تم الإرسال' },
  { value: 'ACCEPTED', label: 'تم القبول' },
  { value: 'FUNDED', label: 'تم التمويل' },
  { value: 'REJECTED', label: 'تم الاعتذار' },
];

export function OrganizationDonorsFilters({
  donors,
  statusFilter,
  projectFilter,
  searchQuery,
  onStatusChange,
  onProjectChange,
  onSearchChange,
  onClear,
  isLoading,
}: OrganizationDonorsFiltersProps) {
  // Unique projects from donor data
  const projects = useMemo(() => {
    const map = new Map<string, string>();
    donors.forEach((d) => {
      if (d.projectId && d.projectName) {
        map.set(d.projectId, d.projectName);
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1], 'ar'));
  }, [donors]);

  const hasFilters = statusFilter || projectFilter || searchQuery;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث بالجهة المانحة أو المشروع..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground text-right"
          />
        </div>

        {/* Status dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground min-w-[160px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Project dropdown */}
        <select
          value={projectFilter}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground min-w-[200px]"
        >
          <option value="">جميع المشاريع</option>
          {projects.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FilterX className="w-4 h-4" />
            مسح الفلاتر
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          جارٍ التحميل...
        </div>
      )}
    </div>
  );
}
