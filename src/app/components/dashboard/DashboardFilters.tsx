import { useDashboardContext } from '../../hooks/useDashboardContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { FilterDefinition, FilterValue } from '../../types/dashboard';

interface DashboardFiltersProps {
  filters: FilterDefinition[];
}

export function DashboardFilters({ filters }: DashboardFiltersProps) {
  const { activeFilters, setActiveFilters } = useDashboardContext();

  const handleFilterChange = (filterId: string, value: unknown) => {
    const newFilters = activeFilters.filter((f) => f.filterId !== filterId);
    if (value !== undefined && value !== null && value !== '') {
      newFilters.push({ filterId, value });
    }
    setActiveFilters(newFilters);
  };

  const handleReset = () => {
    setActiveFilters([]);
  };

  const getFilterValue = (filterId: string): unknown => {
    return activeFilters.find((f) => f.filterId === filterId)?.value;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex flex-wrap items-end gap-4">
        {filters.map((filter) => (
          <div key={filter.id} className="flex flex-col gap-1.5 min-w-[200px]">
            <Label htmlFor={filter.id} className="text-sm font-medium">
              {filter.labelAr || filter.label}
            </Label>
            <FilterControl
              filter={filter}
              value={getFilterValue(filter.id)}
              onChange={(value) => handleFilterChange(filter.id, value)}
            />
          </div>
        ))}

        {activeFilters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="mb-0.5"
          >
            إعادة تعيين
          </Button>
        )}
      </div>
    </div>
  );
}

interface FilterControlProps {
  filter: FilterDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

function FilterControl({ filter, value, onChange }: FilterControlProps) {
  switch (filter.type) {
    case 'dropdown':
      return (
        <Select
          value={value as string || ''}
          onValueChange={(val) => onChange(val || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر..." />
          </SelectTrigger>
          <SelectContent>
            {filter.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.labelAr || option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'dateRange':
      return (
        <div className="flex gap-2">
          <Input
            type="date"
            placeholder="من"
            value={(value as { start?: string })?.start || ''}
            onChange={(e) =>
              onChange({
                ...(value as object || {}),
                start: e.target.value,
              })
            }
            className="text-sm"
          />
          <Input
            type="date"
            placeholder="إلى"
            value={(value as { end?: string })?.end || ''}
            onChange={(e) =>
              onChange({
                ...(value as object || {}),
                end: e.target.value,
              })
            }
            className="text-sm"
          />
        </div>
      );

    case 'search':
      return (
        <Input
          type="text"
          placeholder={filter.config?.placeholder || 'بحث...'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="text-sm"
        />
      );

    case 'multiSelect':
      return (
        <Select
          value={Array.isArray(value) ? value.join(',') : ''}
          onValueChange={(val) => onChange(val ? val.split(',') : undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر..." />
          </SelectTrigger>
          <SelectContent>
            {filter.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.labelAr || option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    default:
      return (
        <Input
          type="text"
          placeholder="..."
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="text-sm"
        />
      );
  }
}
