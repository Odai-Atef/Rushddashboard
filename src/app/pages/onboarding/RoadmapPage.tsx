import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Loader2,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { toast } from 'sonner';
import { handleReportDownload } from '@/app/utils/download-report';
import {
  EvaluationInitiative,
  EvaluationRecommendation,
  EvaluationResponse,
} from '@/api/services/onboarding-service';

interface LoadedEvaluation {
  data: EvaluationResponse;
  cached: boolean;
}

export function RoadmapPage() {
  const { goToStep } = useOnboardingNavigate();
  const { activeOrganizationId, organization, assessmentAnswersDirty } = useOnboardingContext();

  const reportContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [evaluation, setEvaluation] = useState<LoadedEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchEvaluation = async () => {
      if (!activeOrganizationId) {
        setError('لم يتم تحديد الجمعية');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { onboardingService } = await import('@/api/services');

        // Always force regeneration so the report reflects the latest answers.
        let res = await onboardingService.evaluateAssessment(activeOrganizationId, {
          forceRegenerate: true,
        });

        let payload = (res.data as any)?.data ?? res.data;
        let cached = (res.data as any)?.cached ?? false;

        if (!cancelled) {
          if (payload) {
            setEvaluation({ data: payload, cached });
          } else {
            setError('لم يتم استلام بيانات التقييم');
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          const message = err?.message || 'فشل تحميل تقييم خطة التطوير';
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
  }, [activeOrganizationId, assessmentAnswersDirty]);

  const handleDownloadPlan = async () => {
    const container = reportContainerRef.current;
    if (!container) {
      toast.error('تعذر العثور على محتوى الخطة');
      return;
    }

    const orgId = organization?.id || activeOrganizationId || 'organization';
    await handleReportDownload({
      container,
      fileName: `roadmap-report-${orgId}.pdf`,
      setIsDownloading,
      backgroundColor: '#f3f4f6',
    });
  };

  const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'أولوية عالية' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'أولوية متوسطة' },
    low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'أولوية منخفضة' },
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string; icon: typeof Clock }> = {
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'قيد التنفيذ', icon: Activity },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'مكتملة', icon: CheckCircle2 },
    delayed: { bg: 'bg-red-100', text: 'text-red-700', label: 'متأخرة', icon: AlertTriangle },
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جارٍ تحميل خطة التطوير...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">تعذر تحميل الخطة</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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
  const roadmap = data?.roadmap;
  const initiatives = roadmap?.initiatives ?? [];
  const recommendations = data?.recommendations ?? [];
  const overallScore =
    data?.scores?.overall?.percent ??
    (data?.overallScore != null ? data.overallScore : null) ??
    data?.scores?.overall?.rawPoints ??
    roadmap?.overallProgress ??
    0;
  const totalDurationMonths = roadmap?.totalDurationMonths ?? 0;
  const isQualified = data?.qualificationStatus?.toUpperCase() === 'QUALIFIED';

  return (
    <div ref={reportContainerRef} className="min-h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goToStep('analysis')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى التحليل
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">خطة التطوير والتحسين</h1>
              <p className="text-gray-600">
                {data?.comments?.overall?.ar || 'خارطة طريق مخصصة لتطوير الجمعية'}
              </p>
            </div>
            <div className="flex gap-3 report-exclude">
              <button
                onClick={handleDownloadPlan}
                disabled={isDownloading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isDownloading ? 'جارٍ التحميل...' : 'تحميل الخطة'}
              </button>
        
            </div>
          </div>
        </div>

        {/* Overall Score & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">نتيجة التقييم العامة</h3>
            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                  isQualified
                    ? 'bg-blue-50 border-blue-100'
                    : 'bg-red-50 border-red-100'
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    isQualified ? 'text-blue-600' : 'text-red-600'
                  }`}
                >
                  {Math.round(overallScore)}%
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">حالة الأهلية</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isQualified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isQualified ? 'مؤهل' : 'غير مؤهل'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">الجدول الزمني للتنفيذ</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm text-gray-600">إجمالي المدة المتوقعة:</div>
              <div className="text-lg font-bold text-blue-600">{totalDurationMonths} شهراً</div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{ width: `${roadmap?.overallProgress ?? 0}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>البداية</span>
              <span>{Math.round(totalDurationMonths / 2)} أشهر</span>
              <span>الانتهاء</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">التوصيات المقترحة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec: EvaluationRecommendation, idx: number) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {rec.priority}
                    </span>
                    <span className="text-sm font-medium text-gray-600">{rec.dimension}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{rec.serviceNameAr || rec.serviceNameEn}</h4>
                  {rec.packageBundle && (
                    <p className="text-sm text-gray-600">
                      الباقة: {rec.packageBundle.nameAr || rec.packageBundle.nameEn}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initiatives */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">المبادرات التطويرية</h3>
          {initiatives.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              لا توجد مبادرات متاحة في خطة التطوير
            </div>
          ) : (
            initiatives.map((initiative: EvaluationInitiative) => {
              const priorityStyle = priorityConfig[initiative.priority] || priorityConfig.medium;
              const statusStyle = statusConfig[initiative.status] || null;
              const StatusIcon = statusStyle?.icon;

              return (
                <div
                  key={initiative.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{initiative.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyle.bg} ${priorityStyle.text}`}
                        >
                          {initiative.priorityLabelAr || priorityStyle.label}
                        </span>
                        {statusStyle && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusStyle.label}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">المحور: {initiative.area}</div>
                      {initiative.dimension && (
                        <div className="text-sm text-gray-600">البُعد: {initiative.dimension}</div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-600">المدة</div>
                      <div className="font-semibold">{initiative.duration}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">الجهة المسؤولة</div>
                      <div className="font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {initiative.responsible}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">النتيجة المتوقعة</div>
                      <div className="font-medium flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        {initiative.outcome}
                      </div>
                    </div>
                  </div>

                  {/* Tasks */}
                  {initiative.tasks.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">المهام الرئيسية:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {initiative.tasks.map((task, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs">{idx + 1}</span>
                            </div>
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 mt-6">
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
              <button
                onClick={() => goToStep('decision')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 report-exclude"
              >
                الانتقال للخطوة الأخيرة
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
