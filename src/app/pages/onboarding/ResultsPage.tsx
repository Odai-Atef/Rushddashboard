import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Info,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { handleReportDownload } from '@/app/utils/download-report';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { toast } from 'sonner';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { resolveIcon as resolveApiIcon } from '@/app/utils/icon-map';
import {
  IsivAssessmentResult,
  Strength as StrengthItem,
  Weakness as WeaknessItem,
  Benchmarks,
} from '@/api/services/onboarding-service';

interface QualificationStatusOption {
  value: string;
  labelAr: string;
  bgClass: string;
  textClass: string;
  icon: typeof CheckCircle2;
}

function getQualificationStatusOption(status?: string | null): QualificationStatusOption {
  const normalized = status?.toUpperCase() ?? '';
  switch (normalized) {
    case 'QUALIFIED':
    case 'QUALIFIED_WITH_IMPROVEMENT':
    case 'WITH_IMPROVEMENT':
      return {
        value: normalized,
        labelAr: normalized === 'QUALIFIED' ? 'مؤهل' : 'مؤهل مع خطة تحسين',
        bgClass: 'bg-green-400',
        textClass: 'text-green-900',
        icon: CheckCircle2,
      };
    case 'NOT_QUALIFIED':
      return {
        value: normalized,
        labelAr: 'غير مؤهل',
        bgClass: 'bg-red-400',
        textClass: 'text-red-900',
        icon: AlertCircle,
      };
    default:
      return {
        value: normalized,
        labelAr: status ?? 'مؤهل مع خطة تحسين',
        bgClass: 'bg-yellow-400',
        textClass: 'text-yellow-900',
        icon: AlertCircle,
      };
  }
}

