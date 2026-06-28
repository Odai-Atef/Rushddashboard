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
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3">جهتك غير مؤهلة</h1>
          <p className="text-gray-600 mb-6">
            جهتك غير مؤهلة لاستخدام خصائص منصة رشد.
            <br />
            لإجراء التقييم مرة أخرى، يرجى الضغط على الزر أدناه.
          </p>
          <div className="bg-red-50 rounded-xl p-4 mb-6 flex items-start gap-3 text-right">
            <RefreshCw className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">
              يمكنك مراجعة إجاباتك والمستندات المرفوعة ثم إعادة التقييم للحصول على نتيجة أفضل.
            </p>
          </div>
          <button
            onClick={handleReEvaluate}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة التقييم
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3">شكراً لك</h1>
        <p className="text-gray-600 mb-6">
          تم إنشاء/تحديث ملف الجهه بنجاح. يمكنك الآن بدء التقييم لتفعيل الجهه من إنشاء المشاريع.
        </p>
        <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            يستغرق التقييم بضع دقائق. تأكد من الإجابة بدقة لتحصل على نتيجة دقيقة وخطة تطوير مخصصة.
          </p>
        </div>
        <button
          onClick={handleStartAssessment}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          بدء التقييم
        </button>
      </div>
    </div>
  );
}
