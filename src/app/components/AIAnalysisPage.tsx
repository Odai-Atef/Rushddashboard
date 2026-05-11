import { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Users,
  AlertTriangle,
  Target,
  DollarSign,
  Package,
  MapPin,
  MessageSquare,
  FileDown,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  Brain,
  Database,
  TrendingDown,
  Lightbulb,
  Shield,
  MoreVertical,
  Copy,
  Trash2,
  Play,
  StopCircle,
  RefreshCw,
  Check,
  Loader2,
  ChevronRight,
  Search,
  Plus,
  X,
  Star,
  Filter,
  Flame,
  UserCog,
  Activity,
  Warehouse,
  ChevronDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '../utils/cn';

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

interface AnalysisHistoryItem {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  status: 'completed' | 'running' | 'failed';
  preview: string;
}

export function AIAnalysisPage() {
  const [showAnalysisLibrary, setShowAnalysisLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingText, setGeneratingText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisCard | null>(null);

  // Categories for filtering
  const categories = [
    'الكل',
    'المبيعات',
    'العملاء',
    'التشغيل',
    'التسويق',
    'الربحية',
    'المخزون',
    'المخاطر',
    'الفرص',
    'الموارد البشرية',
    'الإدارة التنفيذية'
  ];

  // Comprehensive Analysis Cards Library
  const analysisCards: AnalysisCard[] = [
    // المبيعات
    {
      id: 'sales-1',
      title: 'تحليل انخفاض الإيرادات',
      description: 'تحديد أسباب انخفاض الإيرادات وتقديم حلول فورية',
      category: 'المبيعات',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'حرج',
      icon: TrendingDown,
      recommended: true,
      color: 'from-red-500 to-orange-600'
    },
    {
      id: 'sales-2',
      title: 'تحليل أفضل المنتجات',
      description: 'اكتشف المنتجات الأكثر ربحية وفرص النمو',
      category: 'المبيعات',
      estimatedTime: '1-2 دقيقة',
      complexity: 'بسيط',
      impact: 'متوسط',
      icon: Target,
      trending: true,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'sales-3',
      title: 'تحليل الفروع الضعيفة',
      description: 'تحديد الفروع ذات الأداء المنخفض والأسباب الجذرية',
      category: 'المبيعات',
      estimatedTime: '3-4 دقائق',
      complexity: 'متقدم',
      impact: 'عالي',
      icon: MapPin,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'sales-4',
      title: 'تحليل معدل التحويل',
      description: 'قياس وتحسين معدلات تحويل العملاء المحتملين',
      category: 'المبيعات',
      estimatedTime: '2 دقيقة',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: ArrowRight,
      recommended: true,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'sales-5',
      title: 'تحليل اتجاهات الإيرادات',
      description: 'توقع الإيرادات المستقبلية بناءً على الأنماط الحالية',
      category: 'المبيعات',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'متوسط',
      icon: TrendingUp,
      aiGenerated: true,
      color: 'from-purple-500 to-pink-600'
    },

    // العملاء
    {
      id: 'customers-1',
      title: 'تحليل تسرب العملاء',
      description: 'فهم أسباب فقدان العملاء وتقديم استراتيجيات الاحتفاظ',
      category: 'العملاء',
      estimatedTime: '3 دقائق',
      complexity: 'متقدم',
      impact: 'حرج',
      icon: Users,
      recommended: true,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'customers-2',
      title: 'تحليل رضا العملاء',
      description: 'قياس مستوى رضا العملاء وتحديد نقاط التحسين',
      category: 'العملاء',
      estimatedTime: '2 دقيقة',
      complexity: 'بسيط',
      impact: 'متوسط',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'customers-3',
      title: 'تحليل القيمة الدائمة للعميل',
      description: 'حساب LTV وتحديد العملاء الأكثر قيمة',
      category: 'العملاء',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: DollarSign,
      trending: true,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'customers-4',
      title: 'تحليل شرائح العملاء',
      description: 'تقسيم العملاء إلى مجموعات متجانسة للاستهداف الأمثل',
      category: 'العملاء',
      estimatedTime: '3-4 دقائق',
      complexity: 'متقدم',
      impact: 'عالي',
      icon: Target,
      aiGenerated: true,
      color: 'from-purple-500 to-blue-600'
    },

    // التشغيل
    {
      id: 'operations-1',
      title: 'تحليل كفاءة العمليات',
      description: 'قياس كفاءة العمليات التشغيلية وتحديد الاختناقات',
      category: 'التشغيل',
      estimatedTime: '3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: Activity,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'operations-2',
      title: 'تحليل أوقات التسليم',
      description: 'تقييم سرعة التنفيذ وتحسين عملية التوصيل',
      category: 'التشغيل',
      estimatedTime: '2 دقيقة',
      complexity: 'بسيط',
      impact: 'متوسط',
      icon: Clock,
      recommended: true,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'operations-3',
      title: 'تحليل جودة الخدمة',
      description: 'قياس جودة الخدمات المقدمة ومعدلات الأخطاء',
      category: 'التشغيل',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600'
    },

    // التسويق
    {
      id: 'marketing-1',
      title: 'تحليل عائد الاستثمار التسويقي',
      description: 'قياس ROI لجميع الحملات التسويقية',
      category: 'التسويق',
      estimatedTime: '2 دقيقة',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: BarChart3,
      trending: true,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'marketing-2',
      title: 'تحليل أداء القنوات',
      description: 'مقارنة أداء قنوات التسويق المختلفة',
      category: 'التسويق',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'متوسط',
      icon: Target,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'marketing-3',
      title: 'تحليل مسار التحويل',
      description: 'تتبع رحلة العميل من الوعي إلى الشراء',
      category: 'التسويق',
      estimatedTime: '3 دقائق',
      complexity: 'متقدم',
      impact: 'عالي',
      icon: ArrowRight,
      recommended: true,
      color: 'from-green-500 to-teal-600'
    },

    // الربحية
    {
      id: 'profitability-1',
      title: 'تحليل هوامش الربح',
      description: 'تحليل هوامش الربح حسب المنتج والخدمة',
      category: 'الربحية',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'حرج',
      icon: DollarSign,
      recommended: true,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'profitability-2',
      title: 'تحليل التكاليف التشغيلية',
      description: 'تحديد فرص تقليل التكاليف دون التأثير على الجودة',
      category: 'الربحية',
      estimatedTime: '3 دقائق',
      complexity: 'متقدم',
      impact: 'عالي',
      icon: TrendingDown,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'profitability-3',
      title: 'تحليل الربحية حسب الفرع',
      description: 'مقارنة ربحية الفروع المختلفة',
      category: 'الربحية',
      estimatedTime: '2 دقيقة',
      complexity: 'بسيط',
      impact: 'عالي',
      icon: MapPin,
      trending: true,
      color: 'from-blue-500 to-cyan-600'
    },

    // المخزون
    {
      id: 'inventory-1',
      title: 'تحليل المخزون الراكد',
      description: 'تحديد المنتجات بطيئة الحركة والحلول',
      category: 'المخزون',
      estimatedTime: '2 دقيقة',
      complexity: 'بسيط',
      impact: 'متوسط',
      icon: Package,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'inventory-2',
      title: 'تحليل نقاط إعادة الطلب',
      description: 'تحديد مستويات المخزون المثالية',
      category: 'المخزون',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: Warehouse,
      recommended: true,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'inventory-3',
      title: 'تحليل دوران المخزون',
      description: 'قياس سرعة تدفق المخزون',
      category: 'المخزون',
      estimatedTime: '1-2 دقيقة',
      complexity: 'بسيط',
      impact: 'متوسط',
      icon: RefreshCw,
      color: 'from-green-500 to-teal-600'
    },

    // المخاطر
    {
      id: 'risks-1',
      title: 'تحليل المخاطر المالية',
      description: 'تحديد وتقييم المخاطر المالية المحتملة',
      category: 'المخاطر',
      estimatedTime: '3-4 دقائق',
      complexity: 'متقدم',
      impact: 'حرج',
      icon: AlertTriangle,
      recommended: true,
      color: 'from-red-500 to-orange-600'
    },
    {
      id: 'risks-2',
      title: 'تحليل مخاطر السوق',
      description: 'تقييم المخاطر الخارجية والتهديدات التنافسية',
      category: 'المخاطر',
      estimatedTime: '3 دقائق',
      complexity: 'متقدم',
      impact: 'عالي',
      icon: Shield,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'risks-3',
      title: 'تحليل مخاطر التشغيل',
      description: 'تحديد نقاط الضعف في العمليات التشغيلية',
      category: 'المخاطر',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: Activity,
      aiGenerated: true,
      color: 'from-yellow-500 to-orange-600'
    },

    // الفرص
    {
      id: 'opportunities-1',
      title: 'اكتشاف فرص النمو',
      description: 'تحديد فرص التوسع والنمو الجديدة',
      category: 'الفرص',
      estimatedTime: '3 دقائق',
      complexity: 'متقدم',
      impact: 'عالي',
      icon: Zap,
      trending: true,
      aiGenerated: true,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'opportunities-2',
      title: 'تحليل فرص البيع المتقاطع',
      description: 'اكتشف فرص بيع منتجات إضافية للعملاء الحاليين',
      category: 'الفرص',
      estimatedTime: '2 دقيقة',
      complexity: 'متوسط',
      impact: 'متوسط',
      icon: Target,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'opportunities-3',
      title: 'تحليل قطاعات جديدة',
      description: 'استكشاف أسواق وقطاعات غير مستغلة',
      category: 'الفرص',
      estimatedTime: '3-4 دقائق',
      complexity: 'متقدم',
      impact: 'عالي',
      icon: Lightbulb,
      recommended: true,
      color: 'from-purple-500 to-blue-600'
    },

    // الموارد البشرية
    {
      id: 'hr-1',
      title: 'تحليل معدل دوران الموظفين',
      description: 'فهم أسباب الاستقالات وتحسين الاحتفاظ',
      category: 'الموارد البشرية',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: UserCog,
      color: 'from-red-500 to-orange-600'
    },
    {
      id: 'hr-2',
      title: 'تحليل أداء الموظفين',
      description: 'تقييم الأداء وتحديد الموظفين المتميزين',
      category: 'الموارد البشرية',
      estimatedTime: '2 دقيقة',
      complexity: 'بسيط',
      impact: 'متوسط',
      icon: CheckCircle,
      trending: true,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'hr-3',
      title: 'تحليل احتياجات التوظيف',
      description: 'تحديد الفجوات في القوى العاملة',
      category: 'الموارد البشرية',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: Users,
      color: 'from-blue-500 to-indigo-600'
    },

    // الإدارة التنفيذية
    {
      id: 'executive-1',
      title: 'تقرير الأداء التنفيذي الشامل',
      description: 'نظرة شاملة على جميع مؤشرات الأداء الرئيسية',
      category: 'الإدارة التنفيذية',
      estimatedTime: '4-5 دقائق',
      complexity: 'متقدم',
      impact: 'حرج',
      icon: BarChart3,
      recommended: true,
      color: 'from-purple-500 to-blue-600'
    },
    {
      id: 'executive-2',
      title: 'تحليل تحقيق الأهداف',
      description: 'قياس التقدم نحو الأهداف الاستراتيجية',
      category: 'الإدارة التنفيذية',
      estimatedTime: '3 دقائق',
      complexity: 'متوسط',
      impact: 'عالي',
      icon: Target,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'executive-3',
      title: 'تحليل الأولويات الاستراتيجية',
      description: 'تحديد المبادرات ذات الأثر الأكبر',
      category: 'الإدارة التنفيذية',
      estimatedTime: '3-4 دقائق',
      complexity: 'متقدم',
      impact: 'حرج',
      icon: Lightbulb,
      aiGenerated: true,
      color: 'from-orange-500 to-red-600'
    }
  ];

  // Analysis history
  const analysisHistory: AnalysisHistoryItem[] = [
    {
      id: 'analysis-1',
      title: 'تحليل انخفاض الإيرادات',
      type: 'Revenue Analysis',
      date: '2026-05-11',
      time: '10:30 ص',
      status: 'completed',
      preview: 'انخفضت الإيرادات بنسبة 12% في فرع الدمام بسبب ضعف التحويل...'
    },
    {
      id: 'analysis-2',
      title: 'تحليل تسرب العملاء',
      type: 'Customer Churn',
      date: '2026-05-10',
      time: '03:15 م',
      status: 'completed',
      preview: '42% من الاستقالات بسبب فرص أفضل في السوق...'
    },
    {
      id: 'analysis-3',
      title: 'أداء الحملات التسويقية',
      type: 'Marketing Performance',
      date: '2026-05-09',
      time: '11:45 ص',
      status: 'running',
      preview: 'جاري تحليل ROI للحملات الأخيرة...'
    },
  ];

  // Filter analysis cards by category and search
  const filteredCards = analysisCards.filter(card => {
    const categoryMatch = selectedCategory === 'الكل' || card.category === selectedCategory;
    const searchMatch = searchQuery === '' ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Get recommended and recent analyses
  const recommendedAnalyses = analysisCards.filter(card => card.recommended).slice(0, 3);
  const recentAnalyses = analysisHistory.slice(0, 3);

  // Complexity badge color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'بسيط': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'متوسط': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'متقدم': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  // Impact badge color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'حرج': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'عالي': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'متوسط': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'منخفض': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const handleStartAnalysis = (card: AnalysisCard) => {
    setActiveAnalysis(card);
    setShowAnalysisLibrary(false);
    // Start analysis workflow
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'running':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'failed':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'running':
        return 'قيد التشغيل';
      case 'failed':
        return 'فشل';
      default:
        return status;
    }
  };

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
          <button
            onClick={() => setShowAnalysisLibrary(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>تحليل جديد</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Starter Cards - PERMANENT FEATURE */}
      {!activeAnalysis && (
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
                        {card.recommended && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{card.category}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {card.description}
                  </p>

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
              onClick={() => setShowAnalysisLibrary(true)}
              className="px-4 py-2 text-sm text-primary hover:underline flex items-center gap-2 mx-auto"
            >
              <span>استكشف {analysisCards.length} تحليل إضافي</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Analysis History Sidebar */}
        <div className="w-80 border-l border-border bg-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">سجل التحليلات</h2>
              <button
                onClick={() => setShowAnalysisLibrary(true)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full pr-10 pl-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {analysisHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAnalysis(item.id)}
                className={`group p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                  selectedAnalysis === item.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'hover:bg-muted/50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-accent rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                  {item.preview}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          {!activeAnalysis ? (
            <div className="max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">ابدأ تحليلاً ذكياً</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                اختر تحليلاً من الكروت أعلاه أو استكشف المكتبة الكاملة للتحليلات
              </p>
              <button
                onClick={() => setShowAnalysisLibrary(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>تحليل جديد</span>
              </button>
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8">
                <div className={cn('inline-flex p-4 rounded-2xl bg-gradient-to-br mb-4', activeAnalysis.color)}>
                  <activeAnalysis.icon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{activeAnalysis.title}</h2>
                <p className="text-muted-foreground">{activeAnalysis.description}</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-8">
                <p className="text-muted-foreground mb-6">سيتم تطبيق سير عمل التحليل هنا...</p>
                <button
                  onClick={() => setActiveAnalysis(null)}
                  className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors"
                >
                  إلغاء التحليل
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Library Modal */}
      {showAnalysisLibrary && (
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
                    <p className="text-sm text-muted-foreground">استكشف {analysisCards.length} تحليلاً متقدماً</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalysisLibrary(false)}
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
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border hover:border-primary/50'
                    )}
                  >
                    {category}
                    {category !== 'الكل' && (
                      <span className="ml-2 px-2 py-0.5 bg-black/10 rounded-full text-xs">
                        {analysisCards.filter(c => c.category === category).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Cards Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Search className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
                  <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر فئة أخرى</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        className="group p-5 bg-card border border-border rounded-xl hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={cn('p-3 rounded-xl bg-gradient-to-br shadow-lg', card.color)}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold">{card.title}</h3>
                              {card.recommended && (
                                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-600" />
                                  موصى به
                                </span>
                              )}
                              {card.trending && (
                                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 border border-orange-500/20 rounded-full text-xs flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  رائج
                                </span>
                              )}
                              {card.aiGenerated && (
                                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-full text-xs flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{card.category}</p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {card.description}
                        </p>

                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className={cn('px-2 py-1 rounded text-xs border', getComplexityColor(card.complexity))}>
                            {card.complexity}
                          </span>
                          <span className={cn('px-2 py-1 rounded text-xs border', getImpactColor(card.impact))}>
                            تأثير: {card.impact}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {card.estimatedTime}
                          </span>
                        </div>

                        <button
                          onClick={() => handleStartAnalysis(card)}
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
      )}
    </div>
  );
}
