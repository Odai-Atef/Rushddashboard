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
 bgClass: 'bg-[var(--primary)]/[0.7]',
 textClass: 'text-[var(--primary)]/[0.9]',
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
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="text-center">
 <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
 <p className="text-muted-foreground">جاري تحميل النتائج...</p>
 </div>
 </div>
 );
 }

 if (resultsError) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-md w-full bg-[var(--card)] rounded-xl shadow-sm border border-[var(--destructive)]/[0.3] p-8 text-center">
 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h2 className="text-xl font-bold mb-2">تعذر تحميل النتائج</h2>
 <p className="text-muted-foreground mb-6">{resultsError}</p>
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
 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
 >
 إعادة المحاولة
 </button>
 </div>
 </div>
 );
 }

 if ((localStatus ?? assessmentStatus) && (localStatus ?? assessmentStatus)?.status !== 'COMPLETED' && !isivResult) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-2xl w-full bg-[var(--card)] rounded-xl shadow-sm border border-border p-8 text-center">
 <Info className="w-12 h-12 text-[var(--secondary)] mx-auto mb-4" />
 <h2 className="text-2xl font-bold mb-2">
 {(localStatus ?? assessmentStatus)?.status === 'IN_PROGRESS'
 ? 'التقييم قيد الإكمال'
 : 'لم يبدأ التقييم بعد'}
 </h2>
 <p className="text-muted-foreground mb-6">
 {(localStatus ?? assessmentStatus)?.status === 'IN_PROGRESS'
 ? ' أكمل إجاباتك لعرض النتائج التفصيلية.'
 : ' ابدأ التقييم لتحصل على تحليل شامل لمؤسستك.'}
 </p>
 <button
 onClick={() => goToStep('assessment')}
 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
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
 <div ref={reportContainerRef} className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="max-w-6xl mx-auto">
 {/* Header */}
 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-[var(--spacing-card-padding)] sm:p-8 mb-6 text-[var(--primary-foreground)]">
 <div className="flex flex-col sm:flex-row items-center justify-between gap-[var(--spacing-grid-gap)]">
 <div>
 <div className="inline-flex items-center gap-[var(--spacing-small-gap)] bg-[var(--card)]/20 px-3 py-1 rounded-full mb-3">
 <Sparkles className="w-4 h-4" />
 <span className="text-sm">نتائج التقييم</span>
 </div>
 <h1 className="text-2xl sm:text-4xl font-bold mb-2">تهانينا! تم إكمال التقييم</h1>
 <p className="text-foreground">تم تحليل مؤسستك بنجاح. اطّلع على النتائج التفصيلية أدناه</p>
 </div>
 <div className="text-center">
 <div className="w-32 h-32 bg-[var(--card)]/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
 <div>
 <div className="text-5xl font-bold">{displayScore}</div>
 <div className="text-sm">من 100</div>
 </div>
 </div>
 <div className={`inline-flex items-center gap-[var(--spacing-small-gap)] px-3 py-1 rounded-full font-medium ${statusOption.bgClass} ${statusOption.textClass}`}>
 <Award className="w-4 h-4" />
 <span>{displayMessage}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Qualification Status */}
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] mb-6">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[var(--spacing-grid-gap)]">
 <div className="flex items-center gap-[var(--spacing-grid-gap)]">
 <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-opacity-10 ${statusOption.bgClass.replace('bg-', 'bg-').replace('-400', '-50')}`}>
 <statusOption.icon className={`w-8 h-8 ${statusOption.textClass.replace('900', '600')}`} />
 </div>
 <div>
 <h2 className="text-2xl font-bold mb-1">{displayMessage}</h2>
 <p className="text-muted-foreground">{isivResult?.diagnosis}</p>
 </div>
 </div>
 {isQualified && (
 <button
 onClick={() => goToStep('roadmap')}
 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)]"
 >
 عرض خطة التطوير
 <ArrowRight className="w-5 h-5" />
 </button>
 )}
 </div>
 </div>

 {/* Charts */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[var(--spacing-grid-gap)] sm:gap-[var(--spacing-grid-gap)] mb-6 items-stretch">
 <div className="bg-[var(--card)] rounded-2xl shadow-sm border border-border/80/50 p-[var(--spacing-card-padding)] transition-all duration-200 hover:shadow-md">
 <h3 className="text-lg font-semibold text-foreground mb-4">التحليل الشامل</h3>
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
 <p className="text-muted-foreground text-center py-12">لا توجد بيانات للرسم البياني</p>
 )}
 </div>

 <div className="bg-[var(--card)] rounded-2xl shadow-sm border border-border/80/50 p-[var(--spacing-card-padding)] transition-all duration-200 hover:shadow-md">
 <h3 className="text-lg font-semibold text-foreground mb-4">الأبعاد التفصيلية</h3>
 {categoryScores.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-grid-gap)] items-stretch">
 {categoryScores.map((cs) => (
 <div key={cs.categoryId} className="bg-card/60 rounded-xl border border-border p-[var(--spacing-card-padding)] flex flex-col justify-between h-full" style={{ borderRightWidth: 4, borderRightColor: cs.color }}>
 <div className="flex items-center justify-between mb-3">
 <span className="text-sm font-medium text-foreground">{cs.categoryName}</span>
 <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${cs.color}20`, color: cs.color }}>
 {cs.score} / {cs.maxScore}
 </span>
 </div>
 <div className="flex items-end justify-between">
 <div className="text-3xl font-bold tracking-tight" style={{ color: cs.color }}>{cs.score}</div>
 <div className="text-sm text-muted-foreground">{cs.score}%</div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-muted-foreground text-center py-12">لا توجد بيانات للأبعاد</p>
 )}
 </div>
 </div>

 {/* Diagnostic Feedback */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-grid-gap)] sm:gap-[var(--spacing-grid-gap)] mb-6">
 <div className="lg:col-span-3 bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)]">
 <h3 className="text-lg font-semibold mb-3">التشخيص</h3>
 <p className="text-foreground leading-relaxed">{isivResult?.diagnosis || 'لا يوجد تشخيص متاح.'}</p>
 </div>

 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)]">
 <h3 className="text-lg font-semibold mb-3 flex items-center gap-[var(--spacing-small-gap)] text-[var(--primary)]">
 <CheckCircle2 className="w-5 h-5" />
 نقاط القوة
 </h3>
 {strengths.length > 0 ? (
 <ul className="space-y-[var(--spacing-small-gap)]">
 {strengths.map((strength, idx) => {
 const isObject = typeof strength === 'object';
 const label = isObject ? (strength as StrengthItem).area : (strength as string);
 const insight = isObject ? (strength as StrengthItem).insight : null;
 return (
 <li key={idx} className="flex flex-col gap-[var(--spacing-small-gap)] text-foreground">
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <Check className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
 <span className="font-medium">{label}</span>
 </div>
 {insight && <p className="text-sm text-muted-foreground pr-6">{insight}</p>}
 </li>
 );
 })}
 </ul>
 ) : (
 <p className="text-muted-foreground">لا توجد نقاط قوة مسجلة.</p>
 )}
 </div>

 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)]">
 <h3 className="text-lg font-semibold mb-3 flex items-center gap-[var(--spacing-small-gap)] text-[var(--destructive)]">
 <AlertCircle className="w-5 h-5" />
 مجالات التحسين
 </h3>
 {weaknesses.length > 0 ? (
 <ul className="space-y-[var(--spacing-small-gap)]">
 {weaknesses.map((weakness, idx) => {
 const isObject = typeof weakness === 'object';
 const label = isObject ? (weakness as WeaknessItem).area : (weakness as string);
 const insight = isObject ? (weakness as WeaknessItem).insight : null;
 const severity = isObject ? (weakness as WeaknessItem).severity : null;
 return (
 <li key={idx} className="flex flex-col gap-[var(--spacing-small-gap)] text-foreground">
 <div className="flex items-start gap-[var(--spacing-small-gap)]">
 <X className="w-4 h-4 text-[var(--destructive)] mt-0.5 flex-shrink-0" />
 <span className="font-medium">{label}</span>
 {severity && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--destructive)]/[0.1] text-[var(--destructive)]">{severity}</span>}
 </div>
 {insight && <p className="text-sm text-muted-foreground pr-6">{insight}</p>}
 </li>
 );
 })}
 </ul>
 ) : (
 <p className="text-muted-foreground">لا توجد مجالات تحسين مسجلة.</p>
 )}
 </div>

 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)]">
 <h3 className="text-lg font-semibold mb-4">المقارنة المعيارية</h3>
 <div className="space-y-[var(--spacing-section-gap)]">
 <div>
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium">مؤسستك</span>
 <span className="text-sm font-bold text-primary">{benchmarks.yourScore}٪</span>
 </div>
 <div className="h-3 bg-muted rounded-full overflow-hidden">
 <div className="h-full bg-primary" style={{ width: `${benchmarks.yourScore}%` }}></div>
 </div>
 </div>
 <div>
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium">متوسط القطاع</span>
 <span className="text-sm font-bold text-muted-foreground">{benchmarks.sectorAverage}٪</span>
 </div>
 <div className="h-3 bg-muted rounded-full overflow-hidden">
 <div className="h-full bg-muted-foreground" style={{ width: `${benchmarks.sectorAverage}%` }}></div>
 </div>
 </div>
 <div>
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium">الجمعيات الرائدة</span>
 <span className="text-sm font-bold text-[var(--primary)]">{benchmarks.topPerformer}٪</span>
 </div>
 <div className="h-3 bg-muted rounded-full overflow-hidden">
 <div className="h-full bg-[var(--primary)]" style={{ width: `${benchmarks.topPerformer}%` }}></div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="report-exclude flex flex-col sm:flex-row gap-[var(--spacing-small-gap)] sm:gap-[var(--spacing-grid-gap)]">
 <button
 onClick={() => goToStep('analysis')}
 className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
 >
 عرض التحليل التفصيلي
 </button>
 <button
 onClick={handleDownloadReport}
 disabled={isDownloading}
 className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)] disabled:opacity-50 disabled:cursor-not-allowed"
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
