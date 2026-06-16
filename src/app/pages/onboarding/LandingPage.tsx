import { ArrowRight, Brain, Sparkles, Target, Award, Clock, FileText, Upload, Save } from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';

export function LandingPage() {
  console.log('[LandingPage] render');
  const { goToStep } = useOnboardingNavigate();

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">حاضنة رشد الافتراضية</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            انضم إلى حاضنة رشد للمشاريع الخيرية
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            قيّم جاهزية مؤسستك الخيرية للانضمام إلى برنامج الحاضنة واحصل على خطة تطوير شاملة مدعومة بالذكاء الاصطناعي
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">تقييم شامل</h3>
            <p className="text-gray-600 text-sm">تقييم متعمق لـ 9 محاور رئيسية لقياس جاهزية مؤسستك</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">تحليل ذكي</h3>
            <p className="text-gray-600 text-sm">تحليل مدعوم بالذكاء الاصطناعي مع توصيات مخصصة</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">خطة تطوير</h3>
            <p className="text-gray-600 text-sm">خارطة طريق واضحة للتطوير والتحسين المستمر</p>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">ماذا يتضمن التقييم؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">المدة الزمنية</p>
                <p className="text-sm text-gray-600">٣٠ - ٤٥ دقيقة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">عدد الأسئلة</p>
                <p className="text-sm text-gray-600">٢٤ سؤالاً موزعة على ٦ محاور</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">المستندات المطلوبة</p>
                <p className="text-sm text-gray-600">رخصة الجمعية، شهادة الحساب البنكي، العنوان الوطني</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Save className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">حفظ تلقائي</p>
                <p className="text-sm text-gray-600">احفظ تقدمك وعُد متى شئت</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => goToStep('registration')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              ابدأ التقييم
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              اعرف المزيد
            </button>
          </div>
        </div>

        {/* Progress Explanation */}
        <div className="text-center text-sm text-gray-600">
          <p>سيتم إرشادك خلال ٤ خطوات رئيسية: التسجيل → الملف التعريفي → التقييم → النتائج</p>
        </div>
      </div>
    </div>
  );
}
