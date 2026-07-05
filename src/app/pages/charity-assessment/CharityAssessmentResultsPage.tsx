import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import {
  Award,
  AlertTriangle,
  Target,
  Star,
  Sparkles,
  Lightbulb,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
  Activity,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useIsivAssessmentResults } from '@/api/hooks/useIsivAssessmentResults';
import type { Weakness, ProgressDataItem } from '@/api/services/onboarding-service';

function getReadinessLevel(score: number) {
  if (score >= 85) return { label: 'متميز', color: 'text-green-500', bg: 'bg-green-500' };
  if (score >= 70) return { label: 'جاهز', color: 'text-blue-500', bg: 'bg-blue-500' };
  if (score >= 55) return { label: 'متوسط', color: 'text-yellow-500', bg: 'bg-yellow-500' };
  return { label: 'يحتاج تحسين', color: 'text-red-500', bg: 'bg-red-500' };
}

function getSeverityClasses(severity: string) {
  switch (severity) {
    case 'critical':
      return {
        wrapper: 'bg-red-500/5 border-red-500/20',
        badge: 'text-red-500',
        label: 'حرج',
      };
    case 'high':
      return {
        wrapper: 'bg-orange-500/5 border-orange-500/20',
        badge: 'text-orange-500',
        label: 'عالي',
      };
    default:
      return {
        wrapper: 'bg-yellow-500/5 border-yellow-500/20',
        badge: 'text-yellow-500',
        label: 'متوسط',
      };
  }
}

