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
 high: { bg: 'bg-[var(--destructive)]/[0.1]', text: 'text-[var(--destructive)]', label: 'أولوية عالية' },
 medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'أولوية متوسطة' },
 low: { bg: 'text-[var(--primary)]/[0.4]', text: 'text-[var(--primary)]', label: 'أولوية منخفضة' },
 };

 const statusConfig: Record<string, { bg: string; text: string; label: string; icon: typeof Clock }> = {
 'in-progress': { bg: 'text-[var(--primary)]/[0.4]', text: 'text-[var(--primary)]', label: 'قيد التنفيذ', icon: Activity },
 completed: { bg: 'bg-[var(--primary)]/[0.1]', text: 'text-[var(--primary)]', label: 'مكتملة', icon: CheckCircle2 },
 delayed: { bg: 'bg-[var(--destructive)]/[0.1]', text: 'text-[var(--destructive)]', label: 'متأخرة', icon: AlertTriangle },
 };

 if (isLoading) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="text-center">
 <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
 <p className="text-muted-foreground">جارٍ تحميل خطة التطوير...</p>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-md w-full bg-[var(--card)] rounded-xl shadow-sm border border-[var(--destructive)]/[0.3] p-8 text-center">
 <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
 <h2 className="text-xl font-bold mb-2">تعذر تحميل الخطة</h2>
 <p className="text-muted-foreground mb-6">{error}</p>
 <button
 onClick={() => window.location.reload()}
 className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
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
 <div ref={reportContainerRef} className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="max-w-6xl mx-auto">
 {/* Header */}
 <div className="mb-6 sm:mb-8">
 <button
 onClick={() => goToStep('analysis')}
 className="text-primary hover:text-[var(--primary)] font-medium flex items-center gap-[var(--spacing-small-gap)] mb-4"
 >
 <ChevronRight className="w-5 h-5" />
 رجوع إلى التحليل
 </button>
 <div className="flex items-center justify-between flex-wrap gap-[var(--spacing-grid-gap)]">
 <div>
 <h1 className="text-2xl sm:text-3xl font-bold mb-2">خطة التطوير والتحسين</h1>
 <p className="text-muted-foreground">
 {data?.comments?.overall?.ar || 'خارطة طريق مخصصة لتطوير الجمعية'}
 </p>
 </div>
 <div className="flex gap-[var(--spacing-small-gap)] report-exclude">
 <button
 onClick={handleDownloadPlan}
 disabled={isDownloading}
 className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)] disabled:opacity-50 disabled:cursor-not-allowed"
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
 <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-grid-gap)] sm:gap-[var(--spacing-grid-gap)] mb-6">
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)]">
 <h3 className="text-lg font-semibold mb-4">نتيجة التقييم العامة</h3>
 <div className="flex items-center gap-[var(--spacing-grid-gap)]">
 <div
 className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
 isQualified
 ? 'bg-primary/10 border-primary/20'
 : 'bg-[var(--destructive)]/[0.08] border-[var(--destructive)]/[0.2]'
 }`}
 >
 <span
 className={`text-2xl font-bold ${
 isQualified ? 'text-primary' : 'text-[var(--destructive)]'
 }`}
 >
 {Math.round(overallScore)}%
 </span>
 </div>
 <div>
 <p className="text-sm text-muted-foreground mb-1">حالة الأهلية</p>
 <span
 className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
 isQualified
 ? 'bg-[var(--primary)]/[0.1] text-[var(--primary)]'
 : 'bg-[var(--destructive)]/[0.1] text-[var(--destructive)]'
 }`}
 >
 {isQualified ? 'مؤهل' : 'غير مؤهل'}
 </span>
 </div>
 </div>
 </div>

 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)]">
 <h3 className="text-lg font-semibold mb-4">الجدول الزمني للتنفيذ</h3>
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
 <div className="text-sm text-muted-foreground">إجمالي المدة المتوقعة:</div>
 <div className="text-lg font-bold text-primary">{totalDurationMonths} شهراً</div>
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

 {/* Recommendations */}
 {recommendations.length > 0 && (
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] mb-6">
 <h3 className="text-lg font-semibold mb-4">التوصيات المقترحة</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-small-gap)] sm:gap-[var(--spacing-grid-gap)]">
 {recommendations.map((rec: EvaluationRecommendation, idx: number) => (
 <div
 key={idx}
 className="p-[var(--spacing-card-padding)] border border-border rounded-lg hover:bg-secondary transition-colors"
 >
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2">
 <span className="w-6 h-6 rounded-full text-[var(--primary)]/[0.4] text-primary flex items-center justify-center text-xs font-bold">
 {rec.priority}
 </span>
 <span className="text-sm font-medium text-muted-foreground">{rec.dimension}</span>
 </div>
 <h4 className="font-semibold mb-1">{rec.serviceNameAr || rec.serviceNameEn}</h4>
 {rec.packageBundle && (
 <p className="text-sm text-muted-foreground">
 الباقة: {rec.packageBundle.nameAr || rec.packageBundle.nameEn}
 </p>
 )}
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Initiatives */}
 <div className="space-y-[var(--spacing-section-gap)]">
 <h3 className="text-lg font-semibold">المبادرات التطويرية</h3>
 {initiatives.length === 0 ? (
 <div className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-8 text-center text-muted-foreground">
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
 className="bg-[var(--card)] rounded-xl shadow-sm border border-border p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] hover:shadow-md transition-shadow"
 >
 <div className="flex items-start justify-between mb-4">
 <div className="flex-1">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-2 flex-wrap">
 <h3 className="text-lg font-semibold">{initiative.title}</h3>
 <span
 className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyle.bg} ${priorityStyle.text}`}
 >
 {initiative.priorityLabelAr || priorityStyle.label}
 </span>
 {statusStyle && (
 <span
 className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center gap-[var(--spacing-small-gap)]`}
 >
 <StatusIcon className="w-3 h-3" />
 {statusStyle.label}
 </span>
 )}
 </div>
 <div className="text-sm text-muted-foreground mb-1">المحور: {initiative.area}</div>
 {initiative.dimension && (
 <div className="text-sm text-muted-foreground">البُعد: {initiative.dimension}</div>
 )}
 </div>
 <div className="text-left">
 <div className="text-sm text-muted-foreground">المدة</div>
 <div className="font-semibold">{initiative.duration}</div>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-small-gap)] sm:gap-[var(--spacing-grid-gap)] mb-4 p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] bg-secondary rounded-lg">
 <div>
 <div className="text-xs text-muted-foreground mb-1">الجهة المسؤولة</div>
 <div className="font-medium flex items-center gap-[var(--spacing-small-gap)]">
 <Users className="w-4 h-4 text-muted-foreground" />
 {initiative.responsible}
 </div>
 </div>
 <div>
 <div className="text-xs text-muted-foreground mb-1">النتيجة المتوقعة</div>
 <div className="font-medium flex items-center gap-[var(--spacing-small-gap)]">
 <Target className="w-4 h-4 text-muted-foreground" />
 {initiative.outcome}
 </div>
 </div>
 </div>

 {/* Tasks */}
 {initiative.tasks.length > 0 && (
 <div>
 <div className="text-sm font-medium mb-2">المهام الرئيسية:</div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-small-gap)]">
 {initiative.tasks.map((task, idx) => (
 <div key={idx} className="flex items-center gap-[var(--spacing-small-gap)] text-sm text-muted-foreground">
 <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
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
 <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] border border-indigo-200 mt-6">
 <div className="flex items-start gap-[var(--spacing-grid-gap)]">
 <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
 <Sparkles className="w-6 h-6 text-[var(--primary-foreground)]" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-semibold mb-2">الدعم من حاضنة رشد</h3>
 <p className="text-foreground mb-4">فريقنا جاهز لدعمك في تنفيذ خطة التطوير. ستحصل على:</p>
 <ul className="space-y-[var(--spacing-small-gap)] mb-4">
 <li className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <CheckCircle2 className="w-4 h-4 text-indigo-600" />
 استشارات متخصصة في كل محور
 </li>
 <li className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <CheckCircle2 className="w-4 h-4 text-indigo-600" />
 برامج تدريبية وورش عمل
 </li>
 <li className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <CheckCircle2 className="w-4 h-4 text-indigo-600" />
 منصة متابعة وتقييم مستمر
 </li>
 <li className="flex items-center gap-[var(--spacing-small-gap)] text-sm">
 <CheckCircle2 className="w-4 h-4 text-indigo-600" />
 شبكة من الخبراء والشركاء
 </li>
 </ul>
 <button
 onClick={() => goToStep('decision')}
 className="px-6 py-3 bg-indigo-600 text-[var(--primary-foreground)] rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)] report-exclude"
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
