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
  Plus
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
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>('analysis-1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingText, setGeneratingText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

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

  // Analysis progress steps
  const progressSteps = [
    { id: 1, label: 'جلب البيانات', icon: Database, status: 'completed' },
    { id: 2, label: 'تنفيذ SQL', icon: Brain, status: 'completed' },
    { id: 3, label: 'معالجة المؤشرات', icon: BarChart3, status: 'active' },
    { id: 4, label: 'اكتشاف المخاطر', icon: Shield, status: 'pending' },
    { id: 5, label: 'توليد التوصيات', icon: Sparkles, status: 'pending' },
  ];

  // Mock chart data
  const chartData = [
    { month: 'محرم', value: 2100000 },
    { month: 'صفر', value: 2350000 },
    { month: 'ربيع الأول', value: 2200000 },
    { month: 'ربيع الثاني', value: 2650000 },
  ];

  // Executive recommendations
  const recommendations = [
    {
      id: 1,
      type: 'urgent',
      title: 'تحسين معدل التحويل',
      impact: '+18% إيرادات',
      action: 'إعادة تصميم الصفحات المقصودة'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'توسيع قناة B2B',
      impact: '+32% نمو',
      action: 'توظيف 3 مدراء مبيعات'
    },
  ];

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
      }
    }, 20);
  };

  const stopGenerating = () => {
    setIsGenerating(false);
  };

  const regenerateAnalysis = () => {
    const fullText = 'بناءً على تحليل البيانات الشامل، تم رصد انخفاض بنسبة 12% في إيرادات فرع الدمام خلال الربع الأخير. السبب الرئيسي يعود إلى انخفاض معدل التحويل من 34.5% إلى 28.2%، مما أثر على الأداء العام للفرع.';
    streamText(fullText);
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
    <div className="h-full flex overflow-hidden">
      {/* Left Sidebar - Analysis History */}
      <div className="w-80 border-l border-border bg-card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">سجل التحليلات</h2>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
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

        {/* History List */}
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

              {/* Action buttons on hover */}
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 px-2 py-1 bg-muted hover:bg-accent rounded text-xs flex items-center justify-center gap-1">
                  <Play className="w-3 h-3" />
                  متابعة
                </button>
                <button className="flex-1 px-2 py-1 bg-muted hover:bg-accent rounded text-xs flex items-center justify-center gap-1">
                  <Copy className="w-3 h-3" />
                  نسخ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Workspace Header */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium">تحليل انخفاض الإيرادات</h1>
              <p className="text-sm text-muted-foreground">Revenue Analysis • اليوم 10:30 ص</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm">
              <FileDown className="w-4 h-4" />
              <span>تصدير</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center - AI Conversation */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* User Message */}
              <div className="flex justify-start">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-muted rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">أنت</span>
                    <span className="text-xs text-muted-foreground">10:30 ص</span>
                  </div>
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <p>احلل أسباب انخفاض الإيرادات في فرع الدمام خلال الربع الأخير</p>
                  </div>
                </div>
              </div>

              {/* AI Message with Streaming */}
              <div className="flex justify-start">
                <div className="max-w-4xl w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">المحلل التنفيذي</span>
                    <span className="text-xs text-muted-foreground">10:30 ص</span>
                    {isGenerating && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        جاري الكتابة...
                      </span>
                    )}
                  </div>

                  <div className="p-5 bg-muted/30 rounded-xl space-y-4">
                    {/* Streaming Text */}
                    <p className="leading-relaxed">
                      {generatingText || 'بناءً على تحليل البيانات الشامل، تم رصد انخفاض بنسبة 12% في إيرادات فرع الدمام خلال الربع الأخير. السبب الرئيسي يعود إلى انخفاض معدل التحويل من 34.5% إلى 28.2%، مما أثر على الأداء العام للفرع.'}
                      {isGenerating && <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1"></span>}
                    </p>

                    {!isGenerating && (
                      <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">إيرادات الفرع</p>
                            <p className="text-2xl font-bold">720K ر.س</p>
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" />
                              -12%
                            </p>
                          </div>
                          <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">معدل التحويل</p>
                            <p className="text-2xl font-bold">28.2%</p>
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" />
                              -6.3%
                            </p>
                          </div>
                          <div className="bg-card border border-border rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">هامش الربح</p>
                            <p className="text-2xl font-bold">30%</p>
                            <p className="text-sm text-yellow-600 mt-1">مستقر</p>
                          </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-card border border-border rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-3">اتجاه الإيرادات - فرع الدمام</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(value) => `${value / 1000000}M`} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'var(--color-card)',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: '0.5rem',
                                  fontSize: '12px'
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="var(--color-chart-1)"
                                strokeWidth={2}
                                dot={{ fill: 'var(--color-chart-1)', r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Executive Summary */}
                        <div className="bg-gradient-to-l from-blue-500/10 to-transparent border border-blue-500/20 rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-blue-600" />
                            السبب الجذري
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            التحليل يُظهر أن <span className="text-foreground font-medium">ضعف تجربة المستخدم</span> على الصفحات المقصودة
                            هو السبب الرئيسي لانخفاض التحويل. بالإضافة إلى <span className="text-foreground font-medium">ارتفاع المنافسة</span> في السوق المحلي.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!isGenerating && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={regenerateAnalysis}
                        className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        إعادة التوليد
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm">
                        <ArrowRight className="w-4 h-4" />
                        متابعة التحليل
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm">
                        <Copy className="w-4 h-4" />
                        نسخ
                      </button>
                    </div>
                  )}

                  {/* Stop Button while generating */}
                  {isGenerating && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={stopGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
                      >
                        <StopCircle className="w-4 h-4" />
                        إيقاف التوليد
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggested Follow-up Questions */}
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm transition-colors">
                  ما هي الحلول المقترحة؟
                </button>
                <button className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm transition-colors">
                  قارن مع فرع الرياض
                </button>
                <button className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm transition-colors">
                  احسب التأثير المالي
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اطرح سؤالك أو اطلب تحليل إضافي..."
                  className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <span>إرسال</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Progress & Recommendations */}
          <div className="w-80 border-r border-border bg-card overflow-y-auto p-4 space-y-4">
            {/* AI Analysis Progress */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                مراحل التحليل
              </h3>
              <div className="space-y-2">
                {progressSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                        step.status === 'active'
                          ? 'bg-primary/10 border border-primary/20'
                          : step.status === 'completed'
                          ? 'bg-muted/30'
                          : 'bg-muted/10 opacity-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${
                        step.status === 'active'
                          ? 'bg-primary text-primary-foreground'
                          : step.status === 'completed'
                          ? 'bg-green-600 text-white'
                          : 'bg-muted'
                      }`}>
                        {step.status === 'completed' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : step.status === 'active' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-sm flex-1">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Executive Recommendations */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                توصيات تنفيذية
              </h3>
              <div className="space-y-2">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-3 rounded-lg border-r-4 ${
                      rec.type === 'urgent'
                        ? 'bg-red-500/10 border-red-500'
                        : 'bg-blue-500/10 border-blue-500'
                    }`}
                  >
                    <h4 className="text-sm font-medium mb-1">{rec.title}</h4>
                    <p className="text-xs text-green-600 mb-2">{rec.impact}</p>
                    <p className="text-xs text-muted-foreground">{rec.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium mb-3">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center justify-between">
                  <span>إنشاء خطة عمل</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full px-3 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm flex items-center justify-between">
                  <span>تصدير التقرير</span>
                  <FileDown className="w-4 h-4" />
                </button>
                <button className="w-full px-3 py-2 border border-border hover:bg-accent rounded-lg transition-colors text-sm flex items-center justify-between">
                  <span>جدولة اجتماع</span>
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
