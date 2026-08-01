import { Brain, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { onboardingService } from '@/api/services';
import { toast } from 'sonner';

const PRELOADER_MIN_DURATION_MS = 3000;

function formatRemainingTime(totalSeconds: number): string {
 const hours = Math.floor(totalSeconds / 3600);
 const minutes = Math.ceil((totalSeconds % 3600) / 60);
 if (hours > 0) {
 return `${hours} ساعة و ${minutes} دقيقة`;
 }
 return `${minutes} دقيقة`;
}

export function PreloaderPage() {
 const navigate = useNavigate();
 const { activeOrganizationId, setAssessmentResult, setAssessmentStatus, setAssessmentSubmitted } =
 useOnboardingContext();
 const [processingProgress, setProcessingProgress] = useState(0);
 const [cooldownInfo, setCooldownInfo] = useState<{
 blocked: boolean;
 remainingSeconds: number;
 firstTime: boolean;
 } | null>(null);
 const startedRef = useRef(false);

 useEffect(() => {
 if (!activeOrganizationId || startedRef.current) return;
 startedRef.current = true;

 const checkCooldown = async () => {
 try {
 const res = await onboardingService.getEvaluationCooldownStatus(
 activeOrganizationId,
 'preloader'
 );
 const status = (res.data as any)?.data ?? res.data;
 if (!status?.canEvaluate && !status?.firstTime) {
 setCooldownInfo({
 blocked: true,
 remainingSeconds: status.remainingSeconds ?? 0,
 firstTime: false,
 });
 return true;
 }
 setCooldownInfo({
 blocked: false,
 remainingSeconds: 0,
 firstTime: status?.firstTime ?? false,
 });
 return false;
 } catch (err: any) {
 console.error('[PreloaderPage] cooldown check failed', err);
 return false;
 }
 };

 let progressInterval: ReturnType<typeof setInterval> | null = null;
 const startProgress = () => {
 setProcessingProgress(0);
 progressInterval = setInterval(() => {
 setProcessingProgress((prev) => {
 const next = prev + 10;
 if (next >= 90) {
 if (progressInterval) clearInterval(progressInterval);
 return 90;
 }
 return next;
 });
 }, 300);
 };
 const stopProgress = () => {
 if (progressInterval) clearInterval(progressInterval);
 setProcessingProgress(100);
 };

 const submit = async () => {
 const blocked = await checkCooldown();
 if (blocked) return;

 startProgress();
 const startTime = Date.now();
 try {
 await onboardingService.submitAssessment(activeOrganizationId);
 const [evalRes] = await Promise.all([
 onboardingService.evaluateAssessment(activeOrganizationId),
 new Promise((resolve) => setTimeout(resolve, PRELOADER_MIN_DURATION_MS)),
 ]);
 const evalData = (evalRes.data as any)?.data ?? evalRes.data;
 const resultData = await onboardingService
 .getIsivAssessmentResults(activeOrganizationId)
 .then((res) => (res.data as any)?.data ?? res.data);

 stopProgress();
 setAssessmentResult(resultData);
 setAssessmentStatus({
 status: 'COMPLETED',
 overallScore: resultData?.overallScore ?? null,
 completedAt: resultData?.assessedAt ?? null,
 });

 navigate(`/dashboard/charity-assessment/results/${activeOrganizationId}`);
 } catch (err: any) {
 stopProgress();
 toast.error(err?.message || 'تعذر إكمال التقييم. يرجى المحاولة مرة أخرى.');
 setAssessmentSubmitted(false);
 navigate(`/dashboard/onboarding/assessment?organizationId=${activeOrganizationId}`);
 }
 };

 submit();
 return () => {
 if (progressInterval) clearInterval(progressInterval);
 };
 }, [activeOrganizationId, navigate, setAssessmentResult, setAssessmentStatus, setAssessmentSubmitted]);

 if (cooldownInfo?.blocked) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-xl w-full">
 <div className="bg-[var(--card)] rounded-xl shadow-lg border border-border p-10 text-center">
 <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
 <Clock className="w-10 h-10 text-[var(--warning)]" />
 </div>
 <h1 className="text-2xl font-bold mb-3">التقييم غير متاح حالياً</h1>
 <p className="text-muted-foreground mb-8">
 لقد أجريت تقييماً مؤخراً. يمكنك إجراء التقييم مرة أخرى بعد{' '}
 {formatRemainingTime(cooldownInfo.remainingSeconds)}.
 </p>
 <div className="text-sm text-muted-foreground">
 الوقت المتبقي: {formatRemainingTime(cooldownInfo.remainingSeconds)}
 </div>
 <button
 onClick={() =>
 activeOrganizationId
 ? navigate(`/dashboard/charity-assessment/results/${activeOrganizationId}`)
 : navigate('/dashboard/charity-assessment')
 }
 className="mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
 >
 عرض نتيجة التقييم السابقة
 </button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-2xl w-full">
 <div className="bg-[var(--card)] rounded-xl shadow-lg border border-border p-12 text-center">
 <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
 <Brain className="w-12 h-12 text-[var(--primary-foreground)]" />
 </div>

 <h1 className="text-3xl font-bold mb-3">جارٍ تحليل البيانات...</h1>
 <p className="text-muted-foreground mb-8">
 يقوم الذكاء الاصطناعي بتحليل إجاباتك لإعداد تقرير
 شامل
 </p>

 <div className="mb-6">
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium text-foreground">التقدم</span>
 <span className="text-sm font-medium text-primary">
 {processingProgress}٪
 </span>
 </div>
 <div className="h-3 bg-muted rounded-full overflow-hidden">
 <div
 className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
 style={{ width: `${processingProgress}%` }}
 ></div>
 </div>
 </div>

 <div className="space-y-[var(--spacing-small-gap)] text-right">
 {[
 { threshold: 20, label: 'تحليل الإجابات' },
 { threshold: 50, label: 'مراجعة معلومات الجهة' },
 { threshold: 80, label: 'حساب النتيجة النهائية' },
 ].map((item) => {
 const done = processingProgress > item.threshold;
 return (
 <div
 key={item.label}
 className={`flex items-center gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] rounded-lg ${
 done ? 'bg-[var(--primary)]/[0.08]' : 'bg-secondary'
 }`}
 >
 {done ? (
 <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
 ) : (
 <Loader2 className="w-5 h-5 text-primary animate-spin" />
 )}
 <span className={done ? 'text-[var(--primary)]/[0.9]' : 'text-foreground'}>
 {item.label}
 </span>
 </div>
 );
 })}
 </div>

 <p className="text-sm text-muted-foreground mt-8">
 الوقت المتوقع: ٣٠ - ٦٠ ثانية
 </p>
 </div>
 </div>
 </div>
 );
}
