import { useState, useEffect, useRef, useMemo } from 'react';
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
  ChevronDown,
  Send
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
import { useCategories } from '../hooks/useCategories';
import { useMemo } from 'react';

interface AnalysisCard {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryKey: string;
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
  const [showAnalysisLibrary, setShowAnalysisLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingText, setGeneratingText] = useState('');
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

  // Dynamic categories from API
  const {
    categories: apiCategories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    fetchCategories
  } = useCategories();

  // Build filter chips: prepend aggregate "all" then API categories sorted by sortOrder
  const filterChips = useMemo(() => {
    const all = [{ key: 'all', label: 'الكل', count: undefined as number | undefined, id: 'all' }];
    const mapped = apiCategories.map(c => ({
      key: c.key,
      label: c.nameAr || c.name,
      count: typeof c.count === 'number' ? c.count : undefined,
      id: c.id,
    }));
    return [...all, ...mapped];
  }, [apiCategories]);

  // Map selected label back to key for filtering
  const selectedKey = filterChips.find(c => c.label === selectedCategory)?.key;
  const filteredCards = analysisCards.filter(card => {
    const categoryMatch = selectedKey === 'all' || selectedKey === undefined || card.categoryKey === selectedKey;
    const searchMatch = searchQuery === '' ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

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
                {/* Loading skeleton */}
                {isLoadingCategories && (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded-lg flex-shrink-0" />
                    ))}
                  </>
                )}

                {/* Error state */}
                {!isLoadingCategories && categoriesError && (
                  <div className="flex items-center gap-3 text-sm text-red-600">
                    <span>حدث خطأ أثناء تحميل التصنيفات</span>
                    <button
                      onClick={fetchCategories}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs hover:bg-primary/90"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                )}

                {/* Empty state */}
                {!isLoadingCategories && !categoriesError && filterChips.length <= 1 && (
                  <span className="text-sm text-muted-foreground">لا توجد تصنيفات متاحة</span>
                )}

                {/* Category chips */}
                {!isLoadingCategories && !categoriesError && filterChips.length > 1 && (
                  <>
                    {filterChips.map((chip) => (
                      <button
                        key={chip.id}
                        onClick={() => setSelectedCategory(chip.label)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
                          selectedCategory === chip.label
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border hover:border-primary/50'
                        )}
                      >
                        <span>{chip.label}</span>
                        {typeof chip.count === 'number' && (
                          <span className="px-2 py-0.5 bg-black/10 rounded-full text-xs">
                            {chip.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </>
                )}
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