export function CharityAssessmentResultsPage() {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const { data, isLoading, error, refetch } = useIsivAssessmentResults(organizationId);
  const [documentsMissing, setDocumentsMissing] = useState<boolean | null>(null);

  useEffect(() => {
    if (!organizationId) return;
    let cancelled = false;
    const check = async () => {
      try {
        const { onboardingService } = await import('@/api/services');
        const res = await onboardingService.checkRequiredDocuments(organizationId);
        if (cancelled) return;
        const payload = res.data as any;
        const complete = !!(payload?.data?.complete ?? payload?.complete);
        setDocumentsMissing(!complete);
      } catch {
        if (!cancelled) setDocumentsMissing(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [organizationId]);

  if (isLoading || documentsMissing === null) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-muted-foreground">جاري تحميل نتائج التقييم...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center p-8">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">تعذر تحميل النتائج</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center p-8">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">لا توجد نتائج</h2>
          <p className="text-muted-foreground">لم يتم العثور على نتائج تقييم لهذه المنظمة.</p>
        </div>
      </div>
    );
  }

  const overallScore = data.overallScore ?? 0;
  const readinessLevel = getReadinessLevel(overallScore);
  const radarData =
    data.radarData && data.radarData.length > 0
      ? data.radarData
      : (data.dimensions ?? []).map((d) => ({
          category: d.nameAr || d.dimensionLabelAr || d.dimension || d.nameEn || d.symbol || 'dimension',
          score: d.percent ?? d.percentage ?? d.score ?? 0,
          fullMark: 100,
        }));

  // Keep the radar chart on a fixed 0-100 scale so lower dimensions (e.g.
  // "القيمة والاستدامة") are not visually compressed near the center.
  const radarLowerBound = 0;
  const radarUpperBound = 100;
  // The backend sometimes returns the LLM output as a malformed JSON string
  // in llmResponse.raw. Parse it client-side and, if that fails, extract the
  // rich fields we care about with targeted regex/string parsing.
  const rawLlm = (data as any).llmResponse?.raw;
  let parsedLlm: any = null;
  if (rawLlm && typeof rawLlm === 'string') {
    try {
      parsedLlm = JSON.parse(rawLlm);
    } catch {
      parsedLlm = {};

      const extractStringField = (key: string): string | undefined => {
        const pattern = new RegExp(`"${key}"\\s*:\\s*"(.*?)"(?=,\\s*"|\\s*[,}\\]])`, 's');
        const match = rawLlm.match(pattern);
        return match ? match[1] : undefined;
      };

      const strengthsAnalysis = extractStringField('strengthsAnalysis');
      const gapAnalysis = extractStringField('gapAnalysis');
      if (strengthsAnalysis) parsedLlm.strengthsAnalysis = strengthsAnalysis;
      if (gapAnalysis) parsedLlm.gapAnalysis = gapAnalysis;

      // Extract the recommendations object if present.
      const recMatch = rawLlm.match(/"recommendations"\s*:\s*(\{.*?\})/s);
      if (recMatch) {
        try {
          parsedLlm.recommendations = JSON.parse(recMatch[1]);
        } catch {
          // ignore malformed recommendations block
        }
      }

      if (Object.keys(parsedLlm).length === 0) parsedLlm = null;
    }
  }
  const llm = parsedLlm || (data as any).llmResponse;
  const llmStrengthsAnalysis = llm?.strengthsAnalysis;
  const llmGapAnalysis = llm?.gapAnalysis;

  // Use LLM-derived recommendations when the backend returns an empty list.
  const recommendations =
    data.recommendations && data.recommendations.length > 0
      ? data.recommendations
      : llm?.recommendations
      ? [
          ...(llm.recommendations.highPriority
            ? llm.recommendations.highPriority.split(/\n/).filter(Boolean).map((r: string) => ({ text: r.trim(), priority: 'high' as const }))
            : []),
          ...(llm.recommendations.mediumPriority
            ? llm.recommendations.mediumPriority.split(/\n/).filter(Boolean).map((r: string) => ({ text: r.trim(), priority: 'medium' as const }))
            : []),
          ...(llm.recommendations.longTermDevelopment
            ? llm.recommendations.longTermDevelopment.split(/\n/).filter(Boolean).map((r: string) => ({ text: r.trim(), priority: 'long' as const }))
            : []),
        ]
      : [];

  // Prefer the rich LLM narrative for strengths; fall back to the plain backend list.
  const strengths =
    llmStrengthsAnalysis && typeof llmStrengthsAnalysis === 'string'
      ? llmStrengthsAnalysis.split(/،|\. /).map((s) => s.trim()).filter(Boolean)
      : (data.strengths ?? []);

  // Prefer the rich LLM narrative for gaps; fall back to the plain backend list.
  const weaknesses =
    llmGapAnalysis && typeof llmGapAnalysis === 'string'
      ? [{ area: 'تحليل الفجوات', issue: llmGapAnalysis, severity: 'medium' as const }]
      : ((data.weaknesses ?? []) as Weakness[]);
  const benchmarks = data.benchmarks;
  const benchmarkData = benchmarks
    ? [
        { name: 'منظمتك', value: benchmarks.yourScore, color: '#3b82f6' },
        { name: 'متوسط القطاع', value: benchmarks.sectorAverage, color: '#94a3b8' },
        { name: 'أفضل ممارسة', value: benchmarks.topPerformer, color: '#10b981' },
      ]
    : [
        { name: 'منظمتك', value: overallScore, color: '#3b82f6' },
        { name: 'متوسط القطاع', value: 68, color: '#94a3b8' },
        { name: 'أفضل ممارسة', value: 85, color: '#10b981' },
      ];
  const progressData = data.progressData as ProgressDataItem[] | undefined;
  const assessedAt = data.assessedAt ? new Date(data.assessedAt) : null;

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">نتائج تقييم الجاهزية</h1>
              <p className="text-blue-100">
                {assessedAt
                  ? `تم إكمال التقييم بنجاح • تم التحديث في ${assessedAt.toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}`
                  : 'تم إكمال التقييم بنجاح'}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                تصدير PDF
              </button>
              <button
                onClick={() => navigate('/dashboard/charity-assessment/assessment')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة التقييم
              </button>
              {documentsMissing && data.qualificationStatus?.toUpperCase() !== 'NOT_QUALIFIED' && (
                <button
                  onClick={() =>
                    navigate(`/dashboard/onboarding/documents?organizationId=${encodeURIComponent(organizationId || '')}&from=results`)
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors animate-pulse"
                >
                  أكمل ملفك
                </button>
              )}
            </div>
          </div>

          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <p className="text-blue-100 mb-2">درجة الجاهزية الإجمالية</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{overallScore}%</span>
                <span
                  className={`px-3 py-1 ${readinessLevel.bg}/20 border border-white/20 rounded-full text-sm mb-2`}
                >
                  {readinessLevel.label}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 md:col-span-2">
              <p className="text-blue-100 mb-2">التقييم العام</p>
              <p className="text-2xl font-semibold leading-relaxed">
                {data.comments?.overall?.ar || data.qualificationMessage || 'تم إكمال التقييم بنجاح'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Radar Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">نظرة شاملة على الأداء</h2>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: '#4b5563' }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[radarLowerBound, radarUpperBound]}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    tickCount={5}
                  />
                  <Radar
                    name="درجتك"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'درجتك']}
                    contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                لا توجد بيانات رادار متاحة
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <button
              onClick={() => {
                document.getElementById('strengths-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-card border border-border rounded-xl p-6 text-right w-full hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <Award className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{strengths.length}</p>
              <p className="text-sm text-muted-foreground">نقاط قوة رئيسية</p>
            </button>

            <button
              onClick={() => {
                document.getElementById('gaps-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-card border border-border rounded-xl p-6 text-right w-full hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{weaknesses.length}</p>
              <p className="text-sm text-muted-foreground">تحليل الفجوات</p>
            </button>

            <button
              onClick={() => {
                if (organizationId) {
                  navigate(`/dashboard/charity-assessment/roadmap/${organizationId}`);
                }
              }}
              className="bg-card border border-border rounded-xl p-6 text-right w-full hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <Lightbulb className="w-8 h-8 text-purple-500" />
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mb-1">{recommendations.length}</p>
              <p className="text-sm text-muted-foreground">توصيات مخصصة</p>
            </button>
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
        <div id="strengths-section" className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">نقاط القوة الرئيسية</h2>
          </div>
          {llmStrengthsAnalysis && (
            <p className="text-muted-foreground leading-relaxed mb-6">{llmStrengthsAnalysis}</p>
          )}
          <div className="space-y-4">
            {strengths.length > 0 ? (
              strengths.map((strength, index) => {
                const title = typeof strength === 'string' ? strength : strength.area;
                const score = typeof strength === 'string' ? undefined : strength.score;
                const insight = typeof strength === 'string' ? undefined : strength.insight;
                return (
                  <div key={index} className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium mb-1">{title}</h3>
                        {insight && <p className="text-sm text-muted-foreground">{insight}</p>}
                      </div>
                      {score !== undefined && (
                        <div className="text-left">
                          <p className="text-2xl font-bold text-green-500">{score}%</p>
                        </div>
                      )}
                    </div>
                    {score !== undefined && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground">لا توجد نقاط قوة مسجلة</p>
            )}
          </div>
        </div>

        {/* Gaps */}
        <div id="gaps-section" className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">تحليل الفجوات</h2>
          </div>
          {llmGapAnalysis ? (
            <p className="text-muted-foreground leading-relaxed">{llmGapAnalysis}</p>
          ) : (
            <div className="space-y-4">
              {weaknesses.length > 0 ? (
                weaknesses.map((gap, index) => {
                  const severityClasses = getSeverityClasses(gap.severity);
                  return (
                    <div key={index} className={`border rounded-lg p-5 ${severityClasses.wrapper}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{gap.area}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs ${severityClasses.badge}`}>
                              {severityClasses.label}
                            </span>
                          </div>
                          {gap.issue && (
                            <p className="text-sm text-muted-foreground mb-3">{gap.issue}</p>
                          )}
                          {gap.recommendation && (
                            <div className="flex items-start gap-2 bg-card/50 rounded-lg p-3">
                              <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm">{gap.recommendation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground">لا توجد فجوات مسجلة</p>
              )}
            </div>
          )}
        </div>

        {/* Progress Tracking */}
        {progressData && progressData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">تتبع التقدم</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="درجة الجاهزية"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-3">جاهز للخطوة التالية؟</h3>
          <p className="text-muted-foreground mb-6">
            استعرض خارطة الطريق المخصصة لتحسين جاهزية منظمتك
          </p>
          <button
            onClick={() => navigate(`/dashboard/charity-assessment/roadmap/${organizationId}`)}
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
