import { useParams, useNavigate, useSearchParams } from 'react-router';
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
  Target,
  Sparkles,
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
  high: { bg: 'bg-[var(--destructive)]/[0.1]', text: 'text-[var(--destructive)]', label: 'أولوية عالية' },
  medium: { bg: 'bg-[var(--warning)]/10', text: 'text-[var(--warning)]', label: 'أولوية متوسطة' },
  low: { bg: 'bg-muted/[0.1]', text: 'text-[var(--secondary)]', label: 'أولوية منخفضة' },
};

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: typeof Clock }> = {
  'not-started': { bg: 'bg-muted', text: 'text-foreground', label: 'لم يبدأ', icon: Clock },
  'in-progress': { bg: 'bg-muted/[0.1]', text: 'text-[var(--secondary)]', label: 'قيد التنفيذ', icon: Activity },
  completed: { bg: 'bg-[var(--primary)]/[0.1]', text: 'text-[var(--primary)]', label: 'مكتملة', icon: CheckCircle2 },
  delayed: { bg: 'bg-[var(--destructive)]/[0.1]', text: 'text-[var(--destructive)]', label: 'متأخرة', icon: AlertTriangle },
};

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'text-[var(--destructive)]';
    case 'medium':
      return 'text-[var(--warning)]';
    default:
      return 'text-[var(--secondary)]';
  }
}

