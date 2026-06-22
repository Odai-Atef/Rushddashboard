import { useParams, useNavigate } from 'react-router';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Brain,
  Zap,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Activity,
  Users,
  Target,
  Sparkles,
  Download,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  EvaluationInitiative,
  EvaluationResponse,
} from '@/api/services/onboarding-service';

interface LoadedEvaluation {
  data: EvaluationResponse;
  cached: boolean;
}

const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-red-100', text: 'text-red-700', label: 'أولوية عالية' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'أولوية متوسطة' },
  low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'أولوية منخفضة' },
};

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: typeof Clock }> = {
  'not-started': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'لم يبدأ', icon: Clock },
  'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'قيد التنفيذ', icon: Activity },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'مكتملة', icon: CheckCircle2 },
  delayed: { bg: 'bg-red-100', text: 'text-red-700', label: 'متأخرة', icon: AlertTriangle },
};

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    default:
      return 'text-blue-500';
  }
}

function getPriorityBg(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 border-red-500/20';
    case 'medium':
      return 'bg-yellow-500/10 border-yellow-500/20';
    default:
      return 'bg-blue-500/10 border-blue-500/20';
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case 'high':
      return 'عالي';
    case 'medium':
      return 'متوسط';
    default:
      return 'منخفض';
  }
}

function formatPhaseLabel(phase: string): string {
  return phase.replace(/(\d+)\s*days?/gi, '$1 يوم').replace(/_/g, ' ');
}

