import { CheckCircle2, Play, Sparkles } from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';

export function ThanksPage() {
  const { goToStep } = useOnboardingNavigate();
  const { activeOrganizationId } = useOnboardingContext();

  const handleStartAssessment = () => {
    goToStep('assessment');
  };

  return (
    <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3">شكراً لك</h1>
        <p className="text-gray-600 mb-6">
          تم إنشاء/تحديث ملف المؤسسة بنجاح. يمكنك الآن بدء التقييم لتفعيل المؤسسة من إنشاء المشاريع.
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
