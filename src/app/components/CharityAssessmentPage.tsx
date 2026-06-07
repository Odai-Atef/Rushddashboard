import { useState } from 'react';
import {
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Brain,
  LineChart,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Save,
  Play,
  Clock,
  Users,
  DollarSign,
  Shield,
  Zap,
  BookOpen,
  Building,
  Heart,
  Star,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
  Lightbulb,
  Calendar,
  Activity
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts';

interface AssessmentCategory {
  id: string;
  name: string;
  icon: any;
  questions: Question[];
  score?: number;
}

interface Question {
  id: string;
  question: string;
  type: 'scale' | 'yesno' | 'multiple';
  options?: string[];
  answer?: any;
}

interface Strength {
  category: string;
  score: number;
  insight: string;
}

interface Gap {
  category: string;
  severity: 'critical' | 'high' | 'medium';
  issue: string;
  recommendation: string;
}

interface RoadmapItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  effort: string;
  impact: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

export function CharityAssessmentPage() {
  console.log('✓ CharityAssessmentPage component rendered successfully');
  const [currentView, setCurrentView] = useState<'start' | 'assessment' | 'results' | 'roadmap'>('start');
  const [currentStep, setCurrentStep] = useState(0);
  const [showAIInsights, setShowAIInsights] = useState(true);

  // Assessment Categories
  const categories: AssessmentCategory[] = [
    {
      id: 'governance',
      name: 'الحوكمة والامتثال',
      icon: Shield,
      questions: [
        { id: 'g1', question: 'هل لديك مجلس إدارة نشط ومستقل؟', type: 'yesno' },
        { id: 'g2', question: 'كم عدد اجتماعات مجلس الإدارة السنوية؟', type: 'scale' },
        { id: 'g3', question: 'هل لديكم سياسات وإجراءات موثقة؟', type: 'yesno' },
        { id: 'g4', question: 'مستوى الامتثال للأنظمة واللوائح', type: 'scale' }
      ],
      score: 85
    },
    {
      id: 'financial',
      name: 'الاستقرار المالي',
      icon: DollarSign,
      questions: [
        { id: 'f1', question: 'هل لديكم ميزانية سنوية معتمدة؟', type: 'yesno' },
        { id: 'f2', question: 'مستوى تنوع مصادر التمويل', type: 'scale' },
        { id: 'f3', question: 'هل تخضعون لتدقيق مالي خارجي؟', type: 'yesno' },
        { id: 'f4', question: 'نسبة السيولة المالية', type: 'scale' }
      ],
      score: 72
    },
    {
      id: 'hr',
      name: 'الموارد البشرية',
      icon: Users,
      questions: [
        { id: 'h1', question: 'عدد الموظفين بدوام كامل', type: 'scale' },
        { id: 'h2', question: 'هل لديكم خطة تطوير للموظفين؟', type: 'yesno' },
        { id: 'h3', question: 'مستوى رضا الموظفين', type: 'scale' },
        { id: 'h4', question: 'معدل الاحتفاظ بالموظفين', type: 'scale' }
      ],
      score: 68
    },
    {
      id: 'volunteers',
      name: 'إدارة المتطوعين',
      icon: Heart,
      questions: [
        { id: 'v1', question: 'عدد المتطوعين النشطين', type: 'scale' },
        { id: 'v2', question: 'هل لديكم برنامج تدريب للمتطوعين؟', type: 'yesno' },
        { id: 'v3', question: 'مستوى مشاركة المتطوعين', type: 'scale' },
        { id: 'v4', question: 'هل لديكم نظام لإدارة المتطوعين؟', type: 'yesno' }
      ],
      score: 78
    },
    {
      id: 'technology',
      name: 'التكنولوجيا والنضج الرقمي',
      icon: Zap,
      questions: [
        { id: 't1', question: 'هل لديكم موقع إلكتروني فعال؟', type: 'yesno' },
        { id: 't2', question: 'مستوى استخدام الأدوات الرقمية', type: 'scale' },
        { id: 't3', question: 'هل لديكم نظام لإدارة البيانات؟', type: 'yesno' },
        { id: 't4', question: 'مستوى الأمن السيبراني', type: 'scale' }
      ],
      score: 58
    },
    {
      id: 'projects',
      name: 'إدارة المشاريع',
      icon: Target,
      questions: [
        { id: 'p1', question: 'هل لديكم منهجية لإدارة المشاريع؟', type: 'yesno' },
        { id: 'p2', question: 'نسبة نجاح المشاريع المنفذة', type: 'scale' },
        { id: 'p3', question: 'هل تستخدمون أدوات لإدارة المشاريع؟', type: 'yesno' },
        { id: 'p4', question: 'مستوى توثيق المشاريع', type: 'scale' }
      ],
      score: 75
    },
    {
      id: 'fundraising',
      name: 'قدرة جمع التبرعات',
      icon: TrendingUp,
      questions: [
        { id: 'fr1', question: 'هل لديكم استراتيجية لجمع التبرعات؟', type: 'yesno' },
        { id: 'fr2', question: 'معدل نمو التبرعات السنوي', type: 'scale' },
        { id: 'fr3', question: 'عدد المانحين المنتظمين', type: 'scale' },
        { id: 'fr4', question: 'مستوى التواصل مع المانحين', type: 'scale' }
      ],
      score: 65
    },
    {
      id: 'impact',
      name: 'قياس الأثر',
      icon: BarChart3,
      questions: [
        { id: 'i1', question: 'هل لديكم مؤشرات أداء محددة؟', type: 'yesno' },
        { id: 'i2', question: 'مستوى قياس الأثر الاجتماعي', type: 'scale' },
        { id: 'i3', question: 'هل تصدرون تقارير أثر دورية؟', type: 'yesno' },
        { id: 'i4', question: 'مستوى استخدام البيانات في اتخاذ القرار', type: 'scale' }
      ],
      score: 70
    },
    {
      id: 'strategy',
      name: 'التخطيط الاستراتيجي',
      icon: Lightbulb,
      questions: [
        { id: 's1', question: 'هل لديكم خطة استراتيجية؟', type: 'yesno' },
        { id: 's2', question: 'مدى وضوح الرؤية والرسالة', type: 'scale' },
        { id: 's3', question: 'هل تراجعون الخطة الاستراتيجية بانتظام؟', type: 'yesno' },
        { id: 's4', question: 'مستوى تحقيق الأهداف الاستراتيجية', type: 'scale' }
      ],
      score: 80
    },
    {
      id: 'risk',
      name: 'إدارة المخاطر',
      icon: AlertTriangle,
      questions: [
        { id: 'r1', question: 'هل لديكم سجل للمخاطر؟', type: 'yesno' },
        { id: 'r2', question: 'مستوى إدارة المخاطر المالية', type: 'scale' },
        { id: 'r3', question: 'هل لديكم خطط طوارئ؟', type: 'yesno' },
        { id: 'r4', question: 'مستوى التأمين ضد المخاطر', type: 'scale' }
      ],
      score: 62
    }
  ];

  // Overall Score Calculation
  const overallScore = Math.round(
    categories.reduce((sum, cat) => sum + (cat.score || 0), 0) / categories.length
  );

  // Readiness Level
  const getReadinessLevel = (score: number) => {
    if (score >= 85) return { label: 'متميز', color: 'text-green-500', bg: 'bg-green-500' };
    if (score >= 70) return { label: 'جاهز', color: 'text-blue-500', bg: 'bg-blue-500' };
    if (score >= 55) return { label: 'متوسط', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { label: 'يحتاج تحسين', color: 'text-red-500', bg: 'bg-red-500' };
  };

  const readinessLevel = getReadinessLevel(overallScore);

  // Radar Chart Data
  const radarData = categories.map(cat => ({
    category: cat.name.split(' ')[0],
    score: cat.score || 0,
    fullMark: 100
  }));

  // Strengths
  const strengths: Strength[] = [
    { category: 'الحوكمة والامتثال', score: 85, insight: 'لديكم هيكل حوكمة قوي ومجلس إدارة نشط مع امتثال ممتاز للأنظمة' },
    { category: 'التخطيط الاستراتيجي', score: 80, insight: 'رؤية واضحة وخطة استراتيجية محددة مع مراجعة دورية منتظمة' },
    { category: 'إدارة المتطوعين', score: 78, insight: 'برنامج متطوعين فعال مع مشاركة عالية ونظام إدارة منظم' }
  ];

  // Gaps
  const gaps: Gap[] = [
    {
      category: 'التكنولوجيا والنضج الرقمي',
      severity: 'critical',
      issue: 'مستوى منخفض من التحول الرقمي وضعف في الأمن السيبراني',
      recommendation: 'الاستثمار في البنية التحتية التقنية وتدريب الفريق على الأدوات الرقمية'
    },
    {
      category: 'إدارة المخاطر',
      severity: 'high',
      issue: 'عدم وجود إطار شامل لإدارة المخاطر',
      recommendation: 'إنشاء سجل مخاطر وتطوير خطط طوارئ للمخاطر الحرجة'
    },
    {
      category: 'قدرة جمع التبرعات',
      severity: 'medium',
      issue: 'محدودية استراتيجيات جمع التبرعات وقاعدة محدودة من المانحين',
      recommendation: 'تطوير استراتيجية تنويع مصادر التمويل وبناء علاقات طويلة الأمد مع المانحين'
    }
  ];

  // Roadmap Items
  const roadmapItems: RoadmapItem[] = [
    {
      id: 'r1',
      title: 'تطوير البنية التحتية التقنية',
      priority: 'high',
      effort: '3-6 أشهر',
      impact: 'عالي',
      category: 'التكنولوجيا',
      status: 'pending',
      dueDate: '2026-09-01'
    },
    {
      id: 'r2',
      title: 'إنشاء إطار إدارة المخاطر',
      priority: 'high',
      effort: '2-3 أشهر',
      impact: 'عالي',
      category: 'المخاطر',
      status: 'in-progress',
      dueDate: '2026-07-15'
    },
    {
      id: 'r3',
      title: 'تطوير استراتيجية جمع التبرعات',
      priority: 'medium',
      effort: '1-2 شهر',
      impact: 'متوسط',
      category: 'جمع التبرعات',
      status: 'in-progress',
      dueDate: '2026-07-01'
    },
    {
      id: 'r4',
      title: 'تحسين نظام قياس الأثر',
      priority: 'medium',
      effort: '2-4 أشهر',
      impact: 'عالي',
      category: 'قياس الأثر',
      status: 'pending',
      dueDate: '2026-08-15'
    },
    {
      id: 'r5',
      title: 'تعزيز القدرات المالية',
      priority: 'low',
      effort: '3-6 أشهر',
      impact: 'متوسط',
      category: 'المالية',
      status: 'pending',
      dueDate: '2026-10-01'
    }
  ];

  // Progress Data
  const progressData = [
    { month: 'يناير', score: 65 },
    { month: 'فبراير', score: 68 },
    { month: 'مارس', score: 70 },
    { month: 'أبريل', score: 71 },
    { month: 'مايو', score: 73 }
  ];

  // Benchmark Comparison
  const benchmarkData = [
    { name: 'منظمتك', value: overallScore, color: '#3b82f6' },
    { name: 'متوسط القطاع', value: 68, color: '#94a3b8' },
    { name: 'أفضل ممارسة', value: 85, color: '#10b981' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      default:
        return 'منخفض';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      default:
        return 'text-yellow-500';
    }
  };

  // Start Screen
  if (currentView === 'start') {
    return (
      <div className="min-h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">تقييم جاهزية المنظمة</h1>
            <p className="text-xl text-muted-foreground mb-2">
              منصة ذكية لتقييم مستوى استعداد المنظمات الخيرية
            </p>
            <p className="text-muted-foreground">
              مدعوم بالذكاء الاصطناعي • تحليل شامل • توصيات مخصصة
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6">ما الذي سنقيمه؟</h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <h3 className="font-semibold mb-4">ما الذي ستحصل عليه:</h3>
            <div className="space-y-3">
              {[
                'تقييم شامل لجاهزية المنظمة عبر 10 مجالات رئيسية',
                'درجة جاهزية إجمالية مع مقارنة بمعايير القطاع',
                'تحليل ذكي لنقاط القوة والضعف',
                'خارطة طريق مخصصة للتحسين',
                'توصيات مدعومة بالذكاء الاصطناعي',
                'تتبع التقدم مع مرور الوقت'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('assessment')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-lg font-medium"
            >
              <Play className="w-5 h-5" />
              بدء التقييم
            </button>
            <button
              onClick={() => setCurrentView('results')}
              className="px-6 py-4 border border-border rounded-xl hover:bg-muted transition-colors font-medium"
            >
              عرض نتائج سابقة
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Clock className="w-4 h-4 inline mr-1" />
            المدة المتوقعة: 20-30 دقيقة
          </p>
        </div>
      </div>
    );
  }

  // Assessment Wizard
  if (currentView === 'assessment') {
    const currentCategory = categories[currentStep];
    const progress = ((currentStep + 1) / categories.length) * 100;

    return (
      <div className="min-h-full bg-background">
        {/* Progress Header */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{currentCategory.name}</h2>
                <p className="text-sm text-muted-foreground">
                  القسم {currentStep + 1} من {categories.length}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Save className="w-4 h-4" />
                حفظ ومتابعة لاحقاً
              </button>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Icon = currentCategory.icon;
                return <Icon className="w-6 h-6 text-blue-500" />;
              })()}
              <h3 className="text-lg font-medium">الأسئلة</h3>
            </div>

            <div className="space-y-6">
              {currentCategory.questions.map((q, index) => (
                <div key={q.id} className="border border-border rounded-lg p-6">
                  <p className="font-medium mb-4">
                    {index + 1}. {q.question}
                  </p>

                  {q.type === 'yesno' && (
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-3 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500/10 transition-colors">
                        نعم
                      </button>
                      <button className="flex-1 px-4 py-3 border-2 border-border rounded-lg hover:bg-muted transition-colors">
                        لا
                      </button>
                    </div>
                  )}

                  {q.type === 'scale' && (
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        className="w-full mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>منخفض</span>
                        <span>متوسط</span>
                        <span>عالي</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          {showAIInsights && (
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-purple-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-2">ملاحظة من الذكاء الاصطناعي</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    بناءً على إجاباتك السابقة، نلاحظ أن لديكم أساس قوي في {currentCategory.name}.
                    للحصول على تقييم دقيق، يُنصح بالإجابة على جميع الأسئلة بموضوعية.
                  </p>
                  <button className="text-sm text-purple-500 hover:underline">
                    معرفة المزيد عن كيفية التقييم
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                السابق
              </button>
            )}
            <button
              onClick={() => {
                if (currentStep < categories.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setCurrentView('results');
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {currentStep < categories.length - 1 ? 'التالي' : 'إنهاء التقييم'}
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Dashboard
  if (currentView === 'results') {
    return (
      <div className="min-h-full bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">نتائج تقييم الجاهزية</h1>
                <p className="text-blue-100">تم إكمال التقييم بنجاح • تم التحديث في 11 مايو 2026</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  تصدير PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </button>
                <button
                  onClick={() => setCurrentView('assessment')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة التقييم
                </button>
              </div>
            </div>

            {/* Overall Score */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <p className="text-blue-100 mb-2">درجة الجاهزية الإجمالية</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold">{overallScore}%</span>
                  <span className={`px-3 py-1 ${readinessLevel.bg}/20 border border-white/20 rounded-full text-sm mb-2`}>
                    {readinessLevel.label}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <p className="text-blue-100 mb-2">مقارنة بمتوسط القطاع</p>
                <div className="flex items-end gap-2">
                  <TrendingUp className="w-6 h-6 mb-1" />
                  <span className="text-3xl font-bold">+5%</span>
                </div>
                <p className="text-sm text-blue-100 mt-2">أعلى من المتوسط</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <p className="text-blue-100 mb-2">التقدم منذ آخر تقييم</p>
                <div className="flex items-end gap-2">
                  <Activity className="w-6 h-6 mb-1" />
                  <span className="text-3xl font-bold">+8%</span>
                </div>
                <p className="text-sm text-blue-100 mt-2">تحسن ملحوظ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Radar Chart */}
            <div className="col-span-2 bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">نظرة شاملة على الأداء</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="درجتك" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="المتوسط" dataKey={80} stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <Award className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-2xl font-bold mb-1">3</p>
                <p className="text-sm text-muted-foreground">نقاط قوة رئيسية</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                  <Target className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold mb-1">3</p>
                <p className="text-sm text-muted-foreground">مجالات تحتاج تحسين</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-500" />
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-2xl font-bold mb-1">5</p>
                <p className="text-sm text-muted-foreground">توصيات مخصصة</p>
              </div>
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">المقارنة المعيارية</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {benchmarkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Strengths */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">نقاط القوة الرئيسية</h2>
            </div>
            <div className="space-y-4">
              {strengths.map((strength, index) => (
                <div key={index} className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium mb-1">{strength.category}</h3>
                      <p className="text-sm text-muted-foreground">{strength.insight}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-green-500">{strength.score}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold">تحليل الفجوات</h2>
            </div>
            <div className="space-y-4">
              {gaps.map((gap, index) => (
                <div key={index} className={`border rounded-lg p-5 ${
                  gap.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                  gap.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                  'bg-yellow-500/5 border-yellow-500/20'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{gap.category}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(gap.severity)}`}>
                          {gap.severity === 'critical' ? 'حرج' : gap.severity === 'high' ? 'عالي' : 'متوسط'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{gap.issue}</p>
                      <div className="flex items-start gap-2 bg-card/50 rounded-lg p-3">
                        <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{gap.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">تتبع التقدم</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} name="درجة الجاهزية" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-semibold mb-3">جاهز للخطوة التالية؟</h3>
            <p className="text-muted-foreground mb-6">
              استعرض خارطة الطريق المخصصة لتحسين جاهزية منظمتك
            </p>
            <button
              onClick={() => setCurrentView('roadmap')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              عرض خارطة الطريق
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Improvement Roadmap
  if (currentView === 'roadmap') {
    return (
      <div className="min-h-full bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">خارطة الطريق للتحسين</h1>
                <p className="text-muted-foreground">خطة مخصصة لتحسين جاهزية منظمتك</p>
              </div>
              <button
                onClick={() => setCurrentView('results')}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                العودة للنتائج
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">إجمالي المبادرات</p>
                <p className="text-2xl font-bold">{roadmapItems.length}</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-blue-500">
                  {roadmapItems.filter(i => i.status === 'in-progress').length}
                </p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">مكتمل</p>
                <p className="text-2xl font-bold text-green-500">
                  {roadmapItems.filter(i => i.status === 'completed').length}
                </p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">التأثير المتوقع</p>
                <p className="text-2xl font-bold text-purple-500">+15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Items */}
        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-4">
            {roadmapItems.map((item, index) => (
              <div key={item.id} className={`border rounded-xl p-6 ${getPriorityBg(item.priority)}`}>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'in-progress' ? 'bg-blue-500' : 'bg-muted'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : item.status === 'in-progress' ? (
                        <Clock className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>
                    {index < roadmapItems.length - 1 && (
                      <div className="w-0.5 h-16 bg-border" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(item.priority)}`}>
                            أولوية {getPriorityLabel(item.priority)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground mb-1">موعد الانتهاء</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{item.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-card/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">الجهد المطلوب</p>
                        <p className="font-medium">{item.effort}</p>
                      </div>
                      <div className="bg-card/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">التأثير المتوقع</p>
                        <p className="font-medium">{item.impact}</p>
                      </div>
                    </div>

                    {item.status === 'in-progress' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>التقدم</span>
                          <span>35%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        عرض التفاصيل
                      </button>
                      {item.status === 'pending' && (
                        <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
                          بدء العمل
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="mt-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <Brain className="w-8 h-8 text-purple-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">توصيات الذكاء الاصطناعي</h3>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    بناءً على تحليل شامل لنتائج تقييمك ومقارنتها بأفضل الممارسات في القطاع، نوصي بالبدء بـ "تطوير البنية التحتية التقنية" و "إنشاء إطار إدارة المخاطر" كأولوية قصوى.
                  </p>
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      إتمام هاتين المبادرتين سيرفع درجة جاهزيتك الإجمالية من <strong>73%</strong> إلى <strong>81%</strong> المتوقعة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