export function ResultsPage() {
  const { goToStep } = useOnboardingNavigate();
  const {
    activeOrganizationId,
    assessmentResult,
    assessmentStatus,
    loadAssessmentStatus,
    loadAssessmentResult,
  } = useOnboardingContext();

  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [localResult, setLocalResult] = useState<IsivAssessmentResult | null>(null);
  const [localStatus, setLocalStatus] = useState<typeof assessmentStatus>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchResults = async () => {
      if (!activeOrganizationId) return;
      setIsLoadingResults(true);
      setResultsError(null);
      try {
        const status = await loadAssessmentStatus();
        if (!cancelled) {
          setLocalStatus(status);
        }
        if (status?.status === 'COMPLETED') {
          const result = await loadAssessmentResult();
          if (!cancelled) {
            setLocalResult(result);
          }
        } else {
          if (!cancelled) setLocalResult(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message = err?.message || 'فشل تحميل النتائج';
          setResultsError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setIsLoadingResults(false);
      }
    };
    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId, loadAssessmentStatus, loadAssessmentResult]);

  const isivResult = localResult ?? assessmentResult;
  const displayScore = isivResult?.overallScore ?? localStatus?.overallScore ?? assessmentStatus?.overallScore ?? 0;
  const statusOption = getQualificationStatusOption(isivResult?.qualificationStatus);
  const displayMessage = isivResult?.qualificationMessage || statusOption.labelAr;
  const dimensions = isivResult?.dimensions || [];
  const radarData =
    isivResult?.radarData ||
    dimensions.map((d) => ({
      category: d.symbol || d.dimension.slice(0, 2),
      score: d.percentage,
      fullMark: 100,
    }));
  const categoryScores =
    isivResult?.categoryScores ||
    (radarData.length > 0
      ? radarData.map((d) => ({
          categoryId: d.category,
          categoryName: d.category,
          score: d.score,
          maxScore: d.fullMark,
          color:
            d.score >= 80 ? '#10b981' : d.score >= 50 ? '#3b82f6' : '#f59e0b',
        }))
      : dimensions.map((d) => ({
          categoryId: d.dimension,
          categoryName: d.dimensionLabelAr || d.dimension,
          score: d.percentage,
          maxScore: 100,
          color:
            d.color ||
            (d.percentage >= 80 ? '#10b981' : d.percentage >= 50 ? '#3b82f6' : '#f59e0b'),
        })));
  const apiBenchmarks = isivResult?.benchmarks;
  const benchmarks: Benchmarks = apiBenchmarks || {
    yourScore: Math.round((displayScore / 100) * 100),
    sectorAverage: 65,
    topPerformer: 92,
  };
  const strengths = isivResult?.strengths || [];
  const weaknesses = isivResult?.weaknesses || [];

  const isQualified =
    isivResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED' ||
    isivResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED_WITH_IMPROVEMENT' ||
    isivResult?.qualificationStatus?.toUpperCase() === 'WITH_IMPROVEMENT';

  const handleDownloadReport = async () => {
    const container = reportContainerRef.current;
    if (!container) {
      toast.error('تعذر العثور على محتوى التقرير');
      return;
    }

    const orgName = isivResult?.organizationId || 'organization';
    await handleReportDownload({
      container,
      fileName: `assessment-report-${orgName}.pdf`,
      setIsDownloading,
    });
  };

  if (isLoadingResults) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل النتائج...</p>
        </div>
      </div>
    );
  }

  if (resultsError) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">تعذر تحميل النتائج</h2>
          <p className="text-gray-600 mb-6">{resultsError}</p>
          <button
            onClick={async () => {
              if (!activeOrganizationId) return;
              setIsLoadingResults(true);
              setResultsError(null);
              try {
                const { onboardingService } = await import('@/api/services');
                const evalRes = await onboardingService.getIsivAssessmentResults(activeOrganizationId);
                setLocalResult(evalRes.data);
              } catch (err: any) {
                const message = err?.message || 'فشل في تحميل النتائج. يرجى المحاولة مرة أخرى.';
                setResultsError(message);
                toast.error(message);
              } finally {
                setIsLoadingResults(false);
              }
            }}
            disabled={isLoadingResults}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if ((localStatus ?? assessmentStatus) && (localStatus ?? assessmentStatus)?.status !== 'COMPLETED' && !isivResult) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {(localStatus ?? assessmentStatus)?.status === 'IN_PROGRESS'
              ? 'التقييم قيد الإكمال'
              : 'لم يبدأ التقييم بعد'}
          </h2>
          <p className="text-gray-600 mb-6">
            {(localStatus ?? assessmentStatus)?.status === 'IN_PROGRESS'
              ? ' أكمل إجاباتك لعرض النتائج التفصيلية.'
              : ' ابدأ التقييم لتحصل على تحليل شامل لمؤسستك.'}
          </p>
          <button
            onClick={() => goToStep('assessment')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {(localStatus ?? assessmentStatus)?.status === 'IN_PROGRESS'
              ? 'متابعة التقييم'
              : 'بدء التقييم'}
          </button>
        </div>
      </div>
    );
  }

  if (!isivResult) {
    return null;
  }

  return (
    <div ref={reportContainerRef} className="min-h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">نتائج التقييم</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">تهانينا! تم إكمال التقييم</h1>
              <p className="text-blue-100">تم تحليل مؤسستك بنجاح. اطّلع على النتائج التفصيلية أدناه</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                <div>
                  <div className="text-5xl font-bold">{displayScore}</div>
                  <div className="text-sm">من 100</div>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${statusOption.bgClass} ${statusOption.textClass}`}>
                <Award className="w-4 h-4" />
                <span>{displayMessage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Qualification Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-opacity-10 ${statusOption.bgClass.replace('bg-', 'bg-').replace('-400', '-50')}`}>
                <statusOption.icon className={`w-8 h-8 ${statusOption.textClass.replace('900', '600')}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{displayMessage}</h2>
                <p className="text-gray-600">{isivResult?.diagnosis}</p>
              </div>
            </div>
            {isQualified && (
              <button
                onClick={() => goToStep('roadmap')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                عرض خطة التطوير
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">التحليل الشامل</h3>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar name="النتيجة" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">لا توجد بيانات للرسم البياني</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">الأبعاد التفصيلية</h3>
            {categoryScores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryScores.map((cs) => (
                  <div key={cs.categoryId} className="rounded-lg border border-gray-200 p-4" style={{ borderRightWidth: 4, borderRightColor: cs.color }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{cs.categoryName}</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${cs.color}20`, color: cs.color }}>
                        {cs.score} / {cs.maxScore}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold" style={{ color: cs.color }}>{cs.score}</div>
                      <div className="text-sm text-gray-600">{cs.score}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">لا توجد بيانات للأبعاد</p>
            )}
          </div>
        </div>

        {/* Diagnostic Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3">التشخيص</h3>
            <p className="text-gray-700 leading-relaxed">{isivResult?.diagnosis || 'لا يوجد تشخيص متاح.'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              نقاط القوة
            </h3>
            {strengths.length > 0 ? (
              <ul className="space-y-2">
                {strengths.map((strength, idx) => {
                  const isObject = typeof strength === 'object';
                  const label = isObject ? (strength as StrengthItem).area : (strength as string);
                  const insight = isObject ? (strength as StrengthItem).insight : null;
                  return (
                    <li key={idx} className="flex flex-col gap-1 text-gray-700">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{label}</span>
                      </div>
                      {insight && <p className="text-sm text-gray-600 pr-6">{insight}</p>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">لا توجد نقاط قوة مسجلة.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              مجالات التحسين
            </h3>
            {weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {weaknesses.map((weakness, idx) => {
                  const isObject = typeof weakness === 'object';
                  const label = isObject ? (weakness as WeaknessItem).area : (weakness as string);
                  const insight = isObject ? (weakness as WeaknessItem).insight : null;
                  const severity = isObject ? (weakness as WeaknessItem).severity : null;
                  return (
                    <li key={idx} className="flex flex-col gap-1 text-gray-700">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{label}</span>
                        {severity && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">{severity}</span>}
                      </div>
                      {insight && <p className="text-sm text-gray-600 pr-6">{insight}</p>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">لا توجد مجالات تحسين مسجلة.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">المقارنة المعيارية</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">مؤسستك</span>
                  <span className="text-sm font-bold text-blue-600">{benchmarks.yourScore}٪</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${benchmarks.yourScore}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">متوسط القطاع</span>
                  <span className="text-sm font-bold text-gray-600">{benchmarks.sectorAverage}٪</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400" style={{ width: `${benchmarks.sectorAverage}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">الجمعيات الرائدة</span>
                  <span className="text-sm font-bold text-green-600">{benchmarks.topPerformer}٪</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${benchmarks.topPerformer}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="report-exclude flex gap-4">
          <button
            onClick={() => goToStep('analysis')}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            عرض التحليل التفصيلي
          </button>
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isDownloading ? 'جارٍ التحميل...' : 'تحميل التقرير'}
          </button>
        </div>
      </div>
    </div>
  );
}
