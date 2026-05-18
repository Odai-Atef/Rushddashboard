import { Sparkles, AlertTriangle, Target } from 'lucide-react';
import { useAnalysisContext } from '../hooks/useAnalysisContext';
import { useCategories } from '../hooks/useCategories';
import { useAnalytics } from '../hooks/useAnalytics';
import { useInsights } from '../hooks/useInsights';
import { CategorySelector } from './analysis/CategorySelector';
import { KPICard } from './analysis/KPICard';
import { KPICardsSkeleton } from './analysis/KPICardSkeleton';
import { ChartWidget } from './analysis/ChartWidget';
import { InsightCard } from './analysis/InsightCard';
import { EmptyState } from './analysis/EmptyState';
import { ErrorState } from './analysis/ErrorState';
import { Skeleton } from './ui/skeleton';

export function ExecutiveDashboard() {
  const { selectedCategory, setSelectedCategory } = useAnalysisContext();
  const { categories, isLoading: isLoadingCategories, error: categoriesError, fetchCategories } = useCategories();
  const { summary, isLoading: isLoadingAnalytics, error: analyticsError, fetchAnalytics } = useAnalytics(selectedCategory?.id);
  const { insights, isLoading: isLoadingInsights, error: insightsError, fetchInsights } = useInsights(selectedCategory?.id);

  const handleSelectCategory = (category: typeof selectedCategory) => {
    if (category) {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2">لوحة القيادة التنفيذية</h2>
        <p className="text-muted-foreground">نظرة عامة سريعة عن الوضع العام للمنصة</p>
      </div>

      {/* Category Selector */}
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        isLoading={isLoadingCategories}
      />

      {/* Categories Error */}
      {categoriesError && (
        <ErrorState message={categoriesError} onRetry={fetchCategories} />
      )}

      {/* Empty State - No Categories */}
      {!isLoadingCategories && !categoriesError && categories.length === 0 && (
        <EmptyState
          title="لا توجد تصنيفات متاحة"
          description="لم يتم تكوين أي تصنيفات تحليلية بعد"
        />
      )}

      {/* KPI Cards */}
      {selectedCategory && (
        <>
          {isLoadingAnalytics ? (
            <KPICardsSkeleton />
          ) : analyticsError ? (
            <ErrorState message={analyticsError} onRetry={fetchAnalytics} />
          ) : summary?.metrics && summary.metrics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {summary.metrics.map((metric) => (
                <KPICard key={metric.id} metric={metric} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="لا توجد مؤشرات أداء"
              description="لا توجد مؤشرات أداء متاحة لهذا التصنيف"
            />
          )}
        </>
      )}

      {/* AI Executive Summary */}
      {selectedCategory && !isLoadingInsights && !insightsError && insights.length > 0 && (
        <div className="bg-gradient-to-l from-purple-500/10 via-blue-500/10 to-transparent border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl">الملخص التنفيذي</h3>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">AI Executive</span>
              </div>
              <p className="text-foreground leading-relaxed">
                {insights.filter(i => i.type === 'summary').map(s => s.descriptionAr || s.description).join(' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {selectedCategory && summary?.charts && summary.charts.length > 0 && !isLoadingAnalytics && !analyticsError && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {summary.charts.map((chart) => (
            <ChartWidget key={chart.id} config={chart} />
          ))}
        </div>
      )}

      {/* Alerts and Recommendations */}
      {selectedCategory && (
        <>
          {isLoadingInsights ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="mb-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : insightsError ? (
            <ErrorState message={insightsError} onRetry={fetchInsights} />
          ) : insights.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Alerts Panel */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg">التنبيهات</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {insights
                    .filter((insight) => insight.type === 'alert')
                    .map((insight) => (
                      <InsightCard key={insight.id} insight={insight} />
                    ))}
                  {insights.filter((i) => i.type === 'alert').length === 0 && (
                    <p className="text-muted-foreground text-center py-4">لا توجد تنبيهات حالياً</p>
                  )}
                </div>
              </div>

              {/* Recommendations Panel */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg">التوصيات</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {insights
                    .filter((insight) => insight.type === 'recommendation')
                    .map((insight, index) => (
                      <InsightCard key={insight.id} insight={insight} index={index} />
                    ))}
                  {insights.filter((i) => i.type === 'recommendation').length === 0 && (
                    <p className="text-muted-foreground text-center py-4">لا توجد توصيات حالياً</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="لا توجد توصيات"
              description="لا توجد توصيات أو تنبيهات متاحة حالياً"
            />
          )}
        </>
      )}

      {/* Select Category Prompt */}
      {!selectedCategory && !isLoadingCategories && categories.length > 0 && (
        <EmptyState
          title="اختر تصنيفاً"
          description="يرجى اختيار تصنيف من الأعلى لعرض التحليلات والمؤشرات"
        />
      )}
    </div>
  );
}
