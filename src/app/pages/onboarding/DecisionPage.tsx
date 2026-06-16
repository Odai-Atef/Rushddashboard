import { Award, CheckCircle2, Download, Mail, AlertCircle, AlertTriangle } from 'lucide-react';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';

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
        icon: AlertTriangle,
      };
  }
}

export function DecisionPage() {
  const { organization, assessmentResult, assessmentStatus } = useOnboardingContext();

  const isivResult = assessmentResult;
  const displayScore = isivResult?.overallScore ?? assessmentStatus?.overallScore ?? 0;
  const statusOption = getQualificationStatusOption(isivResult?.qualificationStatus);
  const displayMessage = isivResult?.qualificationMessage || statusOption.labelAr;
  const isAccepted =
    isivResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED' ||
    isivResult?.qualificationStatus?.toUpperCase() === 'QUALIFIED_WITH_IMPROVEMENT' ||
    isivResult?.qualificationStatus?.toUpperCase() === 'WITH_IMPROVEMENT';

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 to-emerald-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
          {/* Success Icon */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isAccepted
              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
              : 'bg-gradient-to-br from-yellow-500 to-orange-600'
          }`}>
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          {/* Main Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              {isAccepted
                ? 'مبارك! تم قبولك في حاضنة رشد'
                : 'تم إكمال التقييم'}
            </h1>
            <p className="text-xl text-gray-600">
              {isAccepted
                ? 'نهنئك على اجتياز التقييم. أنت الآن جزء من مجتمع رشد للمؤسسات الخيرية الرائدة'
                : 'شكراً لاكتمال التقييم. فريق الحاضنة سيقوم بمراجعة نتيجتك والتواصل معك'}
            </p>
          </div>

          {/* Status Badge */}
          <div className={`border-2 rounded-xl p-6 mb-8 ${statusOption.bgClass.replace('bg-', 'bg-').replace('-400', '-50')} ${statusOption.textClass.replace('900', '700').replace('600', '700')}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8" />
              <div className="text-2xl font-bold">{displayMessage}</div>
            </div>
            <p className="text-center">
              نتيجتك: <span className="font-bold text-2xl">{displayScore}/120</span>
            </p>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">الخطوات القادمة</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-medium">إنشاء حساب المؤسسة</div>
                  <div className="text-sm text-gray-600">سجّل الدخول إلى منصة الحاضنة وأكمل ملفك التعريفي</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-medium">الاجتماع التعريفي</div>
                  <div className="text-sm text-gray-600">سيتواصل معك فريق الحاضنة لتحديد موعد الاجتماع التعريفي</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-medium">بدء خطة التطوير</div>
                  <div className="text-sm text-gray-600">ابدأ العمل على خطة التحسين مع دعم فريق الخبراء</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              معلومات التواصل
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">البريد الإلكتروني:</span>
                <span className="font-medium">incubator@rushd.sa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">الهاتف:</span>
                <span className="font-medium" dir="ltr">+966 11 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">ساعات العمل:</span>
                <span className="font-medium">الأحد - الخميس، ٩ص - ٥م</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              تحميل التقرير الكامل
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            سيتم إرسال نسخة من التقرير إلى بريدك الإلكتروني: {organization?.email || 'email@example.com'}
          </p>
        </div>
      </div>
    </div>
  );
}
