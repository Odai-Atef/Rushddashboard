import { Search, Loader2, FilterX } from 'lucide-react';

interface OrganizationDonorsFiltersProps {
  projects: { id: string; name: string }[];
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
  projects,
  statusFilter,
  projectFilter,
  searchQuery,
  onStatusChange,
  onProjectChange,
  onSearchChange,
  onClear,
  isLoading,
}: OrganizationDonorsFiltersProps) {
  const hasFilters = statusFilter || projectFilter || searchQuery;

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)] space-y-3 sm:space-y-[var(--spacing-section-gap)]" dir="rtl">
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-[var(--spacing-small-gap)]">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث بالجهة المانحة أو المشروع..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 text-sm border border-border rounded-lg bg-background text-card-foreground text-right"
          />
        </div>

        {/* Status dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-card-foreground min-w-0 sm:min-w-[160px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Project dropdown */}
        <select
          value={projectFilter}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-card-foreground min-w-0 sm:min-w-[200px]"
        >
          <option value="">جميع المشاريع</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center justify-center gap-[var(--spacing-small-gap)] px-3 py-2.5 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <FilterX className="w-4 h-4" />
            مسح الفلاتر
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-[var(--spacing-small-gap)] text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          جارٍ التحميل...
        </div>
      )}
    </div>
  );
}
