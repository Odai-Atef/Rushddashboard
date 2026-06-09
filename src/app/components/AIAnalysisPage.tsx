import { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Check,
  Loader2,
  ChevronRight,
  Search,
  Plus,
  X,
  Star,
  Filter,
  UserCog,
  Activity,
  Warehouse,
  ChevronDown,
  Send,
  StopCircle
} from 'lucide-react';
import { AnalysisLibraryModal } from './analysis/AnalysisLibraryModal';
import { AnalysisLibraryItem } from '@/api/services/analysis-service';
import { resolveIcon } from '@/app/utils/icon-map';
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
import { useAnalysisCategories } from '@/app/hooks/useAnalysisCategories';
import { Category } from '@/api/services/analysis-service';

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

interface ProgressStep {
  id: number;
  label: string;
  icon: any;
  status: 'completed' | 'active' | 'pending';
}

export function AIAnalysisPage() {
  const { categories: apiCategories, isLoading: categoriesLoading, error: categoriesError, retry: retryCategories } = useAnalysisCategories();
  const [showAnalysisLibrary, setShowAnalysisLibrary] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingText, setGeneratingText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisCard | null>(null);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { id: 1, label: 'جلب البيانات', icon: Database, status: 'pending' },
    { id: 2, label: 'تنفيذ SQL', icon: Brain, status: 'pending' },
    { id: 3, label: 'معالجة المؤشرات', icon: BarChart3, status: 'pending' },
    { id: 4, label: 'اكتشاف المخاطر', icon: Shield, status: 'pending' },
    { id: 5, label: 'توليد التوصيات', icon: Sparkles, status: 'pending' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Additional categories continue...
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

  // Mock chart data
  const chartData = [
    { month: 'محرم', revenue: 2100000, target: 2500000 },
    { month: 'صفر', revenue: 2350000, target: 2500000 },
    { month: 'ربيع الأول', revenue: 2200000, target: 2500000 },
    { month: 'ربيع الثاني', revenue: 2650000, target: 2500000 },
  ];

  // Executive recommendations
  const recommendations = [
    {
      id: 1,
      type: 'urgent',
      title: 'تحسين معدل التحويل في فرع الدمام',
      impact: '+18% إيرادات',
      action: 'إعادة تدريب فريق المبيعات وتحسين عرض المنتجات'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'توسيع قناة B2B',
      impact: '+32% نمو محتمل',
      action: 'توظيف 3 مدراء مبيعات متخصصين'
    },
    {
      id: 3,
      type: 'cost',
      title: 'تحسين إدارة المخزون',
      impact: 'توفير 15% من التكاليف',
      action: 'تطبيق نظام إدارة مخزون ذكي'
    },
  ];

  // Get recommended and recent analyses
  const recommendedAnalyses = analysisCards.filter(card => card.recommended).slice(0, 3);

  // Simulate AI text streaming
  const streamText = (text: string) => {
    setIsGenerating(true);
    setGeneratingText('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setGeneratingText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setIsAnalysisComplete(true);
      }
    }, 20);
  };

  const stopGenerating = () => {
    setIsGenerating(false);
  };

  const regenerateAnalysis = () => {
    const fullText = 'بناءً على تحليل البيانات الشامل، تم رصد انخفاض بنسبة 12% في إيرادات فرع الدمام خلال الربع الأخير. السبب الرئيسي يعود إلى انخفاض معدل التحويل من 34.5% إلى 28.2%، مما أثر على الأداء العام للفرع. تم تحليل 2,450 عملية بيع و580 عميل محتمل خلال هذه الفترة.';
    setIsAnalysisComplete(false);
    streamText(fullText);
  };

  // Simulate analysis workflow
  const startAnalysisWorkflow = async () => {
    setIsAnalysisComplete(false);
    setGeneratingText('');

    // Step 1: Fetch data
    setProgressSteps(steps => steps.map((s, i) =>
      i === 0 ? { ...s, status: 'active' } : s
    ));
    await new Promise(resolve => setTimeout(resolve, 800));
    setProgressSteps(steps => steps.map((s, i) =>
      i === 0 ? { ...s, status: 'completed' } : i === 1 ? { ...s, status: 'active' } : s
    ));

    // Step 2: Execute SQL
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProgressSteps(steps => steps.map((s, i) =>
      i === 1 ? { ...s, status: 'completed' } : i === 2 ? { ...s, status: 'active' } : s
    ));

    // Step 3: Process KPIs
    await new Promise(resolve => setTimeout(resolve, 900));
    setProgressSteps(steps => steps.map((s, i) =>
      i === 2 ? { ...s, status: 'completed' } : i === 3 ? { ...s, status: 'active' } : s
    ));

    // Step 4: Detect risks
    await new Promise(resolve => setTimeout(resolve, 1100));
    setProgressSteps(steps => steps.map((s, i) =>
      i === 3 ? { ...s, status: 'completed' } : i === 4 ? { ...s, status: 'active' } : s
    ));

    // Step 5: Generate recommendations
    await new Promise(resolve => setTimeout(resolve, 1200));
    setProgressSteps(steps => steps.map((s, i) =>
      i === 4 ? { ...s, status: 'completed' } : s
    ));

    // Start streaming text
    const fullText = 'بناءً على تحليل البيانات الشامل، تم رصد انخفاض بنسبة 12% في إيرادات فرع الدمام خلال الربع الأخير. السبب الرئيسي يعود إلى انخفاض معدل التحويل من 34.5% إلى 28.2%، مما أثر على الأداء العام للفرع.\n\nتم تحليل 2,450 عملية بيع و580 عميل محتمل خلال هذه الفترة. النتائج تشير إلى أن المشكلة الأساسية تكمن في ضعف متابعة العملاء المحتملين بعد أول تواصل.';
    streamText(fullText);
  };

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
    // Reset progress
    setProgressSteps(steps => steps.map(s => ({ ...s, status: 'pending' as const })));
    // Start workflow
    setTimeout(() => startAnalysisWorkflow(), 500);
  };

  const handleSelectLibraryItem = (item: AnalysisLibraryItem) => {
    const categoryName = apiCategories.find(c => c.id === item.categoryId)?.nameAr || '';
    const card: AnalysisCard = {
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
    handleStartAnalysis(card);
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

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    // Handle follow-up question
    setChatInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generatingText]);

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
        {!activeAnalysis ? (
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
                onClick={() => setShowAnalysisLibrary(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>فتح مكتبة التحليلات</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Center - AI Analysis Workspace */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Analysis Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg bg-gradient-to-br', activeAnalysis.color)}>
                      <activeAnalysis.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{activeAnalysis.title}</h2>
                      <p className="text-xs text-muted-foreground">{activeAnalysis.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveAnalysis(null)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between gap-2">
                  {progressSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center flex-1">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={cn(
                            'p-2 rounded-lg transition-all',
                            step.status === 'completed' && 'bg-green-500/20',
                            step.status === 'active' && 'bg-primary/20 animate-pulse',
                            step.status === 'pending' && 'bg-muted'
                          )}>
                            {step.status === 'completed' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : step.status === 'active' ? (
                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            ) : (
                              <Icon className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className={cn(
                            'text-xs',
                            step.status === 'completed' && 'text-green-600',
                            step.status === 'active' && 'text-primary font-medium',
                            step.status === 'pending' && 'text-muted-foreground'
                          )}>
                            {step.label}
                          </span>
                        </div>
                        {index < progressSteps.length - 1 && (
                          <div className={cn(
                            'h-0.5 flex-1 mx-2 transition-all',
                            step.status === 'completed' ? 'bg-green-500/40' : 'bg-muted'
                          )} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* User Question */}
                <div className="flex justify-start">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-muted rounded-lg">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">أنت</span>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                      <p>{activeAnalysis.description}</p>
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-end">
                  <div className="max-w-3xl w-full">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      <span className="text-sm font-medium">المحلل الذكي</span>
                      <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl">
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed">{generatingText}</p>
                        {isGenerating && (
                          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>
                        )}
                      </div>

                      {/* Embedded Analytics */}
                      {isAnalysisComplete && (
                        <div className="mt-6 space-y-6">
                          {/* KPI Cards */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                <span className="text-xs text-muted-foreground">انخفاض الإيرادات</span>
                              </div>
                              <p className="text-2xl font-bold text-red-600">-12%</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-orange-600" />
                                <span className="text-xs text-muted-foreground">معدل التحويل</span>
                              </div>
                              <p className="text-2xl font-bold text-orange-600">28.2%</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-xs text-muted-foreground">العملاء المحتملون</span>
                              </div>
                              <p className="text-2xl font-bold text-blue-600">580</p>
                            </div>
                          </div>

                          {/* Chart */}
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium mb-4">اتجاه الإيرادات vs الهدف</h4>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                                <YAxis style={{ fontSize: '12px' }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} />
                                <Line type="monotone" dataKey="target" stroke="var(--color-chart-3)" strokeWidth={2} strokeDasharray="5 5" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {isAnalysisComplete && (
                      <div className="flex items-center gap-2 mt-3 justify-end">
                        <button
                          onClick={regenerateAnalysis}
                          className="px-3 py-1.5 text-xs border border-border hover:bg-accent rounded-lg transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          إعادة التوليد
                        </button>
                        <button className="px-3 py-1.5 text-xs border border-border hover:bg-accent rounded-lg transition-colors flex items-center gap-1">
                          <Copy className="w-3 h-3" />
                          نسخ
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isGenerating && (
                  <div className="flex justify-center">
                    <button
                      onClick={stopGenerating}
                      className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <StopCircle className="w-4 h-4" />
                      إيقاف التوليد
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input - Enabled after analysis */}
              {isAnalysisComplete && (
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اطرح سؤالاً للمتابعة..."
                      className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Insights & Recommendations */}
            {isAnalysisComplete && (
              <div className="w-96 border-r border-border bg-card flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">الرؤى والتوصيات</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Executive Summary */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <h4 className="font-medium text-sm">ملخص تنفيذي</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      المشكلة الرئيسية: ضعف متابعة العملاء. الحل: تحسين عملية المبيعات وتدريب الفريق.
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      التوصيات التنفيذية
                    </h4>
                    <div className="space-y-3">
                      {recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-4 bg-muted/50 border border-border rounded-lg hover:shadow-md transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'p-2 rounded-lg',
                              rec.type === 'urgent' && 'bg-red-500/10',
                              rec.type === 'opportunity' && 'bg-green-500/10',
                              rec.type === 'cost' && 'bg-blue-500/10'
                            )}>
                              {rec.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                              {rec.type === 'opportunity' && <Target className="w-4 h-4 text-green-600" />}
                              {rec.type === 'cost' && <DollarSign className="w-4 h-4 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm mb-1">{rec.title}</h5>
                              <p className="text-xs text-green-600 mb-2">{rec.impact}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {rec.action}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Smart Follow-up Actions */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      إجراءات ذكية مقترحة
                    </h4>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 rounded-lg text-sm text-right transition-colors">
                        تحليل عميق لفريق المبيعات
                      </button>
                      <button className="w-full px-3 py-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 rounded-lg text-sm text-right transition-colors">
                        مقارنة مع الفروع الأخرى
                      </button>
                      <button className="w-full px-3 py-2 bg-primary/10 border border-primary/20 hover:bg-primary/20 rounded-lg text-sm text-right transition-colors">
                        تحليل سلوك العملاء
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