export function CharityAssessmentRoadmapPage() {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [evaluation, setEvaluation] = useState<LoadedEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchEvaluation = async () => {
      if (!organizationId) {
        setError('لم يتم تحديد المنظمة');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { onboardingService } = await import('@/api/services');

        let res = await onboardingService.getIsivAssessmentResults(organizationId);
        let payload = (res.data as any)?.data ?? res.data;
        let cached = (res.data as any)?.cached ?? false;

        if (!payload?.llmResponse) {
          const evalRes = await onboardingService.evaluateAssessment(organizationId);
          payload = (evalRes.data as any)?.data ?? evalRes.data;
          cached = (evalRes.data as any)?.cached ?? false;
        }

        if (!cancelled) {
          if (payload) {
            setEvaluation({ data: payload, cached });
          } else {
            setError('لم يتم استلام بيانات التقييم');
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          const message = err?.message || 'فشل تحميل خطة التطوير';
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchEvaluation();
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const handleDownloadPlan = async () => {
    const container = reportContainerRef.current;
    if (!container) {
      toast.error('تعذر العثور على محتوى الخطة');
      return;
    }

    const { handleReportDownload } = await import('@/app/utils/download-report');
    await handleReportDownload({
      container,
      fileName: `roadmap-report-${organizationId || 'organization'}.pdf`,
      setIsDownloading,
      backgroundColor: '#f3f4f6',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-muted-foreground">جاري تحميل خطة التطوير...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center p-8">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">تعذر تحميل الخطة</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const data = evaluation?.data;
  const llmRoadmapPhases = (data as any)?.llmResponse?.roadmap as
    | { phase: string; objective: string; activities: string[]; kpis: string[]; expectedOutcome: string }[]
    | undefined;
  const llmRoadmap: EvaluationRoadmap | undefined = llmRoadmapPhases?.length
    ? {
        totalDurationMonths: llmRoadmapPhases.length * 3,
        overallProgress: 0,
        initiatives: llmRoadmapPhases.map((phase, idx) => ({
          id: idx + 1,
          title: phase.objective || phase.phase,
          area: formatPhaseLabel(phase.phase),
          dimension: '',
          priority: 'medium',
          responsible: '',
          outcome: phase.expectedOutcome || phase.objective,
          duration: '3 أشهر',
          status: 'not-started',
          tasks: phase.activities ?? [],
          kpis: phase.kpis ?? [],
          progress: 0,
        })),
      }
    : undefined;
  const roadmap = llmRoadmap ?? data?.roadmap;
  const initiatives = roadmap?.initiatives ?? [];
  const recommendations = data?.recommendations ?? [];
  const organizationalReadiness = (data as any)?.llmResponse
    ?.organizationalReadiness as {
    strategy?: string;
    governance?: string;
    operations?: string;
    dataAndDigital?: string;
    sustainability?: string;
  } | undefined;
  const overallScore =
    data?.scores?.overall?.percent ??
    (data?.overallScore != null ? data.overallScore : null) ??
    data?.scores?.overall?.rawPoints ??
    roadmap?.overallProgress ??
    0;
  const totalDurationMonths = roadmap?.totalDurationMonths ?? 0;
  const isQualified = data?.qualificationStatus?.toUpperCase() === 'QUALIFIED';
  const llmRecommendations = (data as any)?.llmResponse?.recommendations as
    | { highPriority?: string; mediumPriority?: string; longTermDevelopment?: string }
    | undefined;

  return (
    <div ref={reportContainerRef} className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">خارطة الطريق للتحسين</h1>
              <p className="text-muted-foreground">
                {data?.comments?.overall?.ar || 'خطة مخصصة لتحسين جاهزية منظمتك'}
              </p>
            </div>
            <div className="flex gap-3 report-exclude flex-wrap">
              <button
                onClick={() =>
                  navigate(
                    organizationId
                      ? `/dashboard/charity-assessment/results/${organizationId}`
                      : '/dashboard/charity-assessment/results'
                  )
                }
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                العودة للنتائج
              </button>
              <button
                onClick={() =>
                  navigate(
                    organizationId
                      ? `/dashboard/ai-innovation?assessmentOrg=${organizationId}&view=feasibility`
                      : '/dashboard/ai-innovation?view=feasibility'
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                إنشاء دراسة باستخدام الذكاء الاصطناعي
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">إجمالي المبادرات</p>
              <p className="text-2xl font-bold">{initiatives.length}</p>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">المدة الإجمالية</p>
              <p className="text-2xl font-bold text-purple-500">{totalDurationMonths} شهر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Overall Score & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">نتيجة التقييم العامة</h3>
            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                  isQualified ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'
                }`}
              >
                <span
                  className={`text-2xl font-bold ${isQualified ? 'text-blue-600' : 'text-red-600'}`}
                >
                  {Math.round(overallScore)}%
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">حالة الأهلية</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isQualified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isQualified ? 'مؤهل' : 'غير مؤهل'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">الجدول الزمني للتنفيذ</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm text-muted-foreground">إجمالي المدة المتوقعة:</div>
              <div className="text-lg font-bold text-blue-600">{totalDurationMonths} شهراً</div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{ width: `${roadmap?.overallProgress ?? 0}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>البداية</span>
              <span>{Math.round(totalDurationMonths / 2)} أشهر</span>
              <span>الانتهاء</span>
            </div>
          </div>
        </div>

        {/* Organizational Readiness */}
        {organizationalReadiness && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">جاهزية المنظمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizationalReadiness.strategy && (
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">الاستراتيجية</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.strategy}
                  </p>
                </div>
              )}
              {organizationalReadiness.governance && (
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">الحوكمة</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.governance}
                  </p>
                </div>
              )}
              {organizationalReadiness.operations && (
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">العمليات</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.operations}
                  </p>
                </div>
              )}
              {organizationalReadiness.dataAndDigital && (
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">البيانات والرقمنة</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.dataAndDigital}
                  </p>
                </div>
              )}
              {organizationalReadiness.sustainability && (
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      5
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">الاستدامة</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.sustainability}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roadmap Items */}
        <div className="space-y-4 mb-8">
          {initiatives.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              لا توجد مبادرات متاحة في خطة التطوير
            </div>
          ) : (
            initiatives.map((initiative: EvaluationInitiative, index: number) => {
              const statusStyle = statusConfig[initiative.status] || null;
              const StatusIcon = statusStyle?.icon;

              return (
                <div
                  key={initiative.id}
                  className={`border rounded-xl p-6 ${getPriorityBg(initiative.priority)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          initiative.status === 'completed'
                            ? 'bg-green-500'
                            : initiative.status === 'in-progress'
                            ? 'bg-blue-500'
                            : 'bg-muted'
                        }`}
                      >
                        {initiative.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : initiative.status === 'in-progress' ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-bold">{index + 1}</span>
                        )}
                      </div>
                      {index < initiatives.length - 1 && (
                        <div className="w-0.5 h-16 bg-border" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3 flex-wrap gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{initiative.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">المحور: {formatPhaseLabel(initiative.area)}</p>
                          {initiative.dimension && (
                            <p className="text-sm text-muted-foreground">البُعد: {initiative.dimension}</p>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-muted-foreground mb-1">المدة</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{initiative.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="bg-card/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">النتيجة المتوقعة</p>
                          <p className="font-medium flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            {initiative.outcome}
                          </p>
                        </div>
                      </div>

                      {initiative.status === 'in-progress' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>التقدم</span>
                            <span>{initiative.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${initiative.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tasks */}
                      {initiative.tasks.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2">المهام الرئيسية:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {initiative.tasks.map((task, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs">{idx + 1}</span>
                                </div>
                                {task}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* KPIs */}
                      {initiative.kpis && initiative.kpis.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">مؤشرات - KPI:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {initiative.kpis.map((kpi, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs">{idx + 1}</span>
                                </div>
                                {kpi}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-purple-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-3">توصيات الذكاء الاصطناعي</h3>
              {llmRecommendations ? (
                <div className="space-y-6">
                  {llmRecommendations.highPriority && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-700 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-red-500 flex-shrink-0" />
                        أولوية عالية
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {llmRecommendations.highPriority}
                      </p>
                    </div>
                  )}
                  {llmRecommendations.mediumPriority && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-yellow-700 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        أولوية متوسطة
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {llmRecommendations.mediumPriority}
                      </p>
                    </div>
                  )}
                  {llmRecommendations.longTermDevelopment && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-700 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        تطوير طويل المدى
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {llmRecommendations.longTermDevelopment}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    بناءً على تحليل شامل لنتائج تقييمك ومقارنتها بأفضل الممارسات في القطاع، نوصي بالبدء بالمبادرات ذات الأولوية العالية لتحقيق أسرع تحسن ممكن.
                  </p>
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      إتمام المبادرات ذات الأولوية العالية سيرفع درجة جاهزيتك الإجمالية بشكل ملحوظ.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 mt-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">الدعم من حاضنة رشد</h3>
              <p className="text-gray-700 mb-4">فريقنا جاهز لدعمك في تنفيذ خطة التطوير. ستحصل على:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  استشارات متخصصة في كل محور
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  برامج تدريبية وورش عمل
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  منصة متابعة وتقييم مستمر
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  شبكة من الخبراء والشركاء
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
