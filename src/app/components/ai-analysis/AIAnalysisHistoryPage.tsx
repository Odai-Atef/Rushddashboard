import { useNavigate } from 'react-router';
import {
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  RotateCcw,
  Trash2,
  Filter,
  MoreVertical,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  Target,
  ChevronRight,
  FileText,
  Download,
  Share2,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Analysis {
  id: string;
  title: string;
  date: string;
  type: string;
  category: 'sales' | 'customers' | 'operations' | 'marketing' | 'profitability' | 'inventory' | 'risks' | 'executive';
  status: 'running' | 'completed' | 'failed';
  summary: string;
  duration: string;
  insights: number;
  recommendations: number;
}

const analyses: Analysis[] = [
  {
    id: '1',
    title: 'تحليل أداء المبيعات Q1 2026',
    date: '2026-05-11 10:30',
    type: 'تحليل شامل للمبيعات',
    category: 'sales',
    status: 'completed',
    summary: 'تم تحليل بيانات المبيعات للربع الأول من 2026. أظهر التحليل نموًا بنسبة 15% مقارنة بالربع السابق مع تحديد 3 فرص رئيسية للتحسين.',
    duration: '3 دقائق 24 ثانية',
    insights: 8,
    recommendations: 5,
  },
  {
    id: '2',
    title: 'تحليل سلوك العملاء - مايو',
    date: '2026-05-10 14:20',
    type: 'تحليل سلوك العملاء',
    category: 'customers',
    status: 'completed',
    summary: 'دراسة شاملة لأنماط سلوك العملاء خلال مايو. تم تحديد 4 شرائح رئيسية للعملاء مع توصيات مخصصة لكل شريحة.',
    duration: '2 دقائق 56 ثانية',
    insights: 12,
    recommendations: 7,
  },
  {
    id: '3',
    title: 'تقييم المخاطر التشغيلية',
    date: '2026-05-10 09:15',
    type: 'تحليل المخاطر',
    category: 'risks',
    status: 'completed',
    summary: 'تقييم شامل للمخاطر التشغيلية الحالية. تم تحديد 5 مخاطر حرجة تحتاج إلى إجراء فوري و 8 مخاطر متوسطة.',
    duration: '4 دقائق 12 ثانية',
    insights: 15,
    recommendations: 9,
  },
  {
    id: '4',
    title: 'تحليل الربحية حسب المنتج',
    date: '2026-05-09 16:45',
    type: 'تحليل الربحية',
    category: 'profitability',
    status: 'running',
    summary: 'تحليل مفصل لربحية كل منتج في الكتالوج. جاري معالجة بيانات 1,245 منتج...',
    duration: 'جاري التنفيذ',
    insights: 0,
    recommendations: 0,
  },
  {
    id: '5',
    title: 'تحليل فعالية الحملات التسويقية',
    date: '2026-05-09 11:30',
    type: 'تحليل التسويق',
    category: 'marketing',
    status: 'completed',
    summary: 'تقييم ROI لجميع الحملات التسويقية في أبريل. أفضل قناة: وسائل التواصل الاجتماعي بعائد 340%.',
    duration: '3 دقائق 8 ثانية',
    insights: 10,
    recommendations: 6,
  },
  {
    id: '6',
    title: 'تحليل كفاءة سلسلة التوريد',
    date: '2026-05-08 15:20',
    type: 'تحليل العمليات',
    category: 'operations',
    status: 'failed',
    summary: 'فشل التحليل بسبب بيانات ناقصة في نظام ERP. يرجى التحقق من اتصال مصدر البيانات.',
    duration: '45 ثانية',
    insights: 0,
    recommendations: 0,
  },
  {
    id: '7',
    title: 'تحليل حركة المخزون - أبريل',
    date: '2026-05-08 10:15',
    type: 'تحليل المخزون',
    category: 'inventory',
    status: 'completed',
    summary: 'تحليل حركة المخزون وتحديد المنتجات بطيئة الحركة. تم تحديد 45 منتج يحتاج إلى تصفية.',
    duration: '2 دقائق 34 ثانية',
    insights: 7,
    recommendations: 4,
  },
  {
    id: '8',
    title: 'مؤشرات الأداء التنفيذية - أبريل',
    date: '2026-05-01 09:00',
    type: 'تحليل تنفيذي شامل',
    category: 'executive',
    status: 'completed',
    summary: 'ملخص تنفيذي شامل لجميع مؤشرات الأداء الرئيسية. الأداء العام: متفوق على الأهداف بنسبة 12%.',
    duration: '5 دقائق 18 ثانية',
    insights: 20,
    recommendations: 12,
  },
];

const getCategoryIcon = (category: Analysis['category']) => {
  switch (category) {
    case 'sales': return TrendingUp;
    case 'customers': return Users;
    case 'operations': return Package;
    case 'marketing': return Target;
    case 'profitability': return DollarSign;
    case 'inventory': return ShoppingCart;
    case 'risks': return AlertTriangle;
    case 'executive': return Sparkles;
  }
};

const getCategoryColor = (category: Analysis['category']) => {
  switch (category) {
    case 'sales': return 'text-blue-500';
    case 'customers': return 'text-purple-500';
    case 'operations': return 'text-orange-500';
    case 'marketing': return 'text-pink-500';
    case 'profitability': return 'text-green-500';
    case 'inventory': return 'text-yellow-500';
    case 'risks': return 'text-red-500';
    case 'executive': return 'text-indigo-500';
  }
};

const getCategoryBg = (category: Analysis['category']) => {
  switch (category) {
    case 'sales': return 'bg-blue-500/10';
    case 'customers': return 'bg-purple-500/10';
    case 'operations': return 'bg-orange-500/10';
    case 'marketing': return 'bg-pink-500/10';
    case 'profitability': return 'bg-green-500/10';
    case 'inventory': return 'bg-yellow-500/10';
    case 'risks': return 'bg-red-500/10';
    case 'executive': return 'bg-indigo-500/10';
  }
};

const getStatusIcon = (status: Analysis['status']) => {
  switch (status) {
    case 'running': return Loader2;
    case 'completed': return CheckCircle2;
    case 'failed': return XCircle;
  }
};

const getStatusColor = (status: Analysis['status']) => {
  switch (status) {
    case 'running': return 'text-blue-500';
    case 'completed': return 'text-green-500';
    case 'failed': return 'text-red-500';
  }
};

const getStatusLabel = (status: Analysis['status']) => {
  switch (status) {
    case 'running': return 'قيد التنفيذ';
    case 'completed': return 'مكتمل';
    case 'failed': return 'فشل';
  }
};

export function AIAnalysisHistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'completed' | 'failed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Analysis['category']>('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || analysis.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleContinue = (analysisId: string) => {
    navigate('/dashboard/ai-analysis/chat', { state: { continueAnalysisId: analysisId } });
  };

  const handleRerun = (analysisId: string) => {
    navigate('/dashboard/ai-analysis/chat', { state: { rerunAnalysisId: analysisId } });
  };

  const handleDelete = (analysisId: string) => {
    setShowDeleteConfirm(analysisId);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            التحليلات السابقة
          </h1>
          <p className="text-muted-foreground mt-1">إدارة ومراجعة جلسات التحليل السابقة</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/ai-analysis/start')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          تحليل جديد
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="البحث في التحليلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="completed">مكتمل</option>
            <option value="running">قيد التنفيذ</option>
            <option value="failed">فشل</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الفئات</option>
            <option value="sales">المبيعات</option>
            <option value="customers">العملاء</option>
            <option value="operations">العمليات</option>
            <option value="marketing">التسويق</option>
            <option value="profitability">الربحية</option>
            <option value="inventory">المخزون</option>
            <option value="risks">المخاطر</option>
            <option value="executive">تنفيذي</option>
          </select>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          عرض {filteredAnalyses.length} من {analyses.length} تحليل
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAnalyses.map((analysis) => {
          const CategoryIcon = getCategoryIcon(analysis.category);
          const StatusIcon = getStatusIcon(analysis.status);

          return (
            <div
              key={analysis.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-blue-500/50 transition-all cursor-pointer group"
              onClick={() => setSelectedAnalysis(analysis)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getCategoryBg(analysis.category)} flex-shrink-0`}>
                  <CategoryIcon className={`w-6 h-6 ${getCategoryColor(analysis.category)}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium text-lg">{analysis.title}</h3>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        analysis.status === 'completed'
                          ? 'bg-green-500/10'
                          : analysis.status === 'running'
                          ? 'bg-blue-500/10'
                          : 'bg-red-500/10'
                      }`}
                    >
                      <StatusIcon
                        className={`w-4 h-4 ${getStatusColor(analysis.status)} ${
                          analysis.status === 'running' ? 'animate-spin' : ''
                        }`}
                      />
                      <span className={getStatusColor(analysis.status)}>{getStatusLabel(analysis.status)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {analysis.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {analysis.duration}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${getCategoryBg(analysis.category)} ${getCategoryColor(
                        analysis.category
                      )}`}
                    >
                      {analysis.type}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{analysis.summary}</p>

                  {analysis.status === 'completed' && (
                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">{analysis.insights} رؤية</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">{analysis.recommendations} توصية</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {analysis.status === 'completed' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinue(analysis.id);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Play className="w-4 h-4" />
                          متابعة
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRerun(analysis.id);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
                        >
                          <RotateCcw className="w-4 h-4" />
                          إعادة التشغيل
                        </button>
                      </>
                    )}
                    {analysis.status === 'failed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRerun(analysis.id);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        إعادة المحاولة
                      </button>
                    )}
                    {analysis.status === 'running' && (
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm cursor-not-allowed opacity-50"
                        disabled
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري التنفيذ
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      تصدير
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(analysis.id);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAnalyses.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl mb-2">لا توجد تحليلات مطابقة</h3>
          <p className="text-muted-foreground mb-6">جرب تعديل معايير البحث أو الفلترة</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedAnalysis(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {(() => {
                      const CategoryIcon = getCategoryIcon(selectedAnalysis.category);
                      return (
                        <div className={`p-3 rounded-lg ${getCategoryBg(selectedAnalysis.category)}`}>
                          <CategoryIcon className={`w-6 h-6 ${getCategoryColor(selectedAnalysis.category)}`} />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="text-2xl mb-2">{selectedAnalysis.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{selectedAnalysis.date}</span>
                        <span>{selectedAnalysis.type}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAnalysis(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">الحالة</span>
                  {(() => {
                    const StatusIcon = getStatusIcon(selectedAnalysis.status);
                    return (
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`w-5 h-5 ${getStatusColor(selectedAnalysis.status)} ${
                            selectedAnalysis.status === 'running' ? 'animate-spin' : ''
                          }`}
                        />
                        <span className="font-medium">{getStatusLabel(selectedAnalysis.status)}</span>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <h3 className="font-medium mb-3">الملخص</h3>
                  <p className="text-muted-foreground">{selectedAnalysis.summary}</p>
                </div>

                {selectedAnalysis.status === 'completed' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">المدة</p>
                      <p className="text-xl font-medium">{selectedAnalysis.duration}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">الرؤى</p>
                      <p className="text-xl font-medium">{selectedAnalysis.insights}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">التوصيات</p>
                      <p className="text-xl font-medium">{selectedAnalysis.recommendations}</p>
                    </div>
                  </div>
                )}

                {selectedAnalysis.status === 'completed' && (
                  <div>
                    <h3 className="font-medium mb-3">الرؤى الرئيسية</h3>
                    <div className="space-y-2">
                      {[
                        'نمو المبيعات بنسبة 15% مقارنة بالربع السابق',
                        'تحسن معدل التحويل من 2.3% إلى 3.1%',
                        'انخفاض تكلفة اكتساب العملاء بنسبة 12%',
                      ].map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border flex gap-3">
                {selectedAnalysis.status === 'completed' && (
                  <>
                    <button
                      onClick={() => {
                        handleContinue(selectedAnalysis.id);
                        setSelectedAnalysis(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      متابعة التحليل
                    </button>
                    <button
                      onClick={() => {
                        handleRerun(selectedAnalysis.id);
                        setSelectedAnalysis(null);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      إعادة التشغيل
                    </button>
                  </>
                )}
                {selectedAnalysis.status === 'failed' && (
                  <button
                    onClick={() => {
                      handleRerun(selectedAnalysis.id);
                      setSelectedAnalysis(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    إعادة المحاولة
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                  <Download className="w-5 h-5" />
                  تصدير
                </button>
                <button
                  onClick={() => {
                    setSelectedAnalysis(null);
                    handleDelete(selectedAnalysis.id);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowDeleteConfirm(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">تأكيد الحذف</h3>
                  <p className="text-sm text-muted-foreground">هل أنت متأكد من حذف هذا التحليل؟</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                لن تتمكن من استعادة هذا التحليل بعد الحذف. سيتم حذف جميع البيانات والرؤى المرتبطة به نهارياً.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  حذف نهائياً
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
