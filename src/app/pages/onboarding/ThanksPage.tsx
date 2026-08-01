import { CheckCircle2, Play, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';

export function ThanksPage() {
 const { goToStep } = useOnboardingNavigate();
 const navigate = useNavigate();
 const { activeOrganizationId } = useOnboardingContext();
 const [searchParams] = useSearchParams();
 const isNotQualified = searchParams.get('notQualified') === '1';

 const handleStartAssessment = () => {
 goToStep('assessment');
 };

 const handleReEvaluate = () => {
 if (activeOrganizationId) {
 navigate(`/dashboard/charity-assessment?organizationId=${encodeURIComponent(activeOrganizationId)}`);
 } else {
 navigate('/dashboard/charity-assessment');
 }
 };

 if (isNotQualified) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-lg w-full bg-[var(--card)] rounded-2xl shadow-sm border border-border p-[var(--spacing-card-padding)] sm:p-8 text-center">
 <div className="w-20 h-20 bg-[var(--destructive)]/[0.1] rounded-full flex items-center justify-center mx-auto mb-6">
 <AlertCircle className="w-10 h-10 text-[var(--destructive)]" />
 </div>
 <h1 className="text-2xl font-bold mb-3">جهتك غير مؤهلة</h1>
 <p className="text-muted-foreground mb-6">
 جهتك غير مؤهلة لاستخدام خصائص منصة رشد.
 <br />
 لإجراء التقييم مرة أخرى، يرجى الضغط على الزر أدناه.
 </p>
 <div className="bg-[var(--destructive)]/[0.08] rounded-xl p-[var(--spacing-card-padding)] mb-6 flex items-start gap-[var(--spacing-small-gap)] text-right">
 <RefreshCw className="w-5 h-5 text-[var(--destructive)] mt-0.5 flex-shrink-0" />
 <p className="text-sm text-[var(--destructive)]">
 يمكنك مراجعة إجاباتك والمستندات المرفوعة ثم إعادة التقييم للحصول على نتيجة أفضل.
 </p>
 </div>
 <button
 onClick={handleReEvaluate}
 className="w-full px-6 py-3 bg-[var(--destructive)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--destructive)]/90 transition-colors font-medium flex items-center justify-center gap-[var(--spacing-small-gap)]"
 >
 <RefreshCw className="w-5 h-5" />
 إعادة التقييم
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-lg w-full bg-[var(--card)] rounded-2xl shadow-sm border border-border p-[var(--spacing-card-padding)] sm:p-8 text-center">
 <div className="w-20 h-20 bg-[var(--primary)]/[0.1] rounded-full flex items-center justify-center mx-auto mb-6">
 <CheckCircle2 className="w-10 h-10 text-[var(--primary)]" />
 </div>
 <h1 className="text-2xl font-bold mb-3">شكراً لك</h1>
 <p className="text-muted-foreground mb-6">
 تم إنشاء/تحديث ملف الجهه بنجاح. يمكنك الآن بدء التقييم لتفعيل الجهه من إنشاء المشاريع.
 </p>
 <div className="bg-secondary rounded-xl p-[var(--spacing-card-padding)] mb-6 flex items-start gap-[var(--spacing-small-gap)] text-left">
 <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
 <p className="text-sm text-primary">
 يستغرق التقييم بضع دقائق. تأكد من الإجابة بدقة لتحصل على نتيجة دقيقة وخطة تطوير مخصصة.
 </p>
 </div>
 <button
 onClick={handleStartAssessment}
 className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-[var(--spacing-small-gap)]"
 >
 <Play className="w-5 h-5" />
 بدء التقييم
 </button>
 </div>
 </div>
 );
}
