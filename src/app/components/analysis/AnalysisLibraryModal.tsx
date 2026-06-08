/**
 * AnalysisLibraryModal
 *
 * Reusable modal component for browsing and selecting AI analysis cards.
 * Displays category filters, a search bar, and a grid of dynamically
 * fetched analysis cards from the backend API.
 */

import { useState, useMemo } from 'react';
import {
  Brain,
  X,
  Search,
  Loader2,
  RefreshCw,
  Clock,
  Play,
  Star,
  Flame,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/app/utils/cn';
import { Category, AnalysisLibraryItem } from '@/api/services/analysis-service';
import { useAnalysisLibraryItems } from '@/app/hooks/useAnalysisLibraryItems';
import { resolveIcon } from '@/app/utils/icon-map';

export interface AnalysisLibraryModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: Error | null;
  retryCategories: () => void;
  onSelectAnalysis: (item: AnalysisLibraryItem) => void;
}

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'بسيط':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'متوسط':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'متقدم':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'حرج':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'عالي':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'متوسط':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    case 'منخفض':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

/**
 * Render a badge chip with an optional icon based on its label.
 */
function BadgeChip({ label }: { label: string }) {
  let icon = null;
  let colorClass = 'bg-gray-500/10 text-gray-600 border-gray-500/20';

  if (label === 'موصى به' || label.includes('موصى')) {
    icon = <Star className="w-3 h-3 fill-yellow-600" />;
    colorClass = 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
  } else if (label === 'رائج' || label.includes('رائج')) {
    icon = <Flame className="w-3 h-3" />;
    colorClass = 'bg-orange-500/10 text-orange-600 border-orange-500/20';
  } else if (label === 'AI' || label.includes('AI')) {
    icon = <Sparkles className="w-3 h-3" />;
    colorClass = 'bg-purple-500/10 text-purple-600 border-purple-500/20';
  }

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border',
        colorClass
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export function AnalysisLibraryModal({
  open,
  onClose,
  categories,
  categoriesLoading,
  categoriesError,
  retryCategories,
  onSelectAnalysis,
}: AnalysisLibraryModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { items, isLoading, error, retry } = useAnalysisLibraryItems(selectedCategoryId);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const title = (item.titleAr || item.title || '').toLowerCase();
      const desc = ((item.descriptionAr || item.description) || '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [items, searchQuery]);

  // Lookup category name by id for display
  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of categories) {
      map.set(cat.id, cat.nameAr || cat.name);
    }
    return map;
  }, [categories]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">مكتبة التحليلات الذكية</h2>
                <p className="text-sm text-muted-foreground">
                  استكشف {filteredItems.length} تحليلاً متقدماً
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن التحليلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categoriesLoading && (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تحميل الفئات...</span>
              </div>
            )}

            {!categoriesLoading && categoriesError && (
              <button
                onClick={retryCategories}
                className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
            )}

            {/* Always show "All" */}
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                selectedCategoryId === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              )}
            >
              {'الكل'}
            </button>

            {/* Dynamic API categories */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  selectedCategoryId === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary/50'
                )}
              >
                {cat.nameAr || cat.name}
                {cat.count > 0 && (
                  <span className="mr-2 px-2 py-0.5 bg-black/10 rounded-full text-xs">
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">جاري تحميل التحليلات...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">تعذر تحميل التحليلات</h3>
              <p className="text-muted-foreground mb-4">
                {error.message || 'حدث خطأ غير متوقع'}
              </p>
              <button
                onClick={retry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
            </div>
          )}

          {!isLoading && !error && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Search className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">
                جرب البحث بكلمات مختلفة أو اختر فئة أخرى
              </p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const Icon = resolveIcon(item.icon);
                return (
                  <div
                    key={item.id}
                    className="group p-5 bg-card border border-border rounded-xl hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={cn(
                          'p-3 rounded-xl bg-gradient-to-br shadow-lg',
                          item.iconBackground
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold">
                            {item.titleAr || item.title}
                          </h3>
                          {item.badges.map((badge) => (
                            <BadgeChip key={badge} label={badge} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {categoryNameMap.get(item.categoryId) || ''}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {item.descriptionAr || item.description || ''}
                    </p>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span
                        className={cn(
                          'px-2 py-1 rounded text-xs border',
                          getComplexityColor(item.complexity)
                        )}
                      >
                        {item.complexity}
                      </span>
                      <span
                        className={cn(
                          'px-2 py-1 rounded text-xs border',
                          getImpactColor(item.impact)
                        )}
                      >
                        تأثير: {item.impact}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectAnalysis(item)}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                      <span>بدء التحليل</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
