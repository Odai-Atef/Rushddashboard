import { Award, CheckCircle2, Download, Mail, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { handleReportDownload } from '@/app/utils/download-report';

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
 icon: AlertTriangle,
 };
 }
}

export function DecisionPage() {
 const { organization, assessmentResult, assessmentStatus } = useOnboardingContext();

 const reportContainerRef = useRef<HTMLDivElement>(null);
 const [isDownloading, setIsDownloading] = useState(false);

 const isivResult = assessmentResult;
 const displayScore = isivResult?.overallScore ?? assessmentStatus?.overallScore ?? 0;
 const statusOption = getQualificationStatusOption(isivResult?.qualificationStatus);
 const displayMessage = isivResult?.qualificationMessage || statusOption.labelAr;
 const isAccepted =
 isivResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED' ||
 isivResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED_WITH_IMPROVEMENT' ||
 isivResult?.qualificationStatus?.toUpperCase() === 'WITH_IMPROVEMENT';

 const handleDownloadReport = async () => {
 const container = reportContainerRef.current;
 if (!container) return;

 const orgName = organization?.id || 'organization';
 await handleReportDownload({
 container,
 fileName: `decision-report-${orgName}.pdf`,
 setIsDownloading,
 backgroundColor: '#f0fdf4',
 });
 };

 return (
 <div ref={reportContainerRef} className="min-h-full bg-gradient-to-br from-green-50 to-emerald-50 p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="max-w-3xl w-full">
 <div className="bg-[var(--card)] rounded-2xl shadow-xl border border-border p-12">
 {/* Success Icon */}
 <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
 isAccepted
 ? 'bg-gradient-to-br from-green-500 to-emerald-600'
 : 'bg-gradient-to-br from-yellow-500 to-orange-600'
 }`}>
 <CheckCircle2 className="w-12 h-12 text-[var(--primary-foreground)]" />
 </div>

 {/* Main Message */}
 <div className="text-center mb-8">
 <h1 className="text-4xl font-bold mb-3">
 {isAccepted
 ? 'مبارك! تم قبولك في حاضنة رشد'
 : 'تم إكمال التقييم'}
 </h1>
 <p className="text-xl text-muted-foreground">
 {isAccepted
 ? 'نهنئك على اجتياز التقييم. أنت الآن جزء من مجتمع رشد للجمعيات الخيرية الرائدة'
 : 'شكراً لاكتمال التقييم. فريق الحاضنة سيقوم بمراجعة نتيجتك والتواصل معك'}
 </p>
 </div>

 {/* Status Badge */}
 <div className={`border-2 rounded-xl p-[var(--spacing-card-padding)] mb-8 ${statusOption.bgClass.replace('bg-', 'bg-').replace('-400', '-50')} ${statusOption.textClass.replace('900', '700').replace('600', '700')}`}>
 <div className="flex items-center justify-center gap-[var(--spacing-small-gap)] mb-4">
 <Award className="w-8 h-8" />
 <div className="text-2xl font-bold">{displayMessage}</div>
 </div>
 <p className="text-center">
 نتيجتك: <span className="font-bold text-2xl">{displayScore}/100</span>
 </p>
 </div>

 {/* Next Steps */}
 <div className="mb-8">
 <h2 className="text-xl font-semibold mb-4 text-center">الخطوات القادمة</h2>
 <div className="space-y-[var(--spacing-small-gap)]">
 <div className="flex items-start gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] bg-muted rounded-lg">
 <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
 <div>
 <div className="font-medium">إنشاء حساب الجمعية</div>
 <div className="text-sm text-muted-foreground">سجّل الدخول إلى منصة الحاضنة وأكمل ملفك التعريفي</div>
 </div>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] bg-muted rounded-lg">
 <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
 <div>
 <div className="font-medium">الاجتماع التعريفي</div>
 <div className="text-sm text-muted-foreground">سيتواصل معك فريق الحاضنة لتحديد موعد الاجتماع التعريفي</div>
 </div>
 </div>
 <div className="flex items-start gap-[var(--spacing-small-gap)] p-[var(--spacing-card-padding)] bg-muted rounded-lg">
 <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
 <div>
 <div className="font-medium">بدء خطة التطوير</div>
 <div className="text-sm text-muted-foreground">ابدأ العمل على خطة التحسين مع دعم فريق الخبراء</div>
 </div>
 </div>
 </div>
 </div>

 {/* Contact Info */}
 <div className="bg-muted border border-border rounded-xl p-[var(--spacing-card-padding)] mb-8">
 <h3 className="font-semibold mb-3 flex items-center gap-[var(--spacing-small-gap)]">
 <Mail className="w-5 h-5 text-primary" />
 معلومات التواصل
 </h3>
 <div className="space-y-[var(--spacing-small-gap)] text-sm">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className="text-muted-foreground">البريد الإلكتروني:</span>
 <span className="font-medium">incubator@rushd.sa</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className="text-muted-foreground">الهاتف:</span>
 <span className="font-medium" dir="ltr">+966 11 XXX XXXX</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <span className="text-muted-foreground">ساعات العمل:</span>
 <span className="font-medium">الأحد - الخميس، ٩ص - ٥م</span>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 {/* <div className="report-exclude flex flex-col sm:flex-row gap-[var(--spacing-grid-gap)]">
 <button
 onClick={handleDownloadReport}
 disabled={isDownloading}
 className="flex-1 px-6 py-4 border-2 border-border rounded-lg hover:bg-muted transition-colors font-medium flex items-center justify-center gap-[var(--spacing-small-gap)] disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isDownloading ? (
 <Loader2 className="w-5 h-5 animate-spin" />
 ) : (
 <Download className="w-5 h-5" />
 )}
 {isDownloading ? 'جارٍ التحميل...' : 'تحميل التقرير الكامل'}
 </button>
 </div> */}

 {/* Footer Note */}
 <p className="text-center text-sm text-muted-foreground mt-6">
 سيتم إرسال نسخة من التقرير إلى بريدك الإلكتروني: {organization?.email || 'email@example.com'}
 </p>
 </div>
 </div>
 </div>
 );
}