function getPriorityBg(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-[var(--destructive)]/10 border-[var(--destructive)]/20';
    case 'medium':
      return 'bg-[var(--warning)]/10 border-[var(--warning)]/20';
    default:
      return 'bg-[var(--primary)]/10 border-[var(--secondary)]/[0.2]';
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

interface EvaluationRoadmap {
  totalDurationMonths: number;
  overallProgress: number;
  initiatives: EvaluationInitiative[];
}

export function CharityAssessmentRoadmapPage() {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [searchParams] = useSearchParams();
  const isCaptureMode = searchParams.get('pdf-capture') === '1';
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
            if (isCaptureMode && window.parent !== window) {
              window.parent.postMessage({ type: 'ROADMAP_CAPTURE_READY', organizationId }, '*');
            }
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
  }, [organizationId, isCaptureMode]);

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
      backgroundColor: 'var(--secondary)',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-[var(--spacing-grid-gap)]">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--secondary)]" />
          <p className="text-muted-foreground text-center">جاري تحميل خطة التطوير...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center p-4 sm:p-8">
        <div className="bg-card border border-border rounded-xl p-[var(--spacing-card-padding)] text-center max-w-md w-full">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--destructive)] mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground">تعذر تحميل الخطة</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium"
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
    <div ref={reportContainerRef} data-capture-root className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-[var(--spacing-grid-gap)]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-card-foreground">خارطة الطريق للتحسين</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {data?.comments?.overall?.ar || 'خطة مخصصة لتحسين جاهزية منظمتك'}
              </p>
            </div>
            {!isCaptureMode && (
              <div className="flex gap-[var(--spacing-small-gap)] report-exclude flex-wrap">
                <button
                  onClick={() =>
                    navigate(
                      organizationId
                        ? `/dashboard/charity-assessment/results/${organizationId}`
                        : '/dashboard/charity-assessment/results'
                    )
                  }
                  className="flex items-center gap-[var(--spacing-small-gap)] px-3 sm:px-4 py-2 text-sm sm:text-base border border-border rounded-lg hover:bg-muted transition-colors text-card-foreground"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة للنتائج
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[var(--spacing-grid-gap)] items-stretch">
            <div className="bg-card rounded-2xl p-4 sm:p-[var(--spacing-card-padding)] border border-border/80 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-muted w-fit mb-3 sm:mb-4">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">إجمالي المبادرات</p>
              <p className="text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">{initiatives.length}</p>
            </div>
            <div className="bg-card rounded-2xl p-4 sm:p-[var(--spacing-card-padding)] border border-[var(--secondary)]/[0.2] shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-muted w-fit mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--chart-3)]" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">المدة الإجمالية</p>
              <p className="text-2xl sm:text-3xl font-bold text-[var(--chart-3)] tracking-tight">{totalDurationMonths} شهر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Overall Score & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-[var(--spacing-grid-gap)] mb-6 sm:mb-8">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)]">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">نتيجة التقييم العامة</h3>
            <div className="flex items-center gap-3 sm:gap-[var(--spacing-grid-gap)]">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-4 ${
                  isQualified ? 'bg-muted/50 border-[var(--secondary)]/20' : 'bg-[var(--destructive)]/5 border-[var(--destructive)]/20'
                }`}
              >
                <span
                  className={`text-xl sm:text-2xl font-bold ${isQualified ? 'text-[var(--secondary)]' : 'text-[var(--destructive)]'}`}
                >
                  {Math.round(overallScore)}%
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">حالة الأهلية</p>
                <span
                  className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    isQualified ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--destructive)]/10 text-[var(--destructive)]'
                  }`}
                >
                  {isQualified ? 'مؤهل' : 'غير مؤهل'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)]">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">الجدول الزمني للتنفيذ</h3>
            <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
              <div className="text-xs sm:text-sm text-muted-foreground">إجمالي المدة المتوقعة:</div>
              <div className="text-base sm:text-lg font-bold text-[var(--secondary)]">{totalDurationMonths} شهراً</div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--secondary)] to-[var(--chart-3)]"
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
          <div className="bg-card border border-border rounded-xl p-4 sm:p-[var(--spacing-card-padding)] mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">جاهزية المنظمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-[var(--spacing-grid-gap)]">
              {organizationalReadiness.strategy && (
                <div className="p-3 sm:p-[var(--spacing-card-padding)] border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
                    <span className="w-6 h-6 rounded-full bg-muted text-[var(--secondary)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">الاستراتيجية</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.strategy}
                  </p>
                </div>
              )}
              {organizationalReadiness.governance && (
                <div className="p-3 sm:p-[var(--spacing-card-padding)] border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
                    <span className="w-6 h-6 rounded-full bg-muted text-[var(--secondary)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">الحوكمة</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.governance}
                  </p>
                </div>
              )}
              {organizationalReadiness.operations && (
                <div className="p-3 sm:p-[var(--spacing-card-padding)] border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
                    <span className="w-6 h-6 rounded-full bg-muted text-[var(--secondary)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">العمليات</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.operations}
                  </p>
                </div>
              )}
              {organizationalReadiness.dataAndDigital && (
                <div className="p-3 sm:p-[var(--spacing-card-padding)] border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
                    <span className="w-6 h-6 rounded-full bg-muted text-[var(--secondary)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      4
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">البيانات والرقمنة</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.dataAndDigital}
                  </p>
                </div>
              )}
              {organizationalReadiness.sustainability && (
                <div className="p-3 sm:p-[var(--spacing-card-padding)] border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
                    <span className="w-6 h-6 rounded-full bg-muted text-[var(--secondary)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      5
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">الاستدامة</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                    {organizationalReadiness.sustainability}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roadmap Items */}
        <div className="space-y-4 sm:space-y-[var(--spacing-section-gap)] mb-6 sm:mb-8">
          {initiatives.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-[var(--spacing-card-padding)] text-center text-muted-foreground">
              لا توجد مبادرات متاحة في خطة التطوير
            </div>
          ) : (
            initiatives.map((initiative: EvaluationInitiative, index: number) => {
              const statusStyle = statusConfig[initiative.status] || null;
              const StatusIcon = statusStyle?.icon;

              return (
                <div
                  key={initiative.id}
                  className={`border rounded-xl p-4 sm:p-[var(--spacing-card-padding)] ${getPriorityBg(initiative.priority)}`}
                >
                  <div className="flex items-start gap-3 sm:gap-[var(--spacing-grid-gap)]">
                    <div className="flex flex-col items-center gap-[var(--spacing-small-gap)] flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          initiative.status === 'completed'
                            ? 'bg-[var(--primary)]'
                            : initiative.status === 'in-progress'
                            ? 'bg-[var(--primary)]'
                            : 'bg-muted'
                        }`}
                      >
                        {initiative.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-foreground)]" />
                        ) : initiative.status === 'in-progress' ? (
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary-foreground)]" />
                        ) : (
                          <span className="text-[var(--primary-foreground)] font-bold text-sm sm:text-base">{index + 1}</span>
                        )}
                      </div>
                      {index < initiatives.length - 1 && (
                        <div className="w-0.5 h-12 sm:h-16 bg-border" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2 sm:gap-[var(--spacing-grid-gap)]">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-semibold text-card-foreground">{initiative.title}</h3>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">المحور: {formatPhaseLabel(initiative.area)}</p>
                          {initiative.dimension && (
                            <p className="text-xs sm:text-sm text-muted-foreground">البُعد: {initiative.dimension}</p>
                          )}
                        </div>
                        <div className="text-left flex-shrink-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">المدة</p>
                          <div className="flex items-center gap-[var(--spacing-small-gap)]">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                            <span className="font-medium text-sm sm:text-base">{initiative.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:gap-[var(--spacing-grid-gap)] mb-4">
                        <div className="bg-card/50 rounded-lg p-3 sm:p-[var(--spacing-card-padding)]">
                          <p className="text-xs text-muted-foreground mb-1">النتيجة المتوقعة</p>
                          <p className="font-medium text-sm sm:text-base flex items-center gap-[var(--spacing-small-gap)] text-card-foreground">
                            <Target className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            {initiative.outcome}
                          </p>
                        </div>
                      </div>

                      {initiative.status === 'in-progress' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                            <span className="text-muted-foreground">التقدم</span>
                            <span className="font-medium">{initiative.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-[var(--primary)] h-2 rounded-full"
                              style={{ width: `${initiative.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tasks */}
                      {initiative.tasks.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2 text-card-foreground">المهام الرئيسية:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-[var(--spacing-small-gap)]">
                            {initiative.tasks.map((task, idx) => (
                              <div key={idx} className="flex items-center gap-[var(--spacing-small-gap)] text-xs sm:text-sm text-muted-foreground">
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
                          <div className="text-sm font-medium mb-2 text-card-foreground">مؤشرات - KPI:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-[var(--spacing-small-gap)]">
                            {initiative.kpis.map((kpi, idx) => (
                              <div key={idx} className="flex items-center gap-[var(--spacing-small-gap)] text-xs sm:text-sm text-muted-foreground">
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
        <div className="bg-gradient-to-br from-[var(--chart-3)]/10 to-[var(--secondary)]/10 border border-[var(--chart-3)]/20 rounded-xl p-4 sm:p-8">
          <div className="flex items-start gap-3 sm:gap-[var(--spacing-grid-gap)]">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--chart-3)] flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-card-foreground">توصيات الذكاء الاصطناعي</h3>
              {llmRecommendations ? (
                <div className="space-y-4 sm:space-y-[var(--spacing-section-gap)]">
                  {llmRecommendations.highPriority && (
                    <div className="space-y-2 sm:space-y-[var(--spacing-small-gap)]">
                      <h4 className="font-medium text-[var(--destructive)] flex items-center gap-[var(--spacing-small-gap)] text-sm sm:text-base">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--destructive)] flex-shrink-0" />
                        أولوية عالية
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {llmRecommendations.highPriority}
                      </p>
                    </div>
                  )}
                  {llmRecommendations.mediumPriority && (
                    <div className="space-y-2 sm:space-y-[var(--spacing-small-gap)]">
                      <h4 className="font-medium text-[var(--warning)] flex items-center gap-[var(--spacing-small-gap)] text-sm sm:text-base">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--warning)] flex-shrink-0" />
                        أولوية متوسطة
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {llmRecommendations.mediumPriority}
                      </p>
                    </div>
                  )}
                  {llmRecommendations.longTermDevelopment && (
                    <div className="space-y-2 sm:space-y-[var(--spacing-small-gap)]">
                      <h4 className="font-medium text-[var(--secondary)] flex items-center gap-[var(--spacing-small-gap)] text-sm sm:text-base">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--secondary)] flex-shrink-0" />
                        تطوير طويل المدى
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {llmRecommendations.longTermDevelopment}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-[var(--spacing-small-gap)]">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    بناءً على تحليل شامل لنتائج تقييمك ومقارنتها بأفضل الممارسات في القطاع، نوصي بالبدء بالمبادرات ذات الأولوية العالية لتحقيق أسرع تحسن ممكن.
                  </p>
                  <div className="flex items-start gap-[var(--spacing-small-gap)]">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-card-foreground">
                      إتمام المبادرات ذات الأولوية العالية سيرفع درجة جاهزيتك الإجمالية بشكل ملحوظ.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
