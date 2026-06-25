import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Brain,
  Plus,
  ChevronRight,
  Star,
  History,
} from 'lucide-react';
import { cn } from '@/app/utils/cn';
import { useAnalysisCategories } from '@/app/hooks/useAnalysisCategories';
import { AnalysisLibraryModal } from '@/app/components/analysis/AnalysisLibraryModal';
import { AnalysisLibraryItem } from '@/api/services/analysis-service';
import { useAnalysisLibraryItems } from '@/app/hooks/useAnalysisLibraryItems';
import { resolveIcon } from '@/app/utils/icon-map';

interface AnalysisCard {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  complexity: 'بسيط' | 'متوسط' | 'متقدم';
  impact: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
  icon: any;
  recommended?: boolean;
  trending?: boolean;
  aiGenerated?: boolean;
  color: string;
}

// Fallback cards shown briefly while real library items load.
const fallbackCards: AnalysisCard[] = [
  {
    id: 'fallback-1',
    title: 'تحليل أفضل المنتجات',
    description: 'اكتشف المنتجات الأكثر ربحية وفرص النمو',
    category: 'المبيعات',
    estimatedTime: '1-2 دقيقة',
    complexity: 'بسيط',
    impact: 'متوسط',
    icon: Brain,
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'fallback-2',
    title: 'تحليل المخزون الراكد',
    description: 'تحديد المنتجات بطيئة الحركة والحلول',
    category: 'المخزون',
    estimatedTime: '2 دقيقة',
    complexity: 'بسيط',
    impact: 'متوسط',
    icon: Brain,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'fallback-3',
    title: 'تقرير الأداء التنفيذي الشامل',
    description: 'نظرة شاملة على جميع مؤشرات الأداء الرئيسية',
    category: 'الإدارة التنفيذية',
    estimatedTime: '4-5 دقائق',
    complexity: 'متقدم',
    impact: 'حرج',
    icon: Brain,
    color: 'from-purple-500 to-blue-600',
  },
];

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

const mapLibraryItemToCard = (item: AnalysisLibraryItem, apiCategories: any[]): AnalysisCard => {
  const categoryName = apiCategories.find((c) => c.id === item.categoryId)?.nameAr || '';
  return {
    id: item.id,
    title: item.titleAr || item.title,
    description: item.descriptionAr || item.description || '',
    category: categoryName,
    estimatedTime: item.duration,
    complexity: item.complexity as AnalysisCard['complexity'],
    impact: item.impact as AnalysisCard['impact'],
    icon: resolveIcon(item.icon),
    color: item.iconBackground,
  };
};

export function AIAnalysisStartPage() {
  const navigate = useNavigate();
  const { categories: apiCategories, isLoading: categoriesLoading, error: categoriesError, retry: retryCategories } = useAnalysisCategories();
  const { items: libraryItems, isLoading: libraryLoading, error: libraryError, retry: retryLibrary } = useAnalysisLibraryItems('all');
  const [showAnalysisLibrary, setShowAnalysisLibrary] = useState(false);
  const initializedRef = useRef(false);

  // Build dashboard cards from real backend library items so every card id is a valid UUID.
  const analysisCards: AnalysisCard[] = useMemo(() => {
    if (libraryItems.length === 0) return fallbackCards;

    return libraryItems.map((item) => {
      const categoryName = apiCategories.find((c) => c.id === item.categoryId)?.nameAr || '';
      return {
        id: item.id,
        title: item.titleAr || item.title,
        description: item.descriptionAr || item.description || '',
        category: categoryName,
        estimatedTime: item.duration,
        complexity: item.complexity as AnalysisCard['complexity'],
        impact: item.impact as AnalysisCard['impact'],
        icon: resolveIcon(item.icon),
        color: item.iconBackground,
        recommended: item.badges?.includes('موصى به') || item.badges?.includes('recommended'),
        trending: item.badges?.includes('رائج') || item.badges?.includes('trending'),
        aiGenerated: item.badges?.includes('AI') || item.badges?.includes('ai'),
      };
    });
  }, [libraryItems, apiCategories]);

  const recommendedAnalyses = analysisCards.filter((card) => card.recommended || card.trending).slice(0, 3);

  const handleStartAnalysis = (card: AnalysisCard) => {
    console.log('[Start] handleStartAnalysis', { id: card.id, title: card.title });
    navigate('/dashboard/ai-analysis/chat', {
      state: { selectedAnalysisId: card.id, source: 'recommended' },
    });
  };

  const handleSelectLibraryItem = (item: AnalysisLibraryItem) => {
    const card = mapLibraryItemToCard(item, apiCategories);
    console.log('[Start] handleSelectLibraryItem', { id: card.id, title: card.title });
    navigate('/dashboard/ai-analysis/chat', {
      state: { selectedLibraryItemId: item.id, source: 'library' },
    });
  };

  const handleNewAnalysis = () => {
    setShowAnalysisLibrary(true);
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">المحلل التنفيذي الذكي</h1>
              <p className="text-sm text-muted-foreground">منصة التحليل المدعومة بالذكاء الاصطناعي</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard/ai-analysis/chat')}
              className="px-4 py-3 bg-white dark:bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-all flex items-center gap-2 shadow-sm"
            >
              <History className="w-5 h-5" />
              <span>سجل التحليلات</span>
            </button>
            <button
              onClick={handleNewAnalysis}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>تحليل جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Analysis Starter Cards */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-b border-border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">ابدأ تحليلاً ذكياً</h2>
          <p className="text-sm text-muted-foreground">اختر من التحليلات الموصى بها أو استكشف المكتبة الكاملة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedAnalyses.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group p-5 bg-card border border-border rounded-xl hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => handleStartAnalysis(card)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn('p-2.5 rounded-lg bg-gradient-to-br', card.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base">{card.title}</h3>
                      {card.recommended && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{card.category}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{card.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('px-2 py-1 rounded-full text-xs border', getImpactColor(card.impact))}>
                      {card.impact}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {card.estimatedTime}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-[-4px] transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleNewAnalysis}
            className="px-4 py-2 text-sm text-primary hover:underline flex items-center gap-2 mx-auto"
          >
            <span>استكشف {analysisCards.length} تحليل إضافي</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">ابدأ تحليلاً ذكياً</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            اختر تحليلاً من الكروت أعلاه أو استكشف المكتبة الكاملة للتحليلات المدعومة بالذكاء الاصطناعي
          </p>
          <button
            onClick={handleNewAnalysis}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>فتح مكتبة التحليلات</span>
          </button>
        </div>
      </div>

      <AnalysisLibraryModal
        open={showAnalysisLibrary}
        onClose={() => setShowAnalysisLibrary(false)}
        categories={apiCategories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        retryCategories={retryCategories}
        onSelectAnalysis={handleSelectLibraryItem}
      />
    </div>
  );
}
