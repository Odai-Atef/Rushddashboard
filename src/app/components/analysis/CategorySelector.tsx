import { cn } from '../../utils/cn';
import type { AnalysisCategory } from '../../types/analysis';

interface CategorySelectorProps {
  categories: AnalysisCategory[];
  selectedCategory: AnalysisCategory | null;
  onSelectCategory: (category: AnalysisCategory) => void;
  isLoading?: boolean;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
}: CategorySelectorProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-32 bg-muted animate-pulse rounded-lg flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
            selectedCategory?.id === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          )}
        >
          <span>{category.nameAr || category.name}</span>
          {typeof category.count === 'number' && (
            <span className="px-2 py-0.5 bg-black/10 rounded-full text-xs">
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
