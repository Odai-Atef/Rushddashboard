import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import { useAnalysisStreaming } from '@/app/hooks/useAnalysisStreaming';
import { useAnalysisHistory, AnalysisHistoryStatus, formatDateTime, getPreview } from '@/app/hooks/useAnalysisHistory';

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

interface ProgressStep {
  id: number;
  label: string;
  icon: any;
  status: 'completed' | 'active' | 'pending';
}

export function AIAnalysisPage() {
  const { categories: apiCategories, isLoading: categoriesLoading, error: categoriesError, retry: retryCategories } = useAnalysisCategories();
  const streaming = useAnalysisStreaming();
  const history = useAnalysisHistory();
  const [showAnalysisLibrary, setShowAnalysisLibrary] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisCard | null>(null);
  const [activeLibraryItem, setActiveLibraryItem] = useState<AnalysisLibraryItem | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [pendingRetryQuestion, setPendingRetryQuestion] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingHistoryId, setPendingHistoryId] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { id: 1, label: 'جلب البيانات', icon: Database, status: 'pending' },
    { id: 2, label: 'تنفيذ SQL', icon: Brain, status: 'pending' },
    { id: 3, label: 'معالجة المؤشرات', icon: BarChart3, status: 'pending' },
    { id: 4, label: 'اكتشاف المخاطر', icon: Shield, status: 'pending' },
    { id: 5, label: 'توليد التوصيات', icon: Sparkles, status: 'pending' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyListRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Fetch history on mount
  useEffect(() => {
    history.fetchHistory(1);
  }, []);

  // Sync streaming status to progress steps
  useEffect(() => {
    if (streaming.status === 'connecting') {
      setProgressSteps(steps => steps.map((s, i) =>
        i === 0 ? { ...s, status: 'active' as const } : { ...s, status: 'pending' as const }
      ));
    } else if (streaming.status === 'streaming') {
      setProgressSteps(steps => steps.map((s, i) =>
        i === 0 ? { ...s, status: 'completed' as const } :
        i === 1 ? { ...s, status: 'completed' as const } :
        i === 2 ? { ...s, status: 'completed' as const } :
        i === 3 ? { ...s, status: 'completed' as const } :
        i === 4 ? { ...s, status: 'active' as const } :
        { ...s, status: 'pending' as const }
      ));
    } else if (streaming.status === 'complete' || streaming.status === 'error') {
      setProgressSteps(steps => steps.map(s => ({ ...s, status: 'completed' as const })));
    }
  }, [streaming.status]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streaming.messages, streaming.status]);

  // IntersectionObserver for infinite scroll pagination
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && history.pagination.hasMore && !history.isLoading) {
          history.fetchHistory(history.pagination.page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => observer.disconnect();
  }, [history.pagination.hasMore, history.isLoading, history.pagination.page]);

  const handleHistoryItemClick = (itemId: string) => {
    const isStreamingActive = streaming.status === 'streaming' || streaming.status === 'connecting';
    if (isStreamingActive) {
      setPendingHistoryId(itemId);
      setShowConfirmDialog(true);
      return;
    }
    loadHistorySession(itemId);
  };

  const loadHistorySession = async (itemId: string) => {
    setSelectedAnalysis(itemId);
    setActiveAnalysis(null);
    const entry = history.entries.find(e => e.id === itemId);
    const sessionId = entry?.sessionId || itemId;
    const messages = await history.loadSession(itemId, sessionId);
    if (messages.length > 0) {
      streaming.loadMessages(messages, sessionId);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingHistoryId) {
      streaming.reset();
      loadHistorySession(pendingHistoryId);
    }
    setShowConfirmDialog(false);
    setPendingHistoryId(null);
  };

  const handleCancelSwitch = () => {
    setShowConfirmDialog(false);
    setPendingHistoryId(null);
  };

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

  const handleStartAnalysis = (card: AnalysisCard) => {
    setActiveAnalysis(card);
    setShowAnalysisLibrary(false);
    // Start real streaming
    streaming.startAnalysis(card.id, {});
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
    // Reset any active stream and start new one
    streaming.reset();
    handleStartAnalysis(card);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || streaming.isLoading) return;
    setPendingRetryQuestion(chatInput);
    streaming.sendFollowUp(chatInput);
    setChatInput('');
  };

  const handleRetryFollowUp = () => {
    if (!pendingRetryQuestion || streaming.isLoading) return;
    streaming.sendFollowUp(pendingRetryQuestion);
    setPendingRetryQuestion(null);
  };

  const handleRegenerate = () => {
    if (!activeAnalysis) return;
    streaming.reset();
    streaming.startAnalysis(activeAnalysis.id, {});
  };

  const handleStop = () => {
    streaming.stopStreaming();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'RUNNING':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'FAILED':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'PENDING':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'مكتمل';
      case 'RUNNING':
        return 'قيد التشغيل';
      case 'FAILED':
        return 'فشل';
      case 'PENDING':
        return 'معلق';
      default:
        return status;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'حرج': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'عالي': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'متوسط': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'منخفض': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'بسيط': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'متوسط': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'متقدم': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const isStreamingActive = streaming.status === 'streaming' || streaming.status === 'connecting';
  const isAnalysisComplete = streaming.status === 'complete';
  const hasError = streaming.status === 'error';
  const isHistoricalSessionLoaded = history.selectedId !== null && streaming.status === 'complete' && streaming.sessionId === history.selectedId;
  const isChatEnabled = isAnalysisComplete || hasError || isHistoricalSessionLoaded;

  useEffect(() => {
    if (streaming.status === 'complete') {
      setPendingRetryQuestion(null);
    }
  }, [streaming.status]);

  useEffect(() => {
    if (!hasError) {
      setPendingRetryQuestion(null);
    }
  }, [hasError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streaming.messages, streaming.status]);

  const renderMessage = (message: any, index: number) => {
    if (message.role === 'user') {
      return (
        <div key={message.id || index} className="flex justify-start w-full">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-muted rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">أنت</span>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id || index} className="flex justify-end w-full">
        <div className="max-w-5xl w-full">
          <div className="flex items-center gap-2 mb-2 justify-end">
            <span className="text-sm font-medium">المحلل الذكي</span>
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="p-5 bg-card border border-border rounded-xl w-full">
            <div className="prose prose-sm max-w-none text-right w-full break-words">
              <Markdown remarkPlugins={[remarkGfm]}>
                {message.content || '\u00A0'}
              </Markdown>
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>
              )}
            </div>

            {/* Action Buttons for completed assistant messages */}
            {!message.isStreaming && index === streaming.messages.length - 1 && message.role === 'assistant' && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <button
                  onClick={handleRegenerate}
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
      </div>
    );
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

          <div className="flex-1 overflow-y-auto p-2" ref={historyListRef}>
            {/* Loading State */}
            {history.isLoading && history.entries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">جاري تحميل سجل التحليلات...</p>
              </div>
            )}

            {/* Error State */}
            {history.error && history.entries.length === 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">فشل في تحميل السجل</span>
                </div>
                <p className="mb-3">{history.error}</p>
                <button
                  onClick={() => history.retry()}
                  className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  إعادة المحاولة
                </button>
              </div>
            )}

            {/* Empty State */}
            {!history.isLoading && !history.error && history.entries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-muted rounded-xl mb-3">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  لا توجد تحليلات سابقة. ابدأ بإنشاء تحليل جديد
                </p>
              </div>
            )}

            {/* History Items */}
            {history.entries.map((item) => {
              const { date, time } = formatDateTime(item.startedAt);
              const preview = getPreview(item);
              return (
                <div
                  key={item.id}
                  onClick={() => handleHistoryItemClick(item.id)}
                  className={`group p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                    selectedAnalysis === item.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'hover:bg-muted/50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-accent rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {preview && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                      {preview}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{time}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Inline Loading for Next Page */}
            {history.isLoading && history.entries.length > 0 && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              </div>
            )}

            {/* Observer Target for Infinite Scroll */}
            <div ref={observerTargetRef} className="h-4" />
          </div>
        </div>

        {/* Main Workspace */}
        {!activeAnalysis && !isHistoricalSessionLoaded ? (
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
                    {activeAnalysis ? (
                      <div className={cn('p-2 rounded-lg bg-gradient-to-br', activeAnalysis.color)}>
                        <activeAnalysis.icon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold">
                        {activeAnalysis ? activeAnalysis.title : (history.entries.find(e => e.id === history.selectedId)?.title || 'تحليل سابق')}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {activeAnalysis ? activeAnalysis.category : 'سجل التحليلات'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveAnalysis(null);
                        if (isHistoricalSessionLoaded) {
                          history.reset();
                          streaming.reset();
                        }
                      }}
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

              {/* Loading Skeleton */}
              {streaming.status === 'connecting' && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="w-full max-w-2xl space-y-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              {streaming.status !== 'connecting' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {streaming.messages.map((msg, index) => renderMessage(msg, index))}

                  {/* Stop Button */}
                  {isStreamingActive && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleStop}
                        className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                      >
                        <StopCircle className="w-4 h-4" />
                        إيقاف التوليد
                      </button>
                    </div>
                  )}

                  {/* Error Banner inside messages area removed — shown above chat input instead */}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Error Banner above Chat Input */}
              {hasError && streaming.error && (
                <div className="p-4 border-t border-border bg-card">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">حدث خطأ</span>
                    </div>
                    <p className="mb-3">{streaming.error}</p>
                    {pendingRetryQuestion && (
                      <button
                        onClick={handleRetryFollowUp}
                        disabled={streaming.isLoading}
                        className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3 h-3" />
                        إعادة المحاولة
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Input - Enabled after analysis completes or for loaded historical sessions */}
              {isChatEnabled && (
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اطرح سؤالاً للمتابعة..."
                      disabled={streaming.isLoading}
                      className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || streaming.isLoading}
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
            {isAnalysisComplete && activeAnalysis !== null && (
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
                      {streaming.messages.filter(m => m.role === 'assistant').pop()?.content?.slice(0, 200) || 'جاري التحليل...'}
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

      {/* Confirmation Dialog for Switching from Active Stream */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg">تحليل قيد التشغيل</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              هل تريد الانتقال إلى التحليل المحدد؟ سيؤدي ذلك إلى إيقاف التحليل الحالي وفقدان البيانات غير المحفوظة.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelSwitch}
                className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmSwitch}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                الانتقال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
